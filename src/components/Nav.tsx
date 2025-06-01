import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const logout: React.MouseEventHandler<HTMLElement>=()=>{
localStorage.clear()
window.location.reload();
}
const MyNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
    
      <Navbar.Brand href="#home">
  {localStorage.getItem("usuario")
    ? `¡Bienvenid@ ${localStorage.getItem("usuario")}!`
    : "App presupuesto Yeniffer y Rodrigo"}
</Navbar.Brand>       
  
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Inicio</Nav.Link>

            <NavDropdown title="Opciones" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/1">Acción (proximamente)</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item  onClick={logout}>Cerrar sesión</NavDropdown.Item>            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;