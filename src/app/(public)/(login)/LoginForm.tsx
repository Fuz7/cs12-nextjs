"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { EyeIcon } from "lucide-react";
import { useAuth } from "@/hooks/auth";
import InputError from "@/components/ui/InputError";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const { login } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, []>>({});
  const [status, setStatus] = useState(null);

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();

    login({
      email,
      password,
      remember: false,
      setErrors,
      setStatus,
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitForm}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
                <InputError messages={errors.email} />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    required
                  />
                  <EyeIcon
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    size={20}
                    color="#555555"
                    className="absolute right-2.5 top-2 cursor-pointer "
                  />
                  <InputError messages={errors.password} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <Button
                  onClick={() => {}}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href={"/register"} className="underline underline-offset-2">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
