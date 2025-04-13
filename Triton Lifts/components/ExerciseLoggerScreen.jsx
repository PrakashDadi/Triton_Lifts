import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../supabaseclient";
import { UserContext } from "./UserContext";

export default function ExerciseLoggerScreen({ route, navigation }) {
  const { muscleGroup } = route.params;
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { userId } = useContext(UserContext);

  // Fetch exercises from Supabase
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const { data, error } = await supabase
          .from("Workouts_Table")
          .select("*")
          .eq("Muscle Name", muscleGroup);

        if (error) {
          console.error("Error fetching exercises:", error);
          Alert.alert("Error", "Failed to fetch exercises. Please try again.");
        } else {
          setExercises(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    };

    fetchExercises();
  }, [muscleGroup]);

  // Log workout to Supabase
  const logWorkout = async () => {
    if (!selectedExercise || !weight || !reps) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }

    const volume = parseFloat(weight) * parseInt(reps, 10);
    console.log("Logging workout:", {
      userId,
      workout_name: selectedExercise["Exercise Name"],
      muscle_group: muscleGroup,
      weight_for_rep: parseFloat(weight),
      reps: parseInt(reps, 10),
      volume: volume,
    });
    try {
      const { error } = await supabase.from("User_Workouts").insert([
        {
          
          user_id: userId,
          workout_name: selectedExercise["Exercise Name"],
          muscle_group: muscleGroup,
          weight_for_rep: parseFloat(weight),
          reps: parseInt(reps, 10),
          volume: volume,
        },
      ]);

      if (error) {
        console.error("Error saving workout:", error);
        Alert.alert("Error", "Failed to save workout. Please try again.");
      } else {
        Alert.alert("Success", "Workout logged successfully!");
        setModalVisible(false);
        setWeight("");
        setReps("");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Error", "An unexpected error occurred while saving the workout.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Exercises for {muscleGroup}</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              setSelectedExercise(item);
              setModalVisible(true);
            }}
          >
            <Image
              source={{
                uri: item["Image Source"] || "https://example.com/default.png",
              }}
              style={styles.image}
            />
            <Text style={styles.name}>{item["Exercise Name"]}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Input Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedExercise?.["Exercise Name"]}
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Weight</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter weight"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reps</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter reps"
                keyboardType="numeric"
                value={reps}
                onChangeText={setReps}
              />
            </View>
            <Button title="Save Workout" onPress={logWorkout} />
            <Button
              title="Cancel"
              color="red"
              onPress={() => setModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  name: { fontSize: 18 },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});