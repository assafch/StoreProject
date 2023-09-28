import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, query, collection, deleteDoc, where } from 'firebase/firestore'; // Added where import here
import db from '../firebase'; // make sure to import your firebase instance
import PurchaseByCustomer from "./PurchaseByCustomer";

export default function EditCustomer() {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState({});

    useEffect(() => {
        getCustomerData();
    }, []);

    async function getCustomerData() {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCustomer({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.log("No such document!");
        }
    }

    const handleChange = (e) => {
        const { name, value} = e.target;
        setCustomer({...customer, [name]: value});
    }

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

    return (
        <div className="container">
            <div className="row">
                <div className="col-4 border border-primary rounded p-2">
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button> {/* Changed type to button */}
                    </form>
                </div>
                <div className="col-8">
                    <PurchaseByCustomer id={customerId} product={"all"}/>
                </div>
            </div>
        </div>
    );
}
