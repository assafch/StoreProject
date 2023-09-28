import { useState, useEffect, React } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    query,
    collection,
    onSnapshot,
} from "firebase/firestore";
import db from "../firebase";
import PurchaseByCustomer from "./PurchaseByCustomer";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        const docRef = query(collection(db, "customers"));
        onSnapshot(docRef, (querySnapshot) => {
            setCustomers(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
    };

    const handleAddClick = (customerId) => {
        navigate(`/customer/${customerId}/add`); // Navigate to the desired path
    };

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