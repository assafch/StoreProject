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

export default function PurchaseByProduct(props) {
    const [purchases, setPurchases] = useState([]);
    const [customerNames, setCustomerNames] = useState({});  // Store customer names by their IDs
    const navigate = useNavigate();

    useEffect(() => {
        getPurchasesByProductId();
    }, []);

    useEffect(() => {
        // Fetch customer names when purchases are updated
        purchases.forEach(async purchase => {
            const name = await getCustomerName(purchase.CustomerID);
            setCustomerNames(prevNames => ({
                ...prevNames,
                [purchase.CustomerID]: name
            }));
        });
    }, [purchases]);


    async function getPurchasesByProductId() {
        const docRef = query(collection(db, "purchases"), where("ProductID", "==", props.id));
        const docSnap = await getDocs(docRef);
        setPurchases(docSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }

    async function getCustomerName(customerId) {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return (docSnap.data().firstName + " " + docSnap.data().lastName);
        } else {
            console.error("No such customer!");
            return "Unknown"; // Return a default value if customer not found
        }
    }

    const handleAddClick = (customerId) => {
        navigate(`/customer/${customerId}/add`); // Navigate to the desired path
    };
    
    return (
        <div>
            
            {<ol className="list-group">
                
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
            </ol>}
        </div>
    );
}
