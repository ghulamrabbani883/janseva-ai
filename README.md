# JanSeva AI

**सरकारी आवेदन समीक्षा एवं निर्णय सहायता प्रणाली**

JanSeva AI is a Hindi-first case-review dashboard prototype for officers handling fictional income-certificate applications in Chhattisgarh. It demonstrates how an officer could triage a queue, inspect application evidence, receive transparent rule-based assistance, and record a decision.

> **Demonstration prototype only.** This is not an official government service, does not determine legal eligibility, and must not be used to process real applications. All people and records in the seed data are fictional.

## Problem and intended users

Officers may need to compare an application with several supporting documents, notice missing evidence or conflicting figures, and record a clear next step. A slow or fragmented review process can make prioritization and follow-up harder.

The prototype is intended for government officers reviewing applications. It brings the queue, document checklist, application timeline, review findings, and officer actions into one Hindi-first interface. The AI-style assistant highlights evidence that needs attention; it does not decide whether an applicant qualifies.

## What the application does

- Shows dashboard metrics derived from the seeded application dataset.
- Ranks cases using an explicit, deterministic priority score based on age, deadline, missing/unclear documents, pending verification, returned status, and income discrepancy.
- Provides dedicated routes for all applications, the officer's pending queue, document verification, and decision history.
- Supports search by fictional applicant name or application ID, status and priority filters, and urgency or submission-date sorting.
- Presents application details, sample income fields, document-status controls, and a chronological timeline.
- Generates a rule-based Hindi review with a summary, document gaps, income inconsistencies, incomplete verification, suggested next step, and reasons.
- Lets the officer approve, reject, or return a case with a required note and confirmation. The action is recorded in the local timeline and decision history.
- Persists demo changes in the browser's `localStorage`.

The AI notice is explicit: **AI द्वारा दिए गए सुझाव केवल निर्णय में सहायता के लिए हैं। अंतिम निर्णय संबंधित अधिकारी का होगा।** The rule engine does not approve, reject, or return a case.

## Technical decisions and architecture

### Why Next.js

Next.js App Router was selected because this project needs a small but complete web application, not just a static mockup:

- File-based routes make the dashboard, application detail, queue views, and API handler easy to locate and explain.
- React components and TypeScript work naturally for the interactive Hindi dashboard and strongly typed application records.
- Next.js Route Handlers provide a place for server-side functionality if the demo later needs it, without introducing a separate backend service.
- The app can be deployed directly to Vercel, which is a simple fit for this time-limited prototype.
- The framework keeps the UI and any future server operations in one codebase, reducing setup and deployment complexity.

The dashboard and application review are client-interactive because filtering, document updates, decisions, and demo persistence happen in the browser. App Router pages compose these screens from reusable components.

### Code layout

```text
app/
  page.tsx                     Dashboard route
  applications/page.tsx        All applications
  applications/[id]/page.tsx   Application review
  pending/page.tsx             Officer's active queue
  verification/page.tsx        Cases with document follow-up
  history/page.tsx             Approved/rejected cases
  api/ai-review/route.ts       Rule-based review handler
components/
  layout/                      Sidebar and shared shell
  dashboard/                   Metrics, filters, table, route views
  applications/                Applicant details, documents, timeline
  ai-review/                   Review findings and recommendations
lib/
  mock-data.ts                 Fictional seeded applications
  review-engine.ts             Priority and deterministic review rules
types/
  application.ts               Shared domain types
tests/
  review-engine.test.ts        Rule-engine and priority tests
```

### AI assistance and priority

The review engine is a deterministic TypeScript function, not a connected LLM. It reads the structured fictional application data and reports only supplied values, missing evidence, and unverified items. A missing document or conflicting figure is a reason for human follow-up, not evidence of fraud or an automatic rejection.

The `/api/ai-review` Route Handler can return the rule-based findings for a submitted application payload. The current review panel invokes the same rule engine directly in the client; it does not call an external AI provider, and there are no API keys or external-record checks. An LLM is intentionally not required for this prototype: deterministic output is easier to test and explain, and avoids sending even demo case data to a third party.

Priority is a queue-ordering aid only. Its score is derived from case age, deadline, document state, returned status, and income differences; it is not a probability, eligibility assessment, or proof of wrongdoing.

### Persistence and security limits

The browser's `localStorage` keeps demo decisions and document-status changes on that browser. It is not a database and does not synchronize across reviewers or devices. There is no real authentication: the officer profile is fictional, and the application opens without login credentials. Do not use real personal data, deploy this as an official service, or treat client-side state as secure audit storage.

The assignment's example credentials (`officer@janseva.demo` / `Demo@123`) are **not implemented as a login** and should not be used to represent a real account.

## Run locally

Requirements: Node.js compatible with the installed Next.js version and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
npm run lint   # ESLint
npm run build  # production build and TypeScript check
npm start      # serve the production build locally after npm run build
```

## Deployment and reviewer access

**Deployed application link:** (https://janseva-ai-ebon.vercel.app/)

The application currently has no login screen or authentication, so no login credentials are required. Reviewers can open the live link directly. All sample people and application records are fictional, and changes made during a review are saved only in that browser's local storage.


## Verification

The app can be checked locally with `npm run lint` and `npm run build`. The dashboard and review workflow are intended to be exercised interactively: navigate the sidebar routes, search and filter the case list, update a document status, inspect the AI-assisted findings, and submit a confirmed decision with a reason.

## Before any real-world use

A production system would require, at minimum, an approved legal and document-requirement review, authenticated and role-based access, server-side persistence, tamper-resistant audit logs, privacy/security review, accessibility testing, operational monitoring, and human validation of every recommendation. None of those production controls are claimed by this demo.
