import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/ui/header";
import { LoginForm } from "./view/LoginForm";
import { RegisterForm } from "./view/RegisterForm";
import { OtpVerificationForm } from "./view/OtpVerificationForm";
import { ForgotPasswordForm } from "./view/ForgotPasswordForm";
import { ResetPasswordConfirmForm } from "./view/ResetPasswordConfirmForm";
import { InsertUser } from "@shared/schema";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPasswordConfirm, setShowResetPasswordConfirm] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [, setLocation] = useLocation();
  const {
    user,
    isLoading: authLoading,
    registerMutation,
    verifyRegistrationOtpMutation,
    resetPasswordMutation,
    resetPasswordConfirmMutation,
  } = useAuth();

  useEffect(() => {
    if (!authLoading && user) {
      setLocation("/home");
    }
  }, [user, authLoading, setLocation]);

  useEffect(() => {
    if (registerMutation.isSuccess && registerMutation.data) {
      const email = (registerMutation.variables as InsertUser)?.email;
      if (email) {
        setOtpEmail(email);
        setShowOtpVerification(true);
      }
    }
  }, [registerMutation.isSuccess, registerMutation.data, registerMutation.variables]);

  useEffect(() => {
    if (verifyRegistrationOtpMutation.isSuccess) {
      setShowOtpVerification(false);
      setOtpEmail("");
      registerMutation.reset();
      verifyRegistrationOtpMutation.reset();
      setActiveTab("login");
    }
  }, [verifyRegistrationOtpMutation.isSuccess, registerMutation, verifyRegistrationOtpMutation]);

  const handleBackToRegistration = () => {
    setShowOtpVerification(false);
    setOtpEmail("");
    registerMutation.reset();
    setActiveTab("register");
  };

  const handleShowOtpVerification = (email: string) => {
    setOtpEmail(email);
    setShowOtpVerification(true);
  };

  const handleShowForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPasswordConfirm(false);
    setResetPasswordEmail("");
    resetPasswordMutation.reset();
    resetPasswordConfirmMutation.reset();
  };

  const handleForgotPasswordSubmit = async (email: string) => {
    setResetPasswordEmail(email);
    await resetPasswordMutation.mutateAsync({ email });
  };

  const handleResetPasswordConfirm = async (otp: string, newPassword: string) => {
    await resetPasswordConfirmMutation.mutateAsync({
      email: resetPasswordEmail,
      otp,
      new_password: newPassword,
    });
  };

  const handleResendResetOtp = async () => {
    await resetPasswordMutation.mutateAsync({ email: resetPasswordEmail });
  };

  useEffect(() => {
    if (resetPasswordMutation.isSuccess) {
      setShowForgotPassword(false);
      setShowResetPasswordConfirm(true);
    }
  }, [resetPasswordMutation.isSuccess]);

  useEffect(() => {
    if (resetPasswordConfirmMutation.isSuccess) {
      setShowResetPasswordConfirm(false);
      setResetPasswordEmail("");
      resetPasswordMutation.reset();
      resetPasswordConfirmMutation.reset();
    }
  }, [resetPasswordConfirmMutation.isSuccess, resetPasswordMutation, resetPasswordConfirmMutation]);

  if (authLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 flex-col overflow-hidden md:flex-row-reverse">
        {/* Left side - Forms */}
        <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
          <Card className="flex max-h-full w-full max-w-md flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-center text-2xl">Welcome to Eatsy</CardTitle>
              <CardDescription className="text-center">
                The home of delicious home-cooked cuisine
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {showOtpVerification ? (
                <OtpVerificationForm
                  email={otpEmail}
                  mode="registration"
                  onBack={handleBackToRegistration}
                />
              ) : showForgotPassword ? (
                <ForgotPasswordForm
                  onSubmit={handleForgotPasswordSubmit}
                  onBack={handleBackToLogin}
                  isLoading={resetPasswordMutation.isPending}
                />
              ) : showResetPasswordConfirm ? (
                <ResetPasswordConfirmForm
                  email={resetPasswordEmail}
                  onSubmit={handleResetPasswordConfirm}
                  onBack={handleBackToLogin}
                  onResendOtp={handleResendResetOtp}
                  isLoading={resetPasswordConfirmMutation.isPending}
                  isResending={resetPasswordMutation.isPending}
                />
              ) : (
                <Tabs
                  defaultValue="login"
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as "login" | "register")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <LoginForm onForgotPassword={handleShowForgotPassword} />
                  </TabsContent>

                  <TabsContent value="register">
                    <RegisterForm onShowOtpVerification={handleShowOtpVerification} />
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right side - Hero Section */}
        <div className="hidden flex-1 items-center justify-center overflow-y-auto bg-gradient-to-br from-orange-500 to-orange-600 p-8 md:flex">
          <div className="max-w-md rounded-[30px] bg-gradient-to-b from-white/20 to-transparent p-5 text-white backdrop-blur-md">
            <h1 className="mb-4 text-4xl font-bold">
              Experience Home-Cooked Meals Like Never Before
            </h1>
            <p className="mb-6 text-lg">
              Connect with local home cooks, order authentic dishes from around the world, and
              explore a world of flavors right from your neighborhood.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-white/20 p-2">
                  <span className="text-xl">🍲</span>
                </div>
                <div>
                  <h3 className="font-semibold">Authentic Local Dishes</h3>
                  <p className="text-sm opacity-90">
                    From family recipes to local specialties, enjoy real home cooking
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-white/20 p-2">
                  <span className="text-xl">👩‍🍳</span>
                </div>
                <div>
                  <h3 className="font-semibold">Support Local Cooks</h3>
                  <p className="text-sm opacity-90">
                    Empower home cooks by ordering directly from their kitchens
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 rounded-full bg-white/20 p-2">
                  <span className="text-xl">🚚</span>
                </div>
                <div>
                  <h3 className="font-semibold">Fast Delivery</h3>
                  <p className="text-sm opacity-90">
                    Get delicious meals delivered right to your doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
