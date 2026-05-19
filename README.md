# AlignIQ: Next-Gen Employee Goal Tracking Portal 🚀

An enterprise-grade, role-based performance management system designed to streamline Goal Setting, Quarterly Check-ins, and Top-Down KPI alignments. Built with modern web technologies and enhanced with powerful generative AI features to maximize employee productivity and HR governance.

![AlignIQ Cover](https://via.placeholder.com/1200x400?text=AlignIQ+Goal+Tracking+Portal)

---

## 🌟 Hackathon "Wow Factor" Features

We went beyond the standard requirements to deliver a truly next-generation user experience:

1. **Magic AI Auto-Filler 🪄**
   - **The Problem**: Employees hate manually typing out goals from messy emails or meeting notes.
   - **The Solution**: A dedicated text box where users paste raw, disorganized text. Our integration with **Google's Gemini 1.5 Flash** instantly parses the text, extracts up to 8 distinct goals, structures them into JSON, assigns the correct "Thrust Area" and "Unit of Measurement", evenly distributes the 100% weightage, and **auto-fills the entire React Hook Form in milliseconds.**

2. **AI "SMART Goal" Polisher ✨**
   - **The Feature**: A 1-click button next to every goal description box.
   - **The Tech**: Uses generative AI to rewrite rough drafts into highly professional **SMART** formats (Specific, Measurable, Achievable, Relevant, Time-bound). Includes a robust offline-mock fallback to guarantee the demo never fails even if the API key is rate-limited.

3. **Advanced Interactive Analytics 📊**
   - Overhauled the reporting dashboard using `recharts` to render real-time, animated Pie Charts (Goal Status Distribution) and Bar Charts (Execution by Thrust Area) to give Admins an instant visual pulse of the organization.

4. **Zero-Lag Perceived Navigation ⚡**
   - Leveraged Next.js 14 React Suspense Boundaries (`loading.tsx`) to render gorgeous, animated skeleton layouts the exact millisecond a user clicks a tab, completely eliminating the "frozen" UI feeling while the database fetches data in the background.

5. **Instant Demo Login Bypass 🎭**
   - Custom-built a secure session-cookie bypass wrapped around Clerk Authentication. This allows Hackathon judges to seamlessly instantly switch between `Admin`, `Manager`, and `Employee` roles with a single click on the login screen, completely skipping email verification hurdles during a live demo!

---

## 🗺️ Core Functionality Mapping (BRD Compliance)

| BRD Requirement | Implementation Status | Technical Details |
| :--- | :--- | :--- |
| **Authentication & Roles** | ✅ Completed | 3 roles (Admin, Manager, Employee) properly isolated. Clerk SDK + Prisma User sync. Custom Role Guarding on specific routes. |
| **Goal Form Validation** | ✅ Completed | Enforced via `Zod`. Min 10% weight per goal, exactly 100% total weight, max 8 goals. |
| **UoM Types** | ✅ Completed | `MIN_NUMERIC` (Higher=Better), `MAX_NUMERIC`, `TIMELINE`, and `ZERO` incidents. |
| **Top-Down Shared KPIs** | ✅ Completed | Managers can inject "Shared Goals" (`isShared: true`) directly into active employee draft sheets. Titles/Targets are locked from employee edits. |
| **Manager Approvals** | ✅ Completed | Dedicated `/approvals` pipeline. Managers can edit subordinates' goals inline, approve, or return them with mandatory remarks. |
| **Quarterly Check-ins** | ✅ Completed | Employees enter "Actuals". System auto-calculates the `% Score`. Managers must provide text feedback. |
| **Audit Trails** | ✅ Completed | All Manager actions (approvals, edits, returns) are logged and displayed in the `/reports` portal. |

---

## 🏗️ Architecture Diagram

> **[PLACE YOUR ARCHITECTURE DIAGRAM HERE]**
> *(Paste your Mermaid.js code or embed your image link here)*

---

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Shadcn UI + Lucide Icons
* **Database:** PostgreSQL (Hosted on Supabase)
* **ORM:** Prisma (with `@prisma/adapter-pg` for Serverless connection pooling)
* **Authentication:** Clerk
* **Forms & Validation:** `react-hook-form` + `zod`
* **Charts:** `recharts`
* **AI Engine:** `@google/generative-ai` (Gemini Flash Latest)

---

## 🚀 Getting Started (Local Development)

1. **Clone and Install:**
   ```bash
   git clone <repo-url>
   cd aligniq-portal
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR-DB]@pooler.supabase.com:5432/postgres"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
   CLERK_SECRET_KEY="sk_test_..."
   GEMINI_API_KEY="AIza..."
   ```

3. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed # (Populates the DB with the demo Admin, Manager, and Employee!)
   ```

4. **Run the App:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`. Click the "Demo Login" buttons to instantly bypass Clerk and explore the roles!
