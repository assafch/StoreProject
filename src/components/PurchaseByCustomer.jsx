import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  query,
  collection,
  where,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import db from "../firebase";

export default function PurchaseByCustomer(props) {
  const [purchases, setPurchases] = useState([]); // Store purchases
  const [productNames, setProductNames] = useState({}); // Store product names by their IDs

  useEffect(() => {
    getPurchasesByCustomerId();
  }, []);

  useEffect(() => {
    // Fetch products names when purchases are updated
    purchases.forEach(async (purchase) => {
      const name = await getProductName(purchase.ProductID);
      setProductNames((prevNames) => ({
        ...prevNames,
        [purchase.ProductID]: name,
      }));
    });
  }, [purchases]);

  async function getPurchasesByCustomerId() {
    const docRef = query(
      collection(db, "purchases"),
      where("CustomerID", "==", props.id)
    );
    const docSnap = await getDocs(docRef);
    setPurchases(docSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  async function getProductName(ProductID) {
    const docRef = doc(db, "products", ProductID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().name;
    } else {
      console.error("No such customer!");
      return "Unknown"; // Return a default value if customer not found
    }
  }

  return (
    <div>
      <ol className="list-group">
        {purchases
        .filter((purchase) => purchase.ProductID === props.product || props.product === "all")
        .filter((purchase) => {

          if (props.purchaseDate === "" || isNaN(props.purchaseDate.getTime())) {
            return true;
          }  
          const purchaseDate = new Date(purchase.Date.seconds * 1000);
          purchaseDate.setHours(0, 0, 0, 0);
          const date = new Date(props.purchaseDate);
          date.setHours(0, 0, 0, 0);
          return date.getTime() === purchaseDate.getTime();
        })
        .map((purchase) => {
          const date = new Date(purchase.Date.seconds * 1000);
          const dateString = date.toLocaleDateString();
          return (
            <li
              key={purchase.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              Product name:{" "}
              <Link
                to={`/product/${purchase.ProductID}`}
                className="mb-1 alert-link"
              >
                {productNames[purchase.ProductID] || "Loading..."}
              </Link>
              P.Date: {dateString}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
