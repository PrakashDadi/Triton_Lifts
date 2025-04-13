import React, { useState, useRef, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator,
  ScrollView, Keyboard, Image
} from 'react-native';
import Constants from 'expo-constants';
import { UserContext } from './UserContext';
import { supabase } from '../supabaseclient';

const TritonChat = () => {
  const { userId } = useContext(UserContext);
  const [input, setInput] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const fetchUserPrompt = async () => {
    const { data: user } = await supabase
      .from('User_Details')
      .select('height, weight')
      .eq('id', userId)
      .single();

    const { data: workouts } = await supabase
      .from('User_Workouts')
      .select('muscle_group, volume')
      .eq('user_id', userId);

    const volume = {};
    workouts?.forEach(({ muscle_group, volume: v }) => {
      volume[muscle_group] = (volume[muscle_group] || 0) + v;
    });

    return `Hey, my height is ${user?.height ?? 'unknown'} and my weight is ${user?.weight ?? 'unknown'}.
Till today I lifted ${volume['Chest'] || 0} on Chest, ${volume['Biceps'] || 0} on Biceps, and ${volume['Shoulders'] || 0} on Shoulders.
Answer this in under 50 words: "${input}"`;
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    Keyboard.dismiss();
    setLoading(true);
    setDisplayedText('');
    setImageUrl(null);

    try {
      const API_KEY = Constants.expoConfig.extra.GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
      const prompt = await fetchUserPrompt();

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      });

      const data = await response.json();
      const fullText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ No AI response.';
      const words = fullText.split(/\s+/).slice(0, 50);

      let i = 0;
      const interval = setInterval(() => {
        if (i < words.length) {
          setDisplayedText((prev) => prev + ' ' + words[i]);
          i++;
        } else {
          clearInterval(interval);
          scrollRef.current?.scrollToEnd({ animated: true });
        }
      }, 70);
    } catch (e) {
      setDisplayedText('❌ Could not connect to Gemini API.');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleHeatmapImage = async () => {
    setImageUrl(null);
    setDisplayedText('');
    setLoading(true);

    try {
      const API_KEY = Constants.expoConfig.extra.GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

      const { data: user } = await supabase
        .from('User_Details')
        .select('height, weight')
        .eq('id', userId)
        .single();

      const prompt = `Generate a vivid and descriptive image prompt for a fitness heat map showing which muscles have been worked the most based on a user's weekly volume. Emphasize chest, biceps, and shoulders as high intensity. User height: ${user?.height}, weight: ${user?.weight}.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.5, maxOutputTokens: 100 },
        }),
      });

      const data = await response.json();
      const promptText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (promptText) {
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}`;
        setImageUrl(imgUrl);
      } else {
        setDisplayedText('❌ Heatmap prompt generation failed.');
      }
    } catch (error) {
      setDisplayedText('❌ Image generation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.header}>💬 Ask Your AI Coach</Text>

      <TextInput
        placeholder="e.g. What workout should I do for chest tomorrow?"
        placeholderTextColor="#9ca3af"
        style={styles.input}
        multiline
        value={input}
        onChangeText={setInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Ask AI</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={handleHeatmapImage} disabled={loading}>
        <Text style={styles.buttonText}>Generate Heatmap</Text>
      </TouchableOpacity>

      <ScrollView ref={scrollRef} style={styles.responseContainer}>
        {displayedText ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{displayedText}</Text>
          </View>
        ) : null}

        {imageUrl && (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1f2937',
  },
  input: {
    minHeight: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    color: '#111827',
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  responseContainer: {
    maxHeight: 250,
  },
  responseBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 12,
  },
  responseText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  image: {
    width: '100%',
    height: 280,
    borderRadius: 10,
    marginTop: 16,
  },
});

export default TritonChat;
