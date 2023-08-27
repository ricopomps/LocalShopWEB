import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { Product as ProductModel } from "../models/product";
import { IoStorefrontOutline, IoStorefrontSharp } from "react-icons/io5";
import * as ProductsApi from "../network/products_api";
import * as ShoppingListApi from "../network/shoppingListApi";
import * as UsersApi from "../network/notes_api";
import * as StoreApi from "../network/storeApi";
import styles from "../styles/ProductsPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "../components/InfiniteScroll";
import ShoppingList, { ProductItem } from "../components/ShoppingList";
import Product from "../components/Product";
import { Store } from "../models/store";
import { User } from "../models/user";
import { set } from "react-hook-form";
import { toast } from "react-toastify";

interface ProductListPageProps {
  loggedUser: User;
  refreshFavStore: (storeId: string) => void;
}

const ProductListPage = ({
  loggedUser,
  refreshFavStore,
}: ProductListPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [storeName, setStoreName] = useState("");

  const [showProductsLoadingError, setshowProductsLoadingError] =
    useState(false);
  const [page, setPage] = useState(0);
  const queryParameters = new URLSearchParams(location.search);
  const storeId = queryParameters.get("store");
  async function loadProducts(initial?: boolean) {
    try {
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
  const [productsSelected, setProductsSelected] = useState<ProductItem[]>([]);
  useEffect(() => {
    const getPreviousShoppingList = async () => {
      try {
        if (!storeId) throw Error("Loja não encontrada");
        const shoppingList = await ShoppingListApi.getShoppingList(storeId);

        if (shoppingList?.products) {
          setProductsSelected(shoppingList.products);
          setCartOpen(true);
        }
      } catch (error) {}
    };
    getPreviousShoppingList();
    loadProducts(true);
    getStoreName();
  }, []);

  const addProductToShoppingCart = (product: ProductModel) => {
    const existingProduct = productsSelected.find(
      (item) => item.product._id === product._id
    );

    if (!existingProduct) {
      setProductsSelected([...productsSelected, { product, quantity: 1 }]);
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
      productsSelected.filter((item) => item.product._id !== id)
    );
  };

  const goToStoreMap = () => {
    navigate(`/map?store=${storeId}`);
  };

  const goToProductPageMap = (productId: string) => {
    navigate(`/product?store=${storeId}&product=${productId}`);
  };

  const addStoreFavorite = async () => {
    try {
      if (!storeId) throw Error("Loja não encontrada");
      await UsersApi.favoriteStore(storeId);
      refreshFavStore(storeId);
      toast.success("Loja favoritada com sucesso!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const removeStoreFavorite = async () => {
    try {
      if (!storeId) throw Error("Loja não encontrada");
      // await UsersApi.favoriteStore(storeId); removeFavoriteStore
      refreshFavStore(storeId);
      toast.success("Loja removida com sucesso dos favoritos!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  const productsGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.productsGrid}`}>
      {products.map((product) => (
        <Col key={product._id}>
          <Product
            addProduct={addProductToShoppingCart}
            product={product}
            onProductClicked={() => goToProductPageMap(product._id)}
            className={styles.product}
          ></Product>
        </Col>
      ))}
    </Row>
  );

  const getStoreName = async () => {
    if (storeId) {
      const store = await StoreApi.getStore(storeId);
      setStoreName(store.name);
    }
  };
  console.log(loggedUser, loggedUser.favoriteStores?.includes(storeId!));
  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.storeTitle}>{storeName}</h1>
        <Button className={styles.btnMapa} onClick={goToStoreMap}>
          Ir para o mapa
        </Button>
        {storeId && loggedUser.favoriteStores?.includes(storeId) ? (
          <IoStorefrontSharp
            className={styles.favIcon}
            onClick={removeStoreFavorite}
          />
        ) : (
          <IoStorefrontOutline
            className={styles.favIcon}
            onClick={addStoreFavorite}
          />
        )}
        {/* <img
          // onClick={addStoreFavorite}
          // src={favstore}
          // alt="favstore"
          className={styles.favButton}
        /> */}
      </div>
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
        productsItems={productsSelected}
        setProductsItems={setProductsSelected}
        onDelete={removeProductFromShoppingCart}
        cartOpen={cartOpen}
        toggleCart={toggleCart}
      />
    </>
  );
};

export default ProductListPage;
