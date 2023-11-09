export type AuthStateType = {
    authState: { value: boolean };
};

export type paragraphType = {
    id: string;
    text: string;
  };
  
export type chapterType = {
    chapterId: string;
    chapterTitle: string;
    chapterParagraphs: paragraphType[];
  };
  
export type bodyStateType = chapterType[];

export type essaysDataType = []
