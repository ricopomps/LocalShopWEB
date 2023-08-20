import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { Product as ProductModel } from "../models/product";
import * as ProductsApi from "../network/products_api";
import * as ShoppingListApi from "../network/shoppingListApi";
import styles from "../styles/ProductsPage.module.css";
import { useLocation } from "react-router-dom";
import InfiniteScroll from "../components/InfiniteScroll";
import ShoppingList from "../components/ShoppingList";
import Product from "../components/Product";
import { toast } from "react-toastify";

interface ProductListPageProps {}

const ProductListPage = ({}: ProductListPageProps) => {
  const location = useLocation();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [showProductsLoadingError, setshowProductsLoadingError] =
    useState(false);
  const [page, setPage] = useState(0);
  const queryParameters = new URLSearchParams(location.search);
  const storeId = queryParameters.get("store");
  async function loadProducts(initial?: boolean) {
    try {
      console.log("loadProducts", storeId);
      if (!storeId) throw Error("Loja não encontrada");
      setshowProductsLoadingError(false);
      setProductsLoading(true);
      const products = await ProductsApi.fetchProducts(storeId, page);
      if (initial) setProducts(products);
      else setProducts((prevItems) => [...prevItems, ...products]);
      setPage(page + 1);
    } catch (error) {
      console.error(error);
      setshowProductsLoadingError(true);
    } finally {
      setProductsLoading(false);
    }
  }
  const [cartOpen, setCartOpen] = useState(false);
  const [productsSelected, setProductsSelected] = useState<ProductModel[]>([]);
  useEffect(() => {
    const getPreviousShoppingList = async () => {
      try {
        if (!storeId) throw Error("Loja não encontrada");
        const shoppingList = await ShoppingListApi.getShoppingList(storeId);
      } catch (error) {}
    };
    getPreviousShoppingList();
    loadProducts(true);
  }, []);

  const addProductToShoppingCart = (product: ProductModel) => {
    if (!productsSelected.includes(product)) {
      setProductsSelected([...productsSelected, product]);
      setCartOpen(true);
    } else {
      removeProductFromShoppingCart(product._id);
    }
  };
  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const removeProductFromShoppingCart = (id: string) => {
    setProductsSelected(
      productsSelected.filter((product) => product._id !== id)
    );
  };

  const productsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.productsGrid}`}>
      {products.map((product) => (
        <Col key={product._id}>
          <Product
            product={product}
            onProductClicked={addProductToShoppingCart}
            className={styles.product}
          ></Product>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {!showProductsLoadingError && (
        <>
          {products.length > 0 ? (
            productsGrid
          ) : (
            <p>Não existem produtos cadastrados</p>
          )}
        </>
      )}

      {productsLoading && <Spinner animation="border" variant="primary" />}
      {showProductsLoadingError && (
        <p>Erro inesperado. Favor recarregar a página</p>
      )}
      <InfiniteScroll onLoadMore={loadProducts} isLoading={productsLoading} />
      <ShoppingList
        storeId={storeId}
        products={productsSelected}
        onDelete={removeProductFromShoppingCart}
        cartOpen={cartOpen}
        toggleCart={toggleCart}
      />
    </>
  );
};

export default ProductListPage;
