import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import LayoutWithSidebar from "@/components/LayoutWithSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <LayoutWithSidebar>{children}</LayoutWithSidebar>;
}