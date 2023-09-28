// Importing the necessary modules and components from React, React Router, and Firebase
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, query, getDocs, collection, where } from 'firebase/firestore';
import PurchaseByProduct from "./PurchaseByProduct";
import db from '../firebase';

// Main function component for editing product details
export default function EditProduct() {
    // Retrieve the productId from the URL parameters
    const { productId } = useParams();

    // Initialize state variables
    const [product, setProduct] = useState({
        name: '',
        price: '',
        quantity: ''
    });

    // Run an effect to fetch product data when the component mounts
    useEffect(() => {
        getProductData();
    }, []);

    // Asynchronous function to fetch product data from Firestore
    async function getProductData() {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.log("No such document!");
        }
    }

    // Handle changes in the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    }

    // Asynchronous function to handle form submission and update Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        const docRef = doc(db, "products", productId);
        await updateDoc(docRef, {
            name: product.name,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity)
        });
        alert("Product updated successfully!");
    }

    // Asynchronous function to handle product deletion
    const handleDelete = async () => {
        const docRefPurchases = query(collection(db, "purchases"), where("ProductID", "==", productId));
        const querySnapshotPurchases = await getDocs(docRefPurchases);
        querySnapshotPurchases.forEach((doc) => {
            deleteDoc(doc.ref);
        });
        const docRef = doc(db, "products", productId);
        await deleteDoc(docRef);
        alert("Product deleted successfully!");
        // Optionally add code to redirect the user or update the UI
    }

    // JSX for rendering the form to edit product details
    return (
        <div className="container">
            <div className="row">
                <div className="col-4 border border-primary rounded p-2">
                    <form onSubmit={handleSubmit}>
                        {/* Input fields for product details */}
                        <div className="mb-3">
                            <label className="form-label">Product name</label>
                            <input type="text" name="name" className="form-control" value={product.name} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input type="number" name="price" className="form-control" value={product.price} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Quantity</label>
                            <input type="number" name="quantity" className="form-control" value={product.quantity} onChange={handleChange} />
                        </div>
                        {/* Buttons for form submission and deletion */}
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </form>
                </div>
                {/* Section to display purchases related to this product */}
                <div className="col-8">
                    <PurchaseByProduct id={productId} />
                </div>
            </div>
        </div>
    );
}
