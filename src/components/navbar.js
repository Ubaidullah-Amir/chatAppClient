import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom"
import { MenuContext } from './Main';
import { useLocation } from 'react-router-dom/dist/umd/react-router-dom.development';
function NavBar({disable}) {
  const location = useLocation();
  const {menuOpen,setmenuOpen} = useContext(MenuContext)
    function handleChange(e) {
          setmenuOpen(e.target.checked)
          
    }
  return (
    
    <>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container>
          
          <div className="menubtn" style={location.pathname !== "/" ? {display:'none'}:{}}>
          
           
            <input id="dropdown" className="input-box" type="checkbox" checked={menuOpen} onChange = {handleChange} style={{display:"none"}}/>

            <label htmlFor="dropdown" className="dropdown">
              <span className="hamburger">
                <span className="icon-bar top-bar"></span>
                <span className="icon-bar middle-bar"></span>
                <span className="icon-bar bottom-bar"></span>
              </span>
            </label>
          </div>
          <Navbar.Brand as={Link} disabled={disable} to="/">ChatApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              
              <Nav.Link as={Link} disabled={disable}  to="find">Find People</Nav.Link>
              
              <Nav.Link as={Link} disabled={disable} to="request">Requests</Nav.Link>
              <Nav.Link as={Link} disabled={disable} to="porfile">Porfile</Nav.Link>
              <Nav.Link as={Link}  to="login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
    </>
  );
}

export default NavBar;