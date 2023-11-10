import { v4 as uuidv4 } from "uuid";
import { auth, db } from "@/config/firebase";
import { commentType, oneEssayType } from "@/types/types";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// import components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Card, CardHeader } from "./ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const formSchema = z.object({
  comment: z.string().min(2).max(500),
});

interface IComments {
  id: string;
}

export function Comments({ id }: IComments) {
  const [comments, setComments] = useState<commentType[]>([]);

  // create Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  // Submit comment
  const essaysCollectionRef = collection(db, "essays");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);

    try {
      // Step 1: Retrieve the existing document
      const essayDocRef = doc(essaysCollectionRef, id);
      const essayDocSnapshot = await getDoc(essayDocRef);

      // Step 2: Modify the array by adding the new object
      const existingComments = essayDocSnapshot.data()?.comments || []; // Assuming 'comments' is the array field in your document
      const updatedComments: commentType[] = [
        ...existingComments,
        {
          comment: values.comment,
          commentId: uuidv4(),
          authorName: auth.currentUser?.displayName,
        },
      ];

      // Step 3: Update the document in the collection with the modified array
      await updateDoc(essayDocRef, { comments: updatedComments });

      form.reset();
    } catch (err) {
      console.error(err);
    }
  };

  // Get Comments
  const essaysData = useSelector((state: any) => state.essaysData);
  useEffect(() => {
    const filteredEssaysData = essaysData.filter(
      (data: oneEssayType) => data.id === id
    );
    const selectedComments = filteredEssaysData[0].comments;
    setComments(selectedComments);
  }, []);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"secondary"}>Comments</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
          <Card>
            <CardHeader>
              {comments.map((item) => (
                <p key={item.commentId}>{item.comment}</p>
              ))}
            </CardHeader>
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
