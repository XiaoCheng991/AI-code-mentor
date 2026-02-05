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
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">文件传输</h1>
            <p className="text-slate-500 mt-1">管理和分享你的文件</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 hover:bg-slate-50">
              <Upload className="h-4 w-4" />
              上传文件
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25">
              <Folder className="h-4 w-4" />
              新建文件夹
            </Button>
          </div>
        </div>

        {/* Search and View Options */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索文件..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="hover:bg-slate-50">
                <Grid3X3 className="h-4 w-4 text-slate-500" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-slate-50">
                <List className="h-4 w-4 text-slate-500" />
              </Button>
              <Button variant="outline" size="icon" className="hover:bg-slate-50">
                <MoreHorizontal className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Folders Section */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5 text-blue-500" />
                  文件夹
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {folders.map((folder) => (
                    <div 
                      key={folder.id} 
                      className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Folder className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-700 truncate">{folder.name}</h4>
                        <p className="text-sm text-slate-400">{folder.size}</p>
                        <p className="text-xs text-slate-300">修改于 {folder.modified}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Files Section */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <File className="h-5 w-5 text-green-500" />
                  最近文件
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {files.map((file) => {
                    let IconComponent;
                    let colorClass;
                    switch(file.type) {
                      case 'pdf':
                        IconComponent = FileText;
                        colorClass = 'text-red-500 bg-red-500/10';
                        break;
                      case 'zip':
                        IconComponent = File;
                        colorClass = 'text-amber-500 bg-amber-500/10';
                        break;
                      case 'docx':
                        IconComponent = FileText;
                        colorClass = 'text-blue-500 bg-blue-500/10';
                        break;
                      case 'mp3':
                        IconComponent = Music;
                        colorClass = 'text-purple-500 bg-purple-500/10';
                        break;
                      default:
                        IconComponent = File;
                        colorClass = 'text-slate-500 bg-slate-500/10';
                    }

                    return (
                      <div 
                        key={file.id} 
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all group"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-slate-700 truncate">{file.name}</h4>
                          <p className="text-xs text-slate-400">{file.size} · {file.owner}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="h-4 w-4 text-slate-400" />
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
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">👥</span>
              共享给我的
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-slate-100">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-3 px-4 font-medium text-slate-600">名称</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">大小</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">共享者</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">修改日期</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-50 hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      项目提案.pptx
                    </td>
                    <td className="py-3 px-4 text-slate-500">3.2 MB</td>
                    <td className="py-3 px-4 text-slate-500">Luna</td>
                    <td className="py-3 px-4 text-slate-500">2024-01-10</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="gap-1 hover:bg-blue-50 hover:text-blue-600">
                        <Download className="h-4 w-4" />
                        下载
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-blue-50/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-700 flex items-center gap-2">
                      <File className="h-4 w-4 text-amber-500" />
                      团队照片集.zip
                    </td>
                    <td className="py-3 px-4 text-slate-500">45.7 MB</td>
                    <td className="py-3 px-4 text-slate-500">张三</td>
                    <td className="py-3 px-4 text-slate-500">2024-01-08</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="gap-1 hover:bg-blue-50 hover:text-blue-600">
                        <Download className="h-4 w-4" />
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
