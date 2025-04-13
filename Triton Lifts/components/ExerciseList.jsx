import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabaseclient';
import { UserContext } from './UserContext';

export default function ExerciseList({ muscleGroup, onFinish }) {
  const [exercises, setExercises] = useState([]);
  const [logData, setLogData] = useState({}); // { exercise_id: { reps: "", weight: "" } }
  const { userId } = useContext(UserContext);

  // Fetch exercises from Supabase
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from('Workouts_Table')
          .select('*')
          .eq('Muscle Group', muscleGroup);

        if (error) {
          console.error('Error fetching exercises:', error);
          Alert.alert('Error', 'Failed to fetch exercises. Please try again later.');
        } else {
          setExercises(data);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    };

    fetchExercises();
  }, [muscleGroup]);

  // Handle logging workout data to Supabase
  const handleLog = (exercise) => {
    console.log('Logging workout for exercise:', exercise);
    const userData = logData[exercise.id] || {};
    const { reps, weight } = userData;

    // Validate input
    if (!reps || !weight) {
      Alert.alert('Validation Error', 'Please enter both reps and weight.');
      return;
    }
    console.log('Logging data:', { reps, weight, userId });
    try {
      const { error } = supabase.from('User_Workouts').insert([
        {
          user_id: userId,
          muscle_group: muscleGroup,
          exercise_name: exercise['Exercise Name'],
          reps: parseInt(reps, 10),
          weight: parseFloat(weight),
        },
      ]);

      if (error) {
        console.error('Error saving workout:', error);
        Alert.alert('Error', 'Failed to save workout. Please try again.');
      } else {
        Alert.alert('Success', 'Workout saved successfully!');
        // Optionally clear the input fields for this exercise
        setLogData((prev) => ({
          ...prev,
          [exercise.id]: { reps: '', weight: '' },
        }));
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      Alert.alert('Error', 'An unexpected error occurred while saving the workout.');
    }
  };

  // Handle input changes
  const handleChange = (id, field, value) => {
    setLogData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  return (
    <FlatList
      data={exercises}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={{ uri: item['Image URL'] }} style={styles.image} />
          <Text style={styles.title}>{item['Exercise Name']}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Reps</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={logData[item.id]?.reps || ''}
              onChangeText={(text) => handleChange(item.id, 'reps', text)}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Weight</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={logData[item.id]?.weight || ''}
              onChangeText={(text) => handleChange(item.id, 'weight', text)}
            />
          </View>
          <Button title="Log Workout" onPress={() => handleLog(item)} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
  },
});