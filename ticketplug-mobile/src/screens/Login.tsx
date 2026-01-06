import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TicketPlug</Text>
      <Text>Login Screen - Coming Soon</Text>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: 16,
  },
})

