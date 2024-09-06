import { useState, useEffect } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { CompletedWorkout } from '@/types/workout';

export const useCompletedWorkouts = () => {
    const [completedWorkouts, setCompletedWorkouts] = useState<CompletedWorkout[] | any>([]);
    const db = useSQLiteContext();
    useEffect(() => {
        async function setup() {
            const result = await db.getFirstAsync<{ 'sqlite_version()': string }>(
                'SELECT * FROM completed_workouts'
            );
            setCompletedWorkouts(result);
        }
        setup();
    }, [db]);

    return completedWorkouts;
};