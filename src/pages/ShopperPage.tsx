import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { Store as StoreModel } from "../models/store";
import * as StoresApi from "../network/storeApi";
import styles from "../styles/StoresPage.module.css";
import Product from "../components/Product";
import AddEditProductDialog from "../components/AddEditProductDialog";
import ShoppingList from "../components/ShoppingList";

interface ShopperPageProps {}

const ShopperPage = ({}: ShopperPageProps) => {
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
  async function deleteStore(store: StoreModel) {
    try {
      await StoresApi.deleteStore(store._id);
      setStores(
        stores.filter((existingStore) => existingStore._id !== store._id)
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const storesGrid = (
    <Row xs={1} md={2} xl={3} className={`g-4 ${styles.storesGrid}`}>
      {stores.map((store) => (
        <Col key={store._id}>
          <Product
            product={store}
            onProductClicked={setStoreToEdit}
            onDeleteProductClicked={deleteStore}
            className={styles.store}
          ></Product>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {storesLoading && <Spinner animation="border" variant="primary" />}
      {showStoresLoadingError && (
        <p>Erro inesperado. Favor recarregar a página</p>
      )}

      {!storesLoading && !showStoresLoadingError && (
        <>{stores.length > 0 ? storesGrid : <p>Não existem notas</p>}</>
      )}

      <ShoppingList products={stores} />

      {storeToEdit && (
        <AddEditProductDialog
          storeId=""
          onDismiss={() => setStoreToEdit(null)}
          productToEdit={storeToEdit}
          onProductSaved={() => {}}
        />
      )}
    </>
  );
};

export default ShopperPage;
