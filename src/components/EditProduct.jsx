import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, query, getDocs, collection, where } from 'firebase/firestore';
import PurchaseByProduct from "./PurchaseByProduct";
import db from '../firebase'; // make sure to import your firebase instance

export default function EditProduct() {
    const { productId } = useParams();
    const [product, setProduct] = useState({
        name: '',
        price: '',
        quantity: ''
    });

    useEffect(() => {
        getProductData();
    }, []);

    async function getProductData() {
        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
            console.log("No such document!");
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    }

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

    const handleDelete = async () => {
        const docRefPurchases = query(collection(db, "purchases"), where("ProductID", "==", productId));
        const querySnapshotPurchases = await getDocs(docRefPurchases);
        querySnapshotPurchases.forEach((doc) => {
            deleteDoc(doc.ref);
        })
        const docRef = doc(db, "products", productId);
        await deleteDoc(docRef);
        alert("Product deleted successfully!");
        // Optionally, you can redirect the user to another page or update the UI to reflect the deletion
    }

    return (
        <div className="container">
            <div className="row">
            <div className="col-4 border border-primary rounded p-2">
                    <form onSubmit={handleSubmit}>
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
                        <button type="submit" className="btn btn-primary me-2">Submit</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </form>
                </div>
                <div className="col-8">
                    <PurchaseByProduct id={productId} />
                </div>
            </div>
        </div>
    );
}
