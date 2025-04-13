import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ScrollView,
} from 'react-native';
import { supabase } from '../supabaseclient';
import { UserContext } from './UserContext';
import TritonChat from './TritonChat';

// Enable layout animation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Dashboard({ navigation }) {
  const { userId } = useContext(UserContext);
  const [data, setData] = useState({});
  const [expandedMuscles, setExpandedMuscles] = useState({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data: workouts, error } = await supabase
        .from('User_Workouts')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error(error);
        return;
      }

      const grouped = {};
      workouts.forEach((entry) => {
        const muscle = entry.muscle_group;
        if (!grouped[muscle]) {
          grouped[muscle] = { totalVolume: 0, entries: [] };
        }
        grouped[muscle].entries.push(entry);
        grouped[muscle].totalVolume += entry.volume || 0;
      });

      setData(grouped);
    };

    fetchWorkouts();
  }, [userId]);

  const toggleExpand = (muscle) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedMuscles((prev) => ({ ...prev, [muscle]: !prev[muscle] }));
  };

  const getMaxVolume = () => {
    const values = Object.values(data).map((item) => item.totalVolume);
    return Math.max(...values, 1);
  };

  const renderBarChart = () => {
    const maxVolume = getMaxVolume();
    return Object.entries(data).map(([muscle, { totalVolume }]) => (
      <View key={muscle} style={styles.chartRow}>
        <Text style={styles.chartLabel}>{muscle}</Text>
        <View style={styles.chartBarTrack}>
          <View
            style={[
              styles.chartBarFill,
              { width: `${(totalVolume / maxVolume) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.chartVolume}>{totalVolume}</Text>
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📈 Muscle Volume Overview</Text>
      <View style={styles.chartContainer}>
        {Object.keys(data).length === 0 ? (
          <Text style={styles.empty}>No data to show yet.</Text>
        ) : (
          renderBarChart()
        )}
      </View>

      <View style={styles.chatContainer}>
        <TritonChat />
      </View>

      <Text style={styles.subHeader}>📂 Muscle Group History</Text>
      <FlatList
        data={Object.entries(data)}
        keyExtractor={([muscle]) => muscle}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const [muscle, { totalVolume, entries }] = item;
          const isExpanded = expandedMuscles[muscle];

          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(muscle)}>
                <View style={styles.row}>
                  <Text style={styles.muscle}>{muscle}</Text>
                  <Text style={styles.volume}>Total Volume: {totalVolume}</Text>
                </View>
              </TouchableOpacity>
              {isExpanded && (
                <View style={styles.details}>
                  {entries.map((entry) => (
                    <View key={entry.id} style={styles.entryRow}>
                      <Text>🏋️ Workout: {entry.workout_name}</Text>
                      <Text>🏋️ Weight: {entry.weight_for_rep}kg</Text>
                      <Text>🔁 Reps: {entry.reps}</Text>
                      <Text>📊 Volume: {entry.volume}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No workout data yet.</Text>}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('WorkoutSelector')}
        >
          <Text style={styles.navButtonText}>🏋️ Workout Selector</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('VoiceAI')}
        >
          <Text style={styles.navButtonText}>🎙️ Voice Chat</Text>
        </TouchableOpacity> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9FAFB' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
    color: '#111827',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: '#1f2937',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    elevation: 2,
  },
  chartRow: {
    marginBottom: 12,
  },
  chartLabel: {
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
    color: '#374151',
  },
  chartBarTrack: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 8,
  },
  chartVolume: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  chatContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  muscle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  volume: { fontSize: 14, color: '#6B7280' },
  details: {
    marginTop: 10,
    paddingLeft: 10,
  },
  entryRow: {
    marginBottom: 8,
    color: '#111827',
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginVertical: 16,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  navButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
