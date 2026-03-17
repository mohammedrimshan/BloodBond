import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useForm } from "./useForm";
import { useLogin } from "@/hooks/auth/useAuth";
import { loginSchema, type LoginFormData } from "@/validations/auth.schema";
import { AUTH_TOASTS } from "@/constants/toastMessages";
import { setUser } from "@/store/userSlice";
import { toast } from "sonner";

export function useLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const loginMutation = useLogin();

  const onSubmit = useCallback(
    async (values: LoginFormData) => {
      try {
        const res = await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });

        if (res.user) {
          dispatch(
            setUser({
              id: res.user.id,
              name: res.user.name,
              email: res.user.email,
              phoneNumber: res.user.phoneNumber || null,
              photoUrl: res.user.photoUrl || null,
              isVerified: res.user.isVerified ?? true,
            })
          );
        }

        // Invalidate donors query to update landing page instantly
        queryClient.invalidateQueries({ queryKey: ["donors"] });

        toast.success(AUTH_TOASTS.LOGIN_SUCCESS);
        navigate("/");
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || AUTH_TOASTS.LOGIN_FAILED
        );
        console.error("Login error:", error);
      }
    },
    [loginMutation, dispatch, navigate]
  );

  const form = useForm<LoginFormData>({
    schema: loginSchema,
    initialValues: { email: "", password: "" },
    onSubmit,
  });

  /** Wraps handleSubmit — shows toast on validation failure */
  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      // Pre-check: if validation will fail, show toast
      const result = loginSchema.safeParse(form.values);
      if (!result.success) {
        toast.error(AUTH_TOASTS.VALIDATION_ERROR);
      }
      form.handleSubmit(e);
    },
    [form]
  );

  return {
    ...form,
    handleLogin,
    isPending: loginMutation.isPending,
  };
}
