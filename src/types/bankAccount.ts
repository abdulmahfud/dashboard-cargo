export interface BankAccount {
  id: number;
  user_id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankAccountListResponse {
  success: boolean;
  data: BankAccount[];
}

export interface BankAccountCreateRequest {
  bank_name: string;
  account_name: string;
  account_number: string;
}

export interface BankAccountCreateResponse {
  success: boolean;
  message: string;
  data: BankAccount;
} 