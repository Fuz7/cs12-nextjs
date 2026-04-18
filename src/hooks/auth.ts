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
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  is_authorized: boolean;
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
      .post("/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/login", props)
      .then(() => mutate())
      .catch((error) => {
        console.log(error);
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
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
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/";
  };

  useEffect(() => {
    console.log(user);
    // if (middleware === "auth" && user.is_authorized === false && !error){
    //   router.push("/verify")
    //   return
    // }

    // If the user is authenticated and tries to access a admin page,
    // redirects them to user page
    // if (
    //   middleware === "auth" &&
    //   user &&
    //   user.role === "user"
    // ) {
    //   router.push("/user");
    // }
    if (
      middleware === "auth" &&
      user &&
      user.role === "user" &&
      user.is_authorized === false
    ) {
      router.push("/verify");
    }
    if (middleware === "auth" && user && user.role === "admin") {
      router.push("/admin/dashboard");
    }
    // if (middleware === 'auth' && (user && !user.email_verified_at))
    //     router.push('/verify-email')

    // if (
    //     window.location.pathname === '/verify-email' &&
    //     user?.email_verified_at
    // )
    //     router.push(redirectIfAuthenticated)
    if (middleware === "guest" && user && user.role === "admin") {
      router.push("/admin/dashboard");
    }
    if (
      middleware === "guest" &&
      user &&
      user.role === "user" &&
      user.is_authorized === false
    ) {
      router.push("/verify");
    }
    if (middleware === "auth" && error) logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
