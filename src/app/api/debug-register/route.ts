import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const { email, password, name } = await request.json();

    // 1. 注册用户
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || email.split("@")[0],
        },
      },
    });

    if (authError) {
      return NextResponse.json({
        success: false,
        error: authError.message,
        step: "auth_signup",
      });
    }

    // 2. 等待触发器执行（给数据库一点时间）
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. 检查 public.users 表中的记录
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user?.id)
      .single();

    if (userError) {
      return NextResponse.json({
        success: true,
        message: "用户已在 auth.users 中创建，但 public.users 同步可能失败",
        auth_user: {
          id: authData.user?.id,
          email: authData.user?.email,
        },
        public_users_error: userError.message,
        hint: "请在 Supabase Dashboard → SQL Editor 中执行 create_user_on_signup.sql 脚本",
      });
    }

    return NextResponse.json({
      success: true,
      message: "用户注册成功！",
      user: userData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    });
  }
}

// GET 方法：查询当前用户数
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email, name, current_skill_level, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (usersError) {
      return NextResponse.json({
        success: false,
        error: usersError.message,
        hint: "请确保已执行 create_user_on_signup.sql 触发器脚本",
      });
    }

    return NextResponse.json({
      success: true,
      user_count: users?.length || 0,
      users: users,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    });
  }
}
