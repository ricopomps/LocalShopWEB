import { Button, Navbar } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { User } from "../../models/user";
import * as NotesApi from "../../network/notes_api";
import styles from "../../styles/navbar.module.css";
interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}
const NavBarLoggedInView = ({
  user,
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  async function logout() {
    try {
      await NotesApi.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  return (
    <>
      <Navbar.Text className={styles.textLogged}>
        <div className={styles.centeredContent}>
          {user.image ? (
            <img className={styles.navbarIcon} src={user.image} alt=""></img>
          ) : (
            <FaUserCircle />
          )}
          {user.username}
        </div>
      </Navbar.Text>
      <Button onClick={logout}>Sair</Button>
    </>
  );
};

export default NavBarLoggedInView;
