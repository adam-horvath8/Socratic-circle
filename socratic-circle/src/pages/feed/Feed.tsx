import { EssayCard } from "../../components/EssayCard";
import { useSelector } from "react-redux";
import { essaysDataType } from "@/types/types";
import useUpdateEssaysState from "@/lib/useUpdateEssaysState";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

// components import

export interface IFeedProps {}

export default function Feed(props: IFeedProps) {
  const [numberOfEssaysDisplayed, setNumberOfEssaysDisplayed] =
    useState<number>(10);

  const getEssaysData = useUpdateEssaysState();

  useEffect(() => {
    getEssaysData(numberOfEssaysDisplayed);
  }, [numberOfEssaysDisplayed]);

  useEffect(() => {
    getEssaysData(numberOfEssaysDisplayed);
  }, []);

  const essaysData: essaysDataType = useSelector(
    (state: any) => state.essaysData
  );
  console.log(essaysData);

  return (
    <div className="p-10 flex flex-col gap-5">
      <Input type="search" />
      {essaysData.map((essay) => (
        <EssayCard key={essay.id} essay={essay} />
      ))}
      <button onClick={() => setNumberOfEssaysDisplayed((prev) => prev + 10)}>
        More Essays...
      </button>
    </div>
  );
}
