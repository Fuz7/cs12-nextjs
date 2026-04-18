"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useState } from "react";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import verifyIcon from "@/resources/images/verifyIcon.png";
import websiteIcon from "@/resources/images/websiteIcon.svg";
import { useAuth } from "@/hooks/auth";
export default function LoginForm() {
  const { logout } = useAuth({
    middleware: "guest",
    
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState(null);
  // Handle input changes



  return (
    <div
      className="min-h-screen 
    flex items-center justify-center bg-gradient-to-br
     from-slate-100 via-blue-50 to-slate-100
      dark:from-slate-950 dark:via-slate-900
       dark:to-slate-950 p-6 relative overflow-hidden
       w-full"
    >
      {/* Background decorative elements */}
      <div className="relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.015] dark:opacity-[0.03]"></div>
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Card
        className="w-full max-w-sm rounded-lg border-0 gap-3
       bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
        shadow-xl shadow-primary/10 overflow-hidden"
      >
        <div
          className="absolute top-0 left-0 right-0 h-1.5
         bg-gradient-to-r from-primary/80 via-primary to-primary/80"
        ></div>

        <CardHeader className="pb-2 pt-8 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <Image
              src={verifyIcon}
              alt="Arabian"
              width={64}
              height={64}
              className="h-16 w-16"
              priority
            />
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Account Pending Verification
            </CardTitle>
            <p className="p-3 text-sm text-slate-800 dark:text-slate-700 mt-1">
              Your account registration was successful 
              and is currently under review by our 
              administrative team. We appreciate your patience during this process.
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-2">
          {errors && Object.keys(errors).length > 0 && (
            <div
              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300
             text-xs px-4 py-3 mb-4 rounded-xl flex items-center
              gap-2 "
            >
              <CircleAlert size={16} />
              {errors[Object.keys(errors)[0]][0]}
            </div>
          )}

          <div className="mt-6 text-center text-lg">
            <button
              onClick={()=>logout()}
              className="text-primary hover:underline underline-offset-2"
            >
              Return to Sign in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
