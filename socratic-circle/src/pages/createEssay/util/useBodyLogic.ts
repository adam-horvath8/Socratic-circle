import { bodyStateType, chapterType } from "@/types/types";
import { useState } from "react";
import { defaultBody } from "../CreateEssay";
import { v4 as uuidv4 } from "uuid";

export default function useBodyLogic() {
  const [body, setBody] = useState<bodyStateType>(defaultBody);

  const handleAddParagraph = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    chapterId: string
  ) => {
    e.preventDefault();

    setBody((prevBody) => {
      const updatedBody = prevBody.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          return {
            ...chapter,
            chapterParagraphs: [
              ...chapter.chapterParagraphs,
              { id: uuidv4(), text: "" },
            ],
          };
        }
        return chapter;
      });

      return updatedBody;
    });
  };

  const handleParagraphChange = (
    chapterId: string,
    paragraphId: string,
    text: string
  ) => {
    setBody((prevBody) => {
      const updatedBody = [...prevBody];
      const chapterToUpdate = updatedBody.find(
        (chapter) => chapter.chapterId === chapterId
      );

      if (chapterToUpdate) {
        const paragraphToUpdate = chapterToUpdate.chapterParagraphs.find(
          (par) => par.id === paragraphId
        );

        if (paragraphToUpdate) {
          paragraphToUpdate.text = text;
        }
      }

      return updatedBody;
    });
  };

  const handleDeletePar = (chapterId: string, parId: string) => {
    setBody((prev): chapterType[] => {
      const updatedBody = prev.map((chapter) => {
        if (chapter.chapterId === chapterId) {
          const filteredParagraphs = chapter.chapterParagraphs.filter(
            (par) => par.id !== parId
          );
          return {
            ...chapter,
            chapterParagraphs: filteredParagraphs,
          };
        }
        return chapter;
      });
      return updatedBody;
    });
  };

  const handleAddChapter = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setBody((prevBody) => [
      ...prevBody,
      {
        chapterId: uuidv4(),
        chapterTitle: "",
        chapterParagraphs: [{ id: uuidv4(), text: "" }],
      },
    ]);
  };

  const handleDeleteChapter = (id: string) => {
    const filteredBodyChapters = body.filter(
      (chapter) => chapter.chapterId !== id
    );
    if (body.length > 1) {
      setBody(filteredBodyChapters);
    }
  };

  const handleChapterChange = (chapterId: string, text: string) => {
    setBody((prevBody) => {
      const updatedBody = [...prevBody];
      const chapterToUpdate = updatedBody.find(
        (chapter) => chapter.chapterId === chapterId
      );
      if (chapterToUpdate) {
        chapterToUpdate.chapterTitle = text;
      }
      return updatedBody;
    });
  };

  return {
    body,
    setBody,
    handleAddParagraph,
    handleParagraphChange,
    handleDeletePar,
    handleAddChapter,
    handleDeleteChapter,
    handleChapterChange,
  };
}
