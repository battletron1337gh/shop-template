import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

export function StatCard({ title, value, subtitle, color = '#2563eb' }: StatCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
});
