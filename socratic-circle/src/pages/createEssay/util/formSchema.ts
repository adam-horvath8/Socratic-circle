import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(2).max(100),
  mainQuestion: z.string().min(2).max(500),
  mainIssue: z.string().min(2).max(1000),
  thesis: z.string().min(2).max(1000),
  introduction: z.string().min(2).max(3000),
  conclusion: z.string().min(2).max(3000),
  cathegory: z.string().min(2).max(100),
});

export default formSchema;
