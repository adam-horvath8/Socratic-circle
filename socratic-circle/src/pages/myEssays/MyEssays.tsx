import { useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Link, Outlet } from "react-router-dom";
import { oneEssayType } from "@/types/types";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import useHandleSearch from "./util/useHandleSearch";
import useGetAuthEssays from "./util/useGetAuthEssays";
import signInToast from "@/lib/signInToast";

export default function MyEssays() {
  const essaysData = useSelector((state: any) => state.essaysData);

  const { setCategory, setSearchTerm } = useHandleSearch();

  const { loading, emptyData } = useGetAuthEssays();

  signInToast()

  return (
    <div className="flex flex-col gap-5">
      {loading ? (
        <div className="flex flex-col items-center gap-5 mt-5">
          <Skeleton className="w-full h-[300px] " />
          <Skeleton className="w-full h-[300px] " />
          <Skeleton className="w-full h-[300px] " />
        </div>
      ) : emptyData ? (
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-2xl">No Essays created by you</h2>
          <Link className={buttonVariants() + "flex-1"} to="/in/create-essay">
            Create Essay
          </Link>
        </div>
      ) : (
        <>
          <Outlet />
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="Search for Author or Term you are looking for..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-categories">All Categories</SelectItem>
                <SelectItem value="Aesthetics">Aesthetics</SelectItem>
                <SelectItem value="Epistemology">Epistemology</SelectItem>
                <SelectItem value="Ethics">Ethics</SelectItem>
                <SelectItem value="Logic">Logic</SelectItem>
                <SelectItem value="Metaphysics">Metaphysics</SelectItem>
                <SelectItem value="Political Philosophy">
                  Political Philosophy
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-5">
            {essaysData.map((essay: oneEssayType) => (
              <EssayCard key={essay.id} essay={essay} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
