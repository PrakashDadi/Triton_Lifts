import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { supabase } from '../supabaseclient';

export default function WorkoutLogger({ workout, userId }) {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  const logWorkout = async () => {
    const volume = parseFloat(weight) * parseInt(reps);
    await supabase.from('User_Workouts').insert({
      user_id: userId,
      workout_name: workout['Exercise Name'],
      muscle_group: workout['Muscle Name'],
      weight_for_rep: weight,
      reps: reps,
      volume: volume
    });
  };

  return (
    <View>
      <TextInput placeholder="Weight" value={weight} onChangeText={setWeight} />
      <TextInput placeholder="Reps" value={reps} onChangeText={setReps} />
      <Button title="Submit Workout" onPress={logWorkout} />
    </View>
  );
}