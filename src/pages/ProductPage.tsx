import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductApi from "../network/products_api";
import { toast } from "react-toastify";
import { Product as ProductModel } from "../models/product";
import Product from "../components/Product";
import { Button, Card } from "react-bootstrap";
import ShoppingList from "../components/ShoppingList";
import { useShoppingList } from "../context/ShoppingListContext";
import styles from "../styles/ProductPage.module.css";

const ProductPage = () => {
  const {
    shoppingList: { productsItems },
    handleItemCountIncrease,
    handleItemCountDecrease,
    addProduct,
  } = useShoppingList();
  const location = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(
    null
  );
  const queryParameters = new URLSearchParams(location.search);
  const store = queryParameters.get("store");
  const product = queryParameters.get("product");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!product) throw Error("Produto inválido");
        const selectedProductResponse = await ProductApi.getProduct(product);
        setSelectedProduct(selectedProductResponse);
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };
    fetchData();
  }, []);

  const goToStoreMap = () => {
    if (selectedProduct)
      navigate(
        `/map?store=${store}&x=${selectedProduct.location?.x}&y=${selectedProduct.location?.y}`
      );
  };

  const goBackToStore = () => {
    navigate("/store/product?store=" + store);
  };

  if (!selectedProduct) return <></>;

  return (
    <div>
      <div>
        <Button onClick={goBackToStore}>Voltar para loja</Button>
      </div>
      <div className={styles.main}>
        <Button className={styles.btnProduct} onClick={goToStoreMap}>
          Ver localização
        </Button>
        <Product product={selectedProduct} onProductClicked={() => {}} />
        <h3 className={styles.descricao}>Descrição</h3>
        <Card className={styles.card}>{selectedProduct.description}</Card>
        <div className={styles.menosmais}>
          <Button onClick={() => handleItemCountDecrease(selectedProduct._id)}>
            -
          </Button>
          <Button
            onClick={() => {
              if (
                productsItems.find(
                  (item) => item.product._id === selectedProduct._id
                )
              )
                handleItemCountIncrease(selectedProduct._id);
              else addProduct(selectedProduct);
            }}
          >
            +
          </Button>
        </div>
        <ShoppingList
          cartOpen={true}
          storeId={store}
          toggleCart={() => {}}
          onDelete={() => {}}
        />
      </div>
    </div>
  );
};

export default ProductPage;
