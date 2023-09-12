import { Container, Nav, Navbar } from "react-bootstrap";
import { UserType } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/navbar.module.css";
import { useUser } from "../../context/UserContext";

interface NavBarProps {
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  toggleNotifications: () => void;
}
const NavBar = ({
  onLoginClicked,
  onSignUpClicked,
  toggleNotifications,
}: NavBarProps) => {
  const { user, clearUser } = useUser();
  let navigate = useNavigate();
  return (
    <Navbar
      className={styles.navbar}
      bg="dark"
      variant="dark"
      expand="sm"
      sticky="top"
    >
      <Container className={styles.navbar}>
        {user?.userType === UserType.shopper ? (
          <Navbar.Brand className={styles.textNavbar} as={Link} to="/shopper">
            Lojas
          </Navbar.Brand>
        ) : (
          <Navbar.Brand className={styles.textNavbar} as={Link} to="/products">
            Produtos
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link className={styles.textNavbar} as={Link} to="/profile">
              Perfil
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link
              className={styles.textNavbar}
              onClick={toggleNotifications}
            >
              Notificações
            </Nav.Link>
          </Nav>
          {user?.userType === UserType.store && (
            <Nav>
              <Nav.Link className={styles.textNavbar} as={Link} to="/reports">
                Relatórios
              </Nav.Link>
            </Nav>
          )}
          {user?.store && (
            <>
              <Nav>
                <Nav.Link className={styles.textNavbar} as={Link} to="/map">
                  Mapa
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link className={styles.textNavbar} as={Link} to="/store">
                  Loja
                </Nav.Link>
              </Nav>
            </>
          )}
          <Nav className="ms-auto">
            {user ? (
              <NavBarLoggedInView
                user={user}
                onLogoutSuccessful={() => {
                  clearUser();
                  navigate("/");
                }}
              />
            ) : (
              <NavBarLoggedOutView
                onLoginClicked={onLoginClicked}
                onSignUpClicked={onSignUpClicked}
              />
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
