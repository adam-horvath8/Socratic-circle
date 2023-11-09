import { auth } from "@/config/firebase";
import { useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Outlet } from "react-router-dom";

export interface IMyEssaysProps {}

export default function MyEssays(props: IMyEssaysProps) {
  const essaysData = useSelector((state) => state.essaysData);

  const filteredEssaysData = essaysData.filter(
    (data) => data.author.id === auth.currentUser?.uid
  );

  console.log(filteredEssaysData);

  return (
    <>
      <Outlet />
      <div className="p-10 flex flex-col gap-5">
        {filteredEssaysData.map((essay) => (
          <EssayCard link="my-essays" key={essay.id} essay={essay} />
        ))}
      </div>
    </>
  );
}
