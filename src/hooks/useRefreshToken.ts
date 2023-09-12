import { useUser } from "../context/UserContext";
import * as AuthApi from "../network/authApi";
import * as StoresApi from "../network/storeApi";

const useRefreshToken = () => {
  const { setAccessToken, setUser } = useUser();

  const refresh = async () => {
    const { user, accessToken } = await AuthApi.refresh();
    const store = await StoresApi.getStoreByLoggedUser();
    setUser({ ...user, store });
    setAccessToken(accessToken);
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken;
