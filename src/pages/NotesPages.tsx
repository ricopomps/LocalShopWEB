import { Container } from "react-bootstrap";
import ProductsPageLoggedInView from "../components/ProductsPageLoggedInView";
import NotesPageLoggedOutView from "../components/NotesPageLoggedOutView";
import styles from "../styles/NotesPage.module.css";
import { User, UserType } from "../models/user";

interface NotesPageProps {
  loggedInUser: User | null;
}

const NotesPage = ({ loggedInUser }: NotesPageProps) => {
  const Page = () => {
    if (!loggedInUser) return <NotesPageLoggedOutView />;

    if (!loggedInUser.userType) return <>CREATE A FAIL PAGE!</>;

    if (loggedInUser.userType === UserType.store) {
      if (!loggedInUser.storeId) return <>CREATE A STORE CRUD PAGE!</>;
      return <ProductsPageLoggedInView />;
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
