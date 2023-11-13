import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { useParams } from "react-router-dom";

const formSchema = z.object({
  title: z.string().min(2).max(100),
  mainQuestion: z.string().min(2).max(500),
  mainIssue: z.string().min(2).max(1000),
  thesis: z.string().min(2).max(1000),
  introduction: z.string().min(2).max(3000),
  conclusion: z.string().min(2).max(3000),
  category: z.string().min(2).max(100),
  body: z.array(
    z.object({
      chapterId: z.string(),
      chapterTitle: z.string(),
      chapterParagraphs: z.array(
        z.object({
          id: z.string(),
          text: z.string(),
        })
      ),
    })
  ),
});

export interface ICreateEssayProps {}

export default function CreateEssay(props: ICreateEssayProps) {
  const { toast } = useToast();
  const { id } = useParams();
  console.log(id);

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
      category: "",
      body: [
        {
          chapterId: uuidv4(),
          chapterTitle: "",
          chapterParagraphs: [{ id: uuidv4(), text: "" }],
        },
      ],
    },
  });

  const { control } = form;

  const { fields: chapterFields, append: appendChapter } = useFieldArray({
    name: "body",
    control,
  });

  const { fields: paragraphFields, append: appendParagraph } = useFieldArray({
    name: "body.0.chapterParagraphs",
    control,
  });

  // Database query

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
          body: values.body,
          conclusion: values.conclusion,
          category: values.cathegory,
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
      } catch (err) {
        console.error(err);
      }
    };

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

          {chapterFields.map((chapter, chapterIndex) => (
            <div key={chapter.id}>
              <FormField
                control={form.control}
                name={`body.${chapterIndex}.chapterTitle`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Paragraph fields */}
              {chapter.chapterParagraphs.map((paragraph, paragraphIndex) => (
                <FormField
                  key={paragraph.id}
                  control={form.control}
                  name={`body.${chapterIndex}.chapterParagraphs.${paragraphIndex}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Paragraph</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                onClick={() =>
                  appendChapter({
                    chapterId: uuidv4(),
                    chapterTitle: "",
                    chapterParagraphs: [{ id: uuidv4(), text: "" }],
                  })
                }
              >
                Add Chapter
              </Button>
              <Button onClick={() => appendParagraph({ id: uuidv4(), text: "" })}>
                Add Paragraph
              </Button>
            </div>
          ))}

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
