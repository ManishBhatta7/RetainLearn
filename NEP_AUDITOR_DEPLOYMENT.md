# NEP 2020 Auditor - Deployment & Usage Guide

## Overview
The NEP 2020 Auditor is a Supabase Edge Function that evaluates student submissions against a strict marking scheme aligned with global educational standards (US, Japan, Australia). It detects rote learning and provides actionable improvement strategies using RetainLearn platform features.

## Deployment Status
✅ **Function Deployed**: `nep-auditor`  
✅ **Route Available**: `/nep-auditor`  
✅ **Access Level**: Teacher-only (role-based protection)  

## Architecture

### Backend (Supabase Edge Function)
**File**: `supabase/functions/nep-auditor/index.ts`

**Features**:
- 5-criterion marking scheme (20m each = 100 total)
  1. **Critical Thinking** (20m) - Detects rote learning vs. analytical depth
  2. **Flexibility** (20m) - Evaluates multidisciplinary thinking
  3. **Assessment Quality** (20m) - Measures consistency & iterative improvement
  4. **Teacher/Resource Utility** (20m) - Scores adaptive coaching mode usage
  5. **Holistic Development** (20m) - Checks character, ethics, practical skills

- **Rote Learning Detection**: Keyword analysis identifies memorization-only submissions
- **Global Benchmarking**: Compares against US (STEM-STEAM), Japan (character), Australia (vocational)
- **Actionable Strategies**: Recommends RetainLearn features (Doubt Solver, Essay Checker, AI Visual Learning)

### Frontend (React Component)
**File**: `src/pages/NEPAuditorPage.tsx`

**Features**:
- Gradient dark theme with glassmorphism UI
- Input panel: student details, submission text, coaching mode, learning style, feedback count
- Real-time results display:
  - Total score + severity badge
  - Detailed 5-criterion breakdown with individual scores
  - Global standard comparison
  - Rote learning trap alert
  - Justified deductions (bullet points)
  - Step-by-step improvement strategies

### Integration
- Route: `/nep-auditor` (teacher-only access via ProtectedRoute)
- TeacherDashboard: New "NEP Audit" tab (4th tab)
- Entry point: One-click from Teacher Dashboard

## How to Use

### For Teachers

1. **Login** as a teacher account
2. Go to **Teacher Dashboard**
3. Click **NEP Audit** tab
4. Fill in submission details:
   - Student name
   - Subject
   - Submission type (essay/assignment/report)
   - Coaching mode used (if applicable)
   - Learning style
   - Feedback integration count (times they used Doubt Solver/Essay Checker)
5. **Paste student submission** in the text area
6. Click **Run NEP Audit**
7. Review results instantly:
   - Score breakdown by criterion
   - Global standard comparison
   - Rote learning assessment
   - Actionable improvement strategies

### For Students

- Audit results guide students to:
  - Use **Analytical/Creative** Coaching Modes instead of Standard
  - Use **AI Visual Learning** to create concept maps
  - Integrate **Doubt Solver** and **Essay Checker** for iterative improvement
  - Add real-world application and character reflection to submissions

## Technical Configuration

### Environment Variables
None required for the edge function itself. The function uses only Deno standard library.

### Authentication
- Function requires **JWT token** (automatically provided by Supabase when called from authenticated app session)
- Access control: **Teacher role required** (enforced via ProtectedRoute on frontend)
- CORS headers: Enabled for cross-origin requests

### Testing

**Option 1: Test via Browser**
1. Login to RetainLearn as teacher
2. Go to `/nep-auditor`
3. Submit a sample student text
4. View results instantly

**Option 2: Test via Node.js (requires authenticated session)**
```bash
node test-nep-auditor.js
```

Note: Direct API calls require JWT token. Use the app for testing.

## API Specification

### Request Payload
```json
{
  "studentName": "string",
  "submissionText": "string (full submission)",
  "submissionType": "essay|assignment|report",
  "subject": "string",
  "coachingModeUsed": "analytical|creative|standard" (optional),
  "learningStyle": "visual|auditory|readwrite|kinesthetic" (optional),
  "feedbackIntegrationCount": number (optional),
  "progressTrendData": [{ "score": number, "date": "ISO string" }] (optional)
}
```

