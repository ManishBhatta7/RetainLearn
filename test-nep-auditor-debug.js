#!/usr/bin/env node

/**
 * Simple NEP Auditor Debug Test
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://gwarmogcmeehajnevbmi.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3YXJtb2djbWVlaGFqbmV2Ym1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIxMDg1OTksImV4cCI6MjAwNzY4NDU5OX0.aL31K29XjbXqhKIBSj3S0C6wVxqPRqqqGGhHWH9U0SE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const testPayload = {
  studentName: 'Aarav Kumar',
  subject: 'Physics',
  submissionType: 'essay',
  coachingModeUsed: 'analytical',
  learningStyle: 'visual',
  feedbackIntegrationCount: 3,
  submissionText: 'Quantum entanglement demonstrates advanced analytical thinking with multidisciplinary connections to philosophy and technology. The experiment bridges theory with practical application.'
};

console.log('Testing nep-auditor function...\n');
console.log('Payload:', JSON.stringify(testPayload, null, 2));

const { data, error } = await supabase.functions.invoke('nep-auditor', {
  body: testPayload,
});

if (error) {
  console.error('\n❌ Error:', error);
  process.exit(1);
} else {
  console.log('\n✅ Success!');
  console.log('Result:', JSON.stringify(data, null, 2));
}
