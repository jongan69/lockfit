import { Workout } from "./workout";

export interface Program {
    id: number;
    name: string;
    color: string;
    workouts: Workout[];
    schedule: string;
    split: string;
}

export interface CustomProgram extends Program {
    schedule: string;
    split: string;
}