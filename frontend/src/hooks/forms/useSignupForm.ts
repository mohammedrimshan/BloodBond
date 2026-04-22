import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "./useForm";
import { useRegister } from "@/hooks/auth/useAuth";
import { signupSchema, type SignupFormData } from "@/validations/auth.schema";
import { AUTH_TOASTS, PROFILE_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";

export function useSignupForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const onSubmit = useCallback(
    async (values: SignupFormData) => {
      try {
        const res = await registerMutation.mutateAsync({
          name: values.name,
          email: values.email,
          phoneNumber: values.phoneNumber,
          password: values.password,
          dateOfBirth: values.dateOfBirth,
          bloodGroup: values.bloodGroup,
          place: values.place,
          lastDonatedDate: values.lastDonatedDate,
          whatsappNumber: values.whatsappNumber,
          // photoUrl will be handled if needed, for now sending base info
        });

        if (res.userId) setUserId(res.userId);
        toast.success(AUTH_TOASTS.REGISTER_SUCCESS);
        setShowOTPModal(true);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || AUTH_TOASTS.REGISTER_FAILED
        );
        console.error("Registration error:", error);
      }
    },
    [registerMutation]
  );

  const form = useForm<SignupFormData>({
    schema: signupSchema,
    initialValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: "",
      bloodGroup: "",
      place: "",
      lastDonatedDate: "",
      whatsappNumber: "",
      photo: null,
    },
    onSubmit,
  });

  const nextStep = useCallback(() => {
    // Validate current step fields
    const step1Fields = ["name", "email", "phoneNumber", "password", "confirmPassword"];
    let hasErrors = false;
    
    step1Fields.forEach(field => {
      const result = signupSchema.shape[field as keyof typeof signupSchema.shape].safeParse(form.values[field as keyof SignupFormData]);
      if (!result.success) {
        form.handleBlur(field as keyof SignupFormData);
        hasErrors = true;
      }
    });

    // Check password match too
    if (form.values.password !== form.values.confirmPassword) {
      hasErrors = true;
    }

    if (!hasErrors) {
      setCurrentStep(2);
    } else {
      toast.error("Please fix the errors in step 1 before proceeding.");
    }
  }, [form]);

  const prevStep = useCallback(() => {
    setCurrentStep(1);
  }, []);

  /** Wraps handleSubmit — shows toast on validation failure */
  const handleSignup = useCallback(
    (e: React.FormEvent) => {
      const result = signupSchema.safeParse(form.values);
      console.log(result);
      if (!result.success) {
        toast.error(AUTH_TOASTS.VALIDATION_ERROR);
      }
      form.handleSubmit(e);
    },
    [form]
  );

  const handleOTPVerified = useCallback(() => {
    setShowOTPModal(false);
    toast.success(PROFILE_TOASTS.ACCOUNT_CREATED);
    navigate("/");
  }, [navigate]);

  return {
    ...form,
    handleSignup,
    showOTPModal,
    setShowOTPModal,
    userId,
    handleOTPVerified,
    isPending: registerMutation.isPending,
    currentStep,
    nextStep,
    prevStep,
  };
}
