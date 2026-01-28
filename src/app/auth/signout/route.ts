import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const cookieStore = cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Handle cookie setting error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch {
            // Handle cookie removal error
          }
        },
      },
    }
  )

  // 清除 Supabase session
  await supabase.auth.signOut({ scope: 'local' })

  // 创建响应并手动清除所有 Supabase 相关 cookies
  const response = NextResponse.redirect(new URL('/login', request.url))
  
  // 清除所有 Supabase auth cookies
  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
  ]
  
  cookieNames.forEach(name => {
    response.cookies.set({
      name,
      value: '',
      maxAge: 0,
      path: '/',
    })
  })

  return response
}
