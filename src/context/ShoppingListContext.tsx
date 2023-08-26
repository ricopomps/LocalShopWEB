import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { Product } from "../models/product";

export interface ShoppingList {
  productsItems: ProductItem[];
}

export interface ProductItem {
  product: Product;
  quantity: number;
}

export enum REDUCER_ACTION_TYPE {
  SET_SHOPPING_LIST,
  CLEAR_SHOPPING_LIST,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

type StateType = {
  shoppingList?: ShoppingList;
};

export const initialState: StateType = {
  shoppingList: undefined,
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_SHOPPING_LIST: {
      return {
        ...state,
        shoppingList: action.payload,
      };
    }
    case REDUCER_ACTION_TYPE.CLEAR_SHOPPING_LIST: {
      return {
        ...state,
        shoppingList: undefined,
      };
    }
    default: {
      return state;
    }
  }
};

const useShoppingListContext = (initialState: StateType) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setShoppingList = useCallback((shoppingList: ShoppingList) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SHOPPING_LIST,
      payload: { ...shoppingList, shoppingList },
    });
  }, []);

  const clearShoppingList = useCallback(() => {
    dispatch({
      type: REDUCER_ACTION_TYPE.CLEAR_SHOPPING_LIST,
    });
  }, []);

  return {
    state,
    setShoppingList,
    clearShoppingList,
  };
};

type UseShoppingListContextType = ReturnType<typeof useShoppingListContext>;

const initialContextState: UseShoppingListContextType = {
  state: initialState,
  setShoppingList: (shoppingList: ShoppingList) => {},
  clearShoppingList: () => {},
};

export const ShoppingListContext =
  createContext<UseShoppingListContextType>(initialContextState);

type ChildrenType = {
  children?: ReactElement;
};

export const ShoppingListProvider = ({
  children,
  ...initialState
}: ChildrenType & StateType): ReactElement => {
  return (
    <ShoppingListContext.Provider value={useShoppingListContext(initialState)}>
      {children}
    </ShoppingListContext.Provider>
  );
};

type UseShoppingListHookType = {
  shoppingList?: ShoppingList;
  setShoppingList: (shoppingList: ShoppingList) => void;
  clearShoppingList: () => void;
};

export const useShoppingList = (): UseShoppingListHookType => {
  const {
    state: { shoppingList },
    setShoppingList,
    clearShoppingList,
  } = useContext(ShoppingListContext);
  return {
    shoppingList,
    setShoppingList,
    clearShoppingList,
  };
};
