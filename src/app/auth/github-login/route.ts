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
    // 返回 OAuth URL，让客户端在新标签页中打开
    return Response.json({ url: data.url });
  }

  return Response.json({ error: "oauth_error" }, { status: 400 });
}
