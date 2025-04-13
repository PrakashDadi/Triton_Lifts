import React, { useContext, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { UserContext } from './UserContext';
import { supabase } from '../supabaseclient';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const { setUserId } = useContext(UserContext);

  const handleLogin = async(email) => {
    console.log('Email:', email); // ✅ check if email is correct
    const { data, error } = await supabase
    .from('User_Details')
    .select('*')
    .eq('email', email);// Assuming 'id' is the primary key user_id; // Fetch single user by email
    console.log('Data:', data); // ✅ check if data is correct

 // ✅ check if user_id is correct

  if (error || !data) {
    alert('User not found. Please sign up or try another email.');
    return;
  }

  
  if (!data) {
    alert('No user found with this email.');
    return;
  }
  const user = data[0];
  setUserId(user.id); // ✅ set actual user_id
  navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Triton Lifts</Text>
      <TextInput
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button title="Continue" onPress={() => handleLogin(email)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 26, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
});