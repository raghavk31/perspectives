# Perspectives — AI Context File

## What is Perspectives?
Perspectives is a peer conversation platform for people aged 24–36 (primarily Bangalore-based) navigating life transitions — career, identity, relationships, meaning. It's not therapy, not networking. It's structured, intimate conversation with the right people.

The product sits at the intersection of three bets:
- **Bet A** — Recurring peer groups (cohorts of 5–6 people, meeting regularly)
- **Bet B** — One-off Sphere conversations (on-demand, topic-driven)
- **Bet C (long-term)** — AI layer that learns from a user's conversation history across sessions to surface insights, patterns, and better matches over time

Current focus: Bet A + B, with data infrastructure laid for Bet C.

---

## The Full Product Loop

```
Seeker floats a thought
  → AI tool (separate Vercel app) interviews them
  → Generates a conversation framework + visual poster
  → Saved to Supabase (frameworks table, with user_id)
  → [THIS APP] Detects unactivated framework → "Launch your Sphere"
  → Public Sphere page goes live (framework poster + seeker intent)
  → Joiners discover it → apply with 4 questions (2 objective, 2 subjective)
  → Seeker reviews applications → approves/rejects
  → Approved members get a Whereby video room link
  → Conversation happens
  → Post-conversation:
      - Double opt-in connections (network graph grows over time)
      - AI-generated insights from stories shared/heard
      - Journal entries + shareable collaterals
```

---

## Tech Stack

- **Frontend**: Expo (React Native) with expo-router, targeting iOS + Android
- **Styling**: NativeWind (Tailwind for React Native)
- **Backend**: Supabase (auth + database)
- **Auth**: Magic link / Email OTP — no passwords
- **Video**: Whereby.com (embedded or deep link)
- **AI framework tool**: Separate Vercel app (perspectives-nine.vercel.app) — not in this repo, do not modify

---

## Supabase

- **Dev project URL**: https://hqwxrvfqcdnlgxutbttq.supabase.co
- **Prod project**: https://qhzbnyffuzlolvtantsx.supabase.co
- Always use dev unless explicitly told otherwise
- Anon key is in `.env` — never hardcode it

---

## Database Schema

### Existing tables (inherited from prod)

```sql
users
  id, email, name, phone, city, bio, profile_photo,
  is_subscriber, whatsapp_opt_in, role, linkedin_url,
  twitter_url, instagram_url, primary_auth_method,
  subscriber_since, subscriber_expires_at,
  has_filled_dots_feedback, created_at, updated_at

frameworks
  id, topic_name, dimensions (jsonb), user_id, event_id,
  session_id, svg_content, created_at, updated_at
  NOTE: event_id is null when framework hasn't been launched as a Sphere yet

conversations
  id, session_id, messages (jsonb), framework_id,
  user_id, event_id, cohort_id, created_at, updated_at

events (Spheres)
  id, initiator_id, topic, intent, status, modality,
  token, date, start_time, end_time, ends_at,
  location_id, tags, is_anonymous, voice_summary,
  chat_messages, title_image, carousel_images, created_at

event_requests (applications to join a Sphere)
  id, user_id, event_id, request_message, status,
  is_interest, admin_notes, approved_by, payment_id,
  credit_used, checked_in_at, approved_at, created_at, updated_at

prompts
  id, framework_id, phase, dimension, text, order

payments
  id, user_id, event_id, razorpay_order_id,
  razorpay_payment_id, amount, currency, status,
  payment_kind, subscription_months, created_at
```

### New tables (added for this rebuild)

```sql
user_profiles
  id, user_id (→ users), life_stage, current_focus,
  goals (jsonb), themes_of_interest (jsonb),
  open_to_cohort, created_at, updated_at

cohorts
  id, name, theme, description, status,
  max_members (default 6), cadence, created_at

cohort_members
  id, cohort_id (→ cohorts), user_id (→ users),
  joined_at, status

sessions
  id, cohort_id, framework_id, scheduled_at, ended_at,
  recording_url, summary, session_number, created_at

attendance
  id, session_id (→ sessions), user_id (→ users),
  joined_at, left_at, was_present

connections (post-conversation double opt-in)
  id, user_a (→ users), user_b (→ users),
  session_id, opted_in_a, opted_in_b, connected_at

insights (AI-generated per user per session)
  id, user_id, session_id, content, type, created_at
  -- type: 'reflection' | 'pattern' | 'quote'

artifacts (journal + shareable collaterals)
  id, user_id, session_id, type, content (jsonb),
  is_public, created_at
  -- type: 'journal' | 'collateral' | 'shareable'
```

---

## App Structure

```
/app
  index.tsx                    — landing screen
  (auth)/login.tsx             — magic link login
  (protected)/dashboard.tsx    — seeker dashboard
  (protected)/sphere/[id].tsx  — public sphere page
  (protected)/apply/[id].tsx   — application form

/lib
  supabase.ts                  — supabase client
  types.ts                     — all TypeScript types

/context
  auth.tsx                     — auth state, session management
```

---

## Key Product Concepts

**Seeker** — the person who floats a topic and initiates a Sphere. They own the conversation, curate who joins.

**Joiner** — someone who discovers a Sphere and applies to join. Answers 4 questions to be considered.

**Sphere** — a single conversation event. Has a topic, framework, seeker, and up to N joiners. Happens on Whereby.

**Framework** — the structured conversation guide generated by the AI tool. Has phases (Icebreaker → Breakout → Conclusion), dimensions, and prompts. This is core IP.

**Cohort** — a recurring peer group of 5–6 people. Meets regularly (weekly/biweekly). Separate from one-off Spheres.

**Unactivated framework** — a framework where `event_id` is null. This is the trigger for "Launch your Sphere" on the dashboard.

---

## Build Phases

### Phase 1 — Core (current focus)
- [ ] Auth (magic link)
- [ ] Seeker dashboard — shows frameworks, "Launch Sphere" CTA
- [ ] Launch Sphere flow — creates event row, generates public page
- [ ] Public Sphere page — poster, seeker intent, apply button
- [ ] Application flow — 4 questions saved to event_requests
- [ ] Seeker inbox — review + approve/reject applications

### Phase 2 — Conversation
- [ ] Whereby room generated on approval
- [ ] Approved members notified
- [ ] Attendance tracking

### Phase 3 — Post-conversation
- [ ] Double opt-in connections
- [ ] AI insights generation
- [ ] Journal + shareable artifacts

---

## Design Principles
- Mobile-first, built for iOS + Android
- Warm, intimate — not corporate, not clinical
- Every screen should feel like it's designed for a thoughtful person
- Avoid generic UI patterns — this is a human product
- Raghav has strong aesthetic sensibility — always ask before making big visual decisions

## What NOT to do
- Do not touch the Vercel app (perspectives-nine.vercel.app)
- Do not modify prod Supabase (qhzbnyffuzlolvtantsx)
- Do not add passwords — magic link only
- Do not build admin panel yet — Raghav manages cohorts via Supabase dashboard for now
- Do not over-engineer — ship Phase 1 first
