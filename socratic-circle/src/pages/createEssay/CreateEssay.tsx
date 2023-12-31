import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import { bodyStateType } from "../../types/types";
import { useToast } from "@/components/ui/use-toast";
import scrollToTop from "@/lib/scrollToTop";
import formSchema from "./util/formSchema";
import { useSelector } from "react-redux";

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
import useBodyLogic from "./util/useBodyLogic";
import SignInDialog from "@/components/SignInWarning";

export const defaultBody: bodyStateType = [
  {
    chapterId: uuidv4(),
    chapterTitle: "",
    chapterParagraphs: [{ id: uuidv4(), text: "" }],
  },
];

export default function CreateEssay() {
  const authState = useSelector((state: any) => state.authState);
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();

  console.log("current user", auth.currentUser);

  // Functions
  const {
    body,
    setBody,
    handleAddParagraph,
    handleParagraphChange,
    handleDeletePar,
    handleAddChapter,
    handleDeleteChapter,
    handleChapterChange,
  } = useBodyLogic();

  // Form validations

  const fetchEssay = async (id: string) => {
    const essayDocRef = doc(db, "essays", id);
    try {
      const essayDocSnapshot = await getDoc(essayDocRef);

      if (essayDocSnapshot.exists()) {
        const essayData = essayDocSnapshot.data();
        console.log("Essay data:", essayData);
        return essayData;
      } else {
        console.log("Document does not exist!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await fetchEssay(id);
        if (data) {
          form.reset(data); // Update the form values
          // Set the 'body' state with the fetched 'body' data
          if (data.body) {
            setBody(data.body);
          }
        }
      }
    };

    fetchData();
  }, [id]);

  const existingEssayData = id ? fetchEssay(id) : null;

  const defaultValues = existingEssayData
    ? { ...existingEssayData }
    : {
        title: "",
        mainQuestion: "",
        mainIssue: "",
        thesis: "",
        introduction: "",
        conclusion: "",
        cathegory: "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Database query

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const essaysCollectionRef = collection(db, "essays");

    const essayData = {
      title: values.title,
      mainQuestion: values.mainQuestion,
      mainIssue: values.mainIssue,
      thesis: values.thesis,
      introduction: values.introduction,
      body: body,
      conclusion: values.conclusion,
      cathegory: values.cathegory,
      comments: [],
      likes: [],
      author: {
        name: auth.currentUser?.isAnonymous
          ? "Anonymous"
          : auth.currentUser?.displayName,
        id: auth.currentUser?.uid,
      },
    };

    try {
      // If id is defined, update the existing essay
      if (id) {
        const essayDocRef = doc(db, "essays", id);
        await updateDoc(essayDocRef, essayData);
        toast({
          title: "Your Essay has been Updated successfully",
        });
      } else {
        // If id is not defined, create a new essay
        await addDoc(essaysCollectionRef, essayData);
        toast({
          title: "Your Essay has been Submitted successfully",
        });
      }
      navigate("/in/my-essays");
      scrollToTop();
      form.reset();
      setBody(defaultBody);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className=" flex flex-col items-center max-w-screen">
      <h1>Add your New Essay!</h1>
      {!authState ? (
        <SignInDialog />
      ) : (
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
            <fieldset className="border-2 p-5 sm:p-10 flex flex-col gap-6">
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
                      <Textarea rows={16} {...field} />
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
                      <Textarea rows={16} {...field} />
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
                      <Textarea rows={16} {...field} />
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
                    <Textarea rows={16} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <fieldset className="border-2 p-5 sm:p-10 ">
              <legend>Body</legend>
              {body.map((chapter) => (
                <div key={chapter.chapterId} className="flex flex-col gap-4">
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Chapter Title</FormLabel>
                      {body.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(chapter.chapterId)}
                        >
                          <span className="material-symbols-outlined">
                            delete_forever
                          </span>
                        </button>
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
                      <div className="flex items-center justify-between">
                        <FormLabel>Paragraph</FormLabel>
                        <button
                          type="button"
                          onClick={() =>
                            handleDeletePar(chapter.chapterId, par.id)
                          }
                        >
                          <span className="material-symbols-outlined">
                            delete_forever
                          </span>
                        </button>
                      </div>

                      <FormControl>
                        <Textarea
                          value={par.text}
                          rows={16}
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
                  <div className="flex my-4 gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      onClick={(e) => handleAddParagraph(e, chapter.chapterId)}
                    >
                      <span className="material-symbols-outlined">
                        playlist_add
                      </span>
                      Paragraph
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1  sm:flex-none"
                      onClick={(e) => handleAddChapter(e)}
                    >
                      <span className="material-symbols-outlined">
                        docs_add_on
                      </span>
                      Chapter
                    </Button>
                  </div>
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
                    <Textarea rows={16} {...field} />
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
                  <FormDescription>
                    Add a cathegory of your Essay
                  </FormDescription>
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
                        <SelectItem value="Epistemology">
                          Epistemology
                        </SelectItem>
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
          </form>
        </Form>
      )}
    </div>
  );
}
