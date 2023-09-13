import { Button, Dropdown, Nav, Navbar } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { User } from "../../models/user";
import * as NotesApi from "../../network/notes_api";
import styles from "../../styles/navbar.module.css";
import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import RoutesEnum from "../../utils/routesEnum";
interface NavBarLoggedInViewProps {
  user: User;
  onLogoutSuccessful: () => void;
}
const NavBarLoggedInView = ({
  user,
  onLogoutSuccessful,
}: NavBarLoggedInViewProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  async function logout() {
    try {
      await NotesApi.logout();
      onLogoutSuccessful();
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  const CustomDropdownToggle = React.forwardRef(({}, ref) => (
    <div
      className={styles.centeredContent}
      onClick={() => setOpenDropdown(!openDropdown)}
    >
      {user.image ? (
        <img className={styles.navbarIcon} src={user.image} alt=""></img>
      ) : (
        <FaUserCircle />
      )}
      {user.username}
    </div>
  ));

  return (
    <>
      <Navbar.Text className={styles.textLogged}>
        <Dropdown
          show={openDropdown}
          onToggle={(openDropdown) => setOpenDropdown(openDropdown)}
        >
          <Dropdown.Toggle
            as={CustomDropdownToggle}
            id="dropdown-custom-toggle"
          />

          {openDropdown && (
            <Dropdown.Menu show className={styles.dropdown}>
              <Dropdown.Item className={styles.dropdownItem}>
                <Nav>
                  <Nav.Link
                    className={styles.textNavbar}
                    as={Link}
                    to={RoutesEnum.PROFILE}
                  >
                    Perfil
                  </Nav.Link>
                </Nav>
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className={styles.dropdownItem}>
                <Button onClick={logout} className={styles.logout}>
                  Sair
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          )}
        </Dropdown>
      </Navbar.Text>
    </>
  );
};

export default NavBarLoggedInView;
