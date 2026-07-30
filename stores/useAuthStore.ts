import { create } from "zustand";
import { authClient } from "@/lib/auth-client";
import { toast } from 'react-hot-toast'
import { redirect } from "next/navigation";


export const useAuthStore = create((set, get) => ({


    signup: async ({ email, password, fullName:name }) => {
        let loadingToast;
        const { data, error } = await authClient.signUp.email(
            {
                email,
                password,
                name,
                callbackURL: "/root",
            },
            {
                onRequest: (ctx) => {
                    loadingToast = toast.loading("Signing Up...")
                },
                onSuccess: (ctx) => {
                    toast.dismiss(loadingToast)
                    toast.success("Signed Up Successfully!");
                    redirect('/root')
                },
                onError: (ctx) => {
                    toast.dismiss(loadingToast)
                    toast.error(ctx.error.message);
                },
            }
        );

        return { data, error };
    },

    login: async ({ email, password }) => {
        let loadingToast;

        await authClient.signIn.email(
            {
                email,
                password,
                callbackURL: "/root",
                rememberMe: false,
            },
            {
                onRequest: () => {
                    loadingToast = toast.loading("Signing In...");
                },
                onSuccess: async () => {
                    toast.dismiss(loadingToast);
                    toast.success("Logged In Successfully!");

                    redirect('/root')

                },
                onError: (ctx) => {
                    toast.dismiss(loadingToast);
                    toast.error(ctx.error.message);
                },
            }
        );
    }

}));