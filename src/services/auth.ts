"use client";

import { useAuth } from "@/hooks/auth";
import { JsonResponse, jsonResponse } from "@/utils/response";

interface UserData {
  id: string;
  email: string;
  name: string;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
}

export async function getCurrentUser(): Promise<JsonResponse<UserData | null>> {
  try {

    // Get current user
    const {user} = useAuth()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return jsonResponse(null, "error", error?.message || "Not authenticated");
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    const userData: UserData = {
      id: user.id,
      email: profile.email || user.email || "",
      name: profile.name || "",
    };

    return jsonResponse(userData, "success", "User retrieved successfully");
  } catch (error) {
    console.error("Get current user error:", error);
    return jsonResponse(null, "error", "An unexpected error occurred");
  }
}