### Response Format
```json
{
  "studentName": "string",
  "totalScore": number (0-100),
  "breakdown": {
    "criticalThinking": { "score": number, "feedback": "string" },
    "flexibility": { "score": number, "feedback": "string" },
    "assessmentQuality": { "score": number, "feedback": "string" },
    "teacherResourceUtility": { "score": number, "feedback": "string" },
    "holisticDevelopment": { "score": number, "feedback": "string" }
  },
  "globalComparison": {
    "usStandard": "string",
    "japanStandard": "string",
    "australiaStandard": "string",
    "roteLearningTrap": "string"
  },
  "deductionJustifications": ["string"],
  "modelStrategy": ["string"],
  "severity": "excellent|good|needs-improvement|critical"
}
```

## Scoring Guidelines

### Critical Thinking (20m)
- **18-20**: Strong analysis with application of concepts
- **14-17**: Moderate analytical depth
- **9-13**: Basic analysis, some narrative
- **4-8**: Mostly descriptive, minimal analysis
- **0-3**: Pure memorization, no thinking

### Flexibility (20m)
- **18-20**: Strong multidisciplinary connections (3+ domains)
- **14-17**: Good cross-disciplinary thinking
- **10-13**: Basic connection (1-2 domains)
- **5-9**: Limited to single discipline
- **0-4**: No visible cross-disciplinary thinking

### Assessment Quality (20m)
- **16-20**: Consistent high performance + iterative improvement
- **12-15**: Moderate consistency with growth
- **8-11**: Some variation, limited formative integration
- **4-7**: Highly inconsistent performance
- **0-3**: One-time effort, no evidence of improvement

### Teacher/Resource Utility (20m)
- **16-20**: Excellent use of Analytical/Creative modes + adaptive learning
- **12-15**: Good engagement with platform features
- **8-11**: Moderate platform utilization
- **4-7**: Limited use of coaching modes
- **0-3**: Standard mode only, no adaptation

### Holistic Development (20m)
- **16-20**: Character, ethics, practical skills evident
- **12-15**: Some holistic elements present
- **8-11**: Minimal non-academic content
- **4-7**: Mostly academic, little soft skills
- **0-3**: Pure academic content only

## Troubleshooting

### Function Returns 401 Unauthorized
- ✅ **Expected behavior**: Edge functions require JWT token
- ✅ **Solution**: Call from authenticated app session (which it is)
- If testing via API: Include valid `Authorization: Bearer {jwt}` header

### Function Returns Non-2xx Status
- Check browser console for error details
- Verify submission text is not empty
- Ensure all required fields are filled

### Scores Seem Too Harsh
- ✅ **By design**: NEP Auditor is strict and uncompromising
- It prioritizes competency over effort
- Does not praise; praises competency
- Identifies rote learning immediately

## Future Enhancements

1. **Database Persistence**: Store audit results per student for tracking progress over time
2. **AI-Powered Analysis**: Use Gemini/GPT to generate custom feedback beyond keyword matching
3. **Comparison Dashboard**: Show class-level trends and identify at-risk students
4. **Export Reports**: Generate PDF reports for teacher-parent conferences
5. **Integration with Progress Tab**: Automatically audit submissions as they're uploaded

## Files Involved

```
supabase/functions/nep-auditor/index.ts      # Edge function
src/pages/NEPAuditorPage.tsx                 # Frontend UI
src/App.tsx                                  # Route addition
src/pages/TeacherDashboard.tsx               # Tab integration
test-nep-auditor.js                          # Test suite
test-nep-auditor-debug.js                    # Debug script
test-nep-auditor-http.js                     # HTTP test
```

## Support

For issues or questions:
1. Check the Supabase dashboard function logs
2. Review NEPAuditorPage error boundary
3. Verify JWT token is valid in app context
4. Test submission text is substantial (>100 characters recommended)

---

**Deployed**: December 9, 2025  
**Status**: ✅ Production Ready  
**Next Step**: Train teachers on NEP Auditor features
