import { endOfMonth, startOfMonth } from "date-fns";
import { getApi } from "./api";

const baseUrl = "/api/reports";

export async function getReport(startDate: Date, endDate: Date) {
  const response = await getApi().get(baseUrl, {
    params: {
      startDate: startOfMonth(startDate),
      endDate: endOfMonth(endDate),
    },
  });
  return response.data;
}
