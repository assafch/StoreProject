// Import required modules and components from React, React Router, and Firebase
import { useState, useEffect, React } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    query,
    collection,
    onSnapshot,
} from "firebase/firestore";
import db from "../firebase";
import PurchaseByCustomer from "./PurchaseByCustomer";

// Main function component for displaying customers
export default function Customers() {
    // Initialize state variables and navigation hook
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    // Run effects when the component mounts to fetch all customers
    useEffect(() => {
        getAll();
    }, []);

    // Function to fetch all customers from the "customers" collection in Firestore
    const getAll = () => {
        const docRef = query(collection(db, "customers"));
        onSnapshot(docRef, (querySnapshot) => {
            setCustomers(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
    };

    // Function to handle clicking the "Buy Product" button for a customer
    const handleAddClick = (customerId) => {
        navigate(`/customer/${customerId}/add`); // Navigate to the Add Product page for the customer
    };

    // JSX for rendering the customer list and associated actions
    return (
        <div className="container">
            <div className="row">
                <div className="col-10 border border-primary rounded">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Purchases</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.firstName} {customer.lastName}</td>
                                    <td><PurchaseByCustomer id={customer.id} product={"all"} /></td>
                                    <td><button className="btn btn-primary" onClick={() => handleAddClick(customer.id)}>Buy Product</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
