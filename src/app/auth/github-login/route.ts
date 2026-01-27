import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `https://github.com/login/oauth/authorize?client_id=53132565-9697-48a6-b392-95ec6b3b5ef9&redirect_uri=https://www.xiaocheng991.site/oauth/redirect`,
      scopes: "read:user user:email",
    },
  });

  if (error) {
    console.error("GitHub OAuth error:", error);
    return redirect("/login?error=oauth_error");
  }

  if (data.url) {
    return redirect(data.url);
  }

  return redirect("/login?error=oauth_error");
}
