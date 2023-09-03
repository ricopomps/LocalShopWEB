import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import styles from "../styles/NotificationBar.module.css";
import { toast } from "react-toastify";
import * as NotificationApi from "../network/notificationApi";
import { formatDate } from "../utils/formatDate";
import { AiFillEyeInvisible } from "react-icons/ai";
import { MdOutlineRemoveCircle } from "react-icons/md";
import InfiniteScroll from "./InfiniteScroll";
interface NotificationBarProps {
  open: boolean;
}

interface NotificationBarItemProps {
  className?: string;
  notification: NotificationApi.Notification;
}

const NotificationBar = ({ open }: NotificationBarProps) => {
  const [notifications, setNotifications] = useState<
    NotificationApi.Notification[]
  >([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchNotifications = async (initial?: boolean) => {
    try {
      setNotificationsLoading(true);
      const response = await NotificationApi.getNotification(
        initial ? 0 : page
      );
      if (initial) {
        setNotifications(response);
        setPage(1);
      } else {
        setNotifications((prevItems) => [...prevItems, ...response]);
        setPage(page + 1);
      }
      setNotificationsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
      setNotificationsLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications(true);
  }, [open]);

  const onDelete = async (notificationId: string) => {
    try {
      await NotificationApi.deleteNotification(notificationId);
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
      toast.success("Notificação removida com sucesso");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const readNotification = async (
    notification: NotificationApi.Notification
  ) => {
    if (notification.read) return;
    try {
      await NotificationApi.readNotification(notification._id);
      setNotifications(
        notifications.map((n) => {
          return n._id === notification._id ? { ...n, read: true } : n;
        })
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const NotificationBarItem = ({
    className,
    notification,
  }: NotificationBarItemProps) => {
    return (
      <div
        key={notification._id}
        className={`${styles.shoppingItem} ${className} ${
          !notification.read && styles.unread
        }`}
        onClick={() => readNotification(notification)}
      >
        <div className={styles.itemInfo}>
          <p className={styles.itemText}>{notification.text}</p>
          <p className={styles.itemPrice}>
            {formatDate(notification.createdAt.toString())}
          </p>
        </div>
        <div className={styles.itemControls}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification._id);
            }}
            className={styles.itemDeleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const readAllNotifications = async () => {
    try {
      await NotificationApi.readAllNotifications();
      setNotifications(
        notifications.map((notification) => {
          return { ...notification, read: true };
        })
      );
      toast.success("Todas as notificações foram visualizadas");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await NotificationApi.removeAllNotifications();
      setNotifications([]);
      toast.success("Todas as notificações foram removidas");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <>
      <Container
        ref={containerRef}
        className={`${styles.notificationSidebar} ${open ? styles.open : ""}`}
      >
        <h1 className={styles.cartText}> Notificações</h1>
        <div className={styles.iconContainer}>
          <AiFillEyeInvisible
            className={styles.eyeIcon}
            onClick={readAllNotifications}
          />
          <MdOutlineRemoveCircle
            className={styles.removeIcon}
            onClick={deleteAllNotifications}
          />
        </div>
        {notifications.map((notification, index) => (
          <NotificationBarItem
            className={styles.textoCarrinho}
            notification={notification}
          />
        ))}
        <InfiniteScroll
          onLoadMore={fetchNotifications}
          containerRef={containerRef}
          isLoading={notificationsLoading}
        />
      </Container>
    </>
  );
};

export default NotificationBar;
