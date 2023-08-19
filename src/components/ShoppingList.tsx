import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import styles from "../styles/ShoppingList.module.css";
import { Product } from "../models/product";

interface ShoppingListProps {
  products: Product[];
}

interface ShoppingListItemProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ShoppingList = ({ products }: ShoppingListProps) => {
  const [cartOpen, setCartOpen] = useState(false);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const ShoppingItem = ({
    product: { _id, name, price },
    isSelected,
    onSelect,
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
          <p className={styles.itemPrice}>${price}</p>
        </div>
      </div>
    );
  };
  const handleItemSelect = (itemId: string) => {
    setSelectedItemIds((prevSelectedItems) => {
      if (prevSelectedItems.includes(itemId)) {
        return prevSelectedItems.filter((id) => id !== itemId);
      } else {
        return [...prevSelectedItems, itemId];
      }
    });
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
            onSelect={handleItemSelect}
          />
        ))}
      </Container>
    </>
  );
};

export default ShoppingList;
