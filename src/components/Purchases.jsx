import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { query, collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";
import PurchaseByCustomer from "./PurchaseByCustomer";

// Main component to display all purchases, allows filtering by customer, product, and date
export default function Purchases() {
  // State variables to hold customer, product, and purchase data
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [productSelect, setProductSelect] = useState("all");
  const [customerSelect, setCustomerSelect] = useState("all");
  const [purchaseDate, setPurchaseDate] = useState("");

  // Fetch all customers, products, and purchases when the component mounts
  useEffect(() => {
    getAll();
  }, []);

  // Function to fetch all customers, products, and purchases
  const getAll = () => {
    const docRefCustomers = query(collection(db, "customers"));
    onSnapshot(docRefCustomers, (querySnapshot) => {
      setCustomers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const docRefProducts = query(collection(db, "products"));
    onSnapshot(docRefProducts, (querySnapshot) => {
      setProducts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    const docRefPurchases = query(collection(db, "purchases"));
    onSnapshot(docRefPurchases, (querySnapshot) => {
      setPurchases(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  };

  // Function to handle the search button click
  const onSearch = (e) => {
    e.preventDefault();
    console.log(productSelect, customerSelect, purchaseDate);
  };

  // Render the JSX
  return (
    <div className="container">
      <div className="row">
        <div className="col-8 border border-primary rounded">
          {/* Search form */}
          <form className="m-3" onSubmit={onSearch}>
            {/* Product selection */}
            <div className="mb-3">
              <select className="form-select" id="productSelect" onChange={(e) => setProductSelect(e.target.value)}>
                <option key={0} defaultValue value={"all"}>Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            {/* Customer selection */}
            <div className="mb-3">
              <select className="form-select" id="customerSelect" onChange={(e) => setCustomerSelect(e.target.value)}>
                <option key={0} defaultValue value={"all"}>Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
                ))}
              </select>
            </div>
            {/* Date selection */}
            <div className="mb-3">
              <label className="form-label">Purchase Date</label>
              <input type="date" className="form-control" id="purchaseDate" onChange={(e) => setPurchaseDate(new Date(e.target.value))} />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
        <div className="col-10 border border-primary rounded">
          {/* Table to display purchases */}
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Purchases</th>
              </tr>
            </thead>
            <tbody>
              {customers.filter((c) => c.id === customerSelect || customerSelect === "all").map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.firstName} {customer.lastName}</td>
                  <td><PurchaseByCustomer id={customer.id} product={productSelect} purchaseDate={purchaseDate}/></td>
                  {/* Additional actions can be added here */}
                  <td>
                    <button className="btn btn-primary" onClick={() => handleAddClick(customer.id)}>Buy Product</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
