import { auth } from "@/config/firebase";
import { useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Outlet } from "react-router-dom";
import { oneEssayType } from "@/types/types";

export interface IMyEssaysProps {}

export default function MyEssays(props: IMyEssaysProps) {
  const essaysData = useSelector((state: any) => state.essaysData);

  const filteredEssaysData = essaysData.filter(
    (data: oneEssayType) => data.author.id === auth.currentUser?.uid
  );

  console.log(filteredEssaysData);

  return (
    <>
      <Outlet />
      <div className="p-10 flex flex-col gap-5">
        {filteredEssaysData.map((essay: oneEssayType) => (
          <EssayCard key={essay.id} essay={essay} />
        ))}
      </div>
    </>
  );
}
