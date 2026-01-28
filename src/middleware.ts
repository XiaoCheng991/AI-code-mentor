import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete(name)
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.delete(name)
        },
      },
    }
  )

  // 获取当前会话
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 需要认证的路径
  const protectedPaths = ['/dashboard', '/chat', '/drive', '/settings']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  )

  // 如果访问受保护的路径但没有会话，则重定向到登录页
  if (isProtectedPath && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = `?redirectedFrom=${encodeURIComponent(request.url)}`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export default middleware

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}
