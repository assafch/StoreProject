// Import necessary modules and components from React, React Router, and Firebase
import { useState, useEffect, React } from "react";
import { Link } from "react-router-dom";
import {
    query,
    collection,
    onSnapshot,
} from "firebase/firestore";
import db from "../firebase";
import PurchaseByProduct from "./PurchaseByProduct";
import NumberOfPuraches from "./NumberOfPuraches";

// Main function component for displaying products
export default function Products() {
    // Initialize state variable to store products
    const [products, setproducts] = useState([]);

    // Run effect to fetch all products when the component mounts
    useEffect(() => {
        getAll();
    }, []);

    // Function to fetch all products from the 'products' collection in Firestore
    const getAll = () => {
        const docRef = query(collection(db, "products"));
        onSnapshot(docRef, (querySnapshot) => {
            setproducts(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
    };

    // JSX for rendering the list of products and number of purchases
    return (
        <div className="container">
            <div className="row">
                <div className="col-4 border border-primary rounded d-flex align-items-center justify-content-center">
                    {/* Component to display the number of purchases */}
                    <NumberOfPuraches />
                </div>
                <div className="col-8">
                    <div className="list-group">
                        {/* Iterate through the list of products */}
                        {products.map((pro) => (
                            <div key={pro.id} href="#" className="list-group-item list-group-item-action">
                                <div className="d-flex w-100 justify-content-between">
                                    {/* Link to individual product page */}
                                    <Link to={`/product/${pro.id}`} className="mb-1">{pro.name}</Link>
                                    {/* Display product price and quantity */}
                                    <h5 className="mb-1">{pro.price}$</h5>
                                    <h5 className="mb-1">{pro.quantity} units</h5>
                                </div>
                                {/* Component to display purchases by product */}
                                <div className="border border-primary rounded">
                                    <PurchaseByProduct id={pro.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
