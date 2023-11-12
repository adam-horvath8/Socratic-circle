import { auth } from "@/config/firebase";
import { useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Outlet } from "react-router-dom";
import { oneEssayType } from "@/types/types";
import useFetchEssays from "@/lib/useFetchEssays";
import SearchBar from "@/components/SearchBar";

export interface IMyEssaysProps {}

export default function MyEssays(props: IMyEssaysProps) {
  useFetchEssays();
  const essaysData = useSelector((state: any) => state.essaysData);

  const filteredEssaysData = essaysData.filter(
    (data: oneEssayType) => data.author.id === auth.currentUser?.uid
  );

  return (
    <div className="p-10">
      <Outlet />
      <SearchBar />
      <div className="flex flex-col gap-5">
        {filteredEssaysData.map((essay: oneEssayType) => (
          <EssayCard key={essay.id} essay={essay} />
        ))}
      </div>
    </div>
  );
}
