import { EssayCard } from "../../components/EssayCard";
import { useSelector } from "react-redux";
import { essaysDataType } from "@/types/types";
import useFetchEssays from "@/lib/useFetchEssays";
import SearchBar from "@/components/SearchBar";

// components import

export interface IFeedProps {}

export default function Feed(props: IFeedProps) {
  useFetchEssays();

  const essaysData: essaysDataType = useSelector(
    (state: any) => state.essaysData
  );
  console.log(essaysData);

  return (
    <div className="p-10 flex flex-col gap-5">
      <SearchBar />
      {essaysData.map((essay) => (
        <EssayCard key={essay.id} essay={essay} />
      ))}
    </div>
  );
}
