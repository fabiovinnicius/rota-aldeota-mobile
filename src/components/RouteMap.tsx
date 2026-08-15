import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RoutePoint } from '../domain/types';

interface RouteMapProps {
  points: RoutePoint[];
  onSelectPoint: (point: RoutePoint) => void;
}

export const RouteMap: React.FC<RouteMapProps> = ({ points, onSelectPoint }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'synced':
        return '#10b981';
      case 'syncing':
        return '#38bdf8';
      case 'error':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>Percurso da Rota Aldeota</Text>
        <Text style={styles.mapSubtitle}>Sequência oficial de atendimento em campo</Text>
      </View>

      <ScrollView horizontal contentContainerStyle={styles.timelineScroll} showsHorizontalScrollIndicator={false}>
        <View style={styles.timelineContainer}>
          {points.map((point, index) => {
            const isLast = index === points.length - 1;
            const statusColor = getStatusColor(point.status);

            return (
              <View key={point.id} style={styles.stepWrapper}>
                <TouchableOpacity
                  style={[styles.node, { borderColor: statusColor }]}
                  onPress={() => onSelectPoint(point)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nodeOrder}>#{point.order}</Text>
                  <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                </TouchableOpacity>

                <View style={styles.nodeDetails}>
                  <Text style={styles.nodeTitle} numberOfLines={1}>
                    {point.customer}
                  </Text>
                  <Text style={styles.nodeRef} numberOfLines={1}>
                    {point.referencePoint}
                  </Text>
                  <Text style={styles.nodeMeter}>Medidor: {point.meterNumber}</Text>
                </View>

                {!isLast && <View style={[styles.connectorLine, { backgroundColor: statusColor }]} />}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#64748b' }]} />
          <Text style={styles.legendText}>A realizar</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
          <Text style={styles.legendText}>Pendente Sync</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Sincronizado</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  mapHeader: {
    marginBottom: 16,
  },
  mapTitle: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '800',
  },
  mapSubtitle: {
    color: '#64748b',
    fontSize: 12,
    marginTop: 2,
  },
  timelineScroll: {
    paddingVertical: 10,
  },
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  node: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nodeOrder: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '800',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  nodeDetails: {
    width: 120,
    marginLeft: 8,
  },
  nodeTitle: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
  },
  nodeRef: {
    color: '#38bdf8',
    fontSize: 11,
    marginTop: 2,
  },
  nodeMeter: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 2,
  },
  connectorLine: {
    width: 24,
    height: 2,
    marginTop: 21,
    marginHorizontal: 4,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
});
