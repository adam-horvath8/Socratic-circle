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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { oneEssayType } from "@/types/types";
import scrollToTop from "@/lib/scrollToTop";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import useUpdateEssaysState from "@/lib/useUpdateEssaysState";

interface IEssayCard {
  essay: oneEssayType;
}

export function EssayCard({ essay }: IEssayCard) {
  const essayDocRef = doc(db, "essays", essay.id);
  const updateEssaysState = useUpdateEssaysState();

  const handleLikes = async () => {
    const userId = auth.currentUser?.uid;

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
        } else {
          // If userId is not in the array, add it
          const updatedLikes: string[] = [...essayData.likes, userId];
          await updateDoc(essayDocRef, { likes: updatedLikes });
          
        }
      }
      updateEssaysState();
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <Card key={essay.id}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{essay.title}</CardTitle>
          <Badge variant="secondary">{essay.cathegory}</Badge>
        </div>
        <CardDescription>{essay.mainQuestion}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>More details...</AccordionTrigger>
            <AccordionContent>
              <h2>Main Problem</h2>
              <p>{essay.mainIssue}</p>
              <h2>Thesis</h2>
              <p>{essay.thesis}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="w-full flex justify-between">
          <Link
            onClick={scrollToTop}
            to={essay.id}
            className={buttonVariants()}
          >
            See Essay
          </Link>
          <div>
            <button onClick={handleLikes}>Like {essay.likes.length}</button>
            <Badge variant="outline">@{essay.author.name}</Badge>
          </div>
        </div>
        <Comments id={essay.id} />
      </CardFooter>
    </Card>
  );
}
