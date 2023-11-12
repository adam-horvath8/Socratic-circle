import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { bodyStateType, chapterType } from "../../types/types";

// import componenets
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const formSchema = z.object({
  title: z.string().min(2).max(100),
  mainQuestion: z.string().min(2).max(500),
  mainIssue: z.string().min(2).max(1000),
  thesis: z.string().min(2).max(1000),
  introduction: z.string().min(2).max(3000),
  conclusion: z.string().min(2).max(3000),
  cathegory: z.string().min(2).max(100),
});

export interface ICreateEssayProps {}

const defaultBody: bodyStateType = [
  {
    chapterId: uuidv4(),
    chapterTitle: "",
    chapterParagraphs: [{ id: uuidv4(), text: "" }],
  },
];

export default function CreateEssay(props: ICreateEssayProps) {
  const [body, setBody] = useState<bodyStateType>(defaultBody);
  console.log(body);

  // Functions
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
      const paragraphToUpdate = updatedBody
        .find((chapter) => chapter.chapterId === chapterId)
        .chapterParagraphs.find((par) => par.id === paragraphId);
      if (paragraphToUpdate) {
        paragraphToUpdate.text = text;
      }

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

  // Form validations
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      mainQuestion: "",
      mainIssue: "",
      thesis: "",
      introduction: "",
      conclusion: "",
      cathegory: "",
    },
  });

  // Database query

  const { toast } = useToast();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const essaysCollectionRef = collection(db, "essays");

    const createEssay = async () => {
      try {
        await addDoc(essaysCollectionRef, {
          title: values.title,
          mainQuestion: values.mainQuestion,
          mainIssue: values.mainIssue,
          thesis: values.thesis,
          introduction: values.introduction,
          body: body,
          conclusion: values.conclusion,
          cathegory: values.cathegory,
          comments: [],
          author: {
            name: auth.currentUser?.displayName,
            id: auth.currentUser?.uid,
          },
        });
        toast({
          title: "Your Essay has been submitted succesfully",
          description: "You can see it on the page My Essays",
        });
        await form.reset();
        console.log(body);
        setBody(defaultBody);
      } catch (err) {
        console.error(err);
      }
    };

    console.log(body);

    createEssay();
  }

  return (
    <div className="py-10 px-20 flex flex-col items-center">
      <h1>Add your New Essay!</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormDescription>Add Name of your Essay</FormDescription>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset className="border-2 p-10">
            <legend>About</legend>
            <FormField
              control={form.control}
              name="mainQuestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Question</FormLabel>
                  <FormDescription>
                    Add Main Question that you want to find answer to in your
                    Essay
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainIssue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Issue</FormLabel>
                  <FormDescription>
                    Write Problem that your are deailng with in your Essay
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thesis"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thesis</FormLabel>
                  <FormDescription>
                    Write main idea that you want to present and defend
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <FormField
            control={form.control}
            name="introduction"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Introduction</FormLabel>
                <FormDescription>
                  Write what you want to achieve in this Essay and sketch out
                  your plan to do so.
                </FormDescription>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <fieldset className="border-2 p-10">
            <legend>Body</legend>
            {body.map((chapter) => (
              <div key={chapter.chapterId}>
                <FormItem>
                  <div>
                    <FormLabel>Chapter Title</FormLabel>
                    {body.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => handleDeleteChapter(chapter.chapterId)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      value={chapter.chapterTitle}
                      onChange={(e) => {
                        const text = e.target.value;
                        handleChapterChange(chapter.chapterId, text);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {chapter.chapterParagraphs.map((par) => (
                  <FormItem key={par.id}>
                    <div>
                      <FormLabel>Paragraph</FormLabel>
                      <Button
                        onClick={() =>
                          handleDeletePar(chapter.chapterId, par.id)
                        }
                      >
                        Delete
                      </Button>
                    </div>

                    <FormControl>
                      <Textarea
                        rows={10}
                        value={par.text}
                        onChange={(e) => {
                          const text = e.target.value;
                          handleParagraphChange(
                            chapter.chapterId,
                            par.id,
                            text
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}

                <Button
                  onClick={(e) => handleAddParagraph(e, chapter.chapterId)}
                >
                  Add Paragraph
                </Button>
                <Button onClick={(e) => handleAddChapter(e)}>
                  Add Chapter
                </Button>
              </div>
            ))}
          </fieldset>
          <FormField
            control={form.control}
            name="conclusion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conclusion</FormLabel>
                <FormDescription>
                  Conclude what you achieved in this Essay
                </FormDescription>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cathegory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cathegory</FormLabel>
                <FormDescription>Add a cathegory of your Essay</FormDescription>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...field}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aesthetics">Aesthetics</SelectItem>
                      <SelectItem value="Epistemology">Epistemology</SelectItem>
                      <SelectItem value="Ethics">Ethics</SelectItem>
                      <SelectItem value="Logic">Logic</SelectItem>
                      <SelectItem value="Metaphysics">Metaphysics</SelectItem>
                      <SelectItem value="Political Philosophy">
                        Political Philosophy
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
          <Toaster />
        </form>
      </Form>
    </div>
  );
}
