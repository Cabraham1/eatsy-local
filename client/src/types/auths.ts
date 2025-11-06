import { InsertUser, loginSchema, User } from "@shared/schema";
import { z } from "zod";
import { Role } from "./enum";

export interface OItpVerificationFormProps {
  email: string;
  mode: "login" | "registration";
  onBack: () => void;
}

export type TLoginFormValues = z.infer<typeof loginSchema>;

export interface IUpdateProfileRequest {
  phone?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
}

export interface IChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface IRoleChangeRequest {
  requested_role: Role;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterCredentials extends InsertUser {}

export interface ILoginResponse {
  user?: User;
  tokens?: {
    access: string;
    refresh: string;
  };
  message?: string;
}

export interface IRegisterResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface IVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface IResendOtpRequest {
  email: string;
}

export interface IResetPasswordRequest {
  email: string;
}

export interface IResetPasswordConfirmRequest {
  email: string;
  otp: string;
  new_password: string;
}