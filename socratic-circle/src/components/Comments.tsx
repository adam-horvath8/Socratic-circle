import { v4 as uuidv4 } from "uuid";
import { auth, db } from "@/config/firebase";
import { commentType } from "@/types/types";
import {
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useSelector } from "react-redux";

// import components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  comment: z.string().min(2).max(500),
});

interface IComments {
  id: string;
}

export function Comments({ id }: IComments) {
  const [comments, setComments] = useState<commentType[]>([]);
  const authState = useSelector((state: any) => state.authState);

  // create Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const essaysCollectionRef = collection(db, "essays");

  const getExistingComments = async (
    essayDocRef: DocumentReference<DocumentData, DocumentData>
  ) => {
    const essayDocSnapshot = await getDoc(essayDocRef);
    return essayDocSnapshot.data()?.comments || [];
  };

  const addNewComment = (
    existingComments: commentType[],
    values: z.infer<typeof formSchema>
  ) => {
    return [
      ...existingComments,
      {
        comment: values.comment,
        commentId: uuidv4(),
        authorName: auth.currentUser?.displayName,
      },
    ];
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const essayDocRef = doc(essaysCollectionRef, id);
      const existingComments = await getExistingComments(essayDocRef);
      const updatedComments = addNewComment(existingComments, values);

      await updateDoc(essayDocRef, { comments: updatedComments });
      setComments(updatedComments);

      form.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComments = async () => {
    try {
      const essayDocRef = doc(essaysCollectionRef, id);
      const existingComments = await getExistingComments(essayDocRef);
      setComments(existingComments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>
          <span className="material-symbols-outlined">chat</span>
          Comments({comments.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <Card className="flex flex-col gap-2 p-2">
            {comments.map((item) => (
              <div
                key={item.commentId}
                className="border-b-2 rounded-sm flex flex-col"
              >
                <Badge variant="secondary">{item.authorName}</Badge>
                <p className="break-all">{item.comment}</p>
              </div>
            ))}
          </Card>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 w-full"
            >
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={authState ? false : true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
