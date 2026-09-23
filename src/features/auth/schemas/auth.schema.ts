import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(true)
});

export const signUpSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid work email"),
  password: z.string().min(10, "Use at least 10 characters"),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "Accept the terms to continue" })
  })
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid work email")
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
