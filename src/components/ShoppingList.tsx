import React, { useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "../styles/ShoppingList.module.css";
import * as ShoppingListApi from "../network/shoppingListApi";
import { toast } from "react-toastify";
import cart from "../assets/cart.svg";
import { ProductItem, useShoppingList } from "../context/ShoppingListContext";

interface ShoppingListProps {
  storeId: string | null;
  onDelete: (id: string) => void;
  cartOpen: boolean;
  toggleCart: () => void;
}

interface ShoppingListItemProps {
  className?: string;
  productItem: ProductItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onDelete: (id: string) => void;
}

const ShoppingList = ({
  storeId,
  onDelete,
  cartOpen,
  toggleCart,
}: ShoppingListProps) => {
  const {
    shoppingList: { productsItems, selectedItemIds, storeId: storeIdContext },
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
  } = useShoppingList();

  useEffect(() => {
    const getPreviousShoppingList = async () => {
      try {
        if (!storeId) throw Error("Loja não encontrada");
        const shoppingList = await ShoppingListApi.getShoppingList(storeId);

        if (shoppingList?.products) {
          setProductsItems(shoppingList.products);
          toggleCart();
        }
      } catch (error) {}
    };
    if (storeId) setStoreId(storeId);
    if (productsItems.length === 0 || storeId !== storeIdContext)
      getPreviousShoppingList();
  }, []);

  const handleItemSelect = (itemId: string) => {
    const prevSelectedItems = selectedItemIds;
    let selectedItems;
    if (prevSelectedItems.includes(itemId)) {
      selectedItems = prevSelectedItems.filter((id) => id !== itemId);
    } else {
      selectedItems = [...prevSelectedItems, itemId];
    }
    setSelectedItemIds(selectedItems);
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
    setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
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
    className,
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
      <div className={`${styles.shoppingItem} ${className}`}>
        <Form.Check
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
        />
        <div className={styles.itemInfo}>
          <p className={styles.itemText}>{productItem.product.name}</p>
          <p className={styles.itemPrice}>
            R${productItem.product.price?.toFixed(2)}
          </p>
        </div>
        <div className={styles.itemControls}>
          <button
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
      <img
        onClick={(e) => {
          e.stopPropagation();
          toggleCart();
        }}
        src={cart}
        alt="cart"
        className={styles.toggleButton}
      />
      <Container
        className={`${styles.cartSidebar} ${cartOpen ? styles.open : ""}`}
      >
        <h1 className={styles.cartText}> Carrinho </h1>
        {productsItems.map((item) => (
          <ShoppingItem
            className={styles.textoCarrinho}
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
          Preço total: R${calculateTotalPrice().toFixed(2)}
        </div>
        <Button className={styles.btnSalvar} onClick={onSave}>
          Salvar
        </Button>
      </Container>
    </>
  );
};

export default ShoppingList;
