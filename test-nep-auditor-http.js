#!/usr/bin/env node

/**
 * NEP Auditor Test with Direct HTTP (simulating browser request)
 */

const SUPABASE_URL = 'https://gwarmogcmeehajnevbmi.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YXJtb2djbWVlaGFqbmV2Ym1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIxMDg1OTksImV4cCI6MjAwNzY4NDU5OX0.aL31K29XjbXqhKIBSj3S0C6wVxqPRqqqGGhHWH9U0SE';

const testPayload = {
  studentName: 'Test Student',
  subject: 'Physics',
  submissionType: 'essay',
  coachingModeUsed: 'analytical',
  learningStyle: 'visual',
  feedbackIntegrationCount: 2,
  submissionText: 'This essay demonstrates analytical thinking through careful examination of quantum concepts. The student bridges physics with philosophy, exploring implications beyond definitions. Evidence includes references to Bell\'s Theorem, practical experiments, and historical context from Newton to quantum mechanics. This shows multidisciplinary understanding.'
};

console.log('🧪 Testing nep-auditor function...\n');

fetch(`${SUPABASE_URL}/functions/v1/nep-auditor`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
    'apikey': ANON_KEY,
  },
  body: JSON.stringify(testPayload),
})
  .then(async (response) => {
    console.log(`Status: ${response.status} ${response.statusText}\n`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log('✅ Success!\n');
    console.log('📊 NEP Audit Results:');
    console.log(`\nTotal Score: ${data.totalScore}/100`);
    console.log(`Severity: ${data.severity.toUpperCase()}\n`);

    console.log('Marking Breakdown:');
    Object.entries(data.breakdown).forEach(([key, val]) => {
      console.log(`  • ${key}: ${val.score}/20 - ${val.feedback}`);
    });

    console.log('\nGlobal Comparison:');
    console.log(`  US: ${data.globalComparison.usStandard}`);
    console.log(`  Japan: ${data.globalComparison.japanStandard}`);
    console.log(`  Australia: ${data.globalComparison.australiaStandard}`);

    console.log('\nRote Learning Assessment:');
    console.log(`  ${data.globalComparison.roteLearningTrap}`);

    if (data.deductionJustifications.length > 0) {
      console.log('\nDeductions:');
      data.deductionJustifications.forEach(d => console.log(`  • ${d}`));
    }

    console.log('\nImprovement Strategies:');
    data.modelStrategy.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
  })
  .catch((err) => {
    console.error('❌ Request failed:', err.message);
    process.exit(1);
  });
