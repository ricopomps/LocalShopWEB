import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import {
  ShoppingListProvider,
  initialState,
} from "./context/ShoppingListContext";
import {
  UserProvider,
  initialState as userInitialState,
} from "./context/UserContext";
import AppRoutes from "./routes";

function App() {
  return (
    <>
      <ToastContainer />
      <ShoppingListProvider
        shoppingList={initialState.shoppingList}
        open={initialState.open}
        selectedPath={initialState.selectedPath}
        path={initialState.path}
      >
        <UserProvider user={userInitialState.user}>
          <AppRoutes />
        </UserProvider>
      </ShoppingListProvider>
    </>
  );
}

export default App;
