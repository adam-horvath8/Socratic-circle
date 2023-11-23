import { db } from "@/config/firebase";
import { addData } from "@/features/essaysData";
import { essaysDataType } from "@/types/types";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useState } from "react";
import { useDispatch } from "react-redux";

const useUpdateEssaysState = () => {
  const dispatch = useDispatch();
  const essaysCollectionRef = collection(db, "essays");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const getEssays = async (limitNum: number) => {
    try {
      const data = await getDocs(query(essaysCollectionRef, limit(limitNum)));

      if (data.empty) {
        // Handle error when the response is not ok
        setError("Error: Could not get the data");
      }

      dispatch(
        addData(
          data.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as essaysDataType
        )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { getEssays, loading, error };
};

export default useUpdateEssaysState;
