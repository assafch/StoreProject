// Import required modules and components from React and Firebase
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from "firebase/firestore";
import db from "../firebase";

// Main function component for displaying the number of purchases
export default function NumberOfPuraches() {
    // Initialize state variable for storing the purchase count
    const [purchaseCount, setPurchaseCount] = useState(0);

    // Set up an effect to listen for changes in the 'purchases' collection in Firestore
    useEffect(() => {
        // Create a reference to the 'purchases' collection
        const purchasesRef = collection(db, "purchases");

        // Set up a real-time listener for the collection
        const unsubscribe = onSnapshot(purchasesRef, (snapshot) => {
            // Update the purchase count with the size of the snapshot (number of documents)
            setPurchaseCount(snapshot.size);
        });

        // Clean up the real-time listener when the component unmounts
        return () => unsubscribe();

    }, []); // Empty dependency array ensures that the effect runs only once when the component mounts

    // JSX for rendering the purchase count
    return (
        <>
            <h3>Number of Purchases: {purchaseCount}</h3>
        </>
    );
}
