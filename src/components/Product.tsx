import { Card } from "react-bootstrap";
import styles from "../styles/Product.module.css";
import stylesUtils from "../styles/utils.module.css";
import { Product as ProductModel } from "../models/product";
import { formatDate } from "../utils/formatDate";
import { MdDelete } from "react-icons/md";

interface ProductProps {
  product: ProductModel;
  onProductClicked: (product: ProductModel) => void;
  onDeleteProductClicked: (product: ProductModel) => void;
  className?: string;
}

const Product = ({
  product,
  onProductClicked,
  onDeleteProductClicked,
  className,
}: ProductProps) => {
  const { name, description, createdAt, updatedAt } = product;

  let createdUpdatedText: string;
  if (updatedAt > createdAt) {
    createdUpdatedText = "Atualizado: " + formatDate(updatedAt);
  } else {
    createdUpdatedText = "Criado: " + formatDate(createdAt);
  }

  return (
    <Card
      onClick={() => onProductClicked(product)}
      className={`${styles.productCard} ${className}`}
    >
      {product.image && (
        <Card.Img
          variant="top"
          src={product.image}
          alt=""
          className={styles.productImage}
        />
      )}
      <Card.Body className={styles.cardBody}>
        <Card.Title className={stylesUtils.flexCenter}>
          {name}
          <MdDelete
            className="text-muted ms-auto"
            onClick={(e) => {
              onDeleteProductClicked(product);
              e.stopPropagation();
            }}
          />
        </Card.Title>
        <Card.Text className={styles.productText}>{description}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">{createdUpdatedText}</Card.Footer>
    </Card>
  );
};

export default Product;
