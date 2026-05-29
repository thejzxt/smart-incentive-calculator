import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

export function useFirestoreCollection(collectionName, defaultValue) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        if (!active) return;

        if (querySnapshot.empty && defaultValue) {
          const promises = defaultValue.map(async (item) => {
            const docId = item.id || `doc-${Date.now()}-${Math.random()}`;
            const itemDoc = doc(db, collectionName, docId);
            await setDoc(itemDoc, item);
          });
          await Promise.all(promises);
          if (active) {
            setData(defaultValue);
          }
        } else {
          const list = [];
          querySnapshot.forEach((doc) => {
            list.push({ ...doc.data(), id: doc.id });
          });
          if (active) {
            setData(list);
          }
        }
      } catch (error) {
        console.warn(`Error reading Firestore collection "${collectionName}":`, error);
        if (active) {
          setData(defaultValue || []);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [collectionName]);

  const updateData = async (newData) => {
    setData(newData);

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const existingIds = querySnapshot.docs.map((doc) => doc.id);
      const newIds = newData.map((item) => item.id);

      const deletePromises = existingIds
        .filter((id) => !newIds.includes(id))
        .map((id) => deleteDoc(doc(db, collectionName, id)));

      const upsertPromises = newData.map((item) => {
        const docId = item.id;
        return setDoc(doc(db, collectionName, docId), item);
      });

      await Promise.all([...deletePromises, ...upsertPromises]);
    } catch (error) {
      console.warn(`Error writing to Firestore collection "${collectionName}":`, error);
    }
  };

  return [data, updateData, loading];
}
