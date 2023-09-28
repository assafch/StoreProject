import { query, collection, where, getDocs } from "firebase/firestore";
import db from "../firebase";

export async function getPurchasesByProductId(productId) {
  const qPurchases = query(
    collection(db, "purchases"),
    where("ProductID", "==", productId)
  );
  const querySnapshot = await getDocs(qPurchases);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}