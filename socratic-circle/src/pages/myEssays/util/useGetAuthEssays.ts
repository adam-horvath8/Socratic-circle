import { auth, db } from "@/config/firebase";
import { authPromise } from "@/lib/authPromise";
import { addData } from "@/redux/features/essaysData";
import { essaysDataType } from "@/types/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useHandleSearch from "./useHandleSearch";

const useGetAuthEssays = () => {
  const [loading, setLoading] = useState(true);
  const [emptyData, setEmptyData] = useState(false);

  const { setOriginalEssays } = useHandleSearch();

  const essaysCollectionRef = collection(db, "essays");
  const dispatch = useDispatch();

  const getAuthEssays = async () => {
    try {
      await authPromise;

      const q = query(
        essaysCollectionRef,
        where("author.id", "==", auth.currentUser?.uid)
      );
      const data = await getDocs(q);

      if (data.empty) {
        setEmptyData(true);
      }
      const essays = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as essaysDataType;
      dispatch(addData(essays));
      setOriginalEssays(essays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthEssays();
  }, []);

  return { loading, emptyData };
};

export default useGetAuthEssays;
