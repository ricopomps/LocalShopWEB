import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Product as ProductModel } from "../models/product";
import * as ProductsApi from "../network/products_api";
import styles from "../styles/ProductsPage.module.css";
import stylesUtils from "../styles/utils.module.css";
import AddProductDialog from "./AddEditProductDialog";
import Product from "./Product";

const ProductsPageLoggedInView = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductModel | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductsLoadingError, setshowProductsLoadingError] =
    useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setshowProductsLoadingError(false);
        setProductsLoading(true);
        const products = await ProductsApi.fetchProducts();
        setProducts(products);
      } catch (error) {
        console.error(error);
        setshowProductsLoadingError(true);
      } finally {
        setProductsLoading(false);
      }
    }
    loadProducts();
  }, []);
  async function deleteProduct(product: ProductModel) {
    try {
      await ProductsApi.deleteProduct(product._id);
      setProducts(
        products.filter(
          (existingProduct) => existingProduct._id !== product._id
        )
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const productsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.productsGrid}`}>
      {products.map((product) => (
        <Col key={product._id}>
          <Product
            product={product}
            onProductClicked={setProductToEdit}
            onDeleteProductClicked={deleteProduct}
            className={styles.product}
          ></Product>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      <Button
        className={`mb-4 ${stylesUtils.blockCenter} ${stylesUtils.flexCenter}`}
        onClick={() => setShowAddProductDialog(true)}
      >
        <FaPlus />
        Adicionar novo produto
      </Button>

      {productsLoading && <Spinner animation="border" variant="primary" />}
      {showProductsLoadingError && (
        <p>Erro inesperado. Favor recarregar a página</p>
      )}

      {!productsLoading && !showProductsLoadingError && (
        <>{products.length > 0 ? productsGrid : <p>Não existem notas</p>}</>
      )}

      {showAddProductDialog && (
        <AddProductDialog
          onDismiss={() => setShowAddProductDialog(false)}
          onProductSaved={(newProduct) => {
            setProducts([...products, newProduct]);
            setShowAddProductDialog(false);
          }}
        />
      )}
      {productToEdit && (
        <AddProductDialog
          onDismiss={() => setProductToEdit(null)}
          productToEdit={productToEdit}
          onProductSaved={(updatedProduct) => {
            setProducts(
              products.map((existingProduct) =>
                existingProduct._id === updatedProduct._id
                  ? updatedProduct
                  : existingProduct
              )
            );
            setProductToEdit(null);
          }}
        />
      )}
    </>
  );
};

export default ProductsPageLoggedInView;
