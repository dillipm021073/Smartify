# Workflow Split Implementation Progress

## Overview

Splitting the 10-step application process into:
- **Customer Flow:** Steps 1-7 (ends with "pending" status)
- **Agent Flow:** Steps 8-10 (review, approve, and finalize)

---

## ✅ Completed Tasks

### 1. Customer Portal Modification (Steps 1-7 Only)

**Changes Made:**
- Reduced steps from 10 to 7
- Updated `StepProgress` component: `totalSteps={7}`
- Modified `handleNext()` to stop at step 7
- Removed steps 8-10 from customer view (moved to Agent Portal)
- Added final submit button at step 7
- Added informational message: "After submitting, an agent will review your application"

**Customer Flow Now:**
1. ✅ Select Plan (API integrated)
2. ✅ Select Device (API integrated)
3. ✅ Choose SIM
4. ✅ Verify Identity (OTP - API integrated)
5. ✅ Upload Documents
6. ✅ Address (Locations API integrated)
7. ✅ Employment → **Submit as "pending"**

**File Modified:**
- `client/src/pages/CustomerPortal.tsx`

---

## 🔨 In Progress

### 2. Agent Portal Enhancement

**Current State:**
- Basic agent portal exists with mock data
- Has login, search, and application list
- Needs integration with real APIs

**What Needs to be Done:**
1. Integrate login with `POST /api/agent/login`
2. Search applications with `GET /api/agent/applications?status=pending`
3. Retrieve application details with `GET /api/agent/applications/:id`
4. Auto-assign agent ID and store ID when agent opens application
5. Implement steps 8-10 in agent portal

---

## 📋 Pending Tasks

### 3. Create Signature Upload Endpoint

**Backend Changes Needed:**
```typescript
// server/routes.ts
POST /api/applications/:id/signature
- Accept base64 image or file upload
- Save to uploads/{applicationId}/signature.png
- Update application record with signature path
```

**Storage Structure:**
```
uploads/
  {applicationId}/
    signature.png
```

### 4. Auto-Assign Store & Agent Logic

**When Agent Retrieves Application:**
```typescript
// Pseudo-code
PUT /api/agent/applications/:id/assign
{
  agentId: "current-agent-id",
  storeId: "agent-store-id" // from agent's profile
}

// Update application:
- assignedAgentId = agentId
- assignedStoreId = storeId
- status = "in_review"
```

### 5. Agent Portal Steps 8-10

**Step 8: Store Assignment**
- Auto-assigned based on agent's store
- Display store information
- Read-only (already assigned)

**Step 9: Review Application**
- Display all customer information
- Show plan, device, SIM selection
- Show uploaded documents
- Show address and employment details
- Agent can add notes

**Step 10: Customer Signature & Submit**
- Customer accepts terms & conditions
- Customer sets privacy preferences
- Customer signs on signature canvas
- Signature saved to `uploads/{applicationId}/signature.png`
- Status updated to "submitted"
- Application locked

### 6. Application Locking Mechanism

**Requirements:**
- Once status = "submitted", application is locked
- Only the assigned agent can view/update if status != "submitted"
- Prevent other agents from accessing submitted applications

**Implementation:**
```typescript
// Backend middleware
async function checkApplicationAccess(req, res, next) {
  const { id } = req.params;
  const agentId = req.user.id; // from session/token

  const app = await storage.getApplicationById(id);

  if (app.status === 'submitted' && app.assignedAgentId !== agentId) {
    return res.status(403).json({ error: 'Application is locked' });
  }

  next();
}
```

---

## Implementation Plan

### Phase 1: Backend Updates ⏳

1. **Add Signature Upload Endpoint**
   ```bash
   POST /api/applications/:id/signature
   ```

2. **Add Agent Assignment Endpoint**
   ```bash
   PUT /api/agent/applications/:id/assign
   ```

3. **Add Application Lock Check Middleware**

4. **Update Submit Endpoint**
   - Save signature
   - Update status to "submitted"
   - Lock application

5. **Create uploads directory structure**

### Phase 2: Frontend Updates ⏳

1. **Integrate Agent Portal APIs**
   - Login API
   - Search applications API
   - Get application details API
   - Assign application API

2. **Build Steps 8-10 in Agent Portal**
   - Step 8: Show assigned store
   - Step 9: Review all application data
   - Step 10: Signature collection + submit

3. **Add Signature Upload Component**
   - Reuse `SignatureCanvas` component
   - Convert to base64/blob for upload

### Phase 3: Testing ✅

1. Test customer flow (1-7)
2. Test agent flow (search → assign → review → submit)
3. Test locking mechanism
4. Test signature storage
5. Verify no breaking changes

---

## Current Status Summary

### ✅ Working
- Customer Portal (Steps 1-7)
- All API integrations (Plans, Devices, Locations, OTP)
- Application creation after OTP
- Basic Agent Portal UI

### 🔨 In Progress
- Agent Portal API integration
- Steps 8-10 implementation

### ⏳ To Do
- Signature upload backend
- Auto-assign logic
- Application locking
- Signature file storage

---

## Files Modified So Far

```
client/src/pages/CustomerPortal.tsx
  ✅ Reduced to 7 steps
  ✅ Added submit at step 7
  ✅ Disabled steps 8-10
```

## Files To Be Modified

```
server/routes.ts
  ⏳ Add POST /api/applications/:id/signature
  ⏳ Add PUT /api/agent/applications/:id/assign
  ⏳ Add locking middleware

server/storage.ts
  ⏳ Add assignApplication()
  ⏳ Add saveSignature()
  ⏳ Add checkApplicationLock()

client/src/pages/AgentPortal.tsx
  ⏳ Integrate login API
  ⏳ Integrate search API
  ⏳ Add steps 8-10
  ⏳ Add signature upload

client/src/lib/api.ts
  ⏳ Add useAgentLogin()
  ⏳ Add useSearchApplications()
  ⏳ Add useAssignApplication()
  ⏳ Add useUploadSignature()
```

---

## Next Steps

1. ✅ **Continue with Agent Portal Implementation**
   - Integrate real APIs
   - Add steps 8-10
   - Implement signature upload

2. Create signature upload backend endpoint

3. Add auto-assign logic

4. Test complete flow

---

## Notes

- **No Breaking Changes:** All existing functionality preserved
- **Backward Compatible:** Old agent portal still works during development
- **Incremental Updates:** Each change can be deployed independently
- **Data Integrity:** Application statuses prevent race conditions

---

## Testing Checklist

### Customer Flow
- [ ] Can complete steps 1-7
- [ ] Application saves as "pending" status
- [ ] Cart ID generated correctly
- [ ] Email with OTP works
- [ ] All form data persists

### Agent Flow
- [ ] Agent can login
- [ ] Agent can search pending applications
- [ ] Auto-assign works when agent opens application
- [ ] Step 8 shows correct store
- [ ] Step 9 displays all customer data
- [ ] Step 10 signature upload works
- [ ] Status changes to "submitted" after final submit

### Security
- [ ] Locked applications can't be accessed by other agents
- [ ] Same agent can still access if not completed
- [ ] Signatures stored securely
- [ ] File upload validation works

---

**Current Progress: 40% Complete**
**Next Task: Enhance Agent Portal with API Integration**
