import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import NavBar from "./components/NavBar/NavBar";
import NotificationBar from "./components/NotificationBar";
import ProductsPageLoggedInView from "./components/ProductsPageLoggedInView";
import SignUpModal from "./components/SignUpModal";
import { Store } from "./models/store";
import { UserType } from "./models/user";
import AddEditProductPage from "./pages/AddEditProductPage";
import HistoricPage from "./pages/HistoricPage";
import HomePage from "./pages/HomePage";
import LoginDesktopPage from "./pages/LoginDesktopPage";
import MapPage from "./pages/MapPage";
import MapViewPage from "./pages/MapViewPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProductListPage from "./pages/ProductListPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import styles from "./styles/App.module.css";
import RecoverPasswordPage from "./pages/RecoverPasswordPage";
import ReportsPage from "./pages/ReportsPage";
import SendRecoverPasswordEmailPage from "./pages/SendRecoverPasswordEmailPage";
import SignUpPage from "./pages/SignUpPage";
import StoreListPage from "./pages/StoreListPage";
import StorePage from "./pages/StorePage";
import { useUser } from "./context/UserContext";
import { useEffect, useState } from "react";
import * as UsersApi from "./network/notes_api";
import * as StoresApi from "./network/storeApi";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

const AppRoutes = () => {
  const { user, setUser } = useUser();
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await UsersApi.getLoggedInUser();
        const store = await StoresApi.getStoreByLoggedUser();
        setUser({ ...user, store });
      } catch (error) {
        console.error(error);
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    <BrowserRouter>
      <div>
        {user?.username && (
          <>
            <NavBar
              onLoginClicked={() => setShowLoginModal(true)}
              onSignUpClicked={() => setShowSignUpModal(true)}
              toggleNotifications={() => setOpenNotification(!openNotification)}
            />
            <NotificationBar
              open={openNotification}
              close={() => setOpenNotification(false)}
            />
          </>
        )}
        <Container className={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/logindesktop" element={<LoginDesktopPage />} />
            <Route
              path="/cadlojista"
              element={
                <SignUpPage
                  onSignUpSuccessful={(user) => setUser(user)}
                  userType={UserType.store}
                />
              }
            />
            <Route
              path="/cadshopper"
              element={
                <SignUpPage
                  onSignUpSuccessful={(user) => setUser(user)}
                  userType={UserType.shopper}
                />
              }
            />
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route
                  path="/store/product" //PRIVATE ROUTE
                  element={<ProductListPage />}
                />
                <Route
                  path="/product" //PRIVATE ROUTE
                  element={<ProductPage />}
                />

                <Route path="/historic" element={<HistoricPage />} />

                <Route path="/shopper" element={<StoreListPage />} />
                <Route
                  path="/forgotpassword"
                  element={<SendRecoverPasswordEmailPage />}
                />

                <Route path="/recover" element={<RecoverPasswordPage />} />
                <Route
                  path="/store"
                  element={
                    <StorePage
                      onCreateStoreSuccessful={(store: Store) =>
                        setUser({ ...user!, store: store })
                      }
                      store={user?.store}
                    />
                  }
                />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/shopper" element={<StoreListPage />} />
                {user?.userType === UserType.store && (
                  <Route path="/reports" element={<ReportsPage />} />
                )}
                <Route
                  path="/profile" //PRIVATE ROUTE
                  element={<ProfilePage user={user} updateUser={setUser} />}
                />
                <Route
                  path="/store"
                  element={
                    <StorePage
                      onCreateStoreSuccessful={(store: Store) =>
                        setUser({ ...user!, store: store })
                      }
                      store={user?.store}
                    />
                  }
                />
                {user.store && (
                  <>
                    <Route
                      path="/products" //PRIVATE ROUTE
                      element={<ProductsPageLoggedInView store={user.store} />}
                    />
                    <Route
                      path="/products" //PRIVATE ROUTE
                      element={<ProductsPageLoggedInView store={user.store} />}
                    />
                    <Route
                      path="/map" //PRIVATE ROUTE
                      element={<MapPage storeId={user?.store._id} />}
                    />
                    <Route
                      path="/addeditproduct" //PRIVATE ROUTE
                      element={<AddEditProductPage storeId={user.store._id} />}
                    />
                  </>
                )}
                <Route path="/map" element={<MapViewPage />} />
              </Route>
            </Route>

            <Route path="/*" element={<NotFoundPage />} />
          </Routes>
        </Container>
        {showSignUpModal && (
          <SignUpModal
            onDismiss={() => setShowSignUpModal(false)}
            onSignUpSuccessful={(user) => {
              setUser(user);
              setShowSignUpModal(false);
            }}
          />
        )}
        {showLoginModal && (
          <LoginModal
            onDismiss={() => setShowLoginModal(false)}
            onLoginSuccessful={(user) => {
              setUser(user);
              setShowLoginModal(false);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
