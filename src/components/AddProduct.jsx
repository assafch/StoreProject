// Import necessary modules and components from React, React Router, and Firebase
import { useState, useEffect, React } from "react";
import { useParams } from "react-router-dom";
import {
    query,
    collection,
    onSnapshot,
    doc,
    getDoc,
    addDoc,
} from "firebase/firestore";
import db from "../firebase";

// Main function component for adding a product
export default function AddProduct() {

    // Use useParams to get the customerId from the URL
    const { customerId } = useParams();
    
    // Initialize today's date and format it
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Initialize state variables
    const [products, setproducts] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [purchase, setPurchase] = useState({
        CustomerID: "", 
        Date: "",
        ProductID: ""
    });

    // Run effects when the component mounts
    useEffect(() => {
        getAllProducts();
        getCustomerName(customerId);
    }, []);

    // Function to fetch all products from the "products" collection in Firestore
    const getAllProducts = () => {
        const docRefProducts = query(collection(db, "products"));
        onSnapshot(docRefProducts, (querySnapshot) => {
            setproducts(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
    };

    // Asynchronous function to get the name of a customer based on their ID
    async function getCustomerName(customerId) {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCustomerName(docSnap.data().firstName + " " + docSnap.data().lastName);
        } else {
            console.error("No such customer!");
        }
    }
    
    // Asynchronous function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(purchase);
        await addDoc(collection(db, 'purchases'), purchase);
        console.log(e);
    }

    // JSX for rendering the form
    return (
        <div className="container">
            <div className="row">
                <div className="col-8 border border-primary rounded">
                    <form onSubmit={handleSubmit} className="m-3">
                        <div className="mb-3">
                            {/* Customer Name Field */}
                            <label className="form-label">Customer Name</label>
                            <input type="text" className="form-control" id="customerName" defaultValue={customerName} disabled />
                        </div>
                        <div className="mb-3">
                            {/* Purchase Date Field */}
                            <label className="form-label">Purchase Date</label>
                            <input type="date" className="form-control" id="purchaseDate" defaultValue={formattedDate} disabled />
                        </div>
                        <div className="mb-3">
                            {/* Product Dropdown Selection */}
                            <select className="form-select" onChange={(e) => setPurchase({...purchase, ProductID: e.target.value ,Date: today, CustomerID: customerId})}>
                                <option defaultValue>Select product to purchase</option>
                                {products.map((pro) => (
                                    <option key={pro.id} value={pro.id}>{pro.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Save Button */}
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
