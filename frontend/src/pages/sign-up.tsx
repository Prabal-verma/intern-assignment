"use client";

import * as React from "react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { cn } from "../lib/utils";
import { signup, verifySignupOTP, resendOTP } from "../lib/authApi";
import { useNavigate } from "react-router-dom";

export function SignUpCard() {
  const [otpVisible, setOtpVisible] = React.useState(false);
  const [step, setStep] = React.useState<"form" | "otp">("form");
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    dob: "",
    otp: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [resendLoading, setResendLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await signup({ 
        name: form.name.trim(), 
        email: form.email.trim(),
        dob: form.dob 
      });
      setSuccess(result.message || "OTP sent successfully!");
      setStep("otp");
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await verifySignupOTP({
        email: form.email.trim(),
        otp: form.otp.trim(),
      });
      setSuccess(result.message || "Registration successful!");
      // Small delay to show success message before navigation
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await resendOTP({ email: form.email.trim() });
      setSuccess(result.message || "New OTP sent successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <main className="min-h-dvh w-full bg-white">
      <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
        <section
          className={cn(
            "rounded-3xl border border-neutral-200 bg-white shadow-sm",
            "p-4 md:p-6 lg:p-8 font-sans"
          )}
          aria-label="Sign up container"
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Left: form side */}
            <div className="flex flex-col">
              <form
                onSubmit={step === "form" ? handleSignup : handleVerify}
                className="flex flex-col"
              >
                <div className="mb-8 flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-7 w-15 rounded"
                  />
                </div>
                <h1 className="mb-2 text-3xl font-semibold tracking-tight text-neutral-900 text-balance">
                  Sign up
                </h1>
                <p className="mb-6 text-sm leading-6 text-neutral-500">
                  Sign up to enjoy the feature of HD
                </p>
                
                {/* Success message */}
                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                    {success}
                  </div>
                )}
                
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Name - always visible */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="mb-1 block text-xs font-medium text-blue-600"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Jonas Kahnwald"
                    value={form.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-lg border border-neutral-300 bg-white px-3 py-3",
                      "text-sm text-neutral-900 placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      step === "otp" && "bg-gray-50 cursor-not-allowed"
                    )}
                    aria-label="Name"
                    required
                    minLength={2}
                    maxLength={50}
                    disabled={step === "otp"}
                  />
                </div>
                
                {/* Email - always visible */}
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="mb-1 block text-xs font-medium text-blue-600"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
                      aria-hidden="true"
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      placeholder="jonas_kahnwald@gmail.com"
                      value={form.email}
                      onChange={handleChange}
                      className={cn(
                        "w-full rounded-lg border border-neutral-300 bg-white pr-3 pl-10 py-3",
                        "text-sm text-neutral-900 placeholder:text-neutral-400",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        step === "otp" && "bg-gray-50 cursor-not-allowed"
                      )}
                      aria-label="Email"
                      required
                      disabled={step === "otp"}
                    />
                  </div>
                </div>

                {/* DOB - always visible */}
                <div className="mb-4">
                  <label
                    htmlFor="dob"
                    className="mb-1 block text-xs font-medium text-blue-600"
                  >
                    Date of Birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={form.dob}
                    onChange={handleChange}
                    className={cn(
                      "w-full rounded-lg border border-neutral-300 bg-white px-3 py-3",
                      "text-sm text-neutral-900 placeholder:text-neutral-400",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      step === "otp" && "bg-gray-50 cursor-not-allowed"
                    )}
                    aria-label="Date of Birth"
                    required
                    disabled={step === "otp"}
                  />
                </div>

                {/* OTP field - appears below when step is otp */}
                {step === "otp" && (
                  <div className="mb-4">
                    <label
                      htmlFor="otp"
                      className="mb-1 block text-xs font-medium text-blue-600"
                    >
                      Verification Code
                    </label>
                    <div className="relative">
                      <input
                        id="otp"
                        name="otp"
                        type={otpVisible ? "text" : "password"}
                        placeholder="Enter 6-digit OTP"
                        value={form.otp}
                        onChange={handleChange}
                        className={cn(
                          "w-full rounded-lg border border-neutral-300 bg-white px-3 py-3",
                          "text-sm text-neutral-900 placeholder:text-neutral-400",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        )}
                        aria-label="One-time password"
                        maxLength={6}
                        pattern="[0-9]{6}"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setOtpVisible((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                        aria-label={otpVisible ? "Hide OTP" : "Show OTP"}
                      >
                        {otpVisible ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    
                    {/* Resend OTP */}
                    <div className="mt-2">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendLoading}
                        className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
                      >
                        {resendLoading ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || resendLoading}
                  className={cn(
                    "mt-1 inline-flex h-11 w-full items-center justify-center rounded-lg",
                    "bg-blue-600 px-4 text-sm font-semibold text-white",
                    "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
                    (loading || resendLoading) && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    step === "form" ? "Getting OTP..." : "Signing up..."
                  ) : (
                    step === "form" ? "Get OTP" : "Sign up"
                  )}
                </button>
                
                {step === "form" && (
                  <>
                    {/* Or divider */}
                    <div className="my-6 flex items-center">
                      <div className="flex-1 border-t border-neutral-300"></div>
                      <span className="px-4 text-sm text-neutral-500">or</span>
                      <div className="flex-1 border-t border-neutral-300"></div>
                    </div>
                    
                    {/* Google Sign In */}
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
                      className={cn(
                        "inline-flex h-11 w-full items-center justify-center rounded-lg",
                        "border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-700",
                        "hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      )}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </a>
                  </>
                )}
                
                {/* Footer link */}
                <p className="mt-6 text-center text-sm text-neutral-500">
                  Already have an account?{" "}
                  <a
                    href="/sign-in"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
            
            {/* Right: image panel - hidden on mobile and tablet */}
            <div className="relative hidden lg:block">
              <div className="h-full w-full overflow-hidden rounded-3xl">
                <img
                  src="/container.png"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
