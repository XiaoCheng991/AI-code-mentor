import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, FolderUp, Lock, Users, ArrowRight, Sparkles, Shield, Download, Image, Zap } from "lucide-react";
import { redirect } from 'next/navigation';

export default function HomePage() {
  // 重定向到仪表盘页面
  redirect('/dashboard');
}
