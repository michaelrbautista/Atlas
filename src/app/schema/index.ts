import { z } from "zod";

export const TeamSchema = z.object({
    image: z.instanceof(File).optional(),
    name: z.string().trim().min(1, {
        message: "Please enter a team name."
    }).max(100, {
        message: "Please enter a name that is under 100 characters."
    }),
    description: z.string().max(400, {
        message: "Please enter a description that is under 400 characters."
    }).optional()
})

export const ProgramSchema = z.object({
    image: z.instanceof(File).optional(),
    title: z.string().trim().min(1, {
        message: "Please enter a program title."
    }).max(100, {
        message: "Please enter a title that is under 100 characters."
    }),
    weeks: z.coerce.number({
        message: "Number of weeks must be a number."
    }).min(1, {
        message: "Program must be at least 1 week."
    }).max(56, {
        message: "Number of weeks should be between 1 and 56."
    }),
    price: z.coerce.number({
        message: "Price must be a number."
    }).min(1, {
        message: "Price must be at least 1.00."
    }),
    description: z.string().max(400, {
        message: "Please enter a description that is under 400 characters."
    }).optional()
})

export const WorkoutSchema = z.object({
    title: z.string().trim().min(1, {
        message: "Please enter a program title."
    }).max(100, {
        message: "Please enter a title that is under 100 characters."
    }),
    description: z.string().max(400, {
        message: "Please enter a description that is under 400 characters."
    }).optional()
})

export const ExistingExerciseSchema = z.object({
    sets: z.coerce.number({
        message: "Sets must be a number."
    }).min(1, {
        message: "There must be at least 1 set."
    }),
    reps: z.coerce.number({
        message: "Reps must be a number."
    }).min(1, {
        message: "There must be at least 1 rep."
    })
})

export const NewExerciseSchema = z.object({
    video: z.instanceof(File).optional(),
    title: z.string().trim().min(1, {
        message: "Please enter an exercise title."
    }).max(100, {
        message: "Please enter a title that is under 100 characters."
    }),
    instructions: z.string().max(400, {
        message: "Please enter instructions that are under 400 characters."
    }).optional()
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
    }),
    confirmPassword: z.string().min(8, {
        message: "Password must be at least 8 characters."
    })
}).superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords must match.",
        path: ["confirmPassword"]
      });
    }
  });
