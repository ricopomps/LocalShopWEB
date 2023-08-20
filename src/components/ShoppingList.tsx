import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "../styles/ShoppingList.module.css";
import { Product } from "../models/product";
import * as ShoppingListApi from "../network/shoppingListApi";
import { toast } from "react-toastify";
interface ShoppingListProps {
  storeId: string | null;
  productsItems: ProductItem[];
  setProductsItems: (productItem: ProductItem[]) => void;
  onDelete: (id: string) => void;
  cartOpen: boolean;
  toggleCart: () => void;
}

export interface ProductItem {
  product: Product;
  quantity: number;
}

interface ShoppingListItemProps {
  productItem: ProductItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onDelete: (id: string) => void;
}

const ShoppingList = ({
  storeId,
  productsItems,
  setProductsItems,
  onDelete,
  cartOpen,
  toggleCart,
}: ShoppingListProps) => {
  useEffect(() => {
    for (const item of productsItems) {
      if (!item.quantity) {
        handleItemCountIncrease(item.product._id);
      }
    }
  }, [cartOpen, productsItems]);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItemIds((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
  };

  const handleItemCountIncrease = (itemId: string) => {
    const productItem = productsItems.find(
      (item) => item.product._id === itemId
    );

    if (productItem) {
      productItem.quantity++;
      const updatedProductsItems = productsItems.map((item) =>
        item.product._id === itemId ? productItem : item
      );
      setProductsItems(updatedProductsItems);
    }
  };

  const handleItemCountDecrease = (itemId: string) => {
    const productItem = productsItems.find(
      (item) => item.product._id === itemId
    );

    if (productItem) {
      productItem.quantity--;

      if (productItem.quantity <= 0) {
        handleItemDelete(itemId);
      } else {
        const updatedProductsItems = productsItems.map((item) =>
          item.product._id === itemId ? productItem : item
        );
        setProductsItems(updatedProductsItems);
      }
    }
  };

  const handleItemDelete = (itemId: string) => {
    setSelectedItemIds((prevSelectedItems) =>
      prevSelectedItems.filter((id) => id !== itemId)
    );
    const updatedProductsItems = productsItems.filter(
      (item) => item.product._id !== itemId
    );
    setProductsItems(updatedProductsItems);
    onDelete(itemId);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    for (const productItem of productsItems) {
      total += (productItem.product.price || 10) * productItem.quantity;
    }
    return total;
  };

  const ShoppingItem = ({
    productItem,
    isSelected,
    onSelect,
    onIncrease,
    onDecrease,
    onDelete,
  }: ShoppingListItemProps) => {
    const handleCheckboxChange = () => {
      onSelect(productItem.product._id);
    };

    return (
      <div className={styles.shoppingItem}>
        <Form.Check
          type="checkbox"
          label=""
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <div className={styles.itemInfo}>
          <p className={styles.itemText}>{productItem.product.name}</p>
          <p className={styles.itemPrice}>R${productItem.product.price}</p>
        </div>
        <div className={styles.itemControls}>
          <button
            onClick={() => onIncrease(productItem.product._id)}
            className={styles.itemControlButton}
          >
            +
          </button>
          <span className={styles.itemCount}>{productItem.quantity}</span>
          <button
            onClick={() => onDecrease(productItem.product._id)}
            className={styles.itemControlButton}
          >
            -
          </button>
          <button
            onClick={() => onDelete(productItem.product._id)}
            className={styles.itemDeleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    );
  };

  const onSave = async () => {
    try {
      const productsMapped = productsItems.map((item) => {
        return {
          product: item.product._id,
          quantity: item.quantity,
        };
      });

      if (!storeId) throw Error("Loja inválida");
      const shoppingList = { storeId, products: productsMapped };
      await ShoppingListApi.createShoppingList(shoppingList);
      toast.success("Lista de compras salva com sucesso!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        className={styles.toggleButton}
        onClick={toggleCart}
      >
        Toggle Cart
      </Button>
      <Container
        className={`${styles.cartSidebar} ${cartOpen ? styles.open : ""}`}
      >
        {productsItems.map((item) => (
          <ShoppingItem
            key={item.product._id}
            productItem={item}
            isSelected={selectedItemIds.includes(item.product._id)}
            onSelect={handleItemSelect}
            onIncrease={handleItemCountIncrease}
            onDecrease={handleItemCountDecrease}
            onDelete={handleItemDelete}
          />
        ))}
        <div className={styles.totalPrice}>
          Total Price: R${calculateTotalPrice().toFixed(2)}
        </div>
        <Button onClick={onSave}>Salvar</Button>
      </Container>
    </>
  );
};

export default ShoppingList;
