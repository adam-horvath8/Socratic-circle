import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { essaysDataType, oneEssayType } from "@/types/types";

// import components
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
import { Button, buttonVariants } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { removeData } from "@/features/essaysData";
import { useToast } from "@/components/ui/use-toast";

export default function EssayFull() {
  const essaysData: essaysDataType = useSelector(
    (state: any): essaysDataType => state.essaysData
  );

  const isAuth = useSelector((state: any) => state.authState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const essayDoc = doc(db, "essays", id);
    try {
      navigate(-1);
      await deleteDoc(essayDoc);
      dispatch(removeData(id));
      toast({
        title: "Your Essay has been Deleted succesfully",
      });
    } catch (error) {
      console.error("Error deleting essay:", error);
    }
  };

  const selectedEssay: oneEssayType = essaysData.filter(
    (data) => data.id === id
  )[0];

  const handleCloseEssay = () => {
    navigate(-1);
  };

  console.log(selectedEssay);

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{selectedEssay.title}</CardTitle>
            <Badge variant="secondary">{selectedEssay.cathegory}</Badge>
          </div>
          <CardDescription>{selectedEssay.mainQuestion}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>More details...</AccordionTrigger>
              <AccordionContent>
                <h2>Main Problem</h2>
                <p>{selectedEssay.mainIssue}</p>
                <h2>Thesis</h2>
                <p>{selectedEssay.thesis}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <h2>Introduction</h2>
          <p>{selectedEssay.introduction}</p>
          <h2>Body</h2>
          {selectedEssay.body.map((chapter) => (
            <div key={chapter.chapterId}>
              <h3>{chapter.chapterTitle}</h3>
              {chapter.chapterParagraphs.map((par) => (
                <p key={par.id}>{par.text}</p>
              ))}
            </div>
          ))}
          <h2>Conslusion</h2>
          <p>{selectedEssay.conclusion}</p>
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between">
            <div className="flex">
              <Button onClick={handleCloseEssay}>
                <span className="material-symbols-outlined">exit_to_app</span>
                Close
              </Button>
              {isAuth && selectedEssay.author.id === auth.currentUser?.uid && (
                <div>
                  <Button
                    variant={"outline"}
                    onClick={() => handleDelete(selectedEssay.id)}
                  >
                    <span className="material-symbols-outlined">
                      delete_sweep
                    </span>
                    Delete
                  </Button>
                  <Link
                    to={`/home/create-essay/${id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <span className="material-symbols-outlined">edit</span>
                    Edit
                  </Link>
                </div>
              )}
            </div>

            <Badge variant="outline">@{selectedEssay.author.name}</Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
