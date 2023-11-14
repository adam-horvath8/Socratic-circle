import { auth } from "@/config/firebase";
import { useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Outlet } from "react-router-dom";
import { oneEssayType } from "@/types/types";

import useUpdateEssaysState from "@/lib/useUpdateEssaysState";
import { useEffect, useState } from "react";

export interface IMyEssaysProps {}

export default function MyEssays(props: IMyEssaysProps) {
  const getEssaysData = useUpdateEssaysState();
  const [numberOfEssaysDisplayed, setNumberOfEssaysDisplayed] =
    useState<number>(1);

  useEffect(() => {
    getEssaysData(numberOfEssaysDisplayed);
  }, [numberOfEssaysDisplayed]);

  useEffect(() => {
    getEssaysData(numberOfEssaysDisplayed);
  }, []);

  const essaysData = useSelector((state: any) => state.essaysData);

  const filteredEssaysData = essaysData.filter(
    (data: oneEssayType) => data.author.id === auth.currentUser?.uid
  );

  console.log(filteredEssaysData);

  return (
    <div>
      <Outlet />
      <div className="p-10 flex flex-col gap-5">
        {filteredEssaysData.map((essay: oneEssayType) => (
          <EssayCard key={essay.id} essay={essay} />
        ))}
      </div>
      <button onClick={() => setNumberOfEssaysDisplayed((prev) => prev + 1)}>
        More Essays...
      </button>
    </div>
  );
}
