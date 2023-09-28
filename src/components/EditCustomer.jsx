// Import required modules and components from React, React Router, and Firebase
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, query, collection, deleteDoc, where } from 'firebase/firestore';
import db from '../firebase';
import PurchaseByCustomer from "./PurchaseByCustomer";

// Main function component for editing customer details
export default function EditCustomer() {
    // Get customerId from URL parameters
    const { customerId } = useParams();

    // Initialize state variables
    const [customer, setCustomer] = useState({});

    // Run effect to fetch customer data when the component mounts
    useEffect(() => {
        getCustomerData();
    }, []);

    // Asynchronous function to get customer data from Firestore
    async function getCustomerData() {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCustomer({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.log("No such document!");
        }
    }

    // Handle changes in form input fields
    const handleChange = (e) => {
        const { name, value} = e.target;
        setCustomer({...customer, [name]: value});
    }

    // Asynchronous function to handle form submission and update Firestore document
    const handleSubmit = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "customers", customerId);
        await updateDoc(docRef, {
            firstName: customer.firstName,
            lastName: customer.lastName,
            city: customer.city
        });
        alert("Product updated successfully!");
    }

    // Asynchronous function to handle customer deletion
    const handleDelete = async () => {
        const docRefPurchases = query(collection(db, "purchases"), where("CustomerID", "==", customerId));
        const querySnapshotPurchases = await getDocs(docRefPurchases);
        querySnapshotPurchases.forEach((doc) => {
            deleteDoc(doc.ref);
        });
        const docRef = doc(db, "customers", customerId);
        await deleteDoc(docRef);
        alert("Customer deleted successfully!");
    }

    // JSX for rendering the customer edit form and associated purchases
    return (
        <div className="container">
            <div className="row">
                <div className="col-4 border border-primary rounded p-2">
                    <form onSubmit={handleSubmit}>
                        {/* Form fields for customer details */}
                        <div className="mb-3">
                            <label className="form-label">First Name</label>
                            <input type="text" name="firstName" className="form-control" value={customer.firstName || ''} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Last Name</label>
                            <input type="text" name="lastName" className="form-control" value={customer.lastName || ''} onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">City</label>
                            <input type="text" name="city" className="form-control" value={customer.city || ''} onChange={handleChange}/>
                        </div>
                        {/* Submit and Delete buttons */}
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </form>
                </div>
                {/* Section to display purchases by the customer */}
                <div className="col-8">
                    <PurchaseByCustomer id={customerId} product={"all"}/>
                </div>
            </div>
        </div>
    );
}