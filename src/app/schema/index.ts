import { z } from "zod";

export const TeamSchema = z.object({
    name: z.string().trim().min(1).max(100, {
        message: "Please enter a name that is under 100 characters."
    }),
    description: z.string().max(400, {
        message: "Please enter a description that is under 400 characters."
    }).optional()
})

export const ProgramSchema = z.object({
    
})

export const SignInSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email."
    }),
    password: z.string().min(1, {
        message: "Please enter a password."
    })
})

export const CreateAccountSchema = z.object({
    fullName: z.string().min(1, {
        message: "Full name must be at least 1 character."
    }),
    email: z.string().email({
        message: "Please enter a valid email."
    }),
    username: z.string().min(6, {
        message: "Username must be at least 6 characters."
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters."
    })
})
