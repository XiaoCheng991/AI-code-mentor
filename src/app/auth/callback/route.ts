import { supabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const { error } = await supabaseServer.auth.exchangeCodeForSession(code)
    if (!error) {
      return redirect(next)
    }
  }

  // Return the user to an error page with instructions
  return redirect("/login?error=auth_callback_error")
}
