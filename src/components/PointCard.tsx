import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RoutePoint } from '../domain/types';

interface PointCardProps {
  point: RoutePoint;
  onSelect: (point: RoutePoint) => void;
}

export const PointCard: React.FC<PointCardProps> = ({ point, onSelect }) => {
  const getStatusBadge = () => {
    switch (point.status) {
      case 'synced':
        return { label: 'SINCRONIZADO', style: styles.badgeSynced, textStyle: styles.badgeTextSynced };
      case 'syncing':
        return { label: 'ENVIANDO...', style: styles.badgeSyncing, textStyle: styles.badgeTextSyncing };
      case 'error':
        return { label: 'ERRO SYNC', style: styles.badgeError, textStyle: styles.badgeTextError };
      default:
        if (point.currentReading !== undefined) {
          return { label: 'PENDENTE SYNC', style: styles.badgePending, textStyle: styles.badgeTextPending };
        }
        return { label: 'A REALIZAR', style: styles.badgeDefault, textStyle: styles.badgeTextDefault };
    }
  };

  const badge = getStatusBadge();

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onSelect(point)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.orderBadge}>
          <Text style={styles.orderText}>#{point.order}</Text>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{point.customer}</Text>
          <Text style={styles.installationCode}>Instalação: {point.installationCode}</Text>
        </View>

        <View style={[styles.statusBadge, badge.style]}>
          <Text style={[styles.statusText, badge.textStyle]}>{badge.label}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>MEDIDOR</Text>
          <Text style={styles.detailValue}>{point.meterNumber}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>LEITURA ANTERIOR</Text>
          <Text style={styles.detailValue}>{point.previousReading}</Text>
        </View>

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>NOVA LEITURA</Text>
          <Text style={[styles.detailValue, point.currentReading !== undefined && styles.highlightValue]}>
            {point.currentReading !== undefined ? point.currentReading : '---'}
          </Text>
        </View>
      </View>

      <View style={styles.addressBox}>
        <Text style={styles.referencePoint}>Ref: {point.referencePoint}</Text>
        <Text style={styles.addressText}>{point.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderBadge: {
    backgroundColor: '#0f172a',
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#38bdf8',
  },
  orderText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '800',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  installationCode: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeSynced: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
  },
  badgeTextSynced: {
    color: '#34d399',
  },
  badgeSyncing: {
    backgroundColor: '#075985',
    borderColor: '#38bdf8',
  },
  badgeTextSyncing: {
    color: '#7dd3fc',
  },
  badgeError: {
    backgroundColor: '#7f1d1d',
    borderColor: '#ef4444',
  },
  badgeTextError: {
    color: '#fca5a5',
  },
  badgePending: {
    backgroundColor: '#78350f',
    borderColor: '#f59e0b',
  },
  badgeTextPending: {
    color: '#fcd34d',
  },
  badgeDefault: {
    backgroundColor: '#0f172a',
    borderColor: '#475569',
  },
  badgeTextDefault: {
    color: '#94a3b8',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  detailValue: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  highlightValue: {
    color: '#38bdf8',
    fontWeight: '800',
  },
  addressBox: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  referencePoint: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  addressText: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
});
