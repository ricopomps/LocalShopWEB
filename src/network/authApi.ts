import { getApi } from "./api";

export interface SendRecoverPasswordEmailForm {
  email: string;
}

export async function sendRecoverPasswordEmail(
  credentials: SendRecoverPasswordEmailForm
): Promise<void> {
  const { data } = await getApi().post("/api/auth/recover", credentials);
  return data;
}

export interface RecoverPasswordForm {
  token?: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export async function changePassword(
  credentials: RecoverPasswordForm
): Promise<void> {
  const { data } = await getApi().post("/api/auth/change", credentials);
  return data;
}
