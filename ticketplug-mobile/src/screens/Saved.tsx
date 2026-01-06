import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function SavedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Tickets</Text>
      <Text>Saved Tickets List - Coming Soon</Text>
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

