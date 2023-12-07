import { DetailAccordion } from "../../components/DetailAccordion";
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

import { Button, buttonVariants } from "@/components/ui/button";
import { deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { removeData } from "@/redux/features/essaysData";
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

  const selectedEssay: oneEssayType | undefined = essaysData.find(
    (data) => data.id === id
  );
  if (!selectedEssay) {
    navigate("in/home");
  }

  const handleCloseEssay = () => {
    navigate(-1);
  };

  console.log(essaysData);

  return (
    <div>
      {selectedEssay && (
        <Card>
          <CardHeader>
            <div className="flex justify-between gap-2">
              <CardTitle>{selectedEssay.title}</CardTitle>
              <Badge variant="secondary">{selectedEssay.cathegory}</Badge>
            </div>
            <CardDescription className="text-justify">
              {selectedEssay.mainQuestion}
            </CardDescription>
          </CardHeader>
          <CardContent className="font-times">
            <DetailAccordion selectedEssay={selectedEssay} />
            <h2 className="text-3xl mb-2">Introduction</h2>
            <p className="text-justify mb-6">{selectedEssay.introduction}</p>
            {selectedEssay.body.map((chapter) => (
              <div key={chapter.chapterId}>
                <h3 className="text-3xl mb-2">{chapter.chapterTitle}</h3>
                {chapter.chapterParagraphs.map((par) => (
                  <p className="text-justify mb-6" key={par.id}>
                    {par.text}
                  </p>
                ))}
              </div>
            ))}
            <h2 className="text-3xl mb-2 ">Conslusion</h2>
            <p className="text-justify">{selectedEssay.conclusion}</p>
          </CardContent>
          <CardFooter>
            <div className=" flex flex-col w-full gap-2 sm:justify-between sm:flex-row">
              <Button
                onClick={handleCloseEssay}
                className="flex justify-center"
              >
                <span className="material-symbols-outlined">exit_to_app</span>
                Close
              </Button>
              {isAuth && selectedEssay.author.id === auth.currentUser?.uid && (
                <div className="flex justify-between sm: gap-2">
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
                    to={`/in/create-essay/${id}`}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    <span className="material-symbols-outlined">edit</span>
                    Edit
                  </Link>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
