# Sleepify

A Progressive Web App that transforms YouTube audio into sleep-friendly MP3s — so you can fall asleep to any content without being jolted awake by loud music, inconsistent volume, or jarring sound effects.

## The Problem

Falling asleep to YouTube content is a common habit, but raw audio is rarely sleep-friendly:

1. **Loud background music** drowns out the speaker and keeps you alert
2. **Inconsistent volume** — sudden loud passages jolt you awake
3. **Jarring sound effects** — laughter, coughing, applause, and other non-speech sounds break relaxation
4. **Speaking pace is too fast** — energetic delivery is stimulating, not soothing
5. **Voice pitch is too high** — higher-pitched voices are less conducive to sleep

## How It Works

Sleepify's API runs audio through a multi-step processing pipeline that addresses each pain point:


| Step                        | Technology                      | What It Does                                                                                |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| **1. Vocal Isolation**      | Demucs vocal separation         | Isolates the human voice, stripping away loud background music, sound effects, and applause |
| **2. Volume Normalization** | EBU R128 loudness normalization | Eliminates volume inconsistencies so listeners aren't jolted awake by sudden loud passages  |
| **3. Tempo Reduction**      | 0.85x speed adjustment          | Slows down fast speakers into a more relaxing, sleep-conducive pace                         |
| **4. Pitch Lowering**       | -2 semitones shift              | Produces a deeper, more soothing vocal tone                                                 |


The result is exported as a clean **192kbps MP3** ready for bedtime listening.

> **Note:** Human-originated sounds like laughter or coughing still pass through since Demucs treats them as vocal content. A ClearVoice-based speech enhancement function already exists in the codebase and could be wired into the pipeline to further address this.

