import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { Product as ProductModel } from "../models/product";
import { IoStorefrontOutline, IoStorefrontSharp } from "react-icons/io5";
import * as ProductsApi from "../network/products_api";
import * as UsersApi from "../network/notes_api";
import * as StoreApi from "../network/storeApi";
import styles from "../styles/ProductsPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "../components/InfiniteScroll";
import ShoppingList from "../components/ShoppingList";
import Product from "../components/Product";
import { User } from "../models/user";
import { toast } from "react-toastify";
import { ProductItem, useShoppingList } from "../context/ShoppingListContext";
import TextInputField from "../components/form/TextInputField";
import { useForm } from "react-hook-form";
import { ListProducts } from "../network/products_api";
import magnifying_glass from "../assets/magnifying_glass.svg";
import filter from "../assets/filter.svg";
import filterCheio from "../assets/filtrocheio.svg";
import CheckInputField from "../components/form/CheckInputField";

interface ProductListPageProps {
  loggedUser: User;
  refreshFavStore: (storeId: string) => void;
  addProductFavorite: (productId: string) => void;
  removeProductFavorite: (productId: string) => void;
}

const ProductListPage = ({
  loggedUser,
  refreshFavStore,
  addProductFavorite,
  removeProductFavorite,
}: ProductListPageProps) => {
  const { addProduct } = useShoppingList();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [productsSelected, setProductsSelected] = useState<ProductItem[]>([]);
  const [showProductsLoadingError, setshowProductsLoadingError] =
    useState(false);
  const [page, setPage] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);

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

  useEffect(() => {
    loadProducts(true);
    getStoreName();
    if (!cartOpen) toggleCart();
  }, []);

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  const toggleFilter = () => {
    setValue("category", undefined);
    setValue("priceFrom", undefined);
    setValue("priceTo", undefined);
    setValue("favorite", undefined);
    setFilterOpen(!filterOpen);
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
      await UsersApi.unfavoriteStore(storeId);
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
            addProduct={() => {
              if ((product.stock && product.stock <= 0) || !product.stock) {
                toast.error("Produto sem estoque");
                return;
              }
              addProduct(product);
            }}
            product={product}
            onProductClicked={() => goToProductPageMap(product._id)}
            className={styles.product}
            loggedUser={loggedUser}
            addProductFavorite={addProductFavorite}
            removeProductFavorite={removeProductFavorite}
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

  const [categories, setCategories] = useState<string[]>([""]);

  const loadCategories = async () => {
    const a: string[] = (await ProductsApi.getCategories()).categories;
    setCategories(a);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<ListProducts>({});

  const onSubmit = async (input: ListProducts) => {
    try {
      let listResponse;
      if (!storeId) throw Error("Loja não encontrada");
      listResponse = await ProductsApi.listProducts(storeId, input);
      setProducts(listResponse);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

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
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.filterAlign}>
          <TextInputField
            name="productName"
            label=""
            type="text"
            placeholder="Pesquisar Produto"
            register={register}
            className={styles.inputFilter}
          ></TextInputField>
          <div className={styles.bntAlign}>
            {filterOpen ? (
              <img
                onClick={toggleFilter}
                src={filterCheio}
                alt="filter"
                className={styles.bntFilter}
              />
            ) : (
              <img
                onClick={toggleFilter}
                src={filter}
                alt="filter"
                className={styles.bntFilter}
              />
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={styles.bntFilterGlass}
            >
              <img src={magnifying_glass} alt="lupa" />
            </Button>
          </div>
        </div>
        <div className={styles.filterAlign}>
          {filterOpen && (
            <>
              <TextInputField
                name="category"
                type="text"
                as="select"
                options={categories.map((c) => {
                  return { value: c, key: c };
                })}
                hasDefaultValue={true}
                placeholder="Categoria"
                nullable={true}
                register={register}
                className={styles.selectFilter}
              />
              <TextInputField
                name="priceFrom"
                type="number"
                placeholder="Valor Mínimo"
                register={register}
                className={styles.inputNumberFilter}
              ></TextInputField>
              <TextInputField
                name="priceTo"
                type="number"
                placeholder="Valor Máximo"
                register={register}
                className={styles.inputNumberFilter}
              ></TextInputField>
              <CheckInputField
                className={styles.checkFilter}
                classNameLabel={styles.labelInput}
                name="favorite"
                label="Favoritos"
                type="checkbox"
                register={register}
              />
            </>
          )}
        </div>
      </Form>
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
        onDelete={removeProductFromShoppingCart}
      />
    </>
  );
};

export default ProductListPage;
