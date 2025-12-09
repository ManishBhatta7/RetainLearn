import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppSettings {
  darkMode: boolean;
  notifications: boolean;
  language: string;
  dataUsage: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  notifications: true,
  language: 'en',
  dataUsage: 'auto',
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('appSettings');
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      setIsSaving(true);
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (err) {
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDarkMode = () => {
    const updated = { ...settings, darkMode: !settings.darkMode };
    saveSettings(updated);
  };

  const toggleNotifications = () => {
    const updated = { ...settings, notifications: !settings.notifications };
    saveSettings(updated);
  };

  const handleLanguageChange = () => {
    Alert.alert('Language', 'Select your preferred language', [
      { text: 'English', onPress: () => saveSettings({ ...settings, language: 'en' }) },
      { text: 'Hindi', onPress: () => saveSettings({ ...settings, language: 'hi' }) },
      { text: 'Spanish', onPress: () => saveSettings({ ...settings, language: 'es' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleDataUsageChange = () => {
    Alert.alert('Data Usage', 'Select your data usage preference', [
      { text: 'Auto', onPress: () => saveSettings({ ...settings, dataUsage: 'auto' }) },
      { text: 'WiFi Only', onPress: () => saveSettings({ ...settings, dataUsage: 'wifi' }) },
      { text: 'Minimal', onPress: () => saveSettings({ ...settings, dataUsage: 'minimal' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const getLanguageName = () => {
    const langs: { [key: string]: string } = {
      en: 'English',
      hi: 'Hindi',
      es: 'Spanish',
    };
    return langs[settings.language] || 'English';
  };

  const getDataUsageName = () => {
    const modes: { [key: string]: string } = {
      auto: 'Auto',
      wifi: 'WiFi Only',
      minimal: 'Minimal',
    };
    return modes[settings.dataUsage] || 'Auto';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {/* Display Section */}
        <Text style={styles.sectionTitle}>Display</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Dark Mode</Text>
            <Switch
              value={settings.darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d1d5db', true: '#10b981' }}
              thumbColor={settings.darkMode ? '#059669' : '#f3f4f6'}
              disabled={isSaving}
            />
          </View>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Push Notifications</Text>
            <Switch
              value={settings.notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
              thumbColor={settings.notifications ? '#2563eb' : '#f3f4f6'}
              disabled={isSaving}
            />
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Info', 'Notification preferences coming soon')}
          >
            <Text style={styles.cardLabel}>Notification Preferences</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Language & Region Section */}
        <Text style={styles.sectionTitle}>Language & Region</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardRow} onPress={handleLanguageChange}>
            <Text style={styles.cardLabel}>Language</Text>
            <Text style={styles.cardValue}>{getLanguageName()}</Text>
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <Text style={styles.sectionTitle}>Data & Storage</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardRow} onPress={handleDataUsageChange}>
            <Text style={styles.cardLabel}>Data Usage</Text>
            <Text style={styles.cardValue}>{getDataUsageName()}</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Info', 'Cache: ~12 MB\n\nClear cache to free up space')}
          >
            <Text style={styles.cardLabel}>Clear Cache</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.cardRow}>
            <Text style={styles.cardLabel}>App Size</Text>
            <Text style={styles.cardValue}>~45 MB</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Preferences Section */}
        <Text style={styles.sectionTitle}>Learning</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Info', 'Learning pace customization coming soon')}
          >
            <Text style={styles.cardLabel}>Learning Pace</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Info', 'Daily goal setting coming soon')}
          >
            <Text style={styles.cardLabel}>Daily Goal</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>App Version</Text>
            <Text style={styles.cardValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Info', 'Checking for updates...')}
          >
            <Text style={styles.cardLabel}>Check for Updates</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Linking.openURL('https://retainlearn.com')}
          >
            <Text style={styles.cardLabel}>Website</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Linking.openURL('mailto:support@retainlearn.com')}
          >
            <Text style={styles.cardLabel}>Send Feedback</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Legal Section */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy coming soon')}
          >
            <Text style={styles.cardLabel}>Privacy Policy</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.cardRow}
            onPress={() => Alert.alert('Terms of Service', 'Terms of service coming soon')}
          >
            <Text style={styles.cardLabel}>Terms of Service</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>© 2024 RetainLearn. All rights reserved.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  cardValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  cardArrow: {
    fontSize: 18,
    color: '#d1d5db',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
});
