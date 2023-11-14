import { db } from "@/config/firebase";
import { addData } from "@/features/essaysData";
import { essaysDataType } from "@/types/types";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { useDispatch } from "react-redux";

const useUpdateEssaysState = () => {
  const dispatch = useDispatch();
  const essaysCollectionRef = collection(db, "essays");

  const getEssays = async (limitNum: number) => {
    try {
      const data = await getDocs(query(essaysCollectionRef, limit(limitNum)));
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

  return getEssays;
};

export default useUpdateEssaysState;
