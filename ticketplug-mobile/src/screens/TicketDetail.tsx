import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function TicketDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ticket Details</Text>
      <Text>Ticket Detail View - Coming Soon</Text>
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
    fontSize: 24,
    fontWeight: '600',
    color: '#0E1F33',
  },
})

