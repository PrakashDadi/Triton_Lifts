import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../supabaseclient';
import { useNavigation } from '@react-navigation/native';

export default function WorkoutSelector() {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUniqueMuscleGroups = async () => {
      const { data, error } = await supabase
        .from('Workouts_Table')
        .select('*')
        .order('Muscle Name', { ascending: true });

      if (error) {
        console.error("Error fetching:", error);
      } else {
        const uniqueGroups = [...new Set(data.map(item => item['Muscle Name']))];
        setMuscleGroups(uniqueGroups);
      }
    };
    fetchUniqueMuscleGroups();
  }, []);

  return (
    <FlatList
      data={muscleGroups}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate('ExerciseLoggerScreen', { muscleGroup: item })}
        >
          <Text style={styles.text}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 15,
    backgroundColor: '#4F46E5',
    marginVertical: 8,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
});

