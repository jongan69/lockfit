import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Workout {
  name: string;
  sets: number;
  reps: number;
  duration: number;
  restDuration: number;
}

interface WorkoutTimerProps {
  workout: Workout;
  onComplete: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ workout, onComplete }) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [completedReps, setCompletedReps] = useState<number[]>(new Array(workout.sets).fill(workout.reps));
  const [setCompleted, setSetCompleted] = useState<boolean[]>(new Array(workout.sets).fill(false));
  const [restTimeRemaining, setRestTimeRemaining] = useState(180); // 3 minutes in seconds

  const checkWorkoutCompletion = useCallback(() => {
    if (setCompleted.every((completed) => completed)) {
      onComplete();
    }
  }, [setCompleted, onComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isResting && currentSet <= workout.sets) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => {
          const nextTime = prevTime + 1;
          if (nextTime >= workout.duration) {
            setIsResting(true);
            setRestTimeRemaining(180); // Reset rest timer to 3 minutes
            return 0;
          }
          return nextTime;
        });
      }, 1000);
    } else if (isResting && currentSet < workout.sets) {
      timer = setInterval(() => {
        setRestTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            setCurrentSet((prevSet) => prevSet + 1);
            setIsResting(false);
            return 180; // Reset rest timer to 3 minutes
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (currentSet > workout.sets) {
      checkWorkoutCompletion();
    }

    return () => clearInterval(timer);
  }, [workout, currentSet, isResting, checkWorkoutCompletion]);

  useEffect(() => {
    checkWorkoutCompletion();
  }, [setCompleted, checkWorkoutCompletion]);

  const handleRepClick = (setIndex: number) => {
    setSetCompleted((prevCompleted) => {
      const newCompleted = [...prevCompleted];
      if (!newCompleted[setIndex]) {
        newCompleted[setIndex] = true;
        setIsResting(true);
        setRestTimeRemaining(180); // Start 3-minute rest timer
        return newCompleted;
      }
      return prevCompleted;
    });

    setCompletedReps((prevReps) => {
      const newReps = [...prevReps];
      if (newReps[setIndex] > 0 && setCompleted[setIndex]) {
        newReps[setIndex]--;
      }
      return newReps;
    });
  };

  const handleRepLongPress = (setIndex: number) => {
    setSetCompleted((prevCompleted) => {
      const newCompleted = [...prevCompleted];
      newCompleted[setIndex] = false;
      return newCompleted;
    });

    setCompletedReps((prevReps) => {
      const newReps = [...prevReps];
      newReps[setIndex] = workout.reps;
      return newReps;
    });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <Text style={styles.setInfo}>Set {currentSet} of {workout.sets}</Text>
      <Text style={styles.timerText}>
        {isResting ? formatTime(restTimeRemaining) : formatTime(timeElapsed)}
      </Text>
      <Text style={styles.statusText}>{isResting ? 'Rest' : 'Work'}</Text>
      <View style={styles.repContainer}>
        {completedReps.map((reps, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.repCircle,
              { backgroundColor: setCompleted[index] ? '#4CAF50' : '#FF6347' }
            ]}
            onPress={() => handleRepClick(index)}
            onLongPress={() => handleRepLongPress(index)}
          >
            <Text style={styles.repText}>{reps}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>End Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setInfo: {
    fontSize: 18,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 24,
    marginBottom: 20,
  },
  repContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  repCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  repText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutTimer;