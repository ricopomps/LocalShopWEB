import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { toast } from "react-toastify";
import { Product } from "../models/product";
import { User, UserType } from "../models/user";
import * as UsersApi from "../network/notes_api";

export interface ProductItem {
  product: Product;
  quantity: number;
}

enum REDUCER_ACTION_TYPE {
  SET_USER,
  CLEAR_USER,
  ADD_FAVORITE_PRODUCT,
  REMOVE_FAVORITE_PRODUCT,
  ADD_FAVORITE_STORE,
  REMOVE_FAVORITE_STORE,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

type StateType = {
  user: User;
};

export const initialState: StateType = {
  user: {
    cpf: "",
    email: "",
    username: "",
    userType: UserType.shopper,
    favoriteProducts: [],
    favoriteStores: [],
  },
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_USER: {
      console.log("SET_USER", action.payload);

      return {
        ...state,
        user: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.CLEAR_USER: {
      return {
        ...state,
        user: initialState.user,
      };
    }
    case REDUCER_ACTION_TYPE.ADD_FAVORITE_PRODUCT: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteProducts: state.user.favoriteProducts
            ? [...state.user.favoriteProducts, action.payload]
            : [action.payload],
        },
      };
    }
    case REDUCER_ACTION_TYPE.REMOVE_FAVORITE_PRODUCT: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteProducts: state.user.favoriteProducts.filter(
            (id) => id !== action.payload
          ),
        },
      };
    }
    case REDUCER_ACTION_TYPE.ADD_FAVORITE_STORE: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteStores: [...state.user.favoriteStores, action.payload],
        },
      };
    }
    case REDUCER_ACTION_TYPE.REMOVE_FAVORITE_STORE: {
      return {
        ...state,
        user: {
          ...state.user,
          favoriteStores: state.user.favoriteStores.filter(
            (id) => id !== action.payload
          ),
        },
      };
    }

    default: {
      return state;
    }
  }
};

const useUserContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setUser = useCallback((user: User) => {
    console.log("setUser", user);
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_USER,
      payload: user,
    });
  }, []);

  const clearUser = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_USER,
    });
  }, []);

  const addFavoriteProduct = useCallback(async (productId: string) => {
    try {
      await UsersApi.favoriteProduct(productId);
      toast.success("Produto favoritado com sucesso!");
      dispatch({
        type: REDUCER_ACTION_TYPE.ADD_FAVORITE_PRODUCT,
        payload: productId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const removeFavoriteProduct = useCallback(async (productId: string) => {
    try {
      await UsersApi.unfavoriteProduct(productId);
      toast.success("Produto removido com sucesso dos favoritos!");
      dispatch({
        type: REDUCER_ACTION_TYPE.REMOVE_FAVORITE_PRODUCT,
        payload: productId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const addFavoriteStore = useCallback(async (storeId: string) => {
    try {
      await UsersApi.favoriteStore(storeId);
      toast.success("Loja favoritada com sucesso!");
      dispatch({
        type: REDUCER_ACTION_TYPE.ADD_FAVORITE_STORE,
        payload: storeId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const removeFavoriteStore = useCallback(async (storeId: string) => {
    try {
      await UsersApi.unfavoriteStore(storeId);
      toast.success("Loja removida com sucesso dos favoritos!");
      dispatch({
        type: REDUCER_ACTION_TYPE.REMOVE_FAVORITE_STORE,
        payload: storeId,
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }, []);

  const fetchLoggedInUser = useCallback(async () => {
    try {
      const user = await UsersApi.getLoggedInUser();
      console.log("userNOCONTEXTO", user);
      setUser(user);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return {
    state,
    setUser,
    clearUser,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
    fetchLoggedInUser,
  };
};

type UseUserContextType = ReturnType<typeof useUserContext>;

const initialContextState: UseUserContextType = {
  state: initialState,
  setUser: (user: User) => {},
  clearUser: () => {},
  addFavoriteProduct: async (productId: string) => {},
  removeFavoriteProduct: async (productId: string) => {},
  addFavoriteStore: async (productId: string) => {},
  removeFavoriteStore: async (productId: string) => {},
  fetchLoggedInUser: async () => {},
};

export const UserContext =
  createContext<UseUserContextType>(initialContextState);

type ChildrenType = {
  children?: ReactElement;
};

export const UserProvider = ({
  children,
  ...initialState
}: ChildrenType & StateType): ReactElement => {
  const { fetchLoggedInUser } = useUserContext(initialState);

  useEffect(() => {
    // fetchLoggedInUser();
  }, []);

  return (
    <UserContext.Provider value={useUserContext(initialState)}>
      {children}
    </UserContext.Provider>
  );
};

type UseUserHookType = {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  addFavoriteProduct: (productId: string) => void;
  removeFavoriteProduct: (productId: string) => void;
  addFavoriteStore: (productId: string) => void;
  removeFavoriteStore: (productId: string) => void;
};

export const useUser = (): UseUserHookType => {
  const {
    state: { user },
    setUser,
    clearUser,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
  } = useContext(UserContext);
  return {
    user,
    setUser,
    clearUser,
    addFavoriteProduct,
    removeFavoriteProduct,
    addFavoriteStore,
    removeFavoriteStore,
  };
};
