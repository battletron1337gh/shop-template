import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { StatCard } from '../../components/stat-card.component';
import { formatCurrency } from '../../lib/utils';

export function DashboardScreen({ navigation }: any) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await api.get('/dashboard');
      return response.data.data;
    },
  });

  const today = data?.today || {};
  const month = data?.thisMonth || {};

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerDate}>
          {new Date().toLocaleDateString('nl-NL', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          title="Vandaag"
          value={formatCurrency(today.income || 0)}
          subtitle={`${today.rideCount || 0} ritten`}
          color="#2563eb"
        />
        <StatCard
          title="Deze maand"
          value={formatCurrency(month.profit || 0)}
          subtitle="Winst"
          color="#10b981"
        />
        <StatCard
          title="Kosten"
          value={formatCurrency(month.expenses || 0)}
          subtitle="Deze maand"
          color="#ef4444"
        />
        <StatCard
          title="Ritten"
          value={month.rideCount || 0}
          subtitle="Deze maand"
          color="#8b5cf6"
        />
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle">Snelle acties</Text>
        <View style={styles.actionsRow}>
          <QuickActionButton
            title="Rit toevoegen"
            icon="🚗"
            onPress={() => navigation.navigate('AddRide')}
          />
          <QuickActionButton
            title="Kost toevoegen"
            icon="🧾"
            onPress={() => navigation.navigate('AddExpense')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

function QuickActionButton({ title, icon, onPress }: { title: string; icon: string; onPress: () => void }) {
  return (
    <View style={styles.actionButton}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDate: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
    gap: 12,
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
