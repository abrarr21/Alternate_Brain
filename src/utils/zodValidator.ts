import { z } from "zod";

export const signupSchema = z
  .object({
    fullname: z.string().min(3, "fullname must contain atleast 3 characters."),
    email: z.string().email(),
    password: z.string().min(5, "Password must contain atleast 5 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(5, "Password must contain atleast 5 characters."),
});

export const contentSchema = z.object({
  link: z.string().url("Enter valid URL"),
  type: z.enum(["image", "video", "text", "article", "audio"]),
  title: z.string().min(1, { message: "Title cannot be empty" }),
  tag: z.array(z.string().min(1, { message: "Tag cannot be empty" })),
  userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid user ID" }),
});
