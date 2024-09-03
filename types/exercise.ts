export interface Exercise {
    name: string;
    category: string;
    equipment: string;
    sets?: number;
    reps?: number;
    weight?: number;
    duration?: number;
    restDuration?: number;
}

export interface ExerciseProgress {
    name: string;
    pr: number;
    data: number[];
}