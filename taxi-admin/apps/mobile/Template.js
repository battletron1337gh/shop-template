// TaxiBoek Mobile App Template
// Geinspireerd op Smart Home UI Kit - Deep Blue + Pink Accent

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Receipt, PieChart, Settings, Plus, TrendingUp, Euro, Calendar, FileText, ChevronRight } from 'lucide-react-native';

const COLORS = {
  primary: '#2D3A8C',
  primaryDark: '#1E2756',
  accent: '#F472B6',
  accentLight: '#FBCFE8',
  white: '#FFFFFF',
  lightBg: '#F8FAFC',
  text: '#1E293B',
  textLight: '#64748B',
  success: '#22C55E',
  card: '#FFFFFF',
};

// Components
export const Button = ({ title, onPress, variant = 'primary' }) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, variant === 'primary' && styles.buttonPrimary, variant === 'outline' && styles.buttonOutline]}>
    <Text style={[styles.buttonText, variant === 'primary' && styles.buttonTextPrimary, variant === 'outline' && styles.buttonTextOutline]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export const Card = ({ children, style }) => <View style={[styles.card, style]}>{children}</View>;

// 1. WELCOME SCREEN
export const WelcomeScreen = () => (
  <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.container}>
    <StatusBar barStyle="light-content" />
    <View style={styles.welcomeContent}>
      <View style={styles.logoContainer}>
        <Car size={80} color={COLORS.white} />
        <View style={styles.logoRing} />
      </View>
      <Text style={styles.welcomeTitle}>TAXIBOEK</Text>
      <Text style={styles.welcomeSubtitle}>Slimme boekhouding voor taxi chauffeurs</Text>
      <Button title="AAN DE SLAG" />
    </View>
  </LinearGradient>
);

// 2. DASHBOARD SCREEN
export const DashboardScreen = () => (
  <View style={styles.containerLight}>
    <StatusBar barStyle="light-content" />
    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.dashboardHeader}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerGreeting}>Goedemorgen,</Text>
          <Text style={styles.headerName}>Jan</Text>
        </View>
        <View style={styles.profileAvatar}><Text style={styles.profileInitial}>J</Text></View>
      </View>
      <View style={styles.overviewCard}>
        <Text style={styles.overviewLabel}>Deze maand</Text>
        <Text style={styles.overviewAmount}>€2.845,00</Text>
        <View style={styles.overviewStats}>
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>42</Text>
            <Text style={styles.overviewStatLabel}>Ritten</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewStat}>
            <Text style={styles.overviewStatValue}>€127</Text>
            <Text style={styles.overviewStatLabel}>Gem/rit</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
    
    <ScrollView style={styles.dashboardContent}>
      <Text style={styles.sectionTitle}>Snelle acties</Text>
      <View style={styles.quickActions}>
        {['Rit toevoegen', 'Bon uploaden', 'BTW Rapport'].map((action, i) => (
          <TouchableOpacity key={action} style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: i === 0 ? COLORS.accentLight : i === 1 ? '#DBEAFE' : '#DCFCE7' }]}>
              {i === 0 ? <Plus size={24} color={COLORS.accent} /> : i === 1 ? <Receipt size={24} color="#3B82F6" /> : <FileText size={24} color={COLORS.success} />}
            </View>
            <Text style={styles.quickActionText}>{action}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.sectionTitle}>Overzicht</Text>
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: COLORS.accentLight }]}>
            <Euro size={24} color={COLORS.accent} />
          </View>
          <Text style={styles.statValue}>€2.845</Text>
          <Text style={styles.statTitle}>Bruto omzet</Text>
        </Card>
        <Card style={styles.statCard}>
          <View style={[styles.statIconBg, { backgroundColor: '#DBEAFE' }]}>
            <Receipt size={24} color="#3B82F6" />
          </View>
          <Text style={styles.statValue}>€234</Text>
          <Text style={styles.statTitle}>Uitgaven</Text>
        </Card>
      </View>
      
      <Text style={styles.sectionTitle}>Recente ritten</Text>
      <Card>
        {['Amsterdam CS → Schiphol', 'Rotterdam → Den Haag', 'Utrecht → Amsterdam'].map((route, i) => (
          <View key={route} style={[styles.rideItem, i < 2 && styles.rideItemBorder]}>
            <View style={styles.rideInfo}>
              <View style={styles.rideIconBg}><Car size={16} color={COLORS.primary} /></View>
              <View>
                <Text style={styles.rideRoute}>{route}</Text>
                <Text style={styles.rideTime}>Vandaag • 14:30</Text>
              </View>
            </View>
            <Text style={styles.rideAmount}>€45,00</Text>
          </View>
        ))}
      </Card>
    </ScrollView>
    
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem}><PieChart size={24} color={COLORS.accent} /><Text style={styles.navTextActive}>Overzicht</Text></TouchableOpacity>
      <TouchableOpacity style={styles.navItem}><Car size={24} color={COLORS.textLight} /><Text style={styles.navText}>Ritten</Text></TouchableOpacity>
      <TouchableOpacity style={styles.navCenterButton}><Plus size={32} color={COLORS.white} /></TouchableOpacity>
      <TouchableOpacity style={styles.navItem}><Receipt size={24} color={COLORS.textLight} /><Text style={styles.navText}>Bonnetjes</Text></TouchableOpacity>
      <TouchableOpacity style={styles.navItem}><Settings size={24} color={COLORS.textLight} /><Text style={styles.navText}>Instellingen</Text></TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  containerLight: { flex: 1, backgroundColor: COLORS.lightBg },
  
  welcomeContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  logoContainer: { width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  logoRing: { position: 'absolute', width: 160, height: 160, borderRadius: 80, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },
  welcomeTitle: { fontSize: 36, fontWeight: 'bold', color: COLORS.white, letterSpacing: 4 },
  welcomeSubtitle: { fontSize: 16, color: COLORS.accent, marginTop: 8, marginBottom: 48 },
  
  button: { paddingVertical: 16, paddingHorizontal: 48, borderRadius: 12, alignItems: 'center' },
  buttonPrimary: { backgroundColor: COLORS.accent },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: COLORS.white },
  buttonText: { fontSize: 16, fontWeight: '600' },
  buttonTextPrimary: { color: COLORS.white },
  buttonTextOutline: { color: COLORS.white },
  
  dashboardHeader: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 80 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  headerName: { fontSize: 24, fontWeight: 'bold', color: COLORS.white },
  profileAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },
  profileInitial: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  overviewCard: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24 },
  overviewLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  overviewAmount: { fontSize: 36, fontWeight: 'bold', color: COLORS.white, marginVertical: 8 },
  overviewStats: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  overviewStat: { flex: 1 },
  overviewDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  overviewStatValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.white },
  overviewStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  
  dashboardContent: { flex: 1, marginTop: -40, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 24, marginBottom: 16 },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickAction: { flex: 1, alignItems: 'center' },
  quickActionIcon: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  quickActionText: { fontSize: 12, color: COLORS.text, marginTop: 8, fontWeight: '500' },
  
  statsGrid: { flexDirection: 'row', gap: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statCard: { padding: 16 },
  statIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
  statTitle: { fontSize: 13, color: COLORS.textLight, marginTop: 4 },
  
  rideItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  rideItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rideInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rideIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center' },
  rideRoute: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  rideTime: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  rideAmount: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: COLORS.white, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 11, color: COLORS.textLight, marginTop: 4 },
  navTextActive: { fontSize: 11, color: COLORS.accent, marginTop: 4, fontWeight: '500' },
  navCenterButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginTop: -20 },
});
