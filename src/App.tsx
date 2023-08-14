import { useEffect, useState } from "react";
import NavBar from "./components/NavBar/NavBar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import { User } from "./models/user";
import * as NotesApi from "./network/notes_api";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import NotesPage from "./pages/NotesPages";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import styles from "./styles/App.module.css";
import { Store } from "./models/store";
import { redirect } from "react-router-dom";
import CadastroLojistaPage from "./pages/CadastroLojistaPage";
import CadastroShopperPage from "./pages/CadastroShopperPage";
import LoginDesktopPage from "./pages/LoginDesktopPage";

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
  return (
    <BrowserRouter>
      <div>
        <NavBar
          loggedInUser={loggedInUser}
          onLoginClicked={() => setShowLoginModal(true)}
          onSignUpClicked={() => setShowSignUpModal(true)}
          onLogoutSuccessful={() => {
            setLoggedInUser(null);
            return redirect("");
          }}
        />
        <Container className={styles.pageContainer}>
          <Routes>
            <Route
              path="/"
              element={
                <NotesPage
                  onCreateStoreSuccessful={
                    (store: Store) =>
                      setLoggedInUser({ ...loggedInUser!, store: store }) //IMPROVE THIS! REMOVE THE '!'
                  }
                  loggedInUser={loggedInUser}
                />
              }
            />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cadlojista" element={<CadastroLojistaPage />} />
            <Route path="/cadshopper" element={<CadastroShopperPage />} />
            <Route path="/logindesktop" element={<LoginDesktopPage />} />
            <Route
              path="/store"
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
  );
}

export default App;
