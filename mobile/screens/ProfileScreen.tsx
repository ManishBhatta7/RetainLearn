import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    role?: string;
    learning_style?: string;
  };
}

interface UserStats {
  assignments: number;
  averageScore: number;
  streak: number;
  completedLessons: number;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      setProfile(data.user as UserProfile);

      // Mock stats - in production, fetch from database
      setStats({
        assignments: 24,
        averageScore: 87,
        streak: 12,
        completedLessons: 64,
      });
    } catch (err) {
      Alert.alert('Error', `Failed to load profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsSyncing(true);
      await supabase.auth.signOut();
    } catch (err) {
      Alert.alert('Error', `Failed to logout: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      { text: 'Logout', onPress: handleLogout, style: 'destructive' },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#f59e0b" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile?.user_metadata?.full_name || profile?.email || 'User'
                )}&background=f59e0b&color=fff`,
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>
            {profile?.user_metadata?.full_name || 'RetainLearn User'}
          </Text>
          <Text style={styles.email}>{profile?.email}</Text>
          {profile?.user_metadata?.role && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {profile.user_metadata.role.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        {stats && (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.assignments}</Text>
              <Text style={styles.statLabel}>Assignments</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.averageScore}%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.completedLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>
        )}

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Learning Profile</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Learning Style</Text>
            <Text style={styles.cardValue}>
              {profile?.user_metadata?.learning_style || 'Not set'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Email</Text>
            <Text style={styles.cardValue}>{profile?.email}</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.cardRow} onPress={() => {
            Alert.alert('Info', 'Password change feature coming soon');
          }}>
            <Text style={styles.cardLabel}>Change Password</Text>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <Text style={styles.aboutText}>RetainLearn v1.0.0</Text>
          <Text style={styles.aboutSubtext}>Mobile App</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, isSyncing && styles.logoutButtonDisabled]}
          onPress={confirmLogout}
          disabled={isSyncing}
        >
          {isSyncing ? (
            <ActivityIndicator color="#ef4444" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
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
  aboutText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  logoutButton: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
