import { AxiosError } from "axios";

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  whatsapp: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: number;
      name: string;
      email: string;
      whatsapp: string;
      email_verified_at: string | null;
      created_at: string;
    };
  };
}

export interface RegisterErrorData {
  message?: string;
  errors?: Record<string, string[]>;
}

export type RegisterError = AxiosError<RegisterErrorData>;

export interface FormErrors {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  whatsapp: string;
} 