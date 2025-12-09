import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import {
  AlertCircle, CheckCircle, TrendingUp, Globe, Zap, BarChart3,
  Send, Loader2
} from 'lucide-react';

interface AuditResult {
  studentName: string;
  totalScore: number;
  breakdown: {
    criticalThinking: { score: number; feedback: string };
    flexibility: { score: number; feedback: string };
    assessmentQuality: { score: number; feedback: string };
    teacherResourceUtility: { score: number; feedback: string };
    holisticDevelopment: { score: number; feedback: string };
  };
  globalComparison: {
    usStandard: string;
    japanStandard: string;
    australiaStandard: string;
    roteLearningTrap: string;
  };
  deductionJustifications: string[];
  modelStrategy: string[];
  severity: 'excellent' | 'good' | 'needs-improvement' | 'critical';
}

const NEPAuditorPage: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [submissionType, setSubmissionType] = useState<'essay' | 'assignment' | 'report'>('essay');
  const [subject, setSubject] = useState('');
  const [coachingMode, setCoachingMode] = useState<'analytical' | 'creative' | 'standard'>('standard');
  const [learningStyle, setLearningStyle] = useState<'visual' | 'auditory' | 'readwrite' | 'kinesthetic'>('visual');
  const [feedbackIntegration, setFeedbackIntegration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    if (!studentName.trim() || !submissionText.trim() || !subject.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('nep-auditor', {
        body: {
          studentName,
          submissionText,
          submissionType,
          subject,
          coachingModeUsed: coachingMode,
          learningStyle,
          feedbackIntegrationCount: feedbackIntegration
        }
      });

      if (error) throw error;
      setResult(data);
    } catch (err) {
      console.error('Audit failed:', err);
      alert('Failed to run audit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-blue-600 bg-blue-50';
      case 'needs-improvement':
        return 'text-orange-600 bg-orange-50';
      case 'critical':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 16) return 'text-green-600';
    if (score >= 12) return 'text-blue-600';
    if (score >= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">NEP 2020 Auditor</h1>
          </div>
          <p className="text-gray-300 text-lg">
            Senior Global Education Analyst & NEP Compliance Evaluator
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Evaluate competency against global standards (US, Japan, Australia) — Not rote learning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Submission Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Student Name *</label>
                  <Input
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g., Aarav Kumar"
                    className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Subject *</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Physics, History, Biology"
                    className="mt-2 bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Submission Type</label>
                  <select
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value as any)}
                    className="w-full mt-2 px-3 py-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                  >
                    <option value="essay">Essay</option>
                    <option value="assignment">Assignment</option>
                    <option value="report">Report</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Coaching Mode Used</label>
                  <select
                    value={coachingMode}
                    onChange={(e) => setCoachingMode(e.target.value as any)}
                    className="w-full mt-2 px-3 py-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                  >
                    <option value="standard">Standard</option>
                    <option value="analytical">Analytical</option>
                    <option value="creative">Creative</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">Learning Style</label>
                  <select
                    value={learningStyle}
                    onChange={(e) => setLearningStyle(e.target.value as any)}
                    className="w-full mt-2 px-3 py-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                  >
                    <option value="visual">Visual</option>
                    <option value="auditory">Auditory</option>
                    <option value="readwrite">Read/Write</option>
                    <option value="kinesthetic">Kinesthetic</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Feedback Integration Count (Doubt Solver/Essay Checker uses)
                  </label>
                  <Input
                    type="number"
                    value={feedbackIntegration}
                    onChange={(e) => setFeedbackIntegration(parseInt(e.target.value) || 0)}
                    min="0"
                    className="mt-2 bg-white/20 border-white/30 text-white"
                  />
                </div>
              </div>

              <div className="mt-6 text-xs text-gray-400">
                <p className="mb-2">⚠️ Note: Copy-paste the full submission text below for best accuracy.</p>
              </div>
            </div>
          </div>

          {/* Submission Text & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Input */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                Submission Text *
              </h2>
              <textarea
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                placeholder="Paste the student's essay, assignment, or report here..."
                rows={12}
                className="w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleAudit}
                disabled={isLoading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Audit...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Run NEP Audit
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-6 animate-in fade-in-50">
                {/* Score Header */}
                <div className={`rounded-2xl p-8 border border-white/20 ${getSeverityColor(result.severity)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">
                      {result.studentName}'s NEP Audit Report
                    </h3>
                    {result.severity === 'excellent' && <CheckCircle className="w-8 h-8" />}
                    {result.severity === 'critical' && <AlertCircle className="w-8 h-8" />}
                  </div>
                  <div className="text-5xl font-bold mb-2">{result.totalScore} / 100</div>
                  <p className="text-lg font-semibold capitalize">
                    Status: {result.severity === 'excellent' ? 'Excellent' : result.severity === 'good' ? 'Good' : result.severity === 'needs-improvement' ? 'Needs Improvement' : 'Critical'}
                  </p>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    📊 Detailed Marking Breakdown
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(result.breakdown).map(([key, data]) => (
                      <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-semibold capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </h4>
                          <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                            {data.score}/20
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{data.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Global Comparison */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-400" />
                    🌍 International Analysis
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-blue-400">
                      <p className="text-gray-300 text-sm"><strong>vs. US Standard:</strong> {result.globalComparison.usStandard}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-orange-400">
                      <p className="text-gray-300 text-sm"><strong>vs. Japan Standard:</strong> {result.globalComparison.japanStandard}</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border-l-4 border-green-400">
                      <p className="text-gray-300 text-sm"><strong>vs. Australia Standard:</strong> {result.globalComparison.australiaStandard}</p>
                    </div>
                    <div className="bg-red-900/30 rounded-lg p-4 border-l-4 border-red-500">
                      <p className="text-red-300 text-sm font-semibold">⚠️ Rote Learning Trap:</p>
                      <p className="text-gray-300 text-sm">{result.globalComparison.roteLearningTrap}</p>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                    📉 Justification for Deductions
                  </h3>
                  <ul className="space-y-3">
                    {result.deductionJustifications.map((d, i) => (
                      <li key={i} className="bg-white/5 rounded-lg p-4 border border-white/10 text-gray-300 text-sm">
                        • {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Model Strategy */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 border-l-4 border-l-green-400">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    🚀 Model Strategy for Improvement
                  </h3>
                  <ol className="space-y-3">
                    {result.modelStrategy.map((s, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-green-400 font-bold">{i + 1}.</span>
                        <span className="text-gray-300 text-sm">{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-xs">
          <p>NEP 2020 Auditor | Evaluates Global Standards (US, Japan, Australia) | Detects Rote Learning</p>
          <p className="mt-2">Uses Gemini/GPT/DeepSeek AI for advanced text analysis</p>
        </div>
      </div>
    </div>
  );
};

export default NEPAuditorPage;
