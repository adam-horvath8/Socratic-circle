import { EssayCard } from "../../components/EssayCard";
import { db } from "@/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addData } from "@/features/essaysData";
import { essaysDataType } from "@/types/types";

// components import

export interface IFeedProps {}

export default function Feed(props: IFeedProps) {
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

  const essaysData: essaysDataType = useSelector(
    (state: any) => state.essaysData
  );
  console.log(essaysData);

  return (
    <div className="p-10 flex flex-col gap-5">
      {essaysData.map((essay) => (
        <EssayCard key={essay.id} essay={essay} />
      ))}
    </div>
  );
}
