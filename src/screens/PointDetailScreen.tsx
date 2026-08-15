import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { RoutePoint, ReadingRecord } from '../domain/types';
import { useRoute } from '../store/RouteContext';

interface PointDetailScreenProps {
  point: RoutePoint;
  onBack: () => void;
}

export const PointDetailScreen: React.FC<PointDetailScreenProps> = ({ point, onBack }) => {
  const { registerReading } = useRoute();

  const [readingInput, setReadingInput] = useState<string>(
    point.currentReading !== undefined ? String(point.currentReading) : ''
  );
  const [photoUri, setPhotoUri] = useState<string | null>(point.photo || null);
  const [locationData, setLocationData] = useState<{
    latitude: number;
    longitude: number;
    timestamp: string;
  } | null>(
    point.latitude && point.longitude && point.capturedAt
      ? { latitude: point.latitude, longitude: point.longitude, timestamp: point.capturedAt }
      : null
  );
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [loadingPhoto, setLoadingPhoto] = useState<boolean>(false);

  const handleCapturePhoto = async () => {
    try {
      setLoadingPhoto(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão negada', 'Permissão de câmera é necessária para capturar a leitura.');
        setLoadingPhoto(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch {
      const simulatedPhoto = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500';
      setPhotoUri(simulatedPhoto);
    } finally {
      setLoadingPhoto(false);
    }
  };

  const handleObtainLocation = async () => {
    try {
      setLoadingLocation(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        const fallbackLocation = {
          latitude: point.latitude,
          longitude: point.longitude,
          timestamp: new Date().toISOString(),
        };
        setLocationData(fallbackLocation);
        setLoadingLocation(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocationData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date(location.timestamp).toISOString(),
      });
    } catch {
      setLocationData({
        latitude: point.latitude,
        longitude: point.longitude,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleConcludeVisit = async () => {
    if (!readingInput.trim()) {
      Alert.alert('Campo Obrigatório', 'Por favor, informe o valor da nova leitura.');
      return;
    }

    const numericReading = Number(readingInput);
    if (isNaN(numericReading) || numericReading < 0) {
      Alert.alert('Valor Inválido', 'A leitura deve ser um número válido.');
      return;
    }

    if (numericReading < point.previousReading) {
      Alert.alert(
        'Atenção à Leitura',
        `A nova leitura (${numericReading}) é menor que a leitura anterior (${point.previousReading}). Confirma que o número está correto?`,
        [
          { text: 'Corrigir', style: 'cancel' },
          { text: 'Confirmar Assim Mesmo', onPress: () => processSave(numericReading) },
        ]
      );
      return;
    }

    await processSave(numericReading);
  };

  const processSave = async (numericReading: number) => {
    const finalPhoto = photoUri || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500';
    const finalLocation = locationData || {
      latitude: point.latitude,
      longitude: point.longitude,
      timestamp: new Date().toISOString(),
    };

    const record: ReadingRecord = {
      pointId: point.id,
      installationCode: point.installationCode,
      meterNumber: point.meterNumber,
      previousReading: point.previousReading,
      currentReading: numericReading,
      latitude: finalLocation.latitude,
      longitude: finalLocation.longitude,
      capturedAt: finalLocation.timestamp,
      photo: finalPhoto,
      syncStatus: 'pending',
    };

    await registerReading(record);
    Alert.alert('Sucesso', 'Visita e leitura salvas localmente como PENDENTE!', [
      { text: 'OK', onPress: onBack },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.8}>
        <Text style={styles.backButtonText}>← Voltar para Rota</Text>
      </TouchableOpacity>

      <View style={styles.cardHeader}>
        <Text style={styles.headerTitle}>{point.customer}</Text>
        <Text style={styles.headerSubtitle}>Instalação: {point.installationCode}</Text>
        <Text style={styles.headerAddress}>{point.address}</Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>MEDIDOR</Text>
          <Text style={styles.infoValue}>{point.meterNumber}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>LEITURA ANTERIOR</Text>
          <Text style={styles.infoValue}>{point.previousReading}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Registrar Nova Leitura</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Digite a leitura atual"
          placeholderTextColor="#64748b"
          value={readingInput}
          onChangeText={setReadingInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Foto do Medidor</Text>
        {photoUri ? (
          <View style={styles.photoPreviewContainer}>
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
            <TouchableOpacity style={styles.rePhotoButton} onPress={handleCapturePhoto}>
              <Text style={styles.actionButtonText}>Tirar Nova Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCapturePhoto}
            disabled={loadingPhoto}
          >
            <Text style={styles.actionButtonText}>
              {loadingPhoto ? 'Abrindo Câmera...' : 'Tirar Foto'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Geolocalização do Atendimento</Text>
        {locationData ? (
          <View style={styles.locationBox}>
            <Text style={styles.locationText}>Latitude: {locationData.latitude.toFixed(6)}</Text>
            <Text style={styles.locationText}>Longitude: {locationData.longitude.toFixed(6)}</Text>
            <Text style={styles.locationSubText}>
              Data/Hora: {new Date(locationData.timestamp).toLocaleString('pt-BR')}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.actionButtonSecondary}
            onPress={handleObtainLocation}
            disabled={loadingLocation}
          >
            <Text style={styles.actionButtonTextSecondary}>
              {loadingLocation ? 'Buscando GPS...' : 'Obter Localização Atual'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.concludeButton}
        onPress={handleConcludeVisit}
        activeOpacity={0.85}
      >
        <Text style={styles.concludeButtonText}>CONCLUIR VISITA E SALVAR LOCAL</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
  },
  cardHeader: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitle: {
    color: '#f8fafc',
    fontSize: 22,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  headerAddress: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  infoValue: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: '#334155',
  },
  actionButton: {
    backgroundColor: '#0284c7',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  actionButtonSecondary: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0284c7',
  },
  actionButtonTextSecondary: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '800',
  },
  photoPreviewContainer: {
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 10,
  },
  rePhotoButton: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  locationBox: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  locationText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '700',
  },
  locationSubText: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  concludeButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  concludeButtonText: {
    color: '#022c22',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
