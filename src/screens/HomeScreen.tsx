import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '../store/RouteContext';
import { Header } from '../components/Header';
import { PointCard } from '../components/PointCard';
import { RouteMap } from '../components/RouteMap';
import { PointDetailScreen } from './PointDetailScreen';
import { RoutePoint } from '../domain/types';

export const HomeScreen: React.FC = () => {
  const { route, loading, resetRoute } = useRoute();
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  if (loading || !route) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Carregando rota de atendimento...</Text>
      </View>
    );
  }

  if (selectedPoint) {
    const currentPointData = route.points.find((p) => p.id === selectedPoint.id) || selectedPoint;
    return (
      <PointDetailScreen
        point={currentPointData}
        onBack={() => setSelectedPoint(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'list' && styles.activeTab]}
          onPress={() => setActiveTab('list')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
            📋 Lista de Pontos ({route.points.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'map' && styles.activeTab]}
          onPress={() => setActiveTab('map')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'map' && styles.activeTabText]}>
            🗺️ Percurso & Mapa
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'map' ? (
          <RouteMap points={route.points} onSelectPoint={setSelectedPoint} />
        ) : (
          route.points.map((point) => (
            <PointCard
              key={point.id}
              point={point}
              onSelect={setSelectedPoint}
            />
          ))
        )}

        <TouchableOpacity style={styles.resetButton} onPress={resetRoute} activeOpacity={0.8}>
          <Text style={styles.resetButtonText}>🔄 Resetar Rota para Teste Inicial</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeTab: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  resetButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  resetButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
});
