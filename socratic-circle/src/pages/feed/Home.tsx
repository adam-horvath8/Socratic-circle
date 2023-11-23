import { SearchBar } from "../../components/SearchBar";
import { EssayCard } from "../../components/EssayCard";
import { useSelector } from "react-redux";
import { essaysDataType } from "@/types/types";
import useUpdateEssaysState from "@/lib/useUpdateEssaysState";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// components import

export default function Home() {
  const [numberOfEssaysDisplayed, setNumberOfEssaysDisplayed] =
    useState<number>(10);

  const [displayMoreEssaysBtn, setDisplayMoreEssaysBtn] = useState(true);

  const { getEssays, loading, error } = useUpdateEssaysState();

  const essaysData: essaysDataType = useSelector(
    (state: any) => state.essaysData
  );

  useEffect(() => {
    getEssays(numberOfEssaysDisplayed);
  }, [numberOfEssaysDisplayed]);

  useEffect(() => {
    getEssays(numberOfEssaysDisplayed);
  }, []);

  console.log(error);

  console.log(essaysData);
  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center gap-5">
          <Skeleton className="w-[1000px] h-[300px] " />
          <Skeleton className="w-[1000px] h-[300px] " />
          <Skeleton className="w-[1000px] h-[300px] " />
        </div>
      ) : error ? (
        <span className="text-3xl">{error}</span>
      ) : (
        <div className=" flex flex-col gap-5">
          <SearchBar
            numberOfEssaysDisplayed={numberOfEssaysDisplayed}
            setDisplayMoreEssaysBtn={setDisplayMoreEssaysBtn}
          />
          {essaysData.map((essay) => (
            <EssayCard key={essay.id} essay={essay} />
          ))}
          {displayMoreEssaysBtn && (
            <button
              onClick={() => setNumberOfEssaysDisplayed((prev) => prev + 10)}
            >
              More Essays...
            </button>
          )}
        </div>
      )}
    </>
  );
}
