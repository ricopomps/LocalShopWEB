import { useLocation, useNavigate } from "react-router-dom";
import Grid from "../components/Grid";
import { Button } from "react-bootstrap";

const MapViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(location.search);
  const store = queryParameters.get("store");
  return (
    <>
      <Button onClick={() => navigate(-1)}>Voltar</Button>
      {store ? (
        <Grid rows={10} cols={10} storeId={store} />
      ) : (
        <p>Loja não encontrada</p>
      )}
    </>
  );
};

export default MapViewPage;
