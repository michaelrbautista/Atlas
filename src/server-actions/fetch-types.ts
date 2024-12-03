export type FetchedProgram = {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
    price: number;
    currency: string;
    weeks: number;
    free: boolean;
    private: boolean;
    created_by: {
        full_name: string;
    } | null;
}

export type FetchedPurchasedProgram = {
    created_by: {
        full_name: string;
    } | null;
    programs: {
        id: string;
        title: string;
        free: boolean;
        price: number;
        description: string | null;
        image_url: string | null;
    } | null;
}

export type FetchedWorkout = {
    id: string;
    title: string;
    description: string | null;
    program_exercises: FetchedExercise[];
}

export type FetchedExercise = {
    id: string;
    exercise_number: number;
    sets: number | null;
    reps: number | null;
    time: string | null;
    exercises: {
        title: string;
        instructions: string | null;
        video_url: string | null;
    } | null;
}
