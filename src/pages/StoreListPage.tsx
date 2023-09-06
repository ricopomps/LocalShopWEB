import { useEffect, useState } from "react";
import { Col, Spinner, Form, Button } from "react-bootstrap";
import { Store as StoreModel } from "../models/store";
import * as StoresApi from "../network/storeApi";
import styles from "../styles/StoresPage.module.css";
import AddEditProductDialog from "../components/AddEditProductDialog";
import HorizontalScroll from "../components/HorizontalScroll";
import { useLocation, useNavigate } from "react-router-dom";
import Store from "../components/Store";
import TextInputField from "../components/form/TextInputField";
import magnifying_glass from "../assets/magnifying_glass.svg";
import { useForm } from "react-hook-form";
import { ListStores } from "../network/storeApi";
import { toast } from "react-toastify";
import CheckInputField from "../components/form/CheckInputField";

interface StoreListPageProps {}

const StoreListPage = ({}: StoreListPageProps) => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [storeToEdit, setStoreToEdit] = useState<StoreModel | null>(null);
  const [storesLoading, setStoresLoading] = useState(true);
  const [showStoresLoadingError, setshowStoresLoadingError] = useState(false);
  const location = useLocation();
  useEffect(() => {
    async function loadStores() {
      try {
        setshowStoresLoadingError(false);
        setStoresLoading(true);
        const stores = await StoresApi.fetchStores();
        setStores(stores);
      } catch (error) {
        console.error(error);
        setshowStoresLoadingError(true);
      } finally {
        setStoresLoading(false);
      }
    }
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");

    if (accessToken) {
      // Call the function to fetch user information
      fetchUserData(accessToken);
    }
    loadStores();
  }, []);

  const fetchUserData = async (accessToken: any) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
      );
      const userData = await response.json();
      console.log(userData);

      // Now you have the user information (userData), you can use or store it as needed
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const goToStore = (store: StoreModel) => {
    navigate("/store/product?store=" + store._id);
  };

  const storesGrid = (
    <HorizontalScroll>
      {stores.map((store) => (
        <Col key={store._id}>
          <Store
            store={store}
            onStoreClicked={goToStore}
            className={styles.store}
          ></Store>
        </Col>
      ))}
    </HorizontalScroll>
  );

  const [categories, setCategories] = useState<string[]>([""]);

  async function loadCategories() {
    const a: string[] = (await StoresApi.getCategories()).categories;
    setCategories(a);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ListStores>({});

  const onSubmit = async (input: ListStores) => {
    try {
      let listResponse;
      listResponse = await StoresApi.listStores(input);
      setStores(listResponse);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} className={styles.filterAlign}>
        <TextInputField
          name="name"
          type="text"
          placeholder="Pesquisar Loja"
          register={register}
          className={styles.inputFilter}
        ></TextInputField>
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
        <CheckInputField
          name="favorite"
          label="Favoritos"
          type="checkbox"
          register={register}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className={styles.bntFilterGlass}
        >
          <img src={magnifying_glass} alt="lupa" />
        </Button>
      </Form>
      {storesLoading && <Spinner animation="border" variant="primary" />}
      {showStoresLoadingError && (
        <p>Erro inesperado. Favor recarregar a página</p>
      )}
      {!storesLoading && !showStoresLoadingError && (
        <>
          {stores.length > 0 ? (
            storesGrid
          ) : (
            <p>Não existem lojas cadastradas</p>
          )}
        </>
      )}

      {storeToEdit && (
        <AddEditProductDialog
          storeId=""
          categoryList={[""]}
          onDismiss={() => setStoreToEdit(null)}
          productToEdit={storeToEdit}
          onProductSaved={() => {}}
        />
      )}
    </>
  );
};

export default StoreListPage;
