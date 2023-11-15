import { SearchBar } from "../../components/SearchBar";
import { EssayCard } from "../../components/EssayCard";
import { useSelector } from "react-redux";
import { essaysDataType } from "@/types/types";
import useUpdateEssaysState from "@/lib/useUpdateEssaysState";
import { useEffect, useState } from "react";

// components import

export interface IFeedProps {}

export default function Feed(props: IFeedProps) {
  const [numberOfEssaysDisplayed, setNumberOfEssaysDisplayed] =
    useState<number>(10);

  const [displayMoreEssaysBtn, setDisplayMoreEssaysBtn] = useState(true);

  const getEssaysData = useUpdateEssaysState();

  const essaysData: essaysDataType = useSelector(
    (state: any) => state.essaysData
  );

  useEffect(() => {
    getEssaysData(numberOfEssaysDisplayed);
  }, [numberOfEssaysDisplayed]);

  useEffect(() => {
    getEssaysData(numberOfEssaysDisplayed);
  }, []);

  console.log(essaysData);
  return (
    <div className="p-10 flex flex-col gap-5">
      <SearchBar
        numberOfEssaysDisplayed={numberOfEssaysDisplayed}
        setDisplayMoreEssaysBtn={setDisplayMoreEssaysBtn}
      />

      {essaysData.map((essay) => (
        <EssayCard key={essay.id} essay={essay} />
      ))}
      {displayMoreEssaysBtn && (
        <button onClick={() => setNumberOfEssaysDisplayed((prev) => prev + 10)}>
          More Essays...
        </button>
      )}
    </div>
  );
}
