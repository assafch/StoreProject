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

export default function Products() {
    const [products, setproducts] = useState([]);

    useEffect(() => {
        getAll();
    }, []);

    const getAll = () => {
        const docRef = query(collection(db, "products"));
        onSnapshot(docRef, (querySnapshot) => {
            setproducts(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
    };


    return (
        <div className="container">
            <div className="row">
                <div className="col-4 border border-primary rounded d-flex align-items-center justify-content-center">
                    <NumberOfPuraches />
                </div>
                <div className="col-8">
                    <div className="list-group">
                        {products.map((pro) => (
                            <div key={pro.id} href="#" className="list-group-item list-group-item-action">
                                <div className="d-flex w-100 justify-content-between">
                                    <Link to={`/product/${pro.id}`} className="mb-1">{pro.name}</Link>
                                    <h5 className="mb-1">{pro.price}$</h5>
                                    <h5 className="mb-1">{pro.quantity} units</h5>
                                </div>
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