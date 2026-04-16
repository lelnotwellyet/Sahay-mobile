# PROMPT FOR CLAUDE WEB (claude.ai)

## Instructions for use:
## 1. Go to claude.ai
## 2. Start a new chat
## 3. Attach the reference PDF: /home/lelnotwellyet/Downloads/SAMEER_PATIL_062.pdf
## 4. Copy-paste EVERYTHING below the line into the chat
## -------------------------------------------------------------------

I need you to create a complete academic project whitebook/report for my final year BSc IT project. I'm attaching a reference PDF (Sameer Patil's CareerPulse AI report) — **use the EXACT same template, formatting, page layout, fonts, heading styles, table styles, and structure** from that PDF.

My project is called **Sahay** — an AI-powered mobile mental health platform with peer-to-peer video consultation built in React Native.

**IMPORTANT REQUIREMENTS:**
- Follow the reference PDF template EXACTLY — same chapter structure, same formatting style, same table formats, same page layout
- Create **PROPER UML/visual diagrams** (Use Case, ERD, DFD Level 0, DFD Level 1, Class Diagram, Sequence Diagram, State Diagram, Flow Chart, Menu Tree, Gantt Chart) — not ASCII art, not text descriptions. Render them as actual diagrams using artifacts/SVG/images
- Leave `[Screenshot: ...]` placeholders where app screenshots should go — I'll add those myself
- Leave placeholders for my personal details (name, roll number, guide, college) — I'll fill those in

---

## COMPLETE PROJECT INFORMATION

### What is Sahay?
Sahay (meaning "help/support" in Hindi/Nepali) is a React Native mobile application that connects clients seeking mental health support with verified psychiatrists through real-time peer-to-peer video consultations. It features anonymous access, affordable pricing (₹99–₹499), admin-verified psychiatrists, AI chatbot support, and crisis helpline integration.

### Target Market
India — where the mental health treatment gap exceeds 80% (NIMHANS, 2015-16). Crisis helpline integrated: iCall 9152987821.

---

### Tech Stack
- **Framework**: React Native + Expo SDK 55, TypeScript
- **Authentication**: Firebase 12 Auth (anonymous, email/password, Google Sign-In)
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Real-time Signaling**: Supabase Realtime broadcast channels
- **Video Calling**: react-native-webrtc (peer-to-peer WebRTC)
- **NAT Traversal**: Google STUN servers (stun.l.google.com:19302)
- **AI Chat**: Google Gemini API
- **Navigation**: React Navigation 6 (Stack + Bottom Tabs)
- **UI Components**: React Native Paper, Ionicons (@expo/vector-icons)
- **Storage**: AsyncStorage for session persistence, Supabase Storage for license images
- **Push Notifications**: expo-notifications
- **Image Picker**: expo-image-picker (for license upload)

---

### User Roles (3 roles)
1. **Client** — seeks mental health support. Can login anonymously (gets alias like "CalmOwl#7392"), via email, or Google. Can browse psychiatrists, request video sessions, rate sessions, use AI chatbot, access self-care resources.
2. **Psychiatrist** — licensed professional. Must complete 3-step onboarding (credentials → profile → license upload), wait for admin approval, then toggle online/offline to accept session requests.
3. **Admin** — reviews psychiatrist applications, views platform dashboard stats, approves/rejects applications. Admin accounts created manually in database.

---

### Database Tables (Supabase PostgreSQL)

