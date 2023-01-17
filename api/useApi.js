import {
  collection,
  orderBy,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useApi = (options = {}) => {
  const { type, name, realTime, queryFilter } = options;

  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe;

    const request = async () => {
      try {
        // Real time listeners
        if (realTime) {
          // one document
          // multiple documents
          if (type === "documents") {
            if (queryFilter) {
              unsubscribe = onSnapshot(
                query(
                  collection(db, name),
                  where(...queryFilter),
                  orderBy("timestamp", "desc")
                ),
                (snapshot) => {
                  const queryData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setData(queryData);
                }
              );
            } else {
              unsubscribe = onSnapshot(
                query(collection(db, name)),
                (snapshot) => {
                  const queryData = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                  }));
                  setData(queryData);
                }
              );
            }
          } else if (type === "document") {
          }
        }
        // One time fetching
        else {
        }
      } catch (error) {
        setError(error);
      }
    };
    request();

    return () => unsubscribe();
  }, []);

  return {
    data,
    error,
    loading,
    setData,
  };
};

export default useApi;
