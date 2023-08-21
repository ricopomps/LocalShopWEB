import { Container, Nav, Navbar } from "react-bootstrap";
import { User, UserType } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/navbar.module.css";

interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
}
const NavBar = ({
  loggedInUser,
  onLoginClicked,
  onLogoutSuccessful,
  onSignUpClicked,
}: NavBarProps) => {
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
        {loggedInUser?.userType === UserType.shopper ? (
          <Navbar.Brand as={Link} to="/shopper">
            Lojas
          </Navbar.Brand>
        ) : (
          <Navbar.Brand as={Link} to="/products">
            Produtos
          </Navbar.Brand>
        )}
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link as={Link} to="/profile">
              Perfil
            </Nav.Link>
          </Nav>
          {loggedInUser?.store && (
            <Nav>
              <Nav.Link as={Link} to="/store">
                Visualizar loja
              </Nav.Link>
            </Nav>
          )}
          <Nav className="ms-auto">
            {loggedInUser ? (
              <NavBarLoggedInView
                user={loggedInUser}
                onLogoutSuccessful={() => {
                  onLogoutSuccessful();
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
