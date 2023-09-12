import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useUser } from "../context/UserContext";
import { getApi } from "../network/api";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { accessToken } = useUser();

  useEffect(() => {
    const requestIntercept = getApi().interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = getApi().interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return getApi()(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      getApi().interceptors.request.eject(requestIntercept);
      getApi().interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refresh]);

  return getApi();
};

export default useAxiosPrivate;
