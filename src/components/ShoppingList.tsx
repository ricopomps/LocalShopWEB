import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "../styles/ShoppingList.module.css";
import { Product } from "../models/product";
import * as ShoppingListApi from "../network/shoppingListApi";
import { toast } from "react-toastify";

interface ShoppingListProps {
  storeId: string | null;
  products: Product[];
  onDelete: (id: string) => void;
  cartOpen: boolean;
  toggleCart: () => void;
}

interface ShoppingListItemProps {
  product: Product;
  isSelected: boolean;
  itemCount: number;
  onSelect: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onDelete: (id: string) => void;
}

const ShoppingList = ({
  storeId,
  products,
  onDelete,
  cartOpen,
  toggleCart,
}: ShoppingListProps) => {
  useEffect(() => {
    for (const product of products) {
      if (!itemCounts[product._id]) {
        handleItemCountIncrease(product._id);
      }
    }
  }, [cartOpen, products]);

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [itemCounts, setItemCounts] = useState<{ [key: string]: number }>({});

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
    setItemCounts((prevCounts) => ({
      ...prevCounts,
      [itemId]: (prevCounts[itemId] || 0) + 1,
    }));
  };

  const handleItemCountDecrease = (itemId: string) => {
    setItemCounts((prevCounts) => {
      const newCount = Math.max((prevCounts[itemId] || 0) - 1, 0);
      if (newCount <= 0) {
        handleItemDelete(itemId);
        return prevCounts;
      }
      return {
        ...prevCounts,
        [itemId]: newCount,
      };
    });
  };

  const handleItemDelete = (itemId: string) => {
    setSelectedItemIds((prevSelectedItems) =>
      prevSelectedItems.filter((id) => id !== itemId)
    );
    setItemCounts((prevCounts) => {
      const newCounts = { ...prevCounts };
      delete newCounts[itemId];
      return newCounts;
    });
    onDelete(itemId);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    for (const itemId in itemCounts) {
      const item = products.find((product) => product._id === itemId);
      if (item) {
        total += item.price || 10 * (itemCounts[itemId] || 1);
      }
    }
    return total;
  };

  const ShoppingItem = ({
    product: { _id, name, price },
    isSelected,
    itemCount,
    onSelect,
    onIncrease,
    onDecrease,
    onDelete,
  }: ShoppingListItemProps) => {
    const handleCheckboxChange = () => {
      onSelect(_id);
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
          <p className={styles.itemText}>{name}</p>
          <p className={styles.itemPrice}>R${price}</p>
        </div>
        <div className={styles.itemControls}>
          <button
            onClick={() => onIncrease(_id)}
            className={styles.itemControlButton}
          >
            +
          </button>
          <span className={styles.itemCount}>{itemCount}</span>
          <button
            onClick={() => onDecrease(_id)}
            className={styles.itemControlButton}
          >
            -
          </button>
          <button
            onClick={() => onDelete(_id)}
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
      const productsMapped = products.map((product) => {
        return { product: product._id, quantity: itemCounts[product._id] };
      });
      console.log(productsMapped);
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
        {products.map((item) => (
          <ShoppingItem
            key={item._id}
            product={item}
            isSelected={selectedItemIds.includes(item._id)}
            itemCount={itemCounts[item._id] || 0}
            onSelect={handleItemSelect}
            onIncrease={handleItemCountIncrease}
            onDecrease={handleItemCountDecrease}
            onDelete={handleItemDelete}
          />
        ))}
        <div className={styles.totalPrice}>
          Total Price: ${calculateTotalPrice().toFixed(2)}
        </div>
        <Button onClick={onSave}>Salvar</Button>
      </Container>
    </>
  );
};

export default ShoppingList;
