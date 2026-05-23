import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
interface AuthOptions {
  middleware?: "guest" | "auth";
  redirectIfAuthenticated?: string;
}
export interface User {
  id: number;
  avatarUrl?:string;
  firstName?:string;
  lastName?:string
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  is_linked: boolean;
  remember_token: string | null;
  created_at: string;
  updated_at: string;
}
export const useAuth = ({ middleware }: AuthOptions = {}) => {
  const router = useRouter();
  const params = useParams();

  const {
    data: user,
    error,
    mutate,
    isLoading,
  } = useSWR<User>(
    "/api/user",
    () => axios.get("/api/user").then((res) => res.data),
    {
      shouldRetryOnError: false,
    },
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/api/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setStatus(null);

    return await axios
      .post("/api/login", props)
      .then(() => mutate())
      .catch((error) => {
        console.log(error);
  
        return error.errors;
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status)),
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/api/logout").then(() => mutate());
    }

    window.location.pathname = "/";
  };

  useEffect(() => {

  console.log(user);

  if (middleware === "auth") {
    if (error) {
      logout();
      return;
    }

    if (!user) {
      router.push("/");
      return
    };

    // Check is_linked first before role-based redirect
    if (user.role === "user" && user.is_linked === false) {
      router.push("/verify");
      return;
    }

    if (user.role === "user") {
      router.push("/dashboard");
      return;
    }

    if (user.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }
  }

  if (middleware === "guest") {
    if (!user) return;

    if (user.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }

    if (user.role === "user" && user.is_linked === false) {
      router.push("/verify");
      return;
    }

    if (user.role === "user" && user.is_linked === true) {
      router.push("/dashboard");
      return;
    }
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [user, error])

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    isLoading,
  };
};
