import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Container, Nav, Navbar } from 'react-bootstrap';
import Products from "./components/Products";
import Customers from "./components/Customers";
import Purchases from "./components/Purchases";
import EditProduct from "./components/EditProduct";
import EditCustomer from "./components/EditCustomer";
import AddProduct from "./components/AddProduct";

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Assaf Store</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav"/>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"> 
              <Nav.Link href="/products">Products</Nav.Link>
              <Nav.Link href="/customers">Customers</Nav.Link>
              <Nav.Link href="/purchases">Purchases</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />  
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/product/:productId" element={<EditProduct />} />
        <Route path="/customer/:customerId" element={<EditCustomer />} />
        <Route path="*" element={<h1>Page not found</h1>} />
        <Route path="/customer/:customerId/add" element={<AddProduct />} />
      </Routes>

    </Router>
  );
}

export default App;