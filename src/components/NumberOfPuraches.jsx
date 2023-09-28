import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";

export default function NumberOfPuraches() {
    const [purchaseCount, setPurchaseCount] = useState(0);

    useEffect(() => {
        // Reference to the 'purchases' collection
        const purchasesRef = collection(db, "purchases");

        // Set up the real-time listener
        const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
            setPurchaseCount(snapshot.size);
        });

        // Clean up the listener on component unmount
        return () => unsubscribe();

    }, []); // Empty dependency array ensures the effect runs once when the component mounts

    return (
        <>
            <h3>Number of Purchases: {purchaseCount}</h3>
        </>
    );
}
