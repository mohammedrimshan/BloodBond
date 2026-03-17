import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOTP, useResendOTP } from "@/hooks/auth/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { OTP_TOASTS } from "@/constants/toastMessages";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  userId: string;
  onVerified: () => void;
};

const OTPModal = ({ isOpen, onClose, email, userId, onVerified }: Props) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();

  // countdown timer
  useEffect(() => {
    if (!isOpen || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // reset when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setOtp(["", "", "", "", "", ""]);
    setTimer(60);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    setOtp(pasted.split("").slice(0, 6));
    inputRefs.current[Math.min(pasted.length - 1, 5)]?.focus();
  };

  const handleResend = async () => {
    if (!canResend || resendOTPMutation.isPending) return;

    try {
      await resendOTPMutation.mutateAsync({ email });

      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);

      toast.success(OTP_TOASTS.RESEND_SUCCESS);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || OTP_TOASTS.RESEND_FAILED);
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error(OTP_TOASTS.INCOMPLETE);
      return;
    }

    try {
      const res = await verifyOTPMutation.mutateAsync({
        userId, // ✅ FIX
        email,
        otp: otpValue,
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
            dateOfBirth: res.user.dateOfBirth || null,
            bloodGroup: res.user.bloodGroup || null,
            place: res.user.place || null,
            lastDonatedDate: res.user.lastDonatedDate || null,
            whatsappNumber: res.user.whatsappNumber || null,
            isEligible: res.user.isEligible ?? true,
          })
        );
      }

      // Invalidate donors query to update landing page instantly
      queryClient.invalidateQueries({ queryKey: ["donors"] });

      toast.success(OTP_TOASTS.VERIFY_SUCCESS);
      onVerified();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || OTP_TOASTS.VERIFY_FAILED);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4"
          disabled={verifyOTPMutation.isPending}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">
          Verify Your Email
        </h2>

        <p className="text-center text-muted-foreground mb-6">
          Enter the code sent to <br />
          <span className="font-medium text-primary">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <Input
              key={index}
              value={digit}
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold"
              disabled={verifyOTPMutation.isPending}
            />
          ))}
        </div>

        {!canResend ? (
          <p className="text-center text-sm mb-4">
            Resend in <span className="font-bold">{timer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-primary underline text-sm block mx-auto mb-4"
          >
            Resend OTP
          </button>
        )}

        <Button
          className="w-full h-12"
          onClick={handleVerify}
          disabled={verifyOTPMutation.isPending}
        >
          {verifyOTPMutation.isPending ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </div>
  );
};

export default OTPModal;
