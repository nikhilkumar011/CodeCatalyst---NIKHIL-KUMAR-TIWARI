import { create } from "zustand";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";

interface SignupData {
  email: string;
  password: string;
  fullName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthStore {
  signup: (
    data: SignupData
  ) => Promise<{
    data: unknown;
    error: unknown;
  }>;

  login: (data: LoginData) => Promise<void>;
}

export const useAuthStore = create<AuthStore>(() => ({
  signup: async ({ email, password, fullName: name }) => {
    let loadingToast: string | undefined;

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/landingPage",
      },
      {
        onRequest: () => {
          loadingToast = toast.loading("Signing Up...");
        },
        onSuccess: () => {
          if (loadingToast) toast.dismiss(loadingToast);
          toast.success("Signed Up Successfully!");
          redirect("/landingPage");
        },
        onError: (ctx) => {
          if (loadingToast) toast.dismiss(loadingToast);
          toast.error(ctx.error.message);
        },
      }
    );

    return { data, error };
  },

  login: async ({ email, password }) => {
    let loadingToast: string | undefined;

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/landingPage",
        rememberMe: false,
      },
      {
        onRequest: () => {
          loadingToast = toast.loading("Signing In...");
        },
        onSuccess: () => {
          if (loadingToast) toast.dismiss(loadingToast);
          toast.success("Logged In Successfully!");
          redirect("/landingPage");
        },
        onError: (ctx) => {
          if (loadingToast) toast.dismiss(loadingToast);
          toast.error(ctx.error.message);
        },
      }
    );
  },
}));