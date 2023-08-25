import { useLocation } from "react-router-dom";

const ProductPage = () => {
  const location = useLocation();
  const queryParameters = new URLSearchParams(location.search);
  const store = queryParameters.get("store");
  const product = queryParameters.get("product");
  console.log(store, product);
  return <>Product</>;
};

export default ProductPage;
