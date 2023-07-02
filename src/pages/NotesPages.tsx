import { Container } from "react-bootstrap";
import ProductsPageLoggedInView from "../components/ProductsPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import styles from "../styles/NotesPage.module.css";
import { User, UserType } from "../models/user";
import StorePage from "./StorePage";
import { Store } from "../models/store";

interface NotesPageProps {
  loggedInUser: User | null;
  onCreateStoreSuccessful: (store: Store) => void;
}

const NotesPage = ({
  loggedInUser,
  onCreateStoreSuccessful,
}: NotesPageProps) => {
  const Page = () => {
    if (!loggedInUser) return <NotesPageLoggedOutView />;

    if (!loggedInUser.userType) return <>CREATE A FAIL PAGE!</>;

    if (loggedInUser.userType === UserType.store) {
      if (!loggedInUser?.store)
        return (
          <StorePage
            onCreateStoreSuccessful={onCreateStoreSuccessful}
            store={loggedInUser.store}
          />
        );
      return <ProductsPageLoggedInView store={loggedInUser.store} />;
    }

    if (loggedInUser.userType === UserType.shopper)
      return <>CREATE A {UserType.shopper} PAGE!</>;

    return <>CREATE A FAIL PAGE!</>;
  };

  return (
    <Container className={styles.notesPage}>
      <Page />
    </Container>
  );
};

export default NotesPage;
