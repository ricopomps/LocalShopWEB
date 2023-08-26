import {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import { Product } from "../models/product";

export interface ShoppingList {
  storeId?: string;
  productsItems: ProductItem[];
  selectedItemIds: string[];
}

export interface ProductItem {
  product: Product;
  quantity: number;
}

export enum REDUCER_ACTION_TYPE {
  SET_SHOPPING_LIST,
  CLEAR_SHOPPING_LIST,
  SET_SELECTED_ITEMS,
  SET_PRODUCT_ITEMS,
  SET_STORE_ID,
  INCREASE_COUNT,
  DECREASE_COUNT,
}

export type ReducerAction = {
  type: REDUCER_ACTION_TYPE;
  payload?: any;
};

type StateType = {
  shoppingList: ShoppingList;
};

export const initialState: StateType = {
  shoppingList: { productsItems: [], selectedItemIds: [] },
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
        shoppingList: { productsItems: [], selectedItemIds: [] },
      };
    }
    case REDUCER_ACTION_TYPE.SET_SELECTED_ITEMS: {
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          selectedItemIds: action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.SET_PRODUCT_ITEMS: {
      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.SET_STORE_ID: {
      console.log("REDUCER_ACTION_TYPE.SET_STORE_ID");

      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          storeId: action.payload,
        },
      };
    }
    case REDUCER_ACTION_TYPE.INCREASE_COUNT: {
      const itemId = action.payload;

      const updatedProductItems = state.shoppingList.productsItems.map(
        (item) => {
          if (item.product._id === itemId) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        }
      );

      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: updatedProductItems,
        },
      };
    }
    case REDUCER_ACTION_TYPE.DECREASE_COUNT: {
      const itemId = action.payload;

      const updatedProductItems = state.shoppingList.productsItems
        .map((item) => {
          if (item.product._id === itemId) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);

      return {
        ...state,
        shoppingList: {
          ...state.shoppingList,
          productsItems: updatedProductItems,
        },
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

  const setSelectedItemIds = useCallback((selectedItemIds: string[]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_SELECTED_ITEMS,
      payload: selectedItemIds,
    });
  }, []);

  const setProductsItems = useCallback((selectedItemIds: ProductItem[]) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_PRODUCT_ITEMS,
      payload: selectedItemIds,
    });
  }, []);

  const setStoreId = useCallback((storeId: string) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.SET_STORE_ID,
      payload: storeId,
    });
  }, []);

  const handleItemCountIncrease = useCallback((itemId: string) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.INCREASE_COUNT,
      payload: itemId,
    });
  }, []);

  const handleItemCountDecrease = useCallback((itemId: string) => {
    dispatch({
      type: REDUCER_ACTION_TYPE.DECREASE_COUNT,
      payload: itemId,
    });
  }, []);

  return {
    state,
    setShoppingList,
    clearShoppingList,
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
  };
};

type UseShoppingListContextType = ReturnType<typeof useShoppingListContext>;

const initialContextState: UseShoppingListContextType = {
  state: initialState,
  setShoppingList: (shoppingList: ShoppingList) => {},
  clearShoppingList: () => {},
  setSelectedItemIds: (selectedItemIds: string[]) => {},
  setProductsItems: (selectedProducts: ProductItem[]) => {},
  setStoreId: (storeId: string) => {},
  handleItemCountIncrease: (itemId: string) => {},
  handleItemCountDecrease: (itemId: string) => {},
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
  shoppingList: ShoppingList;
  setShoppingList: (shoppingList: ShoppingList) => void;
  clearShoppingList: () => void;
  setSelectedItemIds: (selectedItemIds: string[]) => void;
  setProductsItems: (selectedProducts: ProductItem[]) => void;
  setStoreId: (storeId: string) => void;
  handleItemCountIncrease: (itemId: string) => void;
  handleItemCountDecrease: (itemId: string) => void;
};

export const useShoppingList = (): UseShoppingListHookType => {
  const {
    state: { shoppingList },
    setShoppingList,
    clearShoppingList,
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
  } = useContext(ShoppingListContext);
  return {
    shoppingList,
    setShoppingList,
    clearShoppingList,
    setSelectedItemIds,
    setProductsItems,
    setStoreId,
    handleItemCountIncrease,
    handleItemCountDecrease,
  };
};
