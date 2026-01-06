import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { StatusBar } from 'expo-status-bar'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>🎟️ TicketPlug</Text>
      <Text style={styles.subtitle}>App is working!</Text>
      <Text style={styles.info}>This is a minimal test version</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0E1F33',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
})


