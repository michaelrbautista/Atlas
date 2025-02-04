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
        id: string;
        full_name: string;
    } | null;
}

export type FetchedPurchasedProgram = {
    created_by: {
        id: string;
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
    workout_exercises: FetchedExercise[];
}

export type FetchedExercise = {
    id: string;
    program_workout_id: string | null;
    workout_id: string | null;
    exercise_number: number;
    sets: number | null;
    reps: number | null;
    time: string | null;
    other: string | null;
    exercises: {
        title: string;
        instructions: string | null;
        video_url: string | null;
    } | null;
}

export type FetchedSubscription = {
    subscribed_to: {
        full_name: string;
        username: string;
        bio: string | null;
        profile_picture_url: string | null;
    } | null;
}

export type FetchedCollection = {
    id: string;
    created_at: string;
    title: string;
    description: string | null;
    collection_number: number;
    articles: FetchedArticle[] | null;
}

export type FetchedArticle = {
    id: string;
    collection_id: string;
    title: string;
    content: string;
    free: boolean;
    image_url: string | null;
    image_path: string | null;
    created_by: {
        id: string;
        full_name: string;
    } | null;
}

export type TipTapNode = {
    type: string;
    attrs: {
        level: number | null;
        start: number | null;
        alt: string | null;
        src: string | null;
        title: string | null;
    } | null;
    content: [TipTapNodeContent] | null;
}

export type TipTapNodeContent = {
    type: string;
    marks: [
        {
            type: string;
        }
    ] | null;
    text: string;
    content: [TipTapNodeContent] | null;
}