For backend API architecture, audio processing pipeline details, and database design, see the [sleepify-api](https://github.com/Pikago-hub/sleepify-api) repository.

## Try It Out

Head to [https://sleepify-five.vercel.app/](https://sleepify-five.vercel.app/), sign up for an account, and paste a YouTube URL. The current hosted version supports up to **5 minutes** of audio processing per clip.

## Run Locally

If you want to adjust variables or remove the 5-minute limit, you can run Sleepify locally:

1. Clone this repo and install dependencies:

```bash
git clone https://github.com/Pikago-hub/sleepify.git
cd sleepify
bun install
```

1. Set up the backend API server by following the instructions at [sleepify-api](https://github.com/Pikago-hub/sleepify-api).
2. Start the dev server:

```bash
bun dev
```

## Commands

```bash
bun install       # Install dependencies
bun dev           # Start development server (port 3000)
bun run build     # Production build
bun start         # Start production server
bun lint          # Run ESLint
```

---

## Technical Architecture Decision

### Market Opportunity

**TAM (Total Addressable Market):** 100–150M US users who consume audio content and have sleep-related needs.

**SAM (Serviceable Addressable Market):** 30–50M users who already use YouTube or podcasts as part of their sleep routine.

### User Behavior Data

The data overwhelmingly points to mobile as the primary device for sleep audio consumption:


| Behavior                                | Percentage                | Source                               |
| --------------------------------------- | ------------------------- | ------------------------------------ |
| Use phone within 1 hour of bedtime      | 87%                       | AASM Survey 2023, YouGov 2022        |
| Sleep with phone in bedroom             | 87%                       | AASM                                 |
| Sleep with phone next to bed            | 71%                       | Smartphone Addiction Statistics 2025 |
| Young adults (18–30) sleep with phone   | 92%                       | Log Off Media 2024                   |
| Use smartphone before bed (of all tech) | 70.6%                     | National Sleep Foundation            |
| Use smartphone in bedroom               | 79.1% of smartphone users | NSF Study                            |


**Key takeaway:** 70–87% of sleep audio listeners use mobile. Any product targeting this behavior must be mobile-first.

### Form Factor Evaluation

We evaluated three product form factors against the requirements of an MVP targeting sleep audio users.

#### Option A: Chrome Extension

**Pros**

- Best UX for the core flow: one-click processing directly on a YouTube page, no copy-pasting links
- Tight integration with the YouTube player

**Cons**

- Only works on Chrome — cuts out Safari, Firefox, and all mobile browsers
- Zero mobile reach, which eliminates 70–87% of the target market
- Clunky onboarding: users must find it in the Chrome Web Store, install it, manage permissions, and understand the toolbar icon
- Desktop-only users account for only 10–15% of sleep audio usage

#### Option B: Native Mobile App

**Pros**

- Background playback works perfectly on iOS (screen-off audio is a first-class citizen)
- Offline storage and local caching are straightforward
- Push notifications for processing status

**Cons**

- **4–6 weeks to build** vs 2–3 weeks for a web app — slower validation
- App Store approval delays + YouTube ToS risk (both Apple and Google actively enforce against apps that download or reprocess YouTube content)
- Two codebases required (iOS + Android), or a cross-platform framework with its own tradeoffs
- Every update goes through app store review — can't iterate quickly on user feedback

#### Option C: Web App + PWA (chosen)

**Pros**

- **Reaches 100% of market** — works on mobile and desktop with a single codebase
- Mobile-optimized: 80% of development effort is spent on the mobile UX, matching how users actually consume sleep audio
- PWA features close the gap with native: installable to home screen, offline playback, background audio with screen locked
- **2–3 week build time** — fastest path to validating the product
- Single codebase — lower cost, faster iteration
- No app store gatekeeping — ship updates instantly, no review cycle
- SEO-discoverable — users find you through search, not an app store listing
- Lower platform risk — not subject to App Store / Play Store policies around YouTube content

**Cons**

- Core UX requires a copy-paste step (paste a YouTube link) rather than one-click
- Some PWA capabilities still catching up to native (e.g., deeper OS integrations)

**Why not desktop-first?** Only 10–15% of sleep audio users are on desktop. A mobile-first web app still works on desktop, but desktop users frequently switch to mobile for actual sleep anyway.

### Weighted Scoring Matrix

Each dimension is weighted by importance to the MVP and scored 1–10:


| Dimension          | Weight   | Web Score  | Native Score | Winner       |
| ------------------ | -------- | ---------- | ------------ | ------------ |
| Development Cost   | 15%      | 10/10      | 3/10         | Web +10.5    |
| Time to Market     | 15%      | 10/10      | 3/10         | Web +10.5    |
| Risk Level         | 15%      | 10/10      | 2/10         | Web +12.0    |
| Core Processing    | 20%      | 10/10      | 10/10        | Tie          |
| Background Audio   | 10%      | 6/10       | 10/10        | Native -4.0  |
| User Acquisition   | 10%      | 9/10       | 4/10         | Web +5.0     |
| Iteration Speed    | 10%      | 10/10      | 2/10         | Web +8.0     |
| Revenue Efficiency | 5%       | 10/10      | 7/10         | Web +1.5     |
| **TOTAL**          | **100%** | **9.3/10** | **6.1/10**   | **Web +53%** |


The web app scores higher across every dimension except background audio, where native holds a slight edge — but PWA background audio is sufficient for the core use case (playing audio with the screen locked).

### Form Factor Comparison


| Criteria            | Chrome Extension    | Mobile App       | Web + PWA              |
| ------------------- | ------------------- | ---------------- | ---------------------- |
| Market reach        | Chrome desktop only | iOS + Android    | All browsers + mobile  |
| Onboarding friction | Medium              | High (app store) | Low (just a link)      |
| Background playback | N/A (desktop)       | Excellent        | Works (screen lock OK) |
| Build time          | 1–2 weeks           | 4–6 weeks        | 2–3 weeks              |
| Iteration speed     | Medium              | Slow             | Fast                   |
| Platform risk (ToS) | Low                 | High             | Low                    |
| Development cost    | Low                 | High             | Low                    |
| Offline support     | Limited             | Excellent        | Good                   |
| Mobile UX           | None                | Native           | Mobile-optimized       |


### Decision

**Web App + PWA**, mobile-optimized. It reaches the entire addressable market, validates the product in 2–3 weeks, carries the lowest platform risk, and delivers the background-audio capability that matters most for a sleep app. Native mobile remains a viable future option once the product-market fit is proven and the ToS landscape is clearer.

---

## Potential Improvements

To become a production-ready SaaS, the following areas need to be addressed:

### Infrastructure & Reliability
- **Persistent task queue** — Replace in-process BackgroundTasks with Celery + Redis so jobs survive server restarts
- **Dedicated GPU worker pool** — Separate GPU-heavy ML models (Demucs, ClearVoice) into a scalable worker pool so they don't block the API

### Abuse Prevention & Billing
- **Rate limiting** — Add per-user rate limiting and concurrent job caps to prevent abuse
- **Stripe integration** — Stripe is not yet integrated; subscription management and tiered usage billing need to be built out

### Observability
- **Structured logging** — Replace ad-hoc logs with structured, queryable log output
- **Error tracking** — Integrate Sentry for real-time error monitoring and alerting
- **Job metrics dashboards** — Track processing times, failure rates, and queue depth

### Storage & Cost Control
- **R2 lifecycle rules** — Auto-expire old processed files to control storage costs

### User Experience
- **Landing page overhaul** — The current landing page is based on a template and needs design and copy fixes to match the Sleepify brand
- **Customizable processing parameters** — Let users adjust tempo multiplier, pitch shift, and other settings to match their preferences
- **ClearVoice integration** — Wire the existing speech enhancement function into the pipeline to filter out laughter, coughing, and other human-originated non-speech sounds

### DevOps & Compliance
- **CI/CD pipeline** — Automated testing, building, and deployment
- **YouTube content compliance strategy** — Address ToS considerations for processing YouTube audio at scale