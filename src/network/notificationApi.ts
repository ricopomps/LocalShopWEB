import { getApi } from "./api";

export interface Notification {
  _id: string;
  userId: string;
  text: string;
  read: boolean;
  createdAt: Date;
}

const baseUrl = "/api/notifications";

export async function createNotification(): Promise<void> {
  const { data } = await getApi().post(baseUrl);
  return data;
}

export async function getNotification(
  page: number,
  take: number = 15
): Promise<Notification[]> {
  const { data } = await getApi().get(`${baseUrl}`, {
    params: {
      page,
      take,
    },
  });
  return data;
}

export async function deleteNotification(
  notificationId: string
): Promise<void> {
  const { data } = await getApi().delete(`${baseUrl}/${notificationId}`);
  return data;
}

export async function readNotification(notificationId: string): Promise<void> {
  await getApi().patch(`${baseUrl}/read/${notificationId}`);
}

export async function readAllNotifications(): Promise<void> {
  await getApi().patch(baseUrl);
}

export async function removeAllNotifications(): Promise<void> {
  await getApi().delete(baseUrl);
}
