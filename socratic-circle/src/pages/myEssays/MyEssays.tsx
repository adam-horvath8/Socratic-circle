import { auth, db } from "@/config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Outlet } from "react-router-dom";
import { essaysDataType, oneEssayType } from "@/types/types";

import useUpdateEssaysState from "@/lib/useUpdateEssaysState";
import { useEffect, useState } from "react";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { addData } from "@/features/essaysData";

export interface IMyEssaysProps {}

export default function MyEssays(props: IMyEssaysProps) {
  const [currentUserEssays, setCurrentUserEssays] = useState([]);
  // const getEssaysData = useUpdateEssaysState();
  // const [numberOfEssaysDisplayed, setNumberOfEssaysDisplayed] =
  //   useState<number>(10);

  // useEffect(() => {
  //   getEssaysData(numberOfEssaysDisplayed);
  // }, [numberOfEssaysDisplayed]);

  // useEffect(() => {
  //   getEssaysData(numberOfEssaysDisplayed);
  // }, []);

  // const filteredEssaysData = essaysData.filter(
  //   (data: oneEssayType) => data.author.id === auth.currentUser?.uid
  // );

  // console.log(filteredEssaysData);
  const essaysCollectionRef = collection(db, "essays");
  const dispatch = useDispatch();

  useEffect(() => {
    const getAuthEssays = async () => {
      try {
        const user = auth.currentUser;
        if (user && user.uid) {
          const q = query(
            essaysCollectionRef,
            where("author.id", "==", auth.currentUser?.uid)
          );
          const data = await getDocs(q);
          dispatch(
            addData(
              data.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              })) as essaysDataType
            )
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    getAuthEssays();
  }, []);

  const essaysData = useSelector((state: any) => state.essaysData);
  console.log(essaysData);

  return (
    <div>
      <Outlet />
      <div className="p-10 flex flex-col gap-5">
        {essaysData.map((essay: oneEssayType) => (
          <EssayCard key={essay.id} essay={essay} />
        ))}
      </div>
    </div>
  );
}