**Table: users**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| firebase_uid | VARCHAR(128) | NOT NULL, UNIQUE |
| email | VARCHAR(255) | NULLABLE (anon users) |
| display_name | VARCHAR(100) | NULLABLE |
| role | VARCHAR(20) | NOT NULL, CHECK (client/psychiatrist/admin) |
| is_anonymous | BOOLEAN | NOT NULL, DEFAULT false |
| alias | VARCHAR(50) | NULLABLE (e.g., BlueFox#4821) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

**Table: psychiatrists**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| user_id | UUID | FK → users(id), UNIQUE |
| full_name | VARCHAR(100) | NOT NULL |
| license_number | VARCHAR(50) | NOT NULL |
| license_image_url | TEXT | NOT NULL (Supabase Storage URL) |
| specialization | VARCHAR(100) | NOT NULL |
| experience | INTEGER | NOT NULL, CHECK >= 0 |
| bio | TEXT | NOT NULL, CHECK length >= 20 |
| price | INTEGER | NOT NULL, CHECK 99–499 |
| is_approved | BOOLEAN | NOT NULL, DEFAULT false |
| is_online | BOOLEAN | NOT NULL, DEFAULT false |
| rating | DECIMAL(2,1) | NOT NULL, DEFAULT 5.0 |
| total_sessions | INTEGER | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

**Table: sessions**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| client_id | UUID | FK → users(id) |
| psychiatrist_id | UUID | FK → psychiatrists(id) |
| status | VARCHAR(20) | NOT NULL, CHECK (pending/active/completed/cancelled) |
| type | VARCHAR(10) | NOT NULL, CHECK (chat/video) |
| rating | INTEGER | NULLABLE, CHECK 1–5 |
| started_at | TIMESTAMPTZ | NULLABLE |
| ended_at | TIMESTAMPTZ | NULLABLE |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

**Table: messages**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| session_id | UUID | FK → sessions(id) |
| sender_id | UUID | FK → users(id) |
| text | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

**Table: notifications**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users(id) |
| title | VARCHAR(100) | NOT NULL |
| body | TEXT | NOT NULL |
| data | JSONB | NULLABLE |
| read | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() |

**Relationships:**
- users (1) → (0..1) psychiatrists [user_id FK]
- users (1) → (0..*) sessions [client_id FK]
- psychiatrists (1) → (0..*) sessions [psychiatrist_id FK]
- sessions (1) → (0..*) messages [session_id FK]
- users (1) → (0..*) messages [sender_id FK]
- users (1) → (0..*) notifications [user_id FK]

---

### App Architecture

**Entry Point:** App.tsx → GestureHandlerRootView → AuthProvider → NavigationContainer → RootNavigator

**Navigation Structure:**
```
RootNavigator (role-based routing)
├── AuthNavigator (Stack)
│   ├── Welcome Screen
│   ├── Login Screen
│   └── Register Screen (role param: client/psychiatrist)
│
├── ClientNavigator
│   ├── Bottom Tabs:
│   │   ├── Home Tab → ClientHomeScreen
│   │   └── Find Tab → FindPsychScreen
│   └── Stack Screens:
│       ├── SessionRequestScreen
│       ├── PaymentScreen
│       ├── SessionWaitingScreen
│       ├── VideoCallScreen
│       ├── AI ChatScreen
│       └── SelfCareScreen
│
├── PsychNavigator
│   ├── OnboardingScreen (3-step, skipped if profile exists)
│   ├── Bottom Tabs:
│   │   ├── Home Tab → PsychHomeScreen
│   │   └── Queue Tab → SessionQueueScreen
│   └── Stack Screens:
│       ├── VideoCallScreen
│       └── EditProfileScreen
│
└── AdminNavigator
    ├── Bottom Tabs:
    │   ├── Dashboard Tab → AdminDashboard
    │   └── Applications Tab → PsychApplications
    └── Stack Screen:
        └── ApplicationDetailScreen
```

---

### Key Code Modules

**1. Firebase Config (src/config/firebase.ts)**
- Uses `getApps().length === 0` check to prevent hot-reload crash
- `initializeAuth` with `getReactNativePersistence(AsyncStorage)` for session persistence
- All config values from environment variables (EXPO_PUBLIC_* prefix)

**2. Supabase Client (src/config/supabase.ts)**
- Creates client with AsyncStorage for auth persistence
- `detectSessionInUrl: false` (required for React Native, no browser URL)
- Handles both database CRUD and Realtime broadcast channels

**3. AuthContext (src/context/AuthContext.tsx)**
- Central auth provider managing user state
- Supports: signInAnon(), signInEmail(), registerEmail(), signInWithGoogle(), logout()
- `pendingRoleRef` (useRef) solves race condition: during registration, `onAuthStateChanged` fires before `registerEmail` returns, so the ref stores the intended role
- On login: checks Supabase for existing user → if not found, creates record with alias (for anon users)
- Registers push notification token after login

**4. Anonymous Name Generator (src/utils/anonymousName.ts)**
- 15 adjectives × 15 animals × 9000 numbers = 2,025,000 combinations
- Produces aliases like "CalmOwl#7392", "BraveLion#5814"
- Reduces stigma — friendly, nature-themed naming

**5. useWebRTC Hook (src/hooks/useWebRTC.ts)**
- Accepts sessionId and userId parameters
- Creates RTCPeerConnection with Google STUN servers
- Uses Supabase Realtime channel `video-call-{sessionId}` for signaling
- Handles SDP offer/answer exchange and ICE candidate negotiation
- Queues ICE candidates received before remote description is set
- Exposes: localStream, remoteStream, connected, isMuted, isCameraOff, toggleMute(), toggleCamera(), switchCamera(), cleanup()
- "Polite peer" pattern for simultaneous offer handling

**6. RootNavigator (src/navigation/RootNavigator.tsx)**
- Checks user.role → renders ClientNavigator, PsychNavigator, or AdminNavigator
- Shows loading spinner during auth state resolution

---

### All Screens (18 screens)

**Auth Screens:**
1. **WelcomeScreen** — App logo, tagline, 3 buttons (Continue Anonymously, Sign In, Register), crisis helpline banner
2. **LoginScreen** — Email/password form, Google Sign-In button, validation
3. **RegisterScreen** — Role selection (Client/Psychiatrist), email/password form, confirm password

**Client Screens:**
4. **ClientHomeScreen** — Greeting with alias/name, Find a Doctor card, AI chatbot card, self-care resources, mental health tips, crisis helpline card
5. **FindPsychScreen** — Search bar (name/specialization), All/Online filter toggle, FlatList of psychiatrist cards (avatar, name, specialization, experience, rating, price in ₹, bio, Request Session button), pull-to-refresh
6. **SessionRequestScreen** — Psychiatrist info card, Video Call type (pre-selected), session fee display (₹), confidentiality badge, "Proceed to Pay" button
7. **PaymentScreen** — Order summary, payment method selector (UPI/Card), Pay Now button
8. **SessionWaitingScreen** — Animated loading, "Waiting for doctor to accept...", polls every 3s, cancel button, 2-min timeout
9. **VideoCallScreen (Client)** — Fullscreen remote video, PiP local video (120×160, top-right, purple border, tap to flip), header with doctor name + connection status (green/orange dot), controls bar (mute, camera, end call red button, flip camera), post-call rating modal (1-5 stars, submit/skip)

**Psychiatrist Screens:**
10. **OnboardingScreen (3-step)** — Step 1: Full name + license number. Step 2: Specialization grid (8 options: General Psychiatry, Child & Adolescent, Addiction, Geriatric, Forensic, Anxiety & Depression, Trauma & PTSD, Couples Therapy) + experience + bio + price (₹99-499). Step 3: License image upload (dashed border area, Supabase Storage). Progress dots (1-2-3).
11. **PsychHomeScreen** — Greeting, approval status banner (if not approved), online/offline toggle switch, stats row (Rating/Sessions Done/Pending — 3 colored cards), Quick Actions (Session Queue with badge, Edit Profile), Recent Ratings list
12. **SessionQueueScreen** — Pending sessions list (client alias, type, time, Accept/Decline buttons), active sessions with Rejoin button
13. **EditProfileScreen** — Pre-filled form (bio, specialization, experience, price), Save Changes button
14. **VideoCallScreen (Psych)** — Same as client video call but shows client alias, no rating modal, navigates to PsychTabs on end

**Admin Screens:**
15. **AdminDashboard** — Stats cards (Pending Applications, Approved Psychiatrists, Total Clients, Active Sessions), quick action to Applications
16. **PsychApplications** — Pending/Approved tabs, list of psychiatrist cards
17. **ApplicationDetailScreen** — Full profile view, license image preview, Approve (green) / Reject (red) buttons

---

### Session Flow (end-to-end)
```
Client: FindPsych → SessionRequest → Payment → SessionWaiting [polls 3s] → VideoCall
Psych: SessionQueue → Accept → VideoCall
Admin: PsychApplications → ApplicationDetail → Approve/Reject
```

### WebRTC Video Call Flow
1. Both users navigate to VideoCallScreen
2. useWebRTC hook: getUserMedia() captures camera + mic
3. Both subscribe to Supabase Realtime channel `video-call-{sessionId}`
4. First peer creates SDP offer → broadcasts via channel
5. Second peer receives offer → creates answer → broadcasts
6. Both exchange ICE candidates via same channel
7. RTCPeerConnection established → video streams flow P2P (SRTP encrypted)
8. End call → cleanup() sends hang-up → session updated to completed

### Session State Lifecycle
```
Idle → [request] → Pending → [accept] → Active → [WebRTC connected] → Connected → [end call] → Completed → [rate] → Rated
                          → [decline/timeout] → Cancelled
```

---

### Event Table (12 events)

| # | Event | Actor | Input | Output | Process |
|---|-------|-------|-------|--------|---------|
| 1 | Anonymous Login | Client | Tap button | Alias generated, navigated to home | Firebase anon auth → Supabase user insert |
| 2 | Email Registration | Client/Psych | Email, password, role | Account created | Firebase create → Supabase insert with role |
| 3 | Google Sign-In | Client/Psych | Google OAuth | Account linked | Google → Firebase → Supabase |
| 4 | Browse Psychiatrists | Client | Screen focus | List of approved psychiatrists | Supabase SELECT WHERE is_approved=true |
| 5 | Request Session | Client | Tap Request | Pending session created | Supabase INSERT session |
| 6 | Payment | Client | Payment method | Payment confirmed | Create session, navigate to waiting |
| 7 | Accept Session | Psychiatrist | Tap Accept | Session active | Supabase UPDATE status=active |
| 8 | WebRTC Connection | Both | Auto | Video call starts | SDP offer/answer + ICE via Supabase Realtime |
| 9 | End Call | Either | Tap End | Session completed | Cleanup WebRTC, UPDATE status=completed |
| 10 | Rate Session | Client | 1-5 stars | Rating saved | UPDATE session + recalculate psych average |
| 11 | Psychiatrist Onboarding | Psychiatrist | Profile + license | Application submitted | INSERT psychiatrist, upload to Storage |
| 12 | Admin Approval | Admin | Tap Approve | Psychiatrist activated | UPDATE is_approved=true |

---

### Design Details
- Primary color: `#6C63FF` (purple)
- Background: `#F0F4FF`
- Font style: Bold headings, rounded cards with shadows
- Pattern: SafeAreaView → ScrollView/FlatList, useFocusEffect for refresh
- Consistent UI: React Native Paper components, Ionicons

---

### Project Timeline (Gantt Chart)
- Dec 2025 – Jan 2026: Project Planning & Research
- Jan 2026: Firebase Auth & Supabase Setup
- Jan–Feb 2026: React Native App Scaffolding
- Feb 2026: Auth Screens + Navigation
- Feb–Mar 2026: Client Screens
- Mar 2026: Psychiatrist Onboarding & Session Queue
- Mar 2026: Admin Dashboard & Approval
- Mar 2026: AI Chat Integration (Gemini)
- Mar–Apr 2026: WebRTC Video Call System
- Apr 2026: Self Care Module
- Apr 2026: Testing, Debugging & Optimization

---

### Non-Functional Metrics
| Parameter | Target | Achieved |
|-----------|--------|----------|
| App Startup | < 3s | ~2.1s |
| Auth Response | < 2s | ~1.5s |
| Video Connection | < 5s | ~3-4s |
| APK Size | < 150 MB | ~132 MB |
| Platform | Android | Android (iOS ready) |

---

### Related Work / Comparison

| Feature | Sahay | Practo | BetterHelp | Wysa | YourDOST | Talkiatry |
|---------|-------|--------|------------|------|----------|-----------|
| Anonymous Access | Yes | No | No | Partial | No | No |
| Video Calls (P2P) | Yes | Yes | Yes | No | Yes | Yes |
| India-Focused | Yes | Yes | No | Yes | Yes | No |
| Affordable (₹99-499) | Yes | Medium | No | Free* | Medium | No |
| Psych Verification | Yes | Yes | Yes | N/A | Yes | Yes |
| AI Chatbot | Yes | No | No | Yes | No | No |
| Open Source | Yes | No | No | No | No | No |
| Crisis Helpline | Yes | No | Yes | Yes | No | No |
| No Backend Server | Yes | No | No | No | No | No |

---

### Future Work (10 items)
1. AI-Powered Chat Integration (Gemini API for 24/7 support)
2. TURN Server (Coturn/Twilio for restrictive networks)
3. Push Notifications (EAS credentials for production delivery)
4. Payment Gateway (Razorpay/Cashfree integration)
5. End-to-End Encryption for Chat (Signal Protocol)
6. Appointment Scheduling (calendar-based booking)
7. Session Notes & History
8. Multi-Language Support (Hindi, Marathi, Tamil)
9. iOS Deployment
10. Analytics Dashboard

---

### References
1. React Native Documentation — reactnative.dev
2. Expo SDK 55 Documentation — docs.expo.dev
3. TypeScript Documentation — typescriptlang.org
4. Firebase Authentication — firebase.google.com/docs/auth
5. Supabase Documentation — supabase.com/docs
6. WebRTC Project — webrtc.org
7. react-native-webrtc — github.com/react-native-webrtc
8. React Navigation — reactnavigation.org
9. NIMHANS National Mental Health Survey 2015-16
10. Gaiha et al. (2020) — "Enhancing mental health literacy in India"
11. WHO Mental Health Atlas 2022 — India Country Profile
12. Google Gemini API — ai.google.dev/docs
13. React Native Paper — callstack.github.io/react-native-paper
14. AsyncStorage — react-native-async-storage.github.io
15. Google STUN/TURN — webrtc.github.io/samples

---

### Project Directory Structure
```
Sahay/
├── App.tsx
├── app.json
├── babel.config.js
├── tsconfig.json
├── package.json
├── .env
├── android/
└── src/
    ├── types/index.ts
    ├── utils/ (anonymousName.ts, validators.ts, notifications.ts)
    ├── config/ (firebase.ts, supabase.ts)
    ├── context/ (AuthContext.tsx)
    ├── hooks/ (useWebRTC.ts)
    ├── navigation/ (RootNavigator, AuthNavigator, ClientNavigator, PsychNavigator, AdminNavigator)
    ├── screens/
    │   ├── auth/ (Welcome, Login, Register)
    │   ├── client/ (ClientHome, FindPsych, SessionRequest, Payment, SessionWaiting, VideoCall)
    │   ├── psychiatrist/ (Onboarding, PsychHome, SessionQueue, EditProfile, VideoCall)
    │   └── admin/ (AdminDashboard, PsychApplications, ApplicationDetail)
    └── styles/screens/ (separated style files per screen)
```

---

## NOW GENERATE THE FULL WHITEBOOK

Create the complete project report following the reference PDF template EXACTLY. Include:

1. **Front Matter**: Cover page, Certificate, Certificate of Approval, Declaration, Index/Table of Contents, List of Figures, List of Tables, Abstract
2. **Chapter 1 — Introduction**: Introduction, Project Description, Stakeholders, Motivation, Scope
3. **Chapter 2 — Literature Survey**: Existing System, Limitations, Objectives, Gantt Chart
4. **Chapter 3 — Methodology**: Technologies Used, Event Table, Use Case Diagram + Descriptions, ERD, Flow Diagram, DFD Level 0, DFD Level 1, Class Diagram, Sequence Diagram, State Diagram, Menu Tree
5. **Chapter 4 — Implementation**: Database tables with attributes, System Coding (key code snippets with annotations), Screen Layouts (all 18 screens with `[Screenshot: ...]` placeholders)
6. **Chapter 5 — Analysis and Related Work**: System Analysis (functional, non-functional, security), Testing (unit + integration test cases in tables), Related Work comparison table
7. **Chapter 6 — Conclusion and Future Work**: Conclusion, Future Work (10 items), References
8. **Appendix**: Environment variables, Build commands, Directory structure

**FOR ALL DIAGRAMS** (Use Case, ERD, DFD Level 0, DFD Level 1, Flow Chart, Class Diagram, Sequence Diagram, State Diagram, Gantt Chart, Menu Tree) — generate them as **proper visual diagrams**, not text/ASCII. Use SVG, Mermaid, or rendered artifacts.

Use `[Your Full Name Here]`, `[Your Roll Number]`, `[Your Guide Name Here]`, `[Your College Name Here]` as placeholders for my personal details.

Use `[Screenshot: Screen Name]` as placeholders where app screenshots should go.
