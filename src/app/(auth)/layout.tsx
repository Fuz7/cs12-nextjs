"use client";
import { useAuth } from "@/hooks/auth";
import axios from "@/lib/axios";
import { ReactNode } from "react";
import useSWR from "swr";

export default function Layout({ children }: { children: ReactNode }) {
  useAuth({ middleware: "auth" });

  return <div className="bg-gray-300">{children}</div>;
}
