import { getApi } from "./api";

export interface Notification {
  _id: string;
  userId: string;
  text: string;
  createdAt: Date;
}

const baseUrl = "/api/notifications";

export async function createNotification(): Promise<void> {
  const { data } = await getApi().post(baseUrl);
  return data;
}

export async function getNotification(): Promise<Notification[]> {
  const { data } = await getApi().get(`${baseUrl}`);
  return data;
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const { data } = await getApi().delete(`${baseUrl}/${notificationId}`);
  return data;
}
