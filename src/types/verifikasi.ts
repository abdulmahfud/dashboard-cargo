import { AxiosError } from "axios";

export interface VerificationResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export interface EmailResendResponse {
  success: boolean;
  message: string;
}

export interface UserStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    whatsapp: string;
    email_verified_at: string | null;
    roles: string[];
  };
}

export interface VerificationErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}

export type VerificationError = AxiosError<VerificationErrorData>;

export type VerificationState = {
  isLoading: boolean;
  isCheckingStatus: boolean;
  error: string | null;
};
