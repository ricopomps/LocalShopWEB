import { useEffect, useState } from "react";
import { Button, Col, Row, Spinner, Form } from "react-bootstrap";
import { Product as ProductModel } from "../models/product";
import * as ProductsApi from "../network/products_api";
import * as ShoppingListApi from "../network/shoppingListApi";
import styles from "../styles/ProductsPage.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import InfiniteScroll from "../components/InfiniteScroll";
import ShoppingList, { ProductItem } from "../components/ShoppingList";
import Product from "../components/Product";
import TextInputField from "../components/form/TextInputField";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ListProducts } from "../network/products_api";
import magnifying_glass from "../assets/magnifying_glass.svg";
import filter from "../assets/filter.svg";

interface ProductListPageProps {}

const ProductListPage = ({}: ProductListPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
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
  const [filterOpen, setFilterOpen] = useState(false);
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

  const toggleFilter = () => {
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

  const [categories, setCategories] = useState<string[]>([""]);

  async function loadCategories() {
    const a: string[] = (await ProductsApi.getCategories()).categories;
    setCategories(a);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ListProducts>({});

  async function onSubmit(input: ListProducts) {
    try {
      let listResponse;
      if (!storeId) throw Error("Loja não encontrada");
      listResponse = await ProductsApi.listProducts(storeId, input);
      setProducts(listResponse);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }

  return (
    <>
      <Button onClick={goToStoreMap}>Ir para o mapa</Button>

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
            <img
              onClick={toggleFilter}
              src={filter}
              alt="filter"
              className={styles.bntFilter}
            />
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
                label=""
                type="text"
                as="select"
                options={categories.map((c) => {
                  return { value: c, key: c };
                })}
                hasDefaultValue={true}
                placeholder="Categoria"
                register={register}
                className={styles.selectFilter}
              />
              <TextInputField
                name="priceFrom"
                label=""
                type="number"
                placeholder="Valor Mínimo"
                register={register}
                className={styles.inputNumberFilter}
              ></TextInputField>
              <TextInputField
                name="priceTo"
                label=""
                type="number"
                placeholder="Valor Máximo"
                register={register}
                className={styles.inputNumberFilter}
              ></TextInputField>
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
