import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubmissionInput {
  studentName: string;
  submissionText: string;
  submissionType: 'essay' | 'assignment' | 'report'; // Type of submission
  subject: string;
  coachingModeUsed?: 'analytical' | 'creative' | 'standard';
  learningStyle?: 'visual' | 'auditory' | 'readwrite' | 'kinesthetic';
  feedbackIntegrationCount?: number; // Times they used doubt solver/essay checker
  progressTrendData?: { score: number; date: string }[]; // Historical scores
}

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

// Helper: Detect rote learning patterns (keywords, lack of analysis)
function detectRoteLearning(text: string): { isRote: boolean; evidence: string[] } {
  const rotKeywords = [
    'define', 'is a', 'according to', 'the definition',
    'memorized', 'stated that', 'says that', 'is when'
  ];

  const analysisKeywords = [
    'therefore', 'because', 'as a result', 'implies', 'demonstrates',
    'applies', 'illustrates', 'connects', 'bridges', 'synthesizes',
    'critically', 'however', 'contradicts', 'challenges'
  ];

  const lowerText = text.toLowerCase();
  const roteCount = rotKeywords.filter(kw => lowerText.includes(kw)).length;
  const analysisCount = analysisKeywords.filter(kw => lowerText.includes(kw)).length;

  const evidence: string[] = [];
  if (roteCount > analysisCount) {
    evidence.push('Heavy use of definitional language without analytical depth');
  }
  if (!lowerText.includes('example') && !lowerText.includes('case')) {
    evidence.push('Lacks concrete examples or case studies');
  }
  if (text.split('.').length < 10) {
    evidence.push('Submission is too brief to demonstrate competency');
  }

  return {
    isRote: roteCount > analysisCount,
    evidence
  };
}

// Helper: Assess flexibility (multidisciplinary connections)
function assessFlexibility(text: string, subject: string): number {
  const interdisciplinaryKeywords = [
    'history', 'culture', 'society', 'economy', 'environment',
    'psychology', 'ethics', 'technology', 'politics', 'health',
    'international', 'global', 'cross', 'interdisciplinary'
  ];

  const hasConnections = interdisciplinaryKeywords.filter(kw => text.toLowerCase().includes(kw)).length;

  if (hasConnections >= 3) return 18; // Excellent multidisciplinary thinking
  if (hasConnections === 2) return 14; // Good connections
  if (hasConnections === 1) return 10; // Basic connection
  return 5; // No visible cross-disciplinary thinking
}

// Helper: Assess critical thinking depth
function assessCriticalThinking(text: string): number {
  const depthIndicators = [
    'analysis', 'evaluate', 'assess', 'compare', 'contrast',
    'implication', 'consequence', 'limitation', 'assumption',
    'hypothesis', 'theory', 'framework', 'model'
  ];

  const criticalPhrases = [
    'this suggests', 'this implies', 'however', 'conversely',
    'in contrast', 'on the other hand', 'argues that', 'claims',
    'evidence shows', 'data indicates', 'research demonstrates'
  ];

  const depthScore = depthIndicators.filter(ind => text.toLowerCase().includes(ind)).length;
  const criticalScore = criticalPhrases.filter(ph => text.toLowerCase().includes(ph)).length;

  const totalIndicators = depthScore + criticalScore;

  if (totalIndicators >= 8) return 18; // Strong critical thinking
  if (totalIndicators >= 5) return 14; // Moderate critical thinking
  if (totalIndicators >= 2) return 9; // Basic analysis
  return 4; // Mostly narrative/descriptive
}

// Helper: Assess consistency via progress trend
function assessConsistency(progressData?: { score: number; date: string }[]): number {
  if (!progressData || progressData.length < 2) return 10; // No data = neutral

  const scores = progressData.map(d => d.score);
  const avgScore = scores.reduce((a, b) => a + b) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - avgScore, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  // Low variance = consistent performance
  if (stdDev < 10) return 18; // Consistent high/stable performance
  if (stdDev < 20) return 14; // Moderate consistency
  if (stdDev < 30) return 10; // Some variation
  return 6; // Highly inconsistent
}

