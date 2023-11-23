import { useEffect, useState } from "react";

// import components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { collection, getDocs, query, where } from "firebase/firestore";
import { essaysDataType, oneEssayType } from "@/types/types";
import { db } from "@/config/firebase";
import { addData } from "@/features/essaysData";
import useUpdateEssaysState from "@/lib/useUpdateEssaysState";

interface ISearchBar {
  numberOfEssaysDisplayed: number;
  setDisplayMoreEssaysBtn: (value: boolean) => void;
}

export function SearchBar({
  numberOfEssaysDisplayed,
  setDisplayMoreEssaysBtn,
}: ISearchBar) {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all-categories");

  const essaysCollectionRef = collection(db, "essays");

  const dispatch = useDispatch();

  const { getEssays } = useUpdateEssaysState();

  const handleSearch = async () => {
    try {
      const q = query(essaysCollectionRef, where("cathegory", "==", category));
      const data =
        category === "all-categories"
          ? await getDocs(essaysCollectionRef)
          : await getDocs(q);

      const filteredData: essaysDataType = data.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as oneEssayType))
        .filter((essay) => {
          // Convert all property values to lowercase for case-insensitive matching
          const values = Object.values(essay).map((value) =>
            typeof value === "string" ? value.toLowerCase() : value
          );

          // Check if any value includes the search term
          const includesSearchTerm = values.some(
            (value) =>
              typeof value === "string" &&
              value.includes(searchTerm.toLowerCase())
          );

          // Check if the search term is in any chapter or paragraph
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
        });

      dispatch(addData(filteredData));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (searchTerm.length > 2 || category !== "all-categories") {
      handleSearch();
      setDisplayMoreEssaysBtn(false);
    } else if (searchTerm.length === 0) {
      getEssays(numberOfEssaysDisplayed);
      setDisplayMoreEssaysBtn(true);
    }
  }, [searchTerm, category]);

  // my-essays search bar

  return (
    <div className="flex gap-4">
      <Input
        type="search"
        placeholder="Search for Author or Term you are looking for..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Select onValueChange={(value) => setCategory(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Chose Category" />
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
  );
}
