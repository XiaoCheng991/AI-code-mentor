"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Upload, Github, Mail, User, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { AvatarCropDialog } from "@/components/ui/avatar-crop-dialog"
import LayoutWithFullWidth from "@/components/LayoutWithFullWidth"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // 裁剪相关状态
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    displayName: "",
    avatarUrl: "",
    bio: "",
    isGithubUser: false,
    userId: "", // 用于验证
  })

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // 检查是否是 GitHub 用户（通过 identities 表）
      const isGithubUser = user.app_metadata?.provider === 'github' || 
                          user.identities?.some(identity => identity.provider === 'github')

      setUserInfo({
        email: user.email || "",
        username: profile?.username || "",
        displayName: profile?.display_name || "",
        avatarUrl: profile?.avatar_url || "",
        bio: profile?.bio || "",
        isGithubUser: isGithubUser || false,
        userId: user.id,
      })
    } catch (error) {
      console.error('Error fetching user info:', error)
      toast({
        title: "加载失败",
        description: "无法获取用户信息",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      toast({
        title: "文件类型错误",
        description: "请上传图片文件",
        variant: "destructive",
      })
      return
    }

    // 验证文件大小（5MB 原图，裁剪后会压缩）
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "文件过大",
        description: "图片大小不能超过 5MB",
        variant: "destructive",
      })
      return
    }

    // 保存文件并显示裁剪对话框
    setOriginalFile(file)
    const imageUrl = URL.createObjectURL(file)
    setSelectedImage(imageUrl)
    setShowCropDialog(true)
    
    // 清空 input
    e.target.value = ''
  }

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setUploading(true)
    setShowCropDialog(false)
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) throw userError
      if (!user) throw new Error('用户未登录')

      // 如果有旧头像，先删除
      if (userInfo.avatarUrl) {
        try {
          // 从 URL 提取文件路径
          const oldFilePath = userInfo.avatarUrl.split('/').slice(-2).join('/')
          if (oldFilePath && oldFilePath.startsWith('avatars/')) {
            await supabase.storage
              .from('user-uploads')
              .remove([oldFilePath])
          }
        } catch (error) {
          // 删除旧头像失败不影响新头像上传
        }
      }

      // 使用裁剪后的图片
      const fileExt = originalFile?.name.split('.').pop() || 'jpg'
      const fileName = `${user.id}_${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // 上传到 Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, croppedImageBlob, { 
          upsert: true,
          contentType: 'image/jpeg'
        })

      if (uploadError) throw uploadError

      // 获取公开 URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath)

      // 更新数据库
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      setUserInfo(prev => ({ ...prev, avatarUrl: publicUrl }))
      
      toast({
        title: "上传成功",
        description: "头像已更新",
      })
    } catch (error: any) {
      toast({
        title: "上传失败",
        description: error.message || "无法上传头像",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      // 清理临时图片URL
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage)
        setSelectedImage(null)
      }
      setOriginalFile(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 数据验证
      const errors: string[] = []

      // 如果不是 GitHub 用户，验证邮箱、用户名
      if (!userInfo.isGithubUser) {
        // 邮箱验证
        if (!userInfo.email || !userInfo.email.includes('@')) {
          errors.push('请输入有效的邮箱地址')
        }

        // 用户名验证
        if (!userInfo.username || userInfo.username.length < 3) {
          errors.push('用户名至少 3 个字符')
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/
        if (!usernameRegex.test(userInfo.username)) {
          errors.push('用户名只能包含字母、数字和下划线')
        }

        // 检查用户名唯一性
        const { data: existingUsername } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('username', userInfo.username)
          .neq('id', userInfo.userId)
          .single()

        if (existingUsername) {
          errors.push('该用户名已被使用')
        }
      }

      // 显示名验证
      if (userInfo.displayName && userInfo.displayName.length > 100) {
        errors.push('显示名不能超过 100 个字符')
      }

      if (errors.length > 0) {
        toast({
          title: "验证失败",
          description: errors.join('\n'),
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      // 构建更新数据
      const updateData: any = {
        bio: userInfo.bio,
        updated_at: new Date().toISOString(),
      }

      // GitHub 用户可以修改显示名
      if (userInfo.isGithubUser) {
        updateData.display_name = userInfo.displayName
      } else {
        // 邮箱用户可以修改更多字段
        updateData.username = userInfo.username
        updateData.display_name = userInfo.displayName
      }

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) throw error

      // 如果是邮箱用户且修改了邮箱，更新 Supabase Auth
      if (!userInfo.isGithubUser && userInfo.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: userInfo.email,
        })
        
        if (emailError) {
          toast({
            title: "邮箱更新失败",
            description: "信息已保存，但邮箱更新失败：" + emailError.message,
            variant: "destructive",
          })
        } else {
          toast({
            title: "保存成功",
            description: "信息已更新。请检查邮箱验证新地址。",
          })
        }
      } else {
        toast({
          title: "保存成功",
          description: "个人信息已更新",
        })
      }
    } catch (error: any) {
      console.error('Error saving:', error)
      toast({
        title: "保存失败",
        description: error.message || "无法保存信息",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <LayoutWithFullWidth>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </LayoutWithFullWidth>
    )
  }

  return (
    <LayoutWithFullWidth>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">账号设置</h1>
          <p className="text-muted-foreground mt-1">
            管理你的个人信息和偏好设置
          </p>
        </div>

        {/* 头像设置 */}
        <Card>
          <CardHeader>
            <CardTitle>个人头像</CardTitle>
            <CardDescription>
              {userInfo.isGithubUser 
                ? "你使用 GitHub 登录，头像来自 GitHub。可以上传自定义头像覆盖。" 
                : "上传你的个人头像"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {userInfo.avatarUrl ? (
                <img
                  src={userInfo.avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/10"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/10">
                  <User className="h-12 w-12 text-primary" />
                </div>
              )}
              
              <div className="flex-1">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors w-fit">
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>上传中...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        <span>上传新头像</span>
                      </>
                    )}
                  </div>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  支持 JPG, PNG, GIF 格式，最大 5MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>
              {userInfo.isGithubUser 
                ? "这些信息来自你的 GitHub 账号" 
                : "你的账号基本信息"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                电子邮箱
              </Label>
              <Input
                id="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                disabled={userInfo.isGithubUser}
                className={userInfo.isGithubUser ? "bg-muted" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {userInfo.isGithubUser 
                  ? "邮箱地址来自 GitHub，无法修改" 
                  : "修改邮箱后需要验证新地址"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                {userInfo.isGithubUser && <Github className="h-4 w-4" />}
                用户名
              </Label>
              <Input
                id="username"
                value={userInfo.username}
                onChange={(e) => setUserInfo(prev => ({ ...prev, username: e.target.value }))}
                disabled={userInfo.isGithubUser}
                className={userInfo.isGithubUser ? "bg-muted" : ""}
              />
              <p className="text-xs text-muted-foreground">
                {userInfo.isGithubUser
                  ? "用户名来自 GitHub，保持与 GitHub 账号一致"
                  : "只能包含字母、数字和下划线，至少 3 个字符"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">显示名称</Label>
              <Input
                id="displayName"
                value={userInfo.displayName}
                onChange={(e) => setUserInfo(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="输入显示名称"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {userInfo.isGithubUser
                  ? "GitHub 用户可以自定义显示名称"
                  : "这是在其他用户看到的名称"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 个人简介 */}
        <Card>
          <CardHeader>
            <CardTitle>个人简介</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio">简介</Label>
              <Textarea
                id="bio"
                value={userInfo.bio}
                onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="写点什么..."
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {userInfo.bio.length} / 500
              </p>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  保存中...
                </>
              ) : (
                "保存更改"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 账号信息提示 */}
        {userInfo.isGithubUser ? (
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Github className="h-5 w-5" />
                GitHub 账号
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                你正在使用 GitHub 账号登录。用户名和邮箱与你的 GitHub 账号保持同步。
                你可以自定义<strong>显示名称</strong>、<strong>头像</strong>和<strong>个人简介</strong>，这不会影响你的账号一致性。
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Mail className="h-5 w-5" />
                邮箱账号
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 dark:text-green-300">
                你正在使用邮箱账号登录。你可以修改你的<strong>用户名</strong>、<strong>邮箱</strong>、<strong>显示名称</strong>、<strong>头像</strong>和<strong>个人简介</strong>。
                你的账号唯一标识基于 UUID，修改信息不会影响账号一致性。
              </p>
            </CardContent>
          </Card>
        )}

        {/* 头像裁剪对话框 */}
        {selectedImage && (
          <AvatarCropDialog
            open={showCropDialog}
            onOpenChange={setShowCropDialog}
            imageSrc={selectedImage}
            onCropComplete={handleCropComplete}
          />
        )}
      </div>
    </LayoutWithFullWidth>
  )
}