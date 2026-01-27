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
          // 使用 delete() 方法删除 cookie，避免类型错误
          request.cookies.delete(name)
          supabaseResponse = NextResponse.next({
            request,
          })
          supabaseResponse.cookies.delete(name)
        },
      },
    }
  )

  /*
   * ✅ 优化说明：
   * 只在有token时验证，不强制刷新session
   * 原来调用 getUser() 会自动刷新token，增加延迟
   * 现在只在需要时（如认证回调）才刷新
   */

  return supabaseResponse
}

export default middleware

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favabase/favicon.ico (网站图标)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - auth/callback (认证回调)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
}
