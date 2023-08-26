import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductApi from "../network/products_api";
import { toast } from "react-toastify";
import { Product as ProductModel } from "../models/product";
import Product from "../components/Product";
import { Button } from "react-bootstrap";
import ShoppingList from "../components/ShoppingList";

const ProductPage = () => {
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
    <>
      <Button onClick={goToStoreMap}>Ver localização</Button>
      <Button onClick={goBackToStore}>Voltar para loja</Button>
      <Product product={selectedProduct} onProductClicked={() => {}} />
      <Button onClick={() => {}}>-</Button>
      <Button onClick={() => {}}>+</Button>

      <ShoppingList
        cartOpen={true}
        storeId={store}
        toggleCart={() => {}}
        onDelete={() => {}}
      />
    </>
  );
};

export default ProductPage;
