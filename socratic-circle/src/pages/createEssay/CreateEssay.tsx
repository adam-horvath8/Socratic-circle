import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useState } from "react";

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

const formSchema = z.object({
  title: z.string().min(2).max(50),
  mainQuestion: z.string().min(2).max(200),
  mainIssue: z.string().min(2).max(500),
  thesis: z.string().min(2).max(500),
  conclusion: z.string().min(2).max(1000),
});

type bodyStateType = [{ chapterTitle: string; chapterParagraphs: string[] }];

export interface ICreateEssayProps {}

const defaultBody = [{ chapterTitle: "", chapterParagraphs: [""] }];

export default function CreateEssay(props: ICreateEssayProps) {
  const [body, setBody] = useState<bodyStateType>(defaultBody);

  console.log(body);
  // TODO figure out why add paragraph button adds tho par at the same time
  // TODO learn and fix typescript

  const handleAddParagraph = (
    e: React.FormEvent<HTMLFormElement>,
    chapterIndex: number
  ) => {
    e.preventDefault();
    setBody((prevBody) => {
      const updatedBody = [...prevBody];
      updatedBody[chapterIndex].chapterParagraphs.push("");
      return updatedBody;
    });
  };

  const handleParagraphChange = (
    chapterIndex: number,
    paragraphIndex: number,
    text: string
  ) => {
    setBody((prevBody) => {
      const updatedBody = [...prevBody];
      updatedBody[chapterIndex].chapterParagraphs[paragraphIndex] = text;
      return updatedBody;
    });
  };

  const handleAddChapter = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setBody((prevBody) => [
      ...prevBody,
      { chapterTitle: "", chapterParagraphs: [""] },
    ]);
  };

  const handleChapterChange = (chapterIndex: number, text: string) => {
    setBody((prevBody) => {
      const updatedBody = [...prevBody];
      updatedBody[chapterIndex].chapterTitle = text;
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
      conclusion: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);

    // Database query
    const essaysCollectionRef = collection(db, "essays");

    const createEssay = async () => {
      try {
        await addDoc(essaysCollectionRef, {
          title: values.title,
          mainQuestion: values.mainQuestion,
          mainIssue: values.mainIssue,
          thesis: values.thesis,
          body: body,
          conclusion: values.conclusion,
          author: {
            name: auth.currentUser?.displayName,
            id: auth.currentUser?.uid,
          },
        });
        form.reset();
        setBody(defaultBody);
      } catch (err) {
        console.error(err);
      }
    };

    createEssay();
  }

  return (
    <div className="py-10 px-20 flex flex-col items-center">
      <h1>Add your new essay!</h1>
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
                <FormDescription>
                  This is your public display name.
                </FormDescription>
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
                    This is your public display name.
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
                    This is your public display name.
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
                    This is your public display name.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </fieldset>
          <fieldset className="border-2 p-10">
            <legend>Body</legend>
            {body.map((chapter, chapterIndex) => (
              <div key={chapterIndex}>
                <FormItem>
                  <FormLabel>Chapter title</FormLabel>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormControl>
                    <Input
                      value={chapter.chapterTitle}
                      onChange={(e) => {
                        const text = e.target.value;
                        handleChapterChange(chapterIndex, text);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {chapter.chapterParagraphs.map((par, parIndex) => (
                  <FormItem key={parIndex}>
                    <FormLabel>Paragraph</FormLabel>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        rows={10}
                        value={par}
                        onChange={(e) => {
                          const text = e.target.value;
                          handleParagraphChange(chapterIndex, parIndex, text);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                ))}

                <Button onClick={(e) => handleAddParagraph(e, chapterIndex)}>
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
                  This is your public display name.
                </FormDescription>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
