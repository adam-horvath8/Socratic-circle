import { EssayCard } from "../../components/EssayCard";
import { useSelector } from "react-redux";
import { essaysDataType } from "@/types/types";
import useFetchedEssays from "@/lib/useFetchedEssays";

// components import

export interface IFeedProps {}

export default function Feed(props: IFeedProps) {
  useFetchedEssays();


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
