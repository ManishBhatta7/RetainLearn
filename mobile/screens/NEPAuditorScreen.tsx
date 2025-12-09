import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';

interface AuditResult {
  totalScore: number;
  severity: string;
  breakdown: any;
  globalComparison: any;
  deductionJustifications: string[];
  modelStrategy: string[];
}

export default function NEPAuditorScreen() {
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    if (!studentName.trim() || !subject.trim() || !submissionText.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nep-auditor', {
        body: {
          studentName,
          subject,
          submissionText,
          submissionType: 'essay',
          coachingModeUsed: 'analytical',
          learningStyle: 'visual',
          feedbackIntegrationCount: 1,
        },
      });

      if (error) {
        throw error;
      }

      setResult(data);
    } catch (err) {
      Alert.alert('Error', `Failed to run audit: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'needs-improvement':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content}>
          {/* Score Card */}
          <View
            style={[
              styles.scoreCard,
              {
                borderColor: getSeverityColor(result.severity),
                backgroundColor: getSeverityColor(result.severity) + '10',
              },
            ]}
          >
            <Text style={styles.scoreName}>{studentName}</Text>
            <Text
              style={[
                styles.scoreNumber,
                { color: getSeverityColor(result.severity) },
              ]}
            >
              {result.totalScore}
            </Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
            <Text style={styles.scoreSeverity}>{result.severity.toUpperCase()}</Text>
          </View>

          {/* Breakdown */}
          <Text style={styles.sectionTitle}>Marking Breakdown</Text>
          {Object.entries(result.breakdown).map(([key, value]: any) => (
            <View key={key} style={styles.breakdownCard}>
              <View style={styles.breakdownHeader}>
                <Text style={styles.breakdownTitle}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={styles.breakdownScore}>{value.score}/20</Text>
              </View>
              <Text style={styles.breakdownFeedback}>{value.feedback}</Text>
            </View>
          ))}

          {/* Global Comparison */}
          <Text style={styles.sectionTitle}>Global Comparison</Text>
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonLabel}>US Standard:</Text>
            <Text style={styles.comparisonText}>
              {result.globalComparison.usStandard}
            </Text>
          </View>
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonLabel}>Japan Standard:</Text>
            <Text style={styles.comparisonText}>
              {result.globalComparison.japanStandard}
            </Text>
          </View>
          <View style={styles.comparisonCard}>
            <Text style={styles.comparisonLabel}>Australia Standard:</Text>
            <Text style={styles.comparisonText}>
              {result.globalComparison.australiaStandard}
            </Text>
          </View>

          {/* Rote Learning */}
          <Text style={styles.sectionTitle}>Rote Learning Assessment</Text>
          <View style={styles.warningCard}>
            <Text style={styles.warningText}>
              {result.globalComparison.roteLearningTrap}
            </Text>
          </View>

          {/* Improvement Strategies */}
          <Text style={styles.sectionTitle}>Improvement Strategies</Text>
          {result.modelStrategy.map((strategy, index) => (
            <View key={index} style={styles.strategyCard}>
              <Text style={styles.strategyNumber}>{index + 1}</Text>
              <Text style={styles.strategyText}>{strategy}</Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setResult(null);
              setStudentName('');
              setSubject('');
              setSubmissionText('');
            }}
          >
            <Text style={styles.resetButtonText}>New Audit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>NEP 2020 Auditor</Text>
        <Text style={styles.subtitle}>
          Evaluate student submissions against global standards
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Student Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter student name"
            value={studentName}
            onChangeText={setStudentName}
            editable={!isLoading}
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Physics, Biology, History"
            value={subject}
            onChangeText={setSubject}
            editable={!isLoading}
            placeholderTextColor="#9ca3af"
          />

          <Text style={styles.label}>Submission Text</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Paste student submission here..."
            value={submissionText}
            onChangeText={setSubmissionText}
            editable={!isLoading}
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={10}
          />

          <TouchableOpacity
            style={[styles.auditButton, isLoading && styles.auditButtonDisabled]}
            onPress={handleAudit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.auditButtonText}>Run NEP Audit</Text>
            )}
          </TouchableOpacity>
        </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  auditButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auditButtonDisabled: {
    opacity: 0.6,
  },
  auditButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderLeftWidth: 4,
  },
  scoreName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  scoreSeverity: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    marginTop: 16,
  },
  breakdownCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563eb',
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  breakdownScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  breakdownFeedback: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  comparisonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  comparisonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  comparisonText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    marginBottom: 24,
  },
  warningText: {
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 18,
  },
  strategyCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  strategyNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 12,
    minWidth: 24,
  },
  strategyText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  resetButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