// Helper: Check holistic elements
function assessHolistic(text: string, learningStyle?: string): number {
  const holisticKeywords = [
    'character', 'value', 'ethics', 'responsibility', 'creativity',
    'reflection', 'self-awareness', 'social', 'collaboration',
    'skill', 'practical', 'application', 'real-world'
  ];

  const hasHolistic = holisticKeywords.filter(kw => text.toLowerCase().includes(kw)).length;

  let score = hasHolistic * 2; // 2 points per indicator
  if (learningStyle && learningStyle !== 'readwrite') score += 5; // Bonus for adaptive learning

  return Math.min(score, 20);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: SubmissionInput = await req.json();

    // 1. CRITICAL THINKING (20m)
    const criticalThinking = assessCriticalThinking(input.submissionText);
    const roteAnalysis = detectRoteLearning(input.submissionText);
    const criticalFeedback = roteAnalysis.isRote
      ? `Rote reproduction detected. Evidence: ${roteAnalysis.evidence.join('; ')}`
      : `Demonstrates analytical depth with proper use of evidence.`;

    // 2. FLEXIBILITY (20m)
    const flexibility = assessFlexibility(input.submissionText, input.subject);
    const flexibilityFeedback = flexibility >= 18
      ? 'Strong interdisciplinary connections across multiple domains.'
      : flexibility >= 14
      ? 'Good cross-disciplinary thinking shown.'
      : 'Limited to single-discipline perspective; lacks broader context.';

    // 3. ASSESSMENT QUALITY (20m) - Based on consistency and formative use
    const consistency = assessConsistency(input.progressTrendData);
    const feedbackUseBonus = (input.feedbackIntegrationCount || 0) > 2 ? 3 : 0;
    const assessmentScore = Math.min(consistency + feedbackUseBonus, 20);
    const assessmentFeedback = assessmentScore >= 16
      ? 'Strong pattern of iterative improvement; consistent high performance.'
      : assessmentScore >= 12
      ? 'Moderate consistency with some growth trajectory.'
      : 'One-time effort or inconsistent pattern; lacks formative integration.';

    // 4. TEACHER/RESOURCE UTILITY (20m) - Based on coaching mode and learning style adaptation
    let resourceScore = 10; // Base score
    if (input.coachingModeUsed === 'analytical' || input.coachingModeUsed === 'creative') {
      resourceScore += 7; // Bonus for non-standard coaching
    }
    if (input.learningStyle && input.learningStyle !== 'readwrite') {
      resourceScore += 3; // Bonus for using adaptive learning styles
    }
    const resourceScore_final = Math.min(resourceScore, 20);
    const resourceFeedback = resourceScore_final >= 16
      ? 'Excellent use of adaptive coaching modes and personalized resources.'
      : resourceScore_final >= 12
      ? 'Good engagement with platform features.'
      : 'Limited utilization of coaching and adaptive tools; consider using Analytical/Creative modes.';

    // 5. HOLISTIC DEVELOPMENT (20m)
    const holisticScore = assessHolistic(input.submissionText, input.learningStyle);
    const holisticFeedback = holisticScore >= 16
      ? 'Demonstrates character, ethical awareness, and practical vocational skills.'
      : holisticScore >= 12
      ? 'Some evidence of holistic development; could integrate more soft skills.'
      : 'Focused purely on academic content; lacks character and practical application.';

    // TOTAL SCORE
    const totalScore = criticalThinking + flexibility + assessmentScore + resourceScore_final + holisticScore;

    // DEDUCTION JUSTIFICATIONS
    const deductions: string[] = [];
    if (roteAnalysis.isRote) {
      deductions.push(`Critical Thinking (-${20 - criticalThinking}m): ${roteAnalysis.evidence.join('; ')}`);
    }
    if (flexibility < 14) {
      deductions.push(`Flexibility (-${20 - flexibility}m): Single-discipline approach; lacks multidisciplinary bridges.`);
    }
    if (assessmentScore < 12) {
      deductions.push(`Assessment Quality (-${20 - assessmentScore}m): No evidence of iterative improvement or formative feedback integration.`);
    }
    if (resourceScore_final < 12) {
      deductions.push(`Teacher/Resource Utility (-${20 - resourceScore_final}m): Underutilization of adaptive coaching modes.`);
    }
    if (holisticScore < 12) {
      deductions.push(`Holistic Development (-${20 - holisticScore}m): Missing character, ethics, and practical application.`);
    }

    // GLOBAL COMPARISON
    const globalComparison = {
      usStandard: flexibility >= 14
        ? 'Aligns with US interdisciplinary standards (STEM to STEAM transition).'
        : 'Below US expectation; lacks integration of STEM with humanities.',
      japanStandard: holisticScore >= 16
        ? 'Meets Japan\'s emphasis on character development and holistic learning.'
        : 'Below Japan standard; insufficient character and practical skill focus.',
      australiaStandard: assessmentScore >= 14 && flexibility >= 14
        ? 'Meets Australia\'s VET + Academic balance; demonstrates practical competency.'
        : 'Below Australia standard; lacks vocational-practical alignment.',
      roteLearningTrap: roteAnalysis.isRote
        ? `ALERT: Rote Learning Detected. Student memorized definitions but cannot apply concepts. Example from submission: ${roteAnalysis.evidence[0] || 'Lack of analytical framework'}`
        : 'Demonstrates conceptual understanding beyond memorization.'
    };

    // MODEL STRATEGY
    const modelStrategy: string[] = [];
    if (roteAnalysis.isRote) {
      modelStrategy.push('Switch Coaching Mode to "Analytical" or "Creative" to move beyond definitions toward application.');
    }
    if (flexibility < 14) {
      modelStrategy.push('Use AI Visual Learning to create concept maps that bridge this subject with history, culture, or ethics.');
    }
    if (assessmentScore < 12) {
      modelStrategy.push('Integrate Doubt Solving and Essay Checker tools after initial draft; revise at least 2-3 times per assignment.');
    }
    if (holisticScore < 12) {
      modelStrategy.push('Include a "Real-World Application" or "Character Reflection" section in all future submissions.');
    }
    modelStrategy.push('Request mentor feedback focusing on gaps between definition and application.');

    // SEVERITY ASSESSMENT
    let severity: 'excellent' | 'good' | 'needs-improvement' | 'critical';
    if (totalScore >= 80) severity = 'excellent';
    else if (totalScore >= 60) severity = 'good';
    else if (totalScore >= 40) severity = 'needs-improvement';
    else severity = 'critical';

    const result: AuditResult = {
      studentName: input.studentName,
      totalScore,
      breakdown: {
        criticalThinking: { score: criticalThinking, feedback: criticalFeedback },
        flexibility: { score: flexibility, feedback: flexibilityFeedback },
        assessmentQuality: { score: assessmentScore, feedback: assessmentFeedback },
        teacherResourceUtility: { score: resourceScore_final, feedback: resourceFeedback },
        holisticDevelopment: { score: holisticScore, feedback: holisticFeedback }
      },
      globalComparison,
      deductionJustifications: deductions.length > 0 ? deductions : ['No major deductions; work meets expectations.'],
      modelStrategy,
      severity
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error: any) {
    console.error('Error in NEP Auditor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
