import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { 
  Folder, 
  File, 
  Image, 
  FileText, 
  Music, 
  Video, 
  Download, 
  Upload, 
  MoreHorizontal, 
  Search,
  Grid3X3,
  List
} from "lucide-react"
import LayoutWithFullWidth from "@/components/LayoutWithFullWidth"

export default async function DrivePage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // 如果用户未登录，重定向到登录页
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>请先登录</p>
      </div>
    );
  }

  // Mock data for demonstration
  const folders = [
    { id: "folder-1", name: "照片", size: "1.2 GB", modified: "2024-01-15", type: "folder" },
    { id: "folder-2", name: "文档", size: "450 MB", modified: "2024-01-10", type: "folder" },
    { id: "folder-3", name: "音乐", size: "2.1 GB", modified: "2024-01-05", type: "folder" },
    { id: "folder-4", name: "工作资料", size: "870 MB", modified: "2024-01-12", type: "folder" },
  ];

  const files = [
    { id: "file-1", name: "年度报告.pdf", size: "2.4 MB", modified: "2024-01-14", type: "pdf", owner: "我" },
    { id: "file-2", name: "假期照片.zip", size: "15.7 MB", modified: "2024-01-13", type: "zip", owner: "Luna" },
    { id: "file-3", name: "项目计划.docx", size: "1.1 MB", modified: "2024-01-12", type: "docx", owner: "我" },
    { id: "file-4", name: "会议录音.mp3", size: "8.3 MB", modified: "2024-01-11", type: "mp3", owner: "张三" },
  ];

  return (
    <LayoutWithFullWidth>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              文件传输
            </h1>
            <p className="text-muted-foreground mt-1">
              管理和分享你的文件
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              上传文件
            </Button>
            <Button className="gap-2">
              <Folder className="h-4 w-4" />
              新建文件夹
            </Button>
          </div>
        </div>

        {/* Search and View Options */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="relative w-96">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索文件..."
                className="pl-8 pr-4 py-2 w-full rounded-lg border bg-background text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Folders Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>文件夹</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folders.map((folder) => (
                    <div 
                      key={folder.id} 
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Folder className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{folder.name}</h4>
                        <p className="text-sm text-muted-foreground">{folder.size}</p>
                        <p className="text-xs text-muted-foreground">修改于 {folder.modified}</p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Files Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>最近文件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => {
                    let IconComponent;
                    switch(file.type) {
                      case 'pdf':
                        IconComponent = FileText;
                        break;
                      case 'zip':
                        IconComponent = File;
                        break;
                      case 'docx':
                        IconComponent = FileText;
                        break;
                      case 'mp3':
                        IconComponent = Music;
                        break;
                      default:
                        IconComponent = File;
                    }

                    return (
                      <div 
                        key={file.id} 
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <IconComponent className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{file.name}</h4>
                          <p className="text-xs text-muted-foreground">{file.size} • {file.owner}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Shared with Me Section */}
        <Card>
          <CardHeader>
            <CardTitle>共享给我的</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">名称</th>
                    <th className="text-left py-2 px-4">大小</th>
                    <th className="text-left py-2 px-4">共享者</th>
                    <th className="text-left py-2 px-4">修改日期</th>
                    <th className="text-left py-2 px-4">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">项目提案.pptx</td>
                    <td className="py-3 px-4 text-muted-foreground">3.2 MB</td>
                    <td className="py-3 px-4 text-muted-foreground">Luna</td>
                    <td className="py-3 px-4 text-muted-foreground">2024-01-10</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-accent/50">
                    <td className="py-3 px-4 font-medium">团队照片集.zip</td>
                    <td className="py-3 px-4 text-muted-foreground">45.7 MB</td>
                    <td className="py-3 px-4 text-muted-foreground">张三</td>
                    <td className="py-3 px-4 text-muted-foreground">2024-01-08</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </LayoutWithFullWidth>
  )
}