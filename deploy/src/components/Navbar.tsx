import { Button, Container, Nav, Navbar as NavbarBs } from "react-bootstrap"
import { NavLink } from "react-router-dom"

export function Navbar() {
    return (
    <NavbarBs sticky="top" className="bg-white shadow-sm mb-3">
        <Container>
            <Nav className="me-auto">
                <Nav.Link to="/" as={NavLink}>
                    Home
                </Nav.Link>
                <Nav.Link to="/store" as={NavLink}>
                    Store
                </Nav.Link>
                <Nav.Link to="/about" as={NavLink}>
                    About
                </Nav.Link>
            </Nav>
            <Button 
                style={{ width: "3rem", height: "3rem", position: "relative" }} 
                variant="outline-success" 
                className="rounded-circle"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" id="Shopping-Cart--Streamline-Lucide" height="16" width="16">
                    <desc>Shopping Cart Streamline Icon: https://streamlinehq.com</desc>
                    <path d="M4.375 13.125a0.625 0.625 0 1 0 1.25 0 0.625 0.625 0 1 0 -1.25 0" stroke-width="1"></path>
                    <path d="M11.25 13.125a0.625 0.625 0 1 0 1.25 0 0.625 0.625 0 1 0 -1.25 0" stroke-width="1"></path>
                    <path d="M1.28125 1.28125h1.25l1.6625 7.7625a1.25 1.25 0 0 0 1.25 0.9875h6.1125a1.25 1.25 0 0 0 1.21875 -0.9812500000000001l1.03125 -4.64375H3.2" stroke-width="1"></path>
                </svg>

                <div 
                className="rounded-circle bg-success d-flex justify-content-center align-items-center" 
                style={{ 
                    color: "white", 
                    width: "1.5rem", 
                    height: "1.5rem", 
                    position: "absolute", 
                    bottom: "0", 
                    right: "0",
                    transform: "translate(25%, 25%)",
                    }}
                >
                    3
                </div>
            </Button>
        </Container>
    </NavbarBs>
    )
}