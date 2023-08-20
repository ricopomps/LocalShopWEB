import { getApi } from "./api";

export interface SendRecoverPasswordEmailForm {
  email: string;
}

const baseUrl = "/api/auth";

export async function sendRecoverPasswordEmail(
  credentials: SendRecoverPasswordEmailForm
): Promise<void> {
  const { data } = await getApi().post(`${baseUrl}/recover`, credentials);
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
  const { data } = await getApi().post(`${baseUrl}/change`, credentials);
  return data;
}
