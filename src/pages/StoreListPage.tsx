import { useEffect, useState } from "react";
import { Col, Spinner } from "react-bootstrap";
import { Store as StoreModel } from "../models/store";
import * as StoresApi from "../network/storeApi";
import styles from "../styles/StoresPage.module.css";
import AddEditProductDialog from "../components/AddEditProductDialog";
import HorizontalScroll from "../components/HorizontalScroll";
import { useNavigate } from "react-router-dom";
import Store from "../components/Store";

interface StoreListPageProps {}

const StoreListPage = ({}: StoreListPageProps) => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [storeToEdit, setStoreToEdit] = useState<StoreModel | null>(null);
  const [storesLoading, setStoresLoading] = useState(true);
  const [showStoresLoadingError, setshowStoresLoadingError] = useState(false);

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
    loadStores();
  }, []);

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

  return (
    <>
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
