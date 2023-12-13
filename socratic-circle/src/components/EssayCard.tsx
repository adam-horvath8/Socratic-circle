import { Comments } from "./Comments";
// import componenets
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { oneEssayType } from "@/types/types";
import scrollToTop from "@/lib/scrollToTop";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import ProfileContainer from "../pages/profil/components/ProfileContainer";
import { useEffect, useState } from "react";
import { DetailAccordion } from "./DetailAccordion";
import { useDispatch, useSelector } from "react-redux";
import { updateData } from "@/redux/features/essaysData";

interface IEssayCard {
  essay: oneEssayType;
}

export function EssayCard({ essay }: IEssayCard) {
  const essayDocRef = doc(db, "essays", essay.id);
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const essaysData = useSelector((state: any) => state.essaysData);
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    // This will run whenever essaysData changes
    const result = essaysData
      .find((item: oneEssayType) => item.id === essay.id)
      .likes.includes(userId);

    setIsLiked(result);
  }, [essaysData]);

  const handleLikes = async () => {
    try {
      // Fetch the current essay document
      const essayDoc = await getDoc(essayDocRef);
      if (essayDoc.exists()) {
        const essayData = essayDoc.data();

        if (essayData.likes.includes(userId)) {
          // If userId is in the array, remove it
          const updatedLikes: string[] = essayData.likes.filter(
            (id: string) => id !== userId
          );

          await updateDoc(essayDocRef, { likes: updatedLikes });

          // Correct usage
          dispatch(updateData({ id: essay.id, likes: updatedLikes }));
        } else {
          // If userId is not in the array, add it
          const updatedLikes: string[] = [...essayData.likes, userId];

          await updateDoc(essayDocRef, { likes: updatedLikes });

          // Correct usage
          dispatch(updateData({ id: essay.id, likes: updatedLikes }));
        }
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <Card key={essay.id}>
      <CardHeader>
        <div className="flex justify-between gap-2">
          <CardTitle>{essay.title}</CardTitle>
          <Badge variant="secondary">{essay.cathegory}</Badge>
        </div>
        <CardDescription className="text-justify">
          {essay.mainQuestion}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DetailAccordion selectedEssay={essay} />
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full flex flex-col justify-between gap-2 items-center mb-4 sm:flex-row">
          <Link
            onClick={scrollToTop}
            to={`/in/${essay.id}`}
            className="w-full sm:w-auto"
          >
            <Button variant="secondary" className="w-full flex justify-center">
              <span className="material-symbols-outlined">open_in_new</span>
              Open
            </Button>
          </Link>
          <div className="w-full flex items-center justify-between gap-2 sm:justify-end">
            <Dialog>
              <DialogTrigger>
                <Button
                  variant="outline"
                  className="hover:text-orange-600 underline text-sm text-clip"
                >
                  @{essay.author.name}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-screen  overflow-auto">
                <ProfileContainer id={essay.author.id} />
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleLikes}
              variant="outline"
              className="flex border-2 rounded-md"
            >
              <span
                className="material-symbols-outlined hover:text-orange-600"
                style={{
                  fontVariationSettings: isLiked
                    ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                    : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  color: isLiked ? "#EA580C" : "",
                }}
              >
                thumb_up
              </span>

              {essay.likes.length}
            </Button>
          </div>
        </div>
        <Comments id={essay.id} />
      </CardFooter>
    </Card>
  );
}
