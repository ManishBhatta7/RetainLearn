#!/usr/bin/env node

/**
 * NEP Auditor Test Suite (with Supabase Auth)
 * Tests the nep-auditor Supabase edge function with real student submissions
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gwarmogcmeehajnevbmi.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YXJtb2djbWVlaGFqbmV2Ym1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIxMDg1OTksImV4cCI6MjAwNzY4NDU5OX0.aL31K29XjbXqhKIBSj3S0C6wVxqPRqqqGGhHWH9U0SE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Test Case 1: Strong submission (analytical, multidisciplinary)
const testCase1 = {
  studentName: 'Aarav Kumar',
  subject: 'Physics',
  submissionType: 'essay',
  coachingModeUsed: 'analytical',
  learningStyle: 'visual',
  feedbackIntegrationCount: 3,
  submissionText: `
    Quantum entanglement is a phenomenon where two particles become correlated in such a way
    that the quantum state of one particle instantaneously influences the state of another,
    regardless of distance. This challenges classical assumptions about locality and realism.
    
    The EPR Paradox (Einstein-Podolsky-Rosen) initially argued that quantum mechanics was
    incomplete because it couldn't describe local hidden variables. However, Bell's Theorem
    (1964) demonstrates that no local hidden variable theory can reproduce all quantum mechanical
    predictions, implying that entanglement is a fundamental feature of reality.
    
    Historically, this connects to the broader scientific revolution where Newton's deterministic
    universe gave way to probabilistic quantum mechanics, mirroring the shift in philosophy
    from determinism to emergence. Socially, quantum technology enables quantum computing and
    cryptography, affecting global cybersecurity ethics and accessibility to quantum advantages.
    
    Practically, I designed an experiment using polarized photons to verify entanglement,
    demonstrating how theoretical physics translates to laboratory reproducibility. This bridges
    academic physics with vocational skills in optical engineering.
    
    Therefore, entanglement is not merely a mathematical abstraction but a verified phenomenon
    with profound implications for technology, philosophy, and our understanding of causality.
  `
};

// Test Case 2: Weak submission (rote learning, definitions only)
const testCase2 = {
  studentName: 'Priya Singh',
  subject: 'Biology',
  submissionType: 'assignment',
  coachingModeUsed: 'standard',
  learningStyle: 'readwrite',
  feedbackIntegrationCount: 0,
  submissionText: `
    Photosynthesis is the process by which plants convert light energy into chemical energy.
    It is a metabolic pathway that converts carbon dioxide and water into glucose and oxygen.
    
    The definition of photosynthesis involves two main stages: the light-dependent reactions
    and the light-independent reactions. Light-dependent reactions occur in the thylakoid membranes.
    Light-independent reactions occur in the stroma.
    
    Chlorophyll is the pigment that absorbs light. The formula for photosynthesis is
    6CO2 + 6H2O + light energy → C6H12O6 + 6O2.
    
    Photosynthesis is important for life on Earth because it produces oxygen and food.
    In conclusion, photosynthesis is a crucial process for plants and the planet.
  `
};

// Test Case 3: Moderate submission (some analysis, limited cross-disciplinary)
const testCase3 = {
  studentName: 'Rajesh Patel',
  subject: 'History',
  submissionType: 'report',
  coachingModeUsed: 'creative',
  learningStyle: 'auditory',
  feedbackIntegrationCount: 1,
  submissionText: `
    The French Revolution (1789-1799) was a period of radical social upheaval in France
    that fundamentally transformed European society. It challenged the absolute monarchy
    and feudal hierarchy.
    
    Key events include the storming of the Bastille (1789), the Declaration of the Rights
    of Man and Citizens (1789), and the reign of terror (1793-1794). These events demonstrate
    how popular uprisings can challenge entrenched power structures.
    
    The revolution's impact was significant: it abolished feudalism, established principles
    of individual rights, and inspired similar movements across Europe and Latin America.
    
    However, the revolution also led to mass violence and terror under Robespierre, raising
    ethical questions about revolutionary change and the cost of progress. This connects to
    modern political philosophy regarding the trade-off between liberty and security.
    
    In conclusion, the French Revolution remains pivotal because it established democratic
    principles that continue to shape global governance today.
  `
};

async function testNEPAuditor(testCase) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`Testing: ${testCase.studentName} | ${testCase.subject}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    const { data, error } = await supabase.functions.invoke('nep-auditor', {
      body: testCase,
    });

    if (error) {
      console.error(`❌ Request failed: ${error.message}`);
      return;
    }

    const result = data;

    // Display Results
    console.log(`📊 TOTAL SCORE: ${result.totalScore}/100`);
    console.log(`Severity: ${result.severity.toUpperCase()}\n`);

    console.log(`📋 Marking Breakdown:`);
    Object.entries(result.breakdown).forEach(([criterion, detail]) => {
      const label = criterion
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .replace(/^./, (c) => c.toUpperCase());
      console.log(`  • ${label}: ${detail.score}/20`);
      console.log(`    └─ ${detail.feedback}\n`);
    });

    console.log(`🌍 Global Comparison:`);
    console.log(`  US Standard: ${result.globalComparison.usStandard}`);
    console.log(`  Japan Standard: ${result.globalComparison.japanStandard}`);
    console.log(`  Australia Standard: ${result.globalComparison.australiaStandard}\n`);

    console.log(`⚠️ Rote Learning Trap:`);
    console.log(`  ${result.globalComparison.roteLearningTrap}\n`);

    if (result.deductionJustifications.length > 0) {
      console.log(`📉 Deduction Justifications:`);
      result.deductionJustifications.forEach((d) => {
        console.log(`  • ${d}`);
      });
      console.log();
    }

    console.log(`🚀 Model Strategy for Improvement:`);
    result.modelStrategy.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s}`);
    });

    console.log(`\n${'✅ TEST PASSED'.padEnd(80, '=')} \n`);
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
  }
}

async function runAllTests() {
  console.log(`\n🔍 NEP 2020 Auditor - Test Suite\n`);
  console.log(`Testing nep-auditor function at: ${SUPABASE_URL}/functions/v1/nep-auditor`);

  await testNEPAuditor(testCase1);
  await testNEPAuditor(testCase2);
  await testNEPAuditor(testCase3);

  console.log(`\n${'All tests completed!'.padStart(80, '=')}\n`);
}

runAllTests().catch(console.error);
