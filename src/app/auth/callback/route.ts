import { createServerSupabaseClient } from "@/lib/supabase/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/dashboard"

  // 处理 OAuth 错误
  if (error) {
    return redirect(`/auth/error?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`)
  }

  // 验证授权码
  if (!code) {
    return redirect("/auth/error?error=no_code")
  }

  const supabase = createServerSupabaseClient()

  // 交换授权码获取 session
  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    return redirect(`/auth/error?error=auth_callback_error&error_description=${encodeURIComponent(exchangeError.message)}`)
  }

  if (!data?.session) {
    return redirect("/auth/error?error=session_creation_failed")
  }

  // 数据库触发器会自动创建 user_profiles 记录
  // 使用 service role 同步用户信息
  const user = data.user
  
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key') {
    try {
      const cookieStore = cookies()
      const serviceSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              cookieStore.set({ name, value, ...options })
            },
            remove(name: string, options: any) {
              cookieStore.set({ name, value: '', ...options, maxAge: 0 })
            },
          },
        }
      )

      // 检查用户是否已存在
      const { data: existingProfile, error: checkError } = await serviceSupabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (existingProfile) {
        // 用户已存在，更新信息
        await serviceSupabase
          .from('user_profiles')
          .update({
            avatar_url: user.user_metadata.avatar_url,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      } else {
        // 用户不存在（触发器可能失败），手动创建
        await serviceSupabase
          .from('user_profiles')
          .insert({
            id: user.id,
            username: user.user_metadata.user_name || user.user_metadata.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
            display_name: user.user_metadata.full_name || user.user_metadata.name || user.user_metadata.user_name || user.email,
            avatar_url: user.user_metadata.avatar_url,
          })
      }
    } catch (serviceError) {
      // 忽略同步错误，不影响登录流程
      console.error("User profile sync error:", serviceError)
    }
  }

  // Session 已在 exchangeCodeForSession 时设置，直接跳转
  return redirect(next)
}
