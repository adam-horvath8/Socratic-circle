import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import { Button } from "@/components/ui/button";


export interface IAppProps {}

export default function App(props: IAppProps) {
  const essaysData: essaysDataType = useSelector(
    (state: any): essaysDataType => state.essaysData
  );

  const { id } = useParams();

  const selectedEssay: oneEssayType = essaysData.filter(
    (data) => data.id === id
  )[0];

  const navigate = useNavigate();

  const handleCloseEssay = () => {
    navigate(-1);
  };

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
            <Button onClick={handleCloseEssay}>Close</Button>
            <Badge variant="outline">@{selectedEssay.author.name}</Badge>
          </div>
         
        </CardFooter>
      </Card>
    </div>
  );
}
