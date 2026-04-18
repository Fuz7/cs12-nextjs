"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormEvent, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Check,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import websiteIcon from "@/resources/images/websiteIcon.svg";
import { useAuth } from "@/hooks/auth";
export default function LoginForm() {
  const { login } = useAuth({
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
  const [status,setStatus] = useState(null)
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const SubmitForm = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await login({
      email: formData.email,
      password: formData.password,
      remember:formData.rememberMe,
      setErrors,
      setStatus
    });
    setLoading(false);
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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

      <Card className="w-full max-w-sm rounded-lg border-0 gap-3
       bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
        shadow-xl shadow-primary/10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5
         bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>

        <CardHeader className="pb-2 pt-8 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-transform duration-300 hover:scale-105">
              <Image
                src={websiteIcon}
                alt="Arabian"
                width={40}
                height={40}
                className="h-10 w-10"
                priority
              />
            </div>
            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Welcome back
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">
              Sign in to your account to continue
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-2">
          {errors && Object.keys(errors).length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300
             text-xs px-4 py-3 mb-4 rounded-xl flex items-center
              gap-2 ">
              <CircleAlert size={16} />
              {errors[Object.keys(errors)[0]][0]}
            </div>
          )}

          <form onSubmit={SubmitForm} className="space-y-5">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email address"
                className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-lg ring-0 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-slate-400 group-focus-within:text-primary transition-colors duration-200" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Password"
                className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 rounded-lg ring-0 focus:border-primary focus:ring-1 focus:ring-primary text-slate-900 dark:text-white"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <div className="relative inline-flex">
                  <input
                    type="checkbox"
                    id="remember"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                </div>
                <Label
                  htmlFor="remember"
                  className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                >
                  <div
                    className={cn(
                      "h-[18px] w-[18px] rounded bg-slate-50",
                      "dark:bg-slate-800/50 z-10",
                      "border border-slate-200",
                      "dark:border-slate-700/50 flex items-center justify-center",
                      formData.rememberMe && "bg-primary border-primary"
                    )}
                  >
                    {formData.rememberMe && <Check size={12} color="white" />}
                  </div>
                  Remember me
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium text-base shadow-lg shadow-primary/20 transition-all mt-4 relative group overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 w-3/12 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-45deg] -translate-x-full group-hover:animate-shimmer" />

              <div className="flex items-center justify-center gap-1">
                <span>{loading ? "Signing in..." : "Sign in"}</span>
                <ArrowRight
                  className={cn(
                    "h-4 w-4",
                    "group-hover:translate-x-1 transition-transform",
                    loading && "hidden"
                  )}
                />
              </div>
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href={"/register"}
              className="text-primary underline underline-offset-2"
            >
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
