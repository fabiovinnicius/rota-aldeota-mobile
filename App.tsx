import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RouteProvider } from './src/store/RouteContext';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <RouteProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#0f172a" />
        <HomeScreen />
      </SafeAreaView>
    </RouteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
