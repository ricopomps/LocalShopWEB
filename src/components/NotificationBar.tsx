import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "../styles/NotificationBar.module.css";
import { toast } from "react-toastify";
import cart from "../assets/cart.svg";
import { useNavigate } from "react-router-dom";
import * as NotificationApi from "../network/notificationApi";
import { Product } from "../models/product";
import { formatDate } from "../utils/formatDate";

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
  //   const {
  //     NotificationBar: { productsItems, selectedItemIds, storeId: storeIdContext },
  //     setSelectedItemIds,
  //     clearNotificationBar,
  //     setProductsItems,
  //     setStoreId,
  //     handleItemCountIncrease,
  //     handleItemCountDecrease,
  //   } = useNotificationBar();
  //   useEffect(() => {
  //     const getPreviousNotificationBar = async () => {
  //       try {
  //         if (!storeId) throw Error("Loja não encontrada");
  //         const NotificationBar = await NotificationBarApi.getNotificationBar(storeId);

  //         if (NotificationBar?.products) {
  //           setProductsItems(NotificationBar.products);
  //         } else if (storeIdContext && storeId !== storeIdContext) {
  //           clearNotificationBar();
  //         }
  //         toggleCart();
  //       } catch (error) {}
  //     };
  //     if (storeId) setStoreId(storeId);
  //     if (productsItems.length === 0 || storeId !== storeIdContext)
  //       getPreviousNotificationBar();
  //   }, []);

  //   const handleItemSelect = (itemId: string) => {
  //     const prevSelectedItems = selectedItemIds;
  //     let selectedItems;
  //     if (prevSelectedItems.includes(itemId)) {
  //       selectedItems = prevSelectedItems.filter((id) => id !== itemId);
  //     } else {
  //       selectedItems = [...prevSelectedItems, itemId];
  //     }
  //     setSelectedItemIds(selectedItems);
  //   };

  //   const handleItemDelete = (itemId: string) => {
  //     setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
  //     const updatedProductsItems = productsItems.filter(
  //       (item) => item.product._id !== itemId
  //     );
  //     setProductsItems(updatedProductsItems);
  //     onDelete(itemId);
  //   };

  //   const calculateTotalPrice = () => {
  //     let total = 0;
  //     for (const productItem of productsItems) {
  //       total += (productItem.product.price || 10) * productItem.quantity;
  //     }
  //     return total;
  //   };

  //   const goToStoreMap = (product: Product) => {
  //     navigate(
  //       `/map?store=${storeId}&x=${product.location?.x}&y=${product.location?.y}`
  //     );
  //   };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await NotificationApi.getNotification();
        setNotifications(response);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };
    fetchNotifications();
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
  const NotificationBarItem = ({
    className,
    notification,
  }: NotificationBarItemProps) => {
    // const handleCheckboxChange = () => {
    //   onSelect(productItem.product._id);
    // };

    return (
      <div className={`${styles.shoppingItem} ${className}`}>
        {/* <Form.Check
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        /> */}
        <div
          className={styles.itemInfo}
          //   onClick={() => goToStoreMap(productItem.product)}
        >
          <p className={styles.itemText}>{notification.text}</p>
          <p className={styles.itemPrice}>
            {formatDate(notification.createdAt.toString())}
          </p>
        </div>
        <div className={styles.itemControls}>
          {/* <button
            onClick={() => onDecrease(productItem.product._id)}
            className={styles.itemControlButton}
          >
            -
          </button>
          <span className={styles.itemCount}>{productItem.quantity}</span>
          <button
            onClick={() => onIncrease(productItem.product._id)}
            className={styles.itemControlButton}
          >
            +
          </button> */}
          <button
            onClick={() => onDelete(notification._id)}
            className={styles.itemDeleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  //   const onSave = async () => {
  //     try {
  //       const productsMapped = productsItems.map((item) => {
  //         return {
  //           product: item.product._id,
  //           quantity: item.quantity,
  //         };
  //       });

  //       if (!storeId) throw Error("Loja inválida");
  //       const NotificationBar = { storeId, products: productsMapped };
  //       await NotificationBarApi.createNotificationBar(NotificationBar);
  //       toast.success("Lista de compras salva com sucesso!");
  //     } catch (error: any) {
  //       toast.error(error?.response?.data?.error ?? error?.message);
  //     }
  //   };
  return (
    <>
      {/* <img
        onClick={(e) => {
          e.stopPropagation();
          toggleCart();
        }}
        src={cart}
        alt="cart"
        className={styles.toggleButton}
      /> */}

      <Container className={`${styles.cartSidebar} ${open ? styles.open : ""}`}>
        <h1 className={styles.cartText}> Notificações</h1>
        {notifications.map((notification) => (
          <NotificationBarItem
            className={styles.textoCarrinho}
            notification={notification}
            // key={item.product._id}
            // productItem={item}
            // isSelected={selectedItemIds.includes(item.product._id)}
            // onSelect={handleItemSelect}
            // onIncrease={handleItemCountIncrease}
            // onDecrease={handleItemCountDecrease}
            // onDelete={handleItemDelete}
          />
        ))}
        {/* <div className={styles.totalPrice}>
          Preço total: R${calculateTotalPrice().toFixed(2)}
        </div> */}
        {/* <Button className={styles.btnSalvar} onClick={onSave}>
          Salvar
        </Button> */}
      </Container>
    </>
  );
};

export default NotificationBar;
