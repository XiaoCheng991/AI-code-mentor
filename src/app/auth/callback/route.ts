import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const error_description = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/dashboard"

  // 如果 GitHub 返回错误
  if (error) {
    console.error("GitHub OAuth Error:", error, error_description)
    return redirect(`/auth/error?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`)
  }

  if (!code) {
    console.error("No code provided in callback")
    return redirect("/auth/error?error=no_code")
  }

  console.log("Received OAuth code, exchanging for session...")
  const supabase = createServerSupabaseClient()

  const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error("Exchange code error:", exchangeError)
    return redirect(`/auth/error?error=auth_callback_error&error_description=${encodeURIComponent(exchangeError.message)}`)
  }

  console.log("Session exchange successful, user:", data?.user?.email)

  if (data?.session) {
    // 验证 session 是否创建
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      console.log("Session verified, redirecting to:", next)
      return redirect(next)
    }
  }

  console.error("Session not created after exchange")
  return redirect("/auth/error?error=session_creation_failed")
}
