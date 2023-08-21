import { Card } from "react-bootstrap";
import styles from "../styles/Product.module.css";
import { Product as ProductModel } from "../models/product";
import { MdDelete } from "react-icons/md";
import add from "../assets/add.svg";

interface ProductProps {
  product: ProductModel;
  addProduct?: (product: ProductModel) => void;
  onProductClicked: (product: ProductModel) => void;
  onDeleteProductClicked?: (product: ProductModel) => void;
  className?: string;
}

const Product = ({
  product,
  addProduct,
  onProductClicked,
  onDeleteProductClicked,
  className,
}: ProductProps) => {
  const { name, category } = product;
  const price = product.price ?? 0;

  return (
    <Card
      onClick={() => onProductClicked(product)}
      className={`${styles.productCard} ${className}`}
      style={{ width: "350px", height: "400px" }}
    >
      {product.image && (
        <Card.Img
          variant="top"
          src={product.image}
          alt=""
          className={styles.productImage}
        />
      )}
      <div className={styles.cardBody}>
        <div className={styles.productDetails}>
          <p className={styles.productName}>{name}</p>
          {onDeleteProductClicked && (
            <MdDelete
              className="text-muted ms-auto"
              onClick={(e) => {
                onDeleteProductClicked(product);
                e.stopPropagation();
              }}
            />
          )}
          <p className={styles.productPrice}>R$ {price.toFixed(2)}</p>
          <p className={styles.productCategory}>{category}</p>
          {addProduct && (
            <img
              onClick={(e) => {
                e.stopPropagation();
                addProduct(product);
              }}
              src={add}
              alt="Add"
              className={styles.addImage}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

export default Product;
