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
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { oneEssayType } from "@/types/types";

interface IEssayCard {
  essay: oneEssayType;
}

export function EssayCard({ essay }: IEssayCard) {
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
          <Link to={essay.id} className={buttonVariants()}>
            See Essay
          </Link>

          <Badge variant="outline">@{essay.author.name}</Badge>
        </div>
        <Comments id={essay.id} />
      </CardFooter>
    </Card>
  );
}