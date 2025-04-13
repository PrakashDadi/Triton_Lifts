// components/Navbar.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>Triton Lifts</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    padding: 59,
    backgroundColor: '#1e90ff',
    alignItems: 'center',
    // marginTop:18,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Navbar;
