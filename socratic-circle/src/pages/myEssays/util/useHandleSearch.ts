import { addData } from "@/redux/features/essaysData";
import { essaysDataType, oneEssayType } from "@/types/types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useHandleSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all-categories");
  const [originalEssays, setOriginalEssays] = useState<essaysDataType>([]);


  const dispatch = useDispatch();


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

  return { setCategory, setSearchTerm, setOriginalEssays };
};

export default useHandleSearch;
