import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute } from '../store/RouteContext';

export const Header: React.FC = () => {
  const { route, isOnline, toggleNetwork, syncAllPending, syncing } = useRoute();

  const completedCount = route?.points.filter((p) => p.status === 'synced' || p.status === 'pending').length || 0;
  const pendingSyncCount = route?.points.filter((p) => p.status === 'pending' || p.status === 'error').length || 0;
  const totalCount = route?.points.length || 0;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.appBadge}>LEIT - CAMPO</Text>
          <Text style={styles.title}>{route?.routeName || 'Rota Aldeota'}</Text>
          <Text style={styles.subtitle}>
            {route?.city} / {route?.state} • {route?.neighborhood}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.networkBadge, isOnline ? styles.onlineBadge : styles.offlineBadge]}
          onPress={toggleNetwork}
          activeOpacity={0.8}
        >
          <View style={[styles.networkDot, isOnline ? styles.onlineDot : styles.offlineDot]} />
          <Text style={styles.networkText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PROGRESSO</Text>
          <Text style={styles.statValue}>
            {completedCount}/{totalCount}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PENDENTES</Text>
          <Text style={[styles.statValue, pendingSyncCount > 0 && styles.warningValue]}>
            {pendingSyncCount}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.syncButton,
            (!isOnline || pendingSyncCount === 0 || syncing) && styles.syncButtonDisabled,
          ]}
          onPress={syncAllPending}
          disabled={!isOnline || pendingSyncCount === 0 || syncing}
          activeOpacity={0.8}
        >
          <Text style={styles.syncButtonText}>
            {syncing ? 'SINCRONIZANDO...' : 'SINCRONIZAR'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  appBadge: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 14,
    borderWidth: 1,
  },
  onlineBadge: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  offlineBadge: {
    backgroundColor: '#451a03',
    borderColor: '#f59e0b',
  },
  networkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  onlineDot: {
    backgroundColor: '#34d399',
  },
  offlineDot: {
    backgroundColor: '#fbbf24',
  },
  networkText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#f8fafc',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statCard: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  warningValue: {
    color: '#fbbf24',
  },
  syncButton: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButtonDisabled: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  syncButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
