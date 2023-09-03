import { Container, Nav, Navbar } from "react-bootstrap";
import { User, UserType } from "../../models/user";
import NavBarLoggedInView from "./NavBarLoggedInView";
import NavBarLoggedOutView from "./NavBarLoggedOutView";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/navbar.module.css";
import NotificationBar from "../NotificationBar";
import { useState } from "react";

interface NavBarProps {
  loggedInUser: User | null;
  onSignUpClicked: () => void;
  onLoginClicked: () => void;
  onLogoutSuccessful: () => void;
  toggleNotifications: () => void;
}
const NavBar = ({
  loggedInUser,
  onLoginClicked,
  onLogoutSuccessful,
  onSignUpClicked,
  toggleNotifications,
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
          {loggedInUser?.userType === UserType.store && (
            <Nav>
              <Nav.Link className={styles.textNavbar} as={Link} to="/reports">
                Relatórios
              </Nav.Link>
            </Nav>
          )}
          {loggedInUser?.store && (
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
