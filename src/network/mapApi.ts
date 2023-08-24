import { CellCoordinates } from "../components/Grid";
import { getApi } from "./api";

export interface Map {
  items: CellCoordinates[];
}

const baseUrl = "/api/map";

export async function saveMap(map: Map): Promise<void> {
  const { data } = await getApi().post(baseUrl, map);
  return data;
}

export async function getMap(storeId: string): Promise<Map> {
  const { data } = await getApi().get(`${baseUrl}/${storeId}`);
  return data;
}
