import { Container, Nav, Navbar } from "react-bootstrap";
import { User } from "../../models/user";
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
        <Navbar.Brand as={Link} to="/products">
          Produtos
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav>
            <Nav.Link as={Link} to="/privacy">
              Privacidade
            </Nav.Link>
            <Nav.Link as={Link} to="/home">
              HomePage
            </Nav.Link>
            <Nav.Link as={Link} to="/cadlojista">
              Cadastro Lojista
            </Nav.Link>
            <Nav.Link as={Link} to="/cadshopper">
              Cadastro Shopper
            </Nav.Link>
            <Nav.Link as={Link} to="/logindesktop">
              Login Desktop
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
