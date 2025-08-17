"use client";

import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/auth";

interface LogoutButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children?: React.ReactNode;
}

export default function LogoutButton({
  variant = "ghost",
  size = "sm",
  className,
  children,
  ...props
}: LogoutButtonProps) {
  // We don't need router anymore since the server action handles redirection
  // const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {logout} = useAuth()
  const handleLogout = async () => {
    setIsLoading(true);
    logout()
    setIsLoading(false)
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {children || (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}
