import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar/NavBar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import { User, UserType } from "./models/user";
import * as NotesApi from "./network/notes_api";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotesPage from "./pages/NotesPages";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";
import { Store } from "./models/store";
import { redirect } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginDesktopPage from "./pages/LoginDesktopPage";
import HomePage from "./pages/HomePage";
import StoreListPage from "./pages/StoreListPage";
import StorePage from "./pages/StorePage";
import AddEditProductPage from "./pages/AddEditProductPage";
import ProductsPageLoggedInView from "./components/ProductsPageLoggedInView";
import ProfilePage from "./pages/ProfilePage";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import SendRecoverPasswordEmailPage from "./pages/SendRecoverPasswordEmailPage";
import ProductListPage from "./pages/ProductListPage";
import MapPage from "./pages/MapPage";
import MapViewPage from "./pages/MapViewPage";
import ProductPage from "./pages/ProductPage";
import {
  ShoppingListProvider,
  initialState,
} from "./context/ShoppingListContext";

function App() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await NotesApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  const refreshFavStore = (storeId: string) => {
    if (loggedInUser) {
      if (loggedInUser.favoriteStores) {
        if (loggedInUser.favoriteStores.includes(storeId)) {
          setLoggedInUser({
            ...loggedInUser,
            favoriteStores: loggedInUser.favoriteStores.filter(
              (id) => id !== storeId
            ),
          });
        } else {
          setLoggedInUser({
            ...loggedInUser,
            favoriteStores: [...loggedInUser.favoriteStores, storeId],
          });
        }
      } else {
        setLoggedInUser({ ...loggedInUser, favoriteStores: [storeId] });
      }
    }
  };
  return (
    <>
      <ToastContainer />
      <ShoppingListProvider shoppingList={initialState.shoppingList}>
        <BrowserRouter>
          <div>
            {loggedInUser && (
              <NavBar
                loggedInUser={loggedInUser}
                onLoginClicked={() => setShowLoginModal(true)}
                onSignUpClicked={() => setShowSignUpModal(true)}
                onLogoutSuccessful={() => {
                  setLoggedInUser(null);
                  return redirect("");
                }}
              />
            )}
            <Container className={styles.pageContainer}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {loggedInUser?.store && (
                  <Route
                    path="/products"
                    element={
                      <ProductsPageLoggedInView store={loggedInUser.store} />
                    }
                  />
                )}
                {loggedInUser && (
                  <Route
                    path="/store/product"
                    element={
                      <ProductListPage
                        loggedUser={loggedInUser}
                        refreshFavStore={refreshFavStore}
                      />
                    }
                  />
                )}
                {loggedInUser?.store && (
                  <Route
                    path="/products"
                    element={
                      <ProductsPageLoggedInView store={loggedInUser.store} />
                    }
                  />
                )}
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route
                  path="/cadlojista"
                  element={
                    <SignUpPage
                      onSignUpSuccessful={(user) => setLoggedInUser(user)}
                      userType={UserType.store}
                    />
                  }
                />
                <Route
                  path="/cadshopper"
                  element={
                    <SignUpPage
                      onSignUpSuccessful={(user) => setLoggedInUser(user)}
                      userType={UserType.shopper}
                    />
                  }
                />
                {loggedInUser?.store && (
                  <Route
                    path="/map"
                    element={<MapPage storeId={loggedInUser?.store._id} />}
                  />
                )}
                <Route path="/map" element={<MapViewPage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/shopper" element={<StoreListPage />} />
                <Route
                  path="/forgotpassword"
                  element={<SendRecoverPasswordEmailPage />}
                />
                {loggedInUser?.store && (
                  <Route
                    path="/addeditproduct"
                    element={
                      <AddEditProductPage storeId={loggedInUser.store._id} />
                    }
                  />
                )}
                <Route path="/recover" element={<RecoverPasswordPage />} />
                <Route
                  path="/store"
                  element={
                    <StorePage
                      onCreateStoreSuccessful={(store: Store) =>
                        setLoggedInUser({ ...loggedInUser!, store: store })
                      }
                      store={loggedInUser?.store}
                    />
                  }
                />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/shopper" element={<StoreListPage />} />
                {loggedInUser && (
                  <Route
                    path="/profile"
                    element={<ProfilePage user={loggedInUser} />}
                  />
                )}
                <Route
                  path="/store"
                  element={
                    <StorePage
                      onCreateStoreSuccessful={(store: Store) =>
                        setLoggedInUser({ ...loggedInUser!, store: store })
                      }
                      store={loggedInUser?.store}
                    />
                  }
                />
                <Route
                  path="/logindesktop"
                  element={
                    <LoginDesktopPage
                      onLoginSuccessful={(user) => {
                        setLoggedInUser(user);
                      }}
                    />
                  }
                />
                <Route
                  path="/store2"
                  element={
                    <NotesPage
                      onCreateStoreSuccessful={
                        (store: Store) =>
                          setLoggedInUser({ ...loggedInUser!, store: store }) //IMPROVE THIS! REMOVE THE '!'
                      }
                      loggedInUser={loggedInUser}
                      goToStorePage
                    />
                  }
                />
                <Route path="/*" element={<NotFoundPage />} />
              </Routes>
            </Container>
            {showSignUpModal && (
              <SignUpModal
                onDismiss={() => setShowSignUpModal(false)}
                onSignUpSuccessful={(user) => {
                  setLoggedInUser(user);
                  setShowSignUpModal(false);
                }}
              />
            )}
            {showLoginModal && (
              <LoginModal
                onDismiss={() => setShowLoginModal(false)}
                onLoginSuccessful={(user) => {
                  setLoggedInUser(user);
                  setShowLoginModal(false);
                }}
              />
            )}
          </div>
        </BrowserRouter>
      </ShoppingListProvider>
    </>
  );
}

export default App;
