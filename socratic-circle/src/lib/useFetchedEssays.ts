import { db } from "@/config/firebase";
import { addData } from "@/features/essaysData";
import { essaysDataType } from "@/types/types";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useFetchedEssays = () => {
  const dispatch = useDispatch();
  const essaysCollectionRef = collection(db, "essays");

  useEffect(() => {
    const getEssays = async () => {
      try {
        const data = await getDocs(essaysCollectionRef);
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
      }
    };
    getEssays();
  }, []);
};

export default useFetchedEssays;
