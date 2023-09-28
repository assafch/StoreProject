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

export default function AddProduct() {

    const { customerId } = useParams();
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const [products, setproducts] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [purchase, setPurchase] = useState({
        CustomerID: "", 
        Date: "",
        ProductID: ""
    })

    useEffect(() => {
        getAllProducts();
        getCustomerName(customerId);
    }, []);

    const getAllProducts = () => {
        const docRefProducts = query(collection(db, "products"));
        onSnapshot(docRefProducts, (querySnapshot) => {
            setproducts(
                querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
        });
    };

    async function getCustomerName(customerId) {
        const docRef = doc(db, "customers", customerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setCustomerName(docSnap.data().firstName + " " + docSnap.data().lastName);
        } else {
            console.error("No such customer!");
            
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(purchase);
        await addDoc(collection(db, 'purchases'), purchase);
        console.log(e);
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-8 border border-primary rounded">
                    <form onSubmit={handleSubmit} className="m-3">
                        <div className="mb-3">
                            <label className="form-label">Customer Name</label>
                            <input type="text" className="form-control" id="customerName" defaultValue={customerName} disabled />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Purchase Date</label>
                            <input type="date" className="form-control" id="purchaseDate" defaultValue={formattedDate} disabled />
                        </div>
                        <div className="mb-3">
                            <select className="form-select" onChange={(e) => setPurchase({...purchase, ProductID: e.target.value ,Date: today, CustomerID: customerId})}>
                                <option defaultValue>Select product to purchase</option>
                                {products.map((pro) => (
                                    <option key={pro.id} value={pro.id}>{pro.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
}