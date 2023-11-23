import { auth, db } from "@/config/firebase";
import { useDispatch, useSelector } from "react-redux";
import { EssayCard } from "@/components/EssayCard";
import { Outlet } from "react-router-dom";
import { essaysDataType, oneEssayType } from "@/types/types";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { addData } from "@/features/essaysData";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authPromise } from "@/lib/authPromise";
import { Skeleton } from "@/components/ui/skeleton";

export default function MyEssays() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all-categories");
  const [originalEssays, setOriginalEssays] = useState<essaysDataType>([]);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(true);

  const essaysCollectionRef = collection(db, "essays");
  const essaysData = useSelector((state: any) => state.essaysData);
  const dispatch = useDispatch();

  const getAuthEssays = async () => {
    try {
      await authPromise;

      const q = query(
        essaysCollectionRef,
        where("author.id", "==", auth.currentUser?.uid)
      );
      const data = await getDocs(q);

      if (data.empty) {
        setError("Error: Could not get the data");
      }
      const essays = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as essaysDataType;
      dispatch(addData(essays));
      setOriginalEssays(essays);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthEssays();
  }, []);

  const handleSearch = (dataToSearch: essaysDataType) => {
    const searchedData: essaysDataType = dataToSearch.filter(
      (essay: oneEssayType) => {
        // Check if the essay's category matches the selected category
        const isCategoryMatch =
          category === "all-categories" || essay.cathegory === category;

        // Check for search term match only if the category matches
        if (isCategoryMatch) {
          const values = Object.values(essay).map((value) =>
            typeof value === "string" ? value.toLowerCase() : value
          );

          const includesSearchTerm = values.some(
            (value) =>
              typeof value === "string" &&
              value.includes(searchTerm.toLowerCase())
          );
          const paragraphs = essay.body.flatMap((chapter) =>
            chapter.chapterParagraphs.map((paragraph) =>
              paragraph.text.toLowerCase()
            )
          );
          const includesInParagraphs = paragraphs.some((paragraph) =>
            paragraph.includes(searchTerm.toLowerCase())
          );
          const chapters = essay.body.map((chapter) =>
            chapter.chapterTitle.toLocaleLowerCase()
          );
          const includesInChapters = chapters.some((chapter) =>
            chapter.includes(searchTerm.toLowerCase())
          );

          const findAuthor = essay.author.name
            .toLocaleLowerCase()
            .includes(searchTerm.toLocaleLowerCase());

          return (
            includesSearchTerm ||
            includesInChapters ||
            includesInParagraphs ||
            findAuthor
          );
        }

        return false;
      }
    );

    dispatch(addData(searchedData));
  };

  useEffect(() => {
    if (searchTerm.length > 2 || category !== "all-categories") {
      handleSearch(originalEssays);
    } else if (searchTerm.length === 0) {
      dispatch(addData(originalEssays));
    }
  }, [searchTerm, category]);

  console.log(essaysData);

  return (
    <div className="flex flex-col gap-5">
      {loading ? (
        <div className="flex flex-col items-center gap-5 mt-5">
          <Skeleton className="w-full h-[300px] " />
          <Skeleton className="w-full h-[300px] " />
          <Skeleton className="w-full h-[300px] " />
        </div>
      ) : error ? (
        <span className="text-3xl">{error}</span>
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
