import Grid from "../components/Grid";

interface MapPageProps {
  storeId: string;
}

const MapPage = ({ storeId }: MapPageProps) => {
  return <Grid rows={10} cols={10} storeId={storeId} edit />;
};

export default MapPage;
