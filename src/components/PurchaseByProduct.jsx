// Importing necessary modules and components from React, React Router, and Firebase
import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
    query,
    collection,
    where,
    doc,
    getDocs,
    getDoc
} from "firebase/firestore";
import db from "../firebase";

// Main function component for displaying purchases by a specific product
export default function PurchaseByProduct(props) {
    const [purchases, setPurchases] = useState([]); // State variable to store purchases
    const [customerNames, setCustomerNames] = useState({});  // State variable to store customer names indexed by their IDs
    const navigate = useNavigate(); // Navigation hook

    // Fetch purchases for a specific product when the component mounts
    useEffect(() => {
        getPurchasesByProductId();
    }, []);

    // Fetch customer names whenever the purchases are updated
    useEffect(() => {
        purchases.forEach(async purchase => {
            const name = await getCustomerName(purchase.CustomerID);
            setCustomerNames(prevNames => ({
                ...prevNames,
                [purchase.CustomerID]: name
            }));
        });
    }, [purchases]);

    // Async function to get purchases by a specific product ID
    async function getPurchasesByProductId() {
        const docRef = query(collection(db, "purchases"), where("ProductID", "==", props.id));
        const docSnap = await getDocs(docRef);
        setPurchases(docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }

    // Async function to get the customer name based on the CustomerID
    async function getCustomerName(customerId) {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return (docSnap.data().firstName + " " + docSnap.data().lastName);
        } else {
            console.error("No such customer!");
            return "Unknown"; // Return a default value if the customer is not found
        }
    }

    // Function to handle the add click, it navigates to the add purchase page for the customer
    const handleAddClick = (customerId) => {
        navigate(`/customer/${customerId}/add`); // Navigate to the desired path
    };

    // JSX for rendering the list of purchases by product
    return (
        <div>
            <ol className="list-group">
                {purchases.map(purchase => {
                    const date = new Date(purchase.Date.seconds * 1000);
                    const dateString = date.toLocaleDateString();
                    return (
                        <li key={purchase.id} className="list-group-item d-flex justify-content-between align-items-center">
                            Customer name: <Link to={`/customer/${purchase.CustomerID}`} className="mb-1 alert-link">{customerNames[purchase.CustomerID] || "Loading..."}</Link>
                            Purchase Date: {dateString}
                            <button className="btn btn-primary" onClick={() => handleAddClick(purchase.CustomerID)}>Add</button>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}