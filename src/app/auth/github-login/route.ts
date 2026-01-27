import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: redirectTo,
      scopes: "read:user user:email",
    },
  });

  if (error) {
    console.error("GitHub OAuth error:", error);
    return redirect("/login?error=oauth_error");
  }

  if (data.url) {
    // 直接返回授权 URL，让浏览器重定向
    return redirect(data.url);
  }

  return redirect("/login?error=oauth_error");
}
