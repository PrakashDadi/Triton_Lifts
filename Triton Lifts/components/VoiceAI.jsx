import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { supabase } from '../supabaseclient';
import * as Speech from 'expo-speech';

export default function VoiceAI({ userId }) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const sendPrompt = async () => {
    const userLogs = await supabase.from('User_Workouts').select('*').eq('user_id', userId);
    const history = userLogs.data?.map(log => `${log.workout_name} - ${log.reps} reps @ ${log.weight_for_rep}kg`).join('\n');

    const fullPrompt = `Workout logs:\n${history}\n\nUser prompt: ${prompt}`;

    const geminiRes = await fetch('http://localhost:5000/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: fullPrompt })
    });
    const result = await geminiRes.json();
    setResponse(result.response);
    Speech.speak(result.response);

    await supabase.from('Chat_History').insert({
      user_id: userId,
      user_prompt_text: prompt,
      generated_response: result.response
    });
  };

  return (
    <View>
      <TextInput placeholder="Talk to AI" value={prompt} onChangeText={setPrompt} />
      <Button title="Ask AI" onPress={sendPrompt} />
      <Text>{response}</Text>
    </View>
  );
}
