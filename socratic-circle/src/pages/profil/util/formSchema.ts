import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  about: z.string().max(500).optional(),
  degree: z.string().max(50).optional(),
  school: z.string().max(50).optional(),
  currentCity: z.string().max(50).optional(),
  homeTown: z.string().max(50).optional(),
  email: z.string().max(50).optional(),
  mobile: z.string().max(50).optional(),
});
