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

export type commentType = {
  commentId: string;
  authorName: string | null | undefined;
  comment: string;
};

export type oneEssayType = {
  id: string;
  author: { id: string; name: string };
  body: {
    chapterId: string;
    chapterParagraphs: { id: string; text: string }[];
    chapterTitle: string;
  }[];
  cathegory: string;
  conclusion: string;
  introduction: string;
  mainIssue: string;
  mainQuestion: string;
  thesis: string;
  title: string;
  comments?: commentType[];
  likes: string[];
};

export type essaysDataType = oneEssayType[];

export type ProfileDataType = {
  id?: string;
  userId: string | undefined;
  userPhoto: string | null | undefined;
  firstName: string;
  lastName: string;
  about: string;
  degree: string;
  school: string;
  currentCity: string;
  homeTown: string;
  email: string;
  mobile: string;
};
