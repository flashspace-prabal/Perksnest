# PerksNest - Features and Functionalities

# Previous Features Fixed by Emily

## **1\. CRITICAL: Pricing Inconsistency Between Homepage and Pricing Page**
### **Context & Explanation**
There is currently a massive discrepancy in the pricing models shown to users. Depending on which page the user lands on, they see two completely different pricing plans, causing extreme confusion and loss of trust.
### **Where exactly is this happening?**
**Location A:** The Homepage (`/` route or `page.tsx`/`index.tsx`)
*   **What screen/part:** Scroll down to the Pricing or "Premium Solution" section on the homepage.
*   **Current State:** Displays an annual plan explicitly listed as **"$149/year"**.
**Location B:** The Dedicated Pricing Page (`/pricing` route)
*   **What screen/part:** The main pricing tier cards.
*   **Current State:** Displays a "Pro" plan explicitly listed as **"$2/month"** (which equates to ~$24/year).
Also the final page of checkout gives the prices as 5 dollars only which should be 2 dollars as given by the offer

### **What the AI needs to do:**
*   **Decision Needed from Human:** The user/owner must first declare which price is the correct one.
*   **Action:** Once the correct price is known, locate the React components rendering these pricing cards (likely named something like `PricingSection.tsx`, `PricingCard.tsx`, or hardcoded in the `page.tsx` files).
*   Overwrite the incorrect text payload so that both the homepage and the `/pricing` page reflect the exact same unified pricing tier, billing cycle (monthly vs annual), and dollar amount.
* * *
## **2\. CRITICAL: Broken Legal and Navigational Footer Links**
### **Context & Explanation**
Almost all the links housed in the global footer component do not lead anywhere. They are set to a fallback href of `"/"` (homepage), meaning users clicking on Privacy Policy or Terms of Service simply get snapped back to the top of the homepage.
### **Where exactly is this happening?**
**Location:** The Global Footer Component (likely `Footer.tsx` or similar, rendering on all pages at the very bottom).
*   **What screen/part:** The columns listing links such as "About", "Careers", "Press", "Help Center", "Community", "Partners", "Privacy Policy", "Terms of Service", and "Security".
*   **Current State:** The anchor tags (`<a>` or Next.js `<Link>`) currently have `href="/"` or `href="#"`.
### **What the AI needs to do:**
1. Locate the `Footer` component in the codebase.
2. For the **Privacy Policy** and **Terms of Service**:
    *   Create two new page routes (e.g., `/privacy` and `/terms`).
    *   Scaffold simple layout pages for these routes.
    *   Update the `href` in the Footer to point to `/privacy` and `/terms`.
3. For the rest of the broken links (About, Careers, etc.):
    *   If the pages don't exist yet, change their styling to look visually "disabled", or point them to a `/coming-soon` route, or comment them out temporarily so users aren't tricked into clicking broken links.
* * *
## **🛑 3. CRITICAL: Unprofessional HTML TODO Comment in** **`<head>`**
### **Context & Explanation**
There is a developer comment accidentally left inside the live HTML `<head>` tag. Search engines parsing the site see this, and it looks unprofessional in the source code.
### **Where exactly is this happening?**
**Location:** The global entry HTML file (If React/Vite, look in `index.html`. If Next.js, look in `app/layout.tsx` or `pages/_document.tsx`).
*   **What screen/part:** Inside the `<head>` block, right above the `<title>` tag.
*   **Current State:** The source code contains exactly this string: `<!-- TODO: Set the document title to the name of your application -->`
### **What the AI needs to do:**
*   Simply execute a global search across the codebase for `TODO: Set the document title`.
*   Strip that specific HTML comment line out of the file entirely.
* * *
## **🟡 4. IMPORTANT: Severe SEO Flaw (Duplicate Title & Meta Descriptions globally)**
### **Context & Explanation**
Currently, no matter what page the user navigates to (Deals, Pricing, Invite), the browser tab title and the SEO meta description remain exactly the same as the homepage. This severely hurts organic search rankings because Google cannot differentiate the pages.
### **Where exactly is this happening?**
**Location:** The routing or layout layer of the application.
*   **Current State:** Every page inherits:
    *   **Title:** `PerksNest - Exclusive SaaS Deals for Startups`
    *   **Meta Description:** `Save big on the best SaaS tools with exclusive deals curated for startups, entrepreneurs, and agencies.`
### **What the AI needs to do:**
*   **If Next.js App Router:** Ensure each `page.tsx` exports its own `metadata` object overriding the root layout metadata.
*   **If React SPA (Vite/CRA):** Implement `react-helmet` or `react-helmet-async` to dynamically inject unique titles and descriptions per route component.
    *   **Target Pages & Desired Titles:**`/deals`: `<title>Browse SaaS Deals | PerksNest</title>`
    *   `/pricing`: `<title>Pricing Plans | PerksNest</title>`
    *   `/invite`: `<title>Refer & Earn $20 Credit | PerksNest</title>`
* * *
## **🟡 5. IMPORTANT: Broken Sub-Links in the "Deals" Navigation Dropdown**
### **Context & Explanation**
In the main navigation header, the "Deals" menu item functions as a dropdown containing several sub-links. However, almost all of these sub-links are currently broken or unresponsive. The only link inside the Deals dropdown that currently works correctly is the "AI" link.
### **Where exactly is this happening?**
**Location:** The Global Header / Navigation Bar component (likely `Header.tsx`, `Navbar.tsx`, or a dedicated `NavDropdown.tsx` component).
*   **What screen/part:** The "Deals" dropdown menu in the top navigation ribbon.
*   **Current State:** Clicking any sub-link inside the Deals dropdown (other than the "AI" category) does nothing or routes to a broken path.
### **What the AI needs to do:**
1. Locate the Navigation bar component containing the dropdown logic for "Deals".
2. Check the data array or hardcoded `<Link>` elements inside the dropdown.
3. Fix the `href` paths for all the broken categories (e.g., Marketing, Sales, etc.) to ensure they properly route to the correct `/deals?category=XYZ` or `/deals/category-name` structure, matching whatever schema the working "AI" link uses.
* * *
## **🟡 6. IMPORTANT: Broken "Expiring Soon" Filter/Button on Deals Page**
### **Context & Explanation**
On the main Deals page, there is an "Expiring Soon" button or filter tab designed to sort or filter the deals based on their expiration date. However, clicking this button currently does nothing (the UI does not update, and the deals list does not filter).
### **Where exactly is this happening?**
**Location:** The Deals directory (`/deals` route), specifically within the component handling the filter UI (likely named `DealsFilter.tsx`, `CategoryNav.tsx`, or inside the main `DealsPage.tsx`).
*   **What screen/part:** The filter navigation row/sidebar above or next to the grid of deals.
*   _\[Screenshot Placeholder: Attach screenshot of the Deals page highlighting the 'Expiring Soon' button\]_
*   **Current State:** Clicking the "Expiring Soon" button does not trigger any state change or data re-fetching. It appears to be an unresponsive UI element.
### **What the AI needs to do:**
1. Locate the component rendering the "Expiring Soon" button on the `/deals` page.
2. Check the `onClick` handler for this button.
3. Review the state management block controlling the active filter (e.g., `const [activeFilter, setActiveFilter] = useState(...)`).
4. Ensure clicking the button updates the `activeFilter` state to `"expiring"` (or similar).
5. Verify the data-filtering logic array actually filters out deals based on their `expirationDate` or `status` property when the `"expiring"` filter is active. Update the logic to dynamically render only deals with approaching expiration dates.
* * *
## **🟡 7. IMPORTANT: "Partners" Portal Link Broken Only When User is Logged In**
### **Context & Explanation**
The "Partners" link in the footer opens the partner portal page correctly **when no user is logged in** (i.e., for anonymous/unauthenticated visitors). However, **when a user IS logged in**, clicking the same "Partners" link breaks — it either shows an error, redirects to the wrong page, or fails to load the partner portal content.
This is an authentication-state-dependent bug: the routing or rendering logic for the partner portal page is behaving differently based on whether the user session / auth token exists.
### **Where exactly is this happening?**
**Location:** The Partners page route (e.g., `/partners`) and the Global Footer Component (likely `Footer.tsx`).
*   **What screen/part:** Click the "Partners" link in the footer while logged in vs. logged out.
*   _\[Screenshot Placeholder: Attach screenshot showing the broken state when clicking 'Partners' while logged in\]_
    *   **Current State:Logged OUT** → Partners page loads correctly ✅
    *   **Logged IN** → Partners page is broken / does not load ❌
### **What the AI needs to do:**
1. Locate the Partners page component (e.g., `/partners` route or `PartnersPage.tsx`).
2. Check for any authentication guards, middleware, or layout wrappers that conditionally modify rendering when a user session exists.
3. The bug is likely caused by one of these:
    *   A protected route wrapper (e.g., `AuthGuard`, `ProtectedRoute`) that incorrectly wraps or redirects the Partners page when a user is authenticated.
    *   A conditional data fetch that fails or returns different data when auth headers/tokens are present.
    *   A layout component that renders differently based on auth state and breaks the Partners page layout.
4. Fix the logic so that the Partners page renders correctly regardless of whether the user is logged in or not.
## **🟡 8. IMPORTANT: The "Invite" Page is Hidden Behind Auth Wall**
### **Context & Explanation**
Logged-out users clicking "Invite" see nothing — just a login wall. They never see the "$20 credit" referral value proposition.
### **What the AI needs to do:**
*   Implement conditional rendering: if `!user`, show a public teaser with the referral benefit and a "Sign Up" CTA. If `user`, show the referral dashboard.
## **🛑 9. CRITICAL: Deal Detail Page Tabs Do Not Switch Content**
### **Context & Explanation**
On individual deal pages (e.g., `/deals/notion`), there is a tab navigation bar with tabs: **"Deals"**, **"General"**, **"FAQ"**, **"Pricing"**, **"Features"**, **"Reviews"**, **"Alternatives & VS"**, **"Also likes"**. Clicking any tab correctly updates the tab's visual active state (the underline moves), but the **content panel below never changes** — it stays stuck on "Reviews & Ratings" regardless of which tab is selected.
### **Where exactly is this happening?**
**Location:** The Deal Detail page component (e.g., `/deals/[slug]` route, likely `DealDetailPage.tsx` or `DealPage.tsx`).
*   **What screen/part:** The horizontal tab bar below the deal hero section, and the content area beneath it.
    1. **Steps to reproduce:**Go to `/deals`
    2. Click on any deal card (e.g., Notion)
    3. On the deal detail page, click the "FAQ" tab → content stays on "Reviews & Ratings"
    4. Click the "General" tab → content stays on "Reviews & Ratings"
    5. Click the "Pricing" tab → content stays on "Reviews & Ratings"

### **What the AI needs to do:**
1. Locate the Deal Detail page component.
2. Find the tab implementation (likely using Radix UI Tabs, Headless UI, or a custom state-based component).
3. The issue is likely one of:
    *   The `value` prop on the content panels does not match the `value` on the tab triggers.
    *   A single content panel is always rendered instead of conditionally rendering based on the active tab.
    *   The `onChange`/`onValueChange` handler updates the tab UI state but does not control which content panel is visible.
4. **Fix:** Ensure each `TabContent` / `TabPanel` has a matching `value` and is conditionally rendered based on the active tab state.
## **🟡 10. IMPORTANT: "Book a Demo" Button Not Working — Does Not Open Mail App**
### **Context & Explanation**
Inside the **Solutions dropdown** in the header navigation, there is a "White Label Solution" section with a "Contact us" line showing [`sales@perksnest.com`](mailto:sales@perksnest.com) and a prominent purple **"Book a demo"** button. Clicking this button **does nothing** — it does not open the user's email client (mail app), does not navigate to a booking/calendly page, and does not trigger any action.
### **Where exactly is this happening?**
**Location:** The header Navigation bar → **"Solutions" dropdown flyout** → right side panel.
*   **What screen/part:** The purple "Book a demo" button sitting below the text "Contact us — [**sales@perksnest.com**](mailto:sales@perksnest.com)" and above the "Premium solution" section.
*   **Current State:** The button is completely non-functional. It likely has an empty `href`, a missing `onClick` handler, or points to `href="#"`.
### **What the AI needs to do:**
1. Locate the Navigation / Header component containing the "Solutions" dropdown.
2. Find the "Book a demo" button element inside it.
3. **Fix:** Update the button to perform one of the following (confirm with the site owner which is preferred):
    *   **Option A (mailto):** Set `href="<`[`mailto:sales@perksnest.com`](mailto:sales@perksnest.com)`>?subject=Book a Demo"` so clicking opens the user's default mail app with a pre-filled subject line.
    *   **Option B (Calendly/booking link):** If a Calendly or similar booking URL exists, set the `href` to that URL and add `target="_blank"` to open in a new tab.
    *   **Option C (contact form):** Route to a `/contact` or `/demo` page with a booking form.
## **12\. IMPORTANT: "Help Center" Link in Resources Dropdown Leads Nowhere**
### **Context & Explanation**
In the header navigation, the **"Resources" dropdown** contains a "Help Center" link. Clicking it does not navigate to any page — it either redirects back to the homepage, shows a 404, or does nothing. There is no Help Center page built.
### **Where exactly is this happening?**
**Location:** The header Navigation bar → **"Resources" dropdown flyout**.
*   **What screen/part:** The "Help Center" link inside the Resources dropdown menu.
*   **Current State:** The link has no valid destination. The `/help` route does not exist (returns 404).
### **What the AI needs to do:**
1. Locate the Navigation / Header component containing the "Resources" dropdown.
2. Find the "Help Center" link element.
3. **Fix:** Either:
    *   **Option A:** Create a simple `/help` route with an FAQ page or a support contact form.
    *   **Option B:** Point the link to [`mailto:support@perksnest.com`](mailto:support@perksnest.com) as an interim solution.
## **🟡 13. IMPORTANT: Hero Section "Get Started" Button Prompts Login Even When Already Logged In**
### **Context & Explanation**
On the homepage hero section, there is a **"Get started"** CTA button. When a user is **already logged in**, clicking this button still redirects them to the login page and asks for credentials again instead of taking them to the dashboard or deals page.
### **Where exactly is this happening?**
**Location:** The Homepage (`/`) → Hero section.
*   **What screen/part:** The primary purple "Get started →" button at the bottom of the hero heading area.
*   **Current State:** The button always navigates to `/login` regardless of whether the user is authenticated or not.
### **What the AI needs to do:**
1. Locate the Hero section component on the homepage.
2. Find the "Get started" button/link element.
3. **Fix:** Make the button's destination conditional based on auth state:
    *   **If** **`!user`** **(not logged in):** Route to `/login` or `/signup` (current behavior — keep this).
    *   **If** **`user`** **(already logged in):** Route to `/deals` or `/dashboard` instead of `/login`.
4. This requires checking the auth context (e.g., `const { user } = useAuth();`) then conditionally setting the `href`.
* * *
## **🟡 14. IMPORTANT: Duplicate User Icons in Navigation Bar After Login**
### **Context & Explanation**
After a user logs in, **two user icons/avatars appear simultaneously** in the navbar. The navbar currently renders both a **user icon** (circular link to `/login`) AND a separate **"Sign in" text button** at the same time. When the user is logged in, both elements change to user avatars, resulting in a visually broken duplicate UI.
### **Where exactly is this happening?**
**Location:** The Global Header / Navigation Bar component (likely `Header.tsx`, `Navbar.tsx`).
*   **What screen/part:** The far-right side of the navigation bar.
*   **Current State (pre-login):** Shows a user icon circle AND text elements like "Sign in" / "Request a demo" / "Get started" — that's 4 separate auth-related items.
*   **Current State (post-login):** Two user avatar circles appear side-by-side.
### **What the AI needs to do:**
1. Locate the Navbar component.
2. Find the section rendering the right-side auth controls.
3. **Fix:** Implement proper conditional rendering based on auth state:
    *   **If** **`!user`****:** Show ONE "Sign in" button + "Get started" CTA. Remove the redundant user icon circle.
    *   **If** **`user`****:** Show ONE user avatar/icon with a dropdown (profile, settings, logout). Remove duplicate.
4. The issue is likely that two separate components both render auth UI without sharing the same conditional check.
# New changes to be done by Emily

1. Navbar design is not consistent in different pages
2. Solutions button on navbar leads to deals page when we are on home page ,fox ot to show the solution dropdown
3. Get started button on home page should lead to deals page
4. Signup with google should be there when user is not signed in and should be hidden when user is signed in
5. Most popular deals design have inconsistency between them and also the buttons are not working
6. Deals pages routes are broken and no deal page is showing
7. Most of the bundles and subcategories categories like AI agents doesn't have any services and is just showing deals of main category
8. Whenever going to the new page through button browse more deals or compare two SaaS tools it is opened at bottom of page and not at starting of page
9. Remove the white label solution from the from pricing in home page and make it consistent with pricing page cards
10. The buttons of get started at below of home page and talk to sales is not working![](https://t1851686.p.clickup-attachments.com/t1851686/38d10958-e8d9-43fd-a9ad-c28613ac9bb5/image.png)
11. Remove the search bar from the navbar when on deals page
12. Edit profile button in user dashboard is not working
13. In partner portal download report button on dashboard is white but the text is also white therefore it is not seeing
14. There is no backend connect in admin portal and nothing is being fetched in real time
15. The ticket system on partner and admin portal is not functional

# New changes to be done by Emily

## 15\. CRITICAL: Navbar Design Inconsistency Across Pages
### Context & Explanation
The navigation bar renders differently on different pages — the layout, spacing, styling, or visible elements change depending on which route the user is on. This creates an unprofessional, inconsistent user experience.
### Where exactly is this happening?
**Location:** The global Header / Navigation Bar component, visible on every page.
*   **Steps to reproduce:**
    1. Visit the homepage (`/`) and note the navbar layout
    2. Navigate to `/deals` — observe differences in navbar design
    3. Navigate to `/pricing` — observe further differences
### What the AI needs to do:
1. Locate the Header/Navbar component (likely `Header.tsx`, `Navbar.tsx`, or `Navigation.tsx`).
2. Check if different pages use different navbar components or pass different props that alter the layout.
3. **Fix:** Ensure a single, consistent Navbar component is rendered across ALL routes with the same styling, spacing, and element visibility.
* * *
## 🛑 16. CRITICAL: Solutions Dropdown Not Showing on Homepage — Redirects to Deals
### Context & Explanation
On the homepage, clicking the **"Solutions"** button in the navbar does **not** open the Solutions dropdown menu. Instead, it navigates the user directly to the Deals page (`/deals`). On other pages, the Solutions button correctly opens a dropdown.
### Where exactly is this happening?
**Location:** The header Navigation bar → **"Solutions"** button, specifically **when on the Homepage (****`/`****)**.
*   **Steps to reproduce:**
    1. Go to the homepage (`/`)
    2. Click "Solutions" in the navbar
    3. ❌ Instead of showing a dropdown, user is redirected to `/deals`
    4. On other pages (e.g., `/pricing`), clicking "Solutions" correctly shows the dropdown ✅
### What the AI needs to do:
1. Locate the Navbar component and the Solutions dropdown trigger.
2. Check if there is a conflicting `href="/deals"` on the Solutions nav item, or a route-specific override that replaces the dropdown toggle with a link when on `/`.
3. **Fix:** Ensure the Solutions nav item always triggers the dropdown flyout on **all pages**, including the homepage. Remove any `href` or `onClick` redirect that overrides the dropdown behavior.
* * *
## 🟡 17. IMPORTANT: "Get Started" Button on Homepage Should Lead to Deals Page
### Context & Explanation
The **"Get started →"** CTA button on the homepage should route users to the **Deals page** (`/deals`) — not to login, signup, or nowhere.
### Where exactly is this happening?
**Location:** Homepage (`/`) → Hero section → "Get started →" button.
### What the AI needs to do:
1. Locate the Hero/CTA component on the homepage.
2. Find the "Get started" button and its `href` or `onClick` handler.
3. **Fix:** Update the navigation logic:
    *   **If user is logged in:** Route to `/deals`
    *   **If user is NOT logged in:** Route to `/signup` (then redirect to `/deals` after signup)
* * *
## 🟡 18. IMPORTANT: "Sign Up with Google" Button Visibility Based on Auth State
### Context & Explanation
The **"Sign up with Google"** button should only be visible when the user is **NOT signed in**. It must be hidden when the user is already authenticated.
### Where exactly is this happening?
**Location:** Authentication UI elements — could be in the Navbar, sign-in modal, or hero section.
### What the AI needs to do:
1. Locate all instances of the Google sign-up/sign-in button across the app.
2. **Fix:** Wrap each instance in an auth state check:
    *   **If** **`!user`** **(not logged in):** Show the button ✅
    *   **If** **`user`** **(logged in):** Hide the button ✅
* * *
## 🛑 19. CRITICAL: "Most Popular Deals" — Design Inconsistency & Broken Buttons
### Context & Explanation
The **"Most Popular Deals"** section has **two problems:**
1. **Design inconsistency:** Deal cards have inconsistent styling — different padding, font sizes, border radius, or button styles.
2. **Broken buttons:** The CTA buttons on the deal cards are **non-functional** — clicking them does nothing.
### Where exactly is this happening?
**Location:** Homepage or Deals page → "Most Popular Deals" section.
*   **Steps to reproduce:**
    1. Scroll to the "Most Popular Deals" section
    2. Compare the visual design of each deal card — notice inconsistencies
    3. Click any deal card's button → nothing happens
### What the AI needs to do:
1. Locate the "Most Popular Deals" component (e.g., `PopularDeals.tsx`, `FeaturedDeals.tsx`).
2. **Design fix:** Ensure all deal cards use the same shared card component with consistent styling.
3. **Button fix:** Ensure CTA buttons route to the deal detail page (`/deals/[slug]`).
* * *
## 🛑 20. CRITICAL: Deals Page Routes Are Broken — No Deal Pages Showing
### Context & Explanation
Individual deal detail pages are completely broken. Navigating to a specific deal (e.g., `/deals/notion`) shows a blank page or 404.
### Where exactly is this happening?
**Location:** Deal detail route (e.g., `/deals/[slug]` or `/deals/:id`).
*   **Steps to reproduce:**
    1. Go to `/deals`
    2. Click on any deal card
    3. ❌ Deal page does not load
### What the AI needs to do:
1. Locate the deal detail page component and its routing configuration.
2. Verify the dynamic route setup and data fetching logic.
3. **Fix:** Ensure routing is correctly configured, the page component renders, and data fetch handles errors gracefully.
* * *
## 🟡 21. IMPORTANT: Sub-Categories Show Main Category Deals Instead of Filtered Results
### Context & Explanation
Sub-categories like **"AI Agents"** display deals from the **main parent category** rather than filtering to the specific sub-category. Most bundles and sub-categories show the same generic deal list as the parent.
### Where exactly is this happening?
**Location:** Deals page (`/deals`) → left sidebar → sub-category selection.
*   **Steps to reproduce:**
    1. Go to `/deals`
    2. Expand a parent category (e.g., "AI")
    3. Click a sub-category (e.g., "AI Agents")
    4. ❌ Deals shown are from the parent "AI" category, not filtered to "AI Agents"
### What the AI needs to do:
1. Locate the deals filtering/query logic.
2. **Fix:** Ensure sub-category selection filters deals by the **sub-category ID**, not the parent category.
* * *
## 🟡 22. IMPORTANT: New Pages Opened via Buttons Scroll to Bottom Instead of Top
### Context & Explanation
When navigating to a new page through buttons like **"Browse more deals"** or **"Compare two SaaS tools"**, the new page opens **scrolled to the bottom** instead of the top. Classic SPA scroll restoration bug.
### Where exactly is this happening?
**Location:** Multiple navigation links/buttons across the site.
### What the AI needs to do:
1. Locate the app's routing setup.
2. **Fix:** Add a scroll-to-top behavior on route changes:
    *   **React Router:** Add a `ScrollToTop` component that calls `window.scrollTo(0, 0)` on route change.
    *   **Next.js:** Ensure `scroll={true}` on `<Link>` components (default but may be overridden).
* * *
## 🟡 23. IMPORTANT: Remove "White Label Solution" from Homepage Pricing
### Context & Explanation
The Homepage Pricing section includes a **"White Label Solution"** card that does **not** appear on the dedicated Pricing page (`/pricing`). Remove it from the homepage and make the pricing cards consistent with the pricing page.
### Where exactly is this happening?
**Location:** Homepage (`/`) → Pricing section.
### What the AI needs to do:
1. Locate the Homepage pricing section component.
2. **Fix:** Remove the "White Label Solution" card. Ensure remaining cards match `/pricing` page design exactly.
* * *
## 🟡 24. IMPORTANT: "Get Started" and "Talk to Sales" Buttons at Bottom of Homepage Not Working
### Context & Explanation
The bottom CTA section of the homepage has two buttons: **"Get started →"** and **"Talk to sales"**. Both are **non-functional**.
### Where exactly is this happening?
**Location:** Homepage (`/`) → Bottom CTA section (purple section with "Ready to save on the tools you love?").
*   **Steps to reproduce:**
    1. Scroll to the bottom of the homepage (above footer)
    2. Click "Get started →" → nothing happens
    3. Click "Talk to sales" → nothing happens
### What the AI needs to do:
1. Locate the bottom CTA component.
2. **Fix:**
    *   **"Get started →":** Route to `/signup` (or `/deals` if logged in).
    *   **"Talk to sales":** Set [`href="mailto:sales@perksnest.com`](mailto:href="mailto:sales@perksnest.com)`?subject=Sales Inquiry"` or link to a contact/calendly page.
* * *
## 🟡 25. IMPORTANT: Remove Search Bar from Navbar When on Deals Page
### Context & Explanation
The Deals page already has its own search/filter. A **duplicate search bar in the navbar** on this page is redundant.
### Where exactly is this happening?
**Location:** Header navbar → search bar, when on `/deals`.
### What the AI needs to do:
1. Locate the Navbar component and search bar element.
2. **Fix:** Hide the navbar search bar when current route is `/deals`:
3. jsx
4. 5. const pathname = usePathname();
6. {pathname !== '/deals' && <SearchBar />}
* * *
## 🟡 26. IMPORTANT: "Edit Profile" Button in User Dashboard Not Working
### Context & Explanation
In the **User Dashboard**, the **"Edit Profile"** button is non-functional — clicking it does nothing.
### Where exactly is this happening?
**Location:** User Dashboard (e.g., `/dashboard` or `/profile`) → "Edit Profile" button.
### What the AI needs to do:
1. Locate the User Dashboard component and the "Edit Profile" button.
2. **Fix:** Either open an inline edit form/modal or navigate to `/profile/edit`.
* * *
## 🛑 27. CRITICAL: Partner Portal — "Download Report" Button Text Invisible (White on White)
### Context & Explanation
The **"Download Report"** button in the Partner Portal Dashboard has **white text on a white background**, making it completely invisible.
### Where exactly is this happening?
**Location:** Partner Portal → Dashboard → "Download Report" button.
### What the AI needs to do:
1. Locate the Partner Portal Dashboard component and the button.
2. **Fix:** Change the button's text color to be visible (e.g., dark text on white bg, or white text on brand-colored bg).
* * *
## 🛑 28. CRITICAL: Admin Portal — No Backend Connection, Nothing Fetched in Real Time
### Context & Explanation
The **Admin Portal** has no working backend connection. All data is hardcoded, static, or empty. Nothing is fetched in real time.
### Where exactly is this happening?
**Location:** The entire Admin Portal (e.g., `/admin` or `/admin/dashboard`).
### What the AI needs to do:
1. Locate all Admin Portal page components.
2. Check for API calls — they likely don't exist or use mock data.
3. **Fix:** Requires backend API endpoints for CRUD operations and frontend integration with real API calls.
4. **Note:** Large-scope fix. AI should audit all admin pages first, list needed endpoints, then implement systematically.
* * *
## 🛑 29. CRITICAL: Ticket System in Partner & Admin Portals Is Non-Functional
### Context & Explanation
Both portals have a **Ticket/Support system** UI that is completely non-functional — no creating, viewing, replying, or status changes work.
### Where exactly is this happening?
**Location:** Partner Portal → Tickets AND Admin Portal → Tickets/Support.
### What the AI needs to do:
1. Locate Ticket system components in both portals.
2. **Fix requires:**
    *   **Database schema:** `tickets` table with `id`, `title`, `description`, `status`, `priority`, `created_by`, `assigned_to`, timestamps.
    *   **API endpoints:** CRUD for tickets.
    *   **Partner Portal:** Ticket creation + viewing own tickets.
    *   **Admin Portal:** View all tickets, assign, respond, change status.
3. **Note:** Significant feature build. Create backend first, then wire up frontend.

**30\. Instructions for Adding Startup Deals to PerksNest**

This document contains instructions and data for an AI agent to add a new batch of 41 startup deals to the PerksNest portal.

**What the AI needs to do:**
1\. Locate the data file or database seed where deals are stored in the PerksNest project (e.g., \`deals.ts\`, or a database seeding script).
2\. Add the following 41 deals to the platform.
3\. For each deal, use the provided Service Name as the title, the Deal description as the offer/benefits, and the Link as the target URL for the "Get Deal" button.
4\. Ensure the new deals are categorized appropriately based on their service type (e.g., Cloud Hosting, AI/Machine Learning, Analytics, Developer Tools).
5\. If the platform requires a logo URL, you will need to find a suitable placeholder or extract the logo from the service's domain.

\---

**\## Data List of Deals to Add**

1\. **\*\*Google Cloud\*\***
   - **\*\*Deal:\*\*** Upto $350,000 credits for AI-Focused Startups
   - **\*\*Link:\*\*** [https://cloud.google.com/startup](https://cloud.google.com/startup)

2\. **\*\*Cloudflare\*\***
   - **\*\*Deal:\*\*** Upto $250,000 credits for developer platform
   - **\*\*Link:\*\*** [https://www.cloudflare.com/forstartups/](https://www.cloudflare.com/forstartups/)

3\. **\*\*Microsoft\*\***
   - **\*\*Deal:\*\*** Upto $150,000 Azure credits
   - **\*\*Link:\*\*** [https://foundershub.startups.microsoft.com/](https://foundershub.startups.microsoft.com/)

4\. **\*\*Amazon Web Services\*\***
   - **\*\*Deal:\*\*** Upto $100,000 credits for AWS Activate
   - **\*\*Link:\*\*** [https://aws.amazon.com/activate/](https://aws.amazon.com/activate/)

5\. **\*\*Digital Ocean\*\***
   - **\*\*Deal:\*\*** Upto $100,000 Infrastructure credits
   - **\*\*Link:\*\*** [https://www.digitalocean.com/hatch](https://www.digitalocean.com/hatch)

6\. **\*\*OVHCloud\*\***
   - **\*\*Deal:\*\*** Upto 100,000 euro cloud credits
   - **\*\*Link:\*\*** [https://startup.ovhcloud.com/](https://startup.ovhcloud.com/)

7\. **\*\*Vercel\*\***
   - **\*\*Deal:\*\*** Varies by Partner
   - **\*\*Link:\*\*** [https://vercel.com/startups](https://vercel.com/startups)

8\. **\*\*Anthropic\*\***
   - **\*\*Deal:\*\*** $25,000 Claude API credits
   - **\*\*Link:\*\*** [https://www.anthropic.com/startups](https://www.anthropic.com/startups)

9\. **\*\*Perplexity AI\*\***
   - **\*\*Deal:\*\*** $5,000 API credits
   - **\*\*Link:\*\*** [https://www.perplexity.ai/hub/blog/introducing-the-perplexity-startup-program](https://www.perplexity.ai/hub/blog/introducing-the-perplexity-startup-program)

10\. **\*\*Eleven Labs\*\***
    - **\*\*Deal:\*\*** $4,000 (12 months of scale tier access)
    - **\*\*Link:\*\*** [https://elevenlabs.io/startup-grants](https://elevenlabs.io/startup-grants)

11\. **\*\*Open AI\*\***
    - **\*\*Deal:\*\*** Upto $2500 API credits
    - **\*\*Link:\*\*** [https://ramp.com/rewards/openai](https://ramp.com/rewards/openai)

12\. **\*\*MongoDB\*\***
    - **\*\*Deal:\*\*** Upto $20,000 Atlas credits
    - **\*\*Link:\*\*** [https://www.mongodb.com/startups](https://www.mongodb.com/startups)

13\. **\*\*Couchbase\*\***
    - **\*\*Deal:\*\*** $12,750 capella credits
    - **\*\*Link:\*\*** [https://aws.amazon.com/startups/offers](https://aws.amazon.com/startups/offers)

14\. **\*\*Supabase\*\***
    - **\*\*Deal:\*\*** $300 credits
    - **\*\*Link:\*\*** [https://supabase.com/partners/integrations](https://supabase.com/partners/integrations)

15\. **\*\*Planetscale\*\***
    - **\*\*Deal:\*\*** Varies by company
    - **\*\*Link:\*\*** [https://planetscale.com/startups](https://planetscale.com/startups)

16\. **\*\*Mixpanel\*\***
    - **\*\*Deal:\*\*** $50,000 benefits with 1 year free of growth plan
    - **\*\*Link:\*\*** [https://mixpanel.com/startups](https://mixpanel.com/startups)

17\. **\*\*PostHog\*\***
    - **\*\*Deal:\*\*** $50,000 Benefits
    - **\*\*Link:\*\*** [https://posthog.com/startups](https://posthog.com/startups)

18\. **\*\*Twilio Segment\*\***
    - **\*\*Deal:\*\*** $25,000 benefits with full access to segment startup program
    - **\*\*Link:\*\*** [https://segment.com/industry/startups/](https://segment.com/industry/startups/)

19\. **\*\*Amplitude\*\***
    - **\*\*Deal:\*\*** 1 year free
    - **\*\*Link:\*\*** [https://amplitude.com/startups](https://amplitude.com/startups)

20\. **\*\*Datadog\*\***
    - **\*\*Deal:\*\*** 1 year free
    - **\*\*Link:\*\*** [https://www.datadoghq.com/partner/datadog-for-startups/](https://www.datadoghq.com/partner/datadog-for-startups/)

21\. **\*\*Sentry\*\***
    - **\*\*Deal:\*\*** Free tier + discounts
    - **\*\*Link:\*\*** [https://sentry.io/for/startups/](https://sentry.io/for/startups/)

22\. **\*\*Retool\*\***
    - **\*\*Deal:\*\*** Upto $60,000 benefits
    - **\*\*Link:\*\*** [https://retool.com/startups](https://retool.com/startups)

23\. **\*\*Algolia\*\***
    - **\*\*Deal:\*\*** $10,000 credits
    - **\*\*Link:\*\*** [https://www.algolia.com/startups/](https://www.algolia.com/startups/)

24\. **\*\*Notion\*\***
    - **\*\*Deal:\*\*** upto $1,000 with 6 months free
    - **\*\*Link:\*\*** [https://www.notion.so/startups](https://www.notion.so/startups)

25\. **\*\*Miro\*\***
    - **\*\*Deal:\*\*** upto $1,000 benefits
    - **\*\*Link:\*\*** [https://miro.com/startups/](https://miro.com/startups/)

26\. **\*\*Github\*\***
    - **\*\*Deal:\*\*** 20 seats free
    - **\*\*Link:\*\*** [https://github.com/enterprise/startups](https://github.com/enterprise/startups)

27\. **\*\*Linear\*\***
    - **\*\*Deal:\*\*** Upto 6 months free
    - **\*\*Link:\*\*** [https://linear.app/startups](https://linear.app/startups)

28\. **\*\*Atlassian\*\***
    - **\*\*Deal:\*\*** Free/Discounted access
    - **\*\*Link:\*\*** [https://www.atlassian.com/software/startups](https://www.atlassian.com/software/startups)

29\. **\*\*Twilio\*\***
    - **\*\*Deal:\*\*** $500 benefits
    - **\*\*Link:\*\*** [https://www.twilio.com/startups](https://www.twilio.com/startups)

30\. **\*\*Intercom\*\***
    - **\*\*Deal:\*\*** Upto 95% off
    - **\*\*Link:\*\*** [https://www.intercom.com/early-stage](https://www.intercom.com/early-stage)

31\. **\*\*Hubspot\*\***
    - **\*\*Deal:\*\*** Upto 90% off
    - **\*\*Link:\*\*** [https://www.hubspot.com/startups](https://www.hubspot.com/startups)

32\. **\*\*Zendesk\*\***
    - **\*\*Deal:\*\*** 6 months free
    - **\*\*Link:\*\*** [https://www.zendesk.com/startups/](https://www.zendesk.com/startups/)

33\. **\*\*Figma\*\***
    - **\*\*Deal:\*\*** $1000 benefits
    - **\*\*Link:\*\*** [https://www.figma.com/startups/](https://www.figma.com/startups/)

34\. **\*\*Canva\*\***
    - **\*\*Deal:\*\*** Free tier + discounts
    - **\*\*Link:\*\*** [https://www.canva.com/teams/](https://www.canva.com/teams/)

35\. **\*\*Freshworks\*\***
    - **\*\*Deal:\*\*** Upto $10,000
    - **\*\*Link:\*\*** [https://www.freshworks.com/startups/](https://www.freshworks.com/startups/)

36\. **\*\*Stripe\*\***
    - **\*\*Deal:\*\*** $150 off +perks
    - **\*\*Link:\*\*** [https://stripe.com/atlas](https://stripe.com/atlas)

37\. **\*\*Dropbox\*\***
    - **\*\*Deal:\*\*** 40-90% off
    - **\*\*Link:\*\*** [https://www.dropbox.com/startups](https://www.dropbox.com/startups)

38\. **\*\*Zoho\*\***
    - **\*\*Deal:\*\*** 1 year free
    - **\*\*Link:\*\*** [https://www.zoho.com/one/startups/](https://www.zoho.com/one/startups/)

39\. **\*\*Brex\*\***
    - **\*\*Deal:\*\*** Exclusive deals
    - **\*\*Link:\*\*** [https://www.brex.com/startups](https://www.brex.com/startups)

40\. **\*\*Ramp\*\***
    - **\*\*Deal:\*\*** Extensive deals
    - **\*\*Link:\*\*** [https://ramp.com/rewards](https://ramp.com/rewards)

41\. **\*\*Gusto\*\***
    - **\*\*Deal:\*\*** Discounted pricing
    - **\*\*Link:\*\*** [https://gusto.com/partners](https://gusto.com/partners)

# Links to FREE Deals - PerkNest !

Free services
1. Notion - 6 months free on the business plan with unlimited AI
2\. Make - First month free on pro plan + 40% off Pro or team annual plans
3\. GCP - $2000 in credits for 1 year if you never raised funds / $350000 in credits if you did
4\. Figma - 50% off professional plan for startups
5\. Digital Ocean- $200 in credits
6\. AWS Activate - upto $100000 in credits or 20-50% off your monthly spend
7\. Brevo - 75% off the annual starter and started plans
8\. Slack - 25% off new plan purchases
9\. Clickup - 20% off unlimited and business plans for 1 year
10\. Intercom - 1 year free on the advanced plan
11\. Hubspot - 30% off professional and enterprise plans for 1 year across all hubspot products
12\. Semrush - 14 days free on the pro and guru plans
13\. Zendesk - 6 months free
14\. Shopify - $1/month for first 3 months +25% off annual plans
15\. Zoom Meetings - 30% off zoom one pro or zoom one business for 1 year
16\. Monday - First Month Free
17\. Perplexity AI - 3 months free on the enterprise pro plan
18\. Figma - 6 months professional free
19\. Linear - 1 year free on startup plan
20\. Loom - 3 months business plan free
21\. Stirring minds - we offer 1 month free coworking for 1 person
22\. Slack - 25% off pro plan for 1 year

Paid Services
1. Airtable- $1000 in credits in 1 year
2. Stripe - Waived stripe fees on your next $20,000 in payment processing
3. Webflow -1 year free on CMS site plan

# Links to free deals in JoinSecret

Free services
1. Notion - 6 months free on the business plan with unlimited AI
Link - [https://affiliate.notion.so/9cq03d26evne](https://affiliate.notion.so/9cq03d26evne)
2\. Make - First month free on pro plan + 40% off Pro or team annual plans
Link - [https://www.make.com/en/register?pc=joinsecret](https://www.make.com/en/register?pc=joinsecret)
Form- [https://f.make.com/r/mV2vjJ](https://f.make.com/r/mV2vjJ)
3\. GCP - $2000 in credits for 1 year if you never raised funds / $350000 in credits if you did
Form - [http://www.jdoqocy.com/click-100567186-16937432](http://www.jdoqocy.com/click-100567186-16937432)
4\. Capcut - 7 days free + 25% off annual plans
Link- [https://capcutaffiliateprogram.pxf.io/y203nD](https://capcutaffiliateprogram.pxf.io/y203nD)
5\. Digital Ocean- $200 in credits
Link - [https://www.dpbolvw.net/click-100567186-15838400](https://www.dpbolvw.net/click-100567186-15838400)
6\. AWS Activate - upto $100000 in credits or 20-50% off your monthly spend
It Ask the eligibility form first and the provide with the deal
7\. Brevo - 75% off the annual starter and started plans
Link - [https://get.brevo.com/gb93jt806fxk](https://get.brevo.com/gb93jt806fxk)
Code- SECRET-SIB
8\. Slack - 25% off new plan purchases
Link - [https://slack.com/intl/en-in/promo/partner?remote\_promo=5be73e96](https://slack.com/intl/en-in/promo/partner?remote_promo=5be73e96)
9\. Clickup - 20% off unlimited and business plans for 1 year
Link - [https://try.web.clickup.com/5uestd](https://try.web.clickup.com/5uestd)
10\. Intercom - 1 year free on the advanced plan
Link - [https://www.intercom.com/startups-program?utm\_source=external-website&utm\_medium=referral&utm\_campaign=es\_partner\_direct\_perk-platform\_secret&utm\_term=secret&utm\_content=perk%20platform](https://www.intercom.com/startups-program?utm_source=external-website&utm_medium=referral&utm_campaign=es_partner_direct_perk-platform_secret&utm_term=secret&utm_content=perk%20platform)
11\. n8n- 14 days free + 20% off annual plans
Link- [https://n8n.partnerlinks.io/ip3q2vzra42d](https://n8n.partnerlinks.io/ip3q2vzra42d)
12\. Semrush - 14 days free on the pro and guru plans
Link - [https://l.gourl.es/l/fc4286630658b9f4bbca9d1362cd1ee80573870f?w=bWFyeUBqb2luc2VjcmV0LmNvbQ&u=10726427](https://l.gourl.es/l/fc4286630658b9f4bbca9d1362cd1ee80573870f?w=bWFyeUBqb2luc2VjcmV0LmNvbQ&u=10726427)
13\. Zendesk - 6 months free
Link - [https://www.zendesk.com/campaign/startups-partner-exclusive/?partner\_account=0011E00001mT2JRQA0](https://www.zendesk.com/campaign/startups-partner-exclusive/?partner_account=0011E00001mT2JRQA0)
14\. Shopify - $1/month for first 3 months +25% off annual plans
Link- [https://shopify.pxf.io/rQ7nrv](https://shopify.pxf.io/rQ7nrv)
15\. Zoom Meetings - 16% off zoom annual plans
Link- [https://zoom.sjv.io/c/3655744/3719575/17910](https://zoom.sjv.io/c/3655744/3719575/17910)
16\. Google workspace
First deal - 20% off standard plans for 1 year
Link- [https://www.jdoqocy.com/click-100567186-14497232](https://www.jdoqocy.com/click-100567186-14497232)
Code- 67E3W3FMVFYHWD3
Second deal - 20% off plus plans for 1 year
Link- [https://www.jdoqocy.com/click-100567186-14497232](https://www.jdoqocy.com/click-100567186-14497232)
code- C93DHFJ44ATRCMM
17\. Typeform - 40% off all annual plans
Link -
18\. TikTok Ads - $6,000 Ad Credit\* for 1 month
Link -
19\. Descript - 35% off annual plans
Link -
20\. Manychat - 30% off for 3 months
Link -
21\. [Apollo.io](http://Apollo.io) - 50% off the annual Basic or Professional plan for 1 year (Up to 5 seats)
Link -
22\. Base44 - 20% off annual plans
Link -
23\. Gamma - 400 credits + 30% off annual plans for Individuals
Link -
24\. Lovable - 15% off annual Pro and Business plans
Link -
25\. Loom - Free forever for up to 10 users
Link -
26\. Pipedrive - 20% off for 12 months
Link -
27\. Clay - 100 free credits/month + 10% off annual plans
Link -
28\. [Instantly.ai](http://Instantly.ai) - Additional 20% off monthly and annual plans
Link - [https://instantly.ai/?via=jean-loup](https://instantly.ai/?via=jean-loup)
Code - SEC20
29\. Carrd - 30% off for 1 year
Link - [http://try.carrd.co/secret30](http://try.carrd.co/secret30)
30\. Waalaxy - 7 days free + 50% off annual plans
Link - [https://try.waalaxy.com/3h1bz01n62go](https://try.waalaxy.com/3h1bz01n62go)
31\. Bubble - 30% off on monthly plans for 1 year
Link - [https://bubble.pxf.io/DyQojy](https://bubble.pxf.io/DyQojy)
32\. Fiverr - 10% off your first purchase
Link - [https://fiverr.partnerlinks.io/arpmo4pqnps5](https://fiverr.partnerlinks.io/arpmo4pqnps5)

Paid Services
1. Airtable - $1,000 in credits for 1 year
2. Stripe- Waived Stripe fees on your next $20,000 in payment processing
3. Webflow - 1 year free on a CMS site plan
4. Miro - $1,000 in credits (lifetime validity)
5. ElevenLabs - 12 months free (33 million characters of free access)
6. Hubspot - 90% off the Professional and Enterprise plans for 1 year
7. Microsoft Azure - $5,000 in credits for 6 months if you didn't raise funds // Up to $150,000 in credits for 2 years if you did
8. Todoist - 20% off annual plans
9. Github- 20 seats on the Enterprise plan free for 1 year
10. OVHCloud - €10,000 in credits for 1 year
11. Framer - 1 year free on the Pro Plan
12. Stripe Atlas - $50 off for the incorporation of your company
13. Perplexity AI - 3 months free on the Enterprise Pro plan (up to 50 seats)
14. Hugging Face - 2 months free on the Pro plan
15. Mixpanel - 1 year free
16. LinkedIn - Spend $250, get $250 FREE ad credit
17. Zoho - $2,500 in credits for 1 year
18. Google Ads - Spend $500, get $500 // Spend $1,000, get $750 // Spend $1,500, get $1,000 in FREE ad credit
19. Sentry - 6 months free on the Teams plan
20. Railway - $240 credit on Hobby plan for 1 year
21. Retool -  1 year free on the monthly Team or Business plan
22. Cloudflare - $5,000 in credits for self-funded startups // $250,000 in credits funded startups
23. Asana - 75% off the annual Starter and Advanced plans for 1 year
24. Linear - 1 year free on the Basic or Business plans (2 seats)
25. Tally - 50% off for 1 year
26. mongoDb - $500 in credits for 1 year
27. Docsend - 90% off your annual DocSend plan
28. Active Campaign - 90% off any annual plan for the first year
29. Gitlab - 12 months free on the Ultimate license
30. Indeed - €100 credits
31. Memberstack - 50% off for 6 months
32. Bouncer - 20% off on Pay-as-you-go
33. Scalingo - €1,000 in credits for 6 months
34. Algolia - $10,000 in credits for 1 year
35. Axeptio -  3 months free on any plan
36. DevRev - 12 months free on the Pro plan
37. Microsoft for startups- $5,000 credit for 6 months
38. Chargebee - 40% off the Performance plan for 1 year
39. Datadog - 1 year free on the Pro plan
40. Content Beta - $1,000 in credits on any annual plan
41. Merge - $5,000 in credits on the Professional or Enterprise plans
42. myPresences - $200 Credit on any plan.
43. Agency - $100,000 in credits
44. Array - 6 months free on the Essential plan
45. Confluent - 12 months free
46. Salesforce - 45% off the Starter Suite plan for 1 year
47. Databricks - $21,000 in credits for 1 year
48. Livechat - $150 credits (Team, Business and Enterprise Plans)
49. noCRM - 50% off up to 6 months on Dream team and Sales Expert
50. Snapcall - 6 months free on Growth plan
51. Instatus - 1 year free on Pro Plan
52. Beefree SDK - 90% off subscription fees on Core and Superpowers plans for 12 months
53. RocketDevs - $1,000 in credits
54. Mobbin - 20% off for 1 year on the Pro plan
55. SerpAPI - 50% off for 12 months
56. Surfshark - 79% off and 2 months free on 2 year plans
57. Jepto - 6 months free on Basic Plan
58. Mux - $500 credits on Mux
59. SearchAds- 3 months free
60. Post Affiliate Pro - $200 credits on any plan
61. Jetbrains - 50% off all JetBrains tools (up to 10 licences)
62. Crunchbase - 20% off for 1 year
63. Alibaba Cloud - $120,000 in credits for 1 year
64. Willo - 50% off for 6 months
65. Flippa - 50% off success fees and 25% off listing fees
66. Galaxy - $600 in credits for 1 year
67. Hunter - 30% off for the first 3 months
68. SimplyBlock - $10,000 in credits for 12 months
69. Harvestr - 50% off on the "Rise" plan
70. WP engine - 3 months free on annual plans
71. [Visible.vc](http://Visible.vc) - 20% off any plan for 12 months
72. Findcustomer - 50% off for 6 months
73. [Slab](https://www.joinsecret.com/slab) - 40% off the Startup and Business plans for 12 months
74. [Sweet Show](https://www.joinsecret.com/sweet-show) - 6 months free
75. [LiveAgent](https://www.joinsecret.com/liveagent) - $120 credits on any plan
76. [LiveSession](https://www.joinsecret.com/livesession) - 50% off the Pro plan for 6 months
77. [MailTag](https://www.joinsecret.com/mailtag) - 50% off any plans (monthly and annual) lifetime
78. [Joonbot](https://www.joinsecret.com/joonbot) - 3 months free on all monthly plans
79. [InvoiceBerry](https://www.joinsecret.com/invoiceberry) - 30% off annual plans
80. [Every](https://www.joinsecret.com/every) - 9 months free on the HR plan
81. [AdOpt](https://www.joinsecret.com/adopt) - 6 months free on any plan
82. [Firstbase](https://www.joinsecret.com/firstbase) - 10% off for 1 year
83. [Tiime](https://www.joinsecret.com/tiime-fr) - 6 months free
84. [Netcore Cloud](https://www.joinsecret.com/netcore-cloud) -$30,000 in credits
85. [Flow](https://www.joinsecret.com/flow) - 35% off any plan for 12 months
86. [hide.me VPN](https://www.joinsecret.com/hide-me-vpn) - 76% off for 39 months
87. [ProdCamp](https://www.joinsecret.com/prodcamp) - 1 year free subscription on any plan
88. [Howuku](https://www.joinsecret.com/howuku) - 50% off for 12 months
89. [UseCSV](https://www.joinsecret.com/usecsv) - 6 months free on the Scale plan
90. [Cloudimage](https://www.joinsecret.com/cloudimage) - 20% discount across all paid plans
91. [Topic](https://www.joinsecret.com/topic) - 40% off for 3 months
92. [No Limits](https://www.joinsecret.com/no-limits) - 2 months free
93. [Faaaster (ex. Themecloud)](https://www.joinsecret.com/themecloud)\- 50% off across all hosting plans
94. [Process Street](https://www.joinsecret.com/process-street) - 6 months free on the Startup plan
95. [Prisma](https://www.joinsecret.com/prisma) - $300 in credits
96. [Calendar](https://www.joinsecret.com/calendar) - 50% off all plans for 1 year
97. [PureVPN](https://www.joinsecret.com/purevpn) -70% off annual plans for 1 year
98. [Blue](https://www.joinsecret.com/blue) - 6 months free
99. [SubOps](https://www.joinsecret.com/subops) - Get 50% off for any annual plan
100. [Copy.ai](https://www.joinsecret.com/copy-ai) - 30% off all plans for 1 year
101. [GanttPRO](https://www.joinsecret.com/ganttpro) -Up to $3,000 in credits
102. [Signitic](https://www.joinsecret.com/signitic) - 30% off for 1 year
103. [Moosend](https://www.joinsecret.com/moosend) - 75% off monthly plans for 1 year
104. [LeadGen App](https://www.joinsecret.com/leadgen-app) - 50% off the monthly Pro plan for life
105. [Apphud](https://www.joinsecret.com/apphud) - 6 months free on Launch Plan
106. [Gmelius](https://www.joinsecret.com/gmelius) - 50% off for 1 year
107. [Wing Assistant](https://www.joinsecret.com/wing-assistant) - $1,000 in credits for Full-Time Services ($500 in credits for Part-Time)
108. [Pivony](https://www.joinsecret.com/pivony) -6 months free on the Basic plan
109. Rollbar - 6 months free on the Advanced plan
110. Blinkist - 25% off annual plans for 1 year
111. Thankz - 20% off for any plan
112. Outsite - $75 off your membership
113. Carta - 25% off 1 year
114. PostHog - $50,000 in credits for 1 year
115. ApparelMagic - 15% off the Professional, Enterprise, or Ultimate plans for 1 year
116. The SaaSy People - 50% off on the annual plan plus zero onboarding fee
117. Perdoo - 20% off Premium plan for 12 months
118. Lawpath - 40% off Legal Plans for 1 year
119. Ledgy - 25% off your first year
120. Yodel - 50% off for 5 months
121. Trainn - 50% off up to 1 year
122. [tawk.to](http://tawk.to) - 15% off on all paid add-ons
123. Cookiebot - 40% off for 3 years
124. Hypervault - 50% off all plans for 1 year
125. Planable - $150 off initial purchases
126. Encharge - 50% off for 1 year
127. Shippo - 3 months free on the Pro plan
128. OpenVC - 20% off for 1 year
129. Mobiroller - 50% off up to 1 year
130. Paperform - 50% off monthly plans for 1 year
131. MonsterONE - 30% off for 1 year
132. Prelo - 50% off all plans for 1 year
133. Expandi - 30% off for 1 year
134. Zoviz - 30% off your plan
135. Prezi - 40% off for 1 year
136. June Analytics - $450 in credits for the Growth plan (3 months)
137. Xoxoday - 95% off for 1 year
138. Visme - 30% off the Pro plan for 1 year
139. Swipe Pages - 30% off monthly plans for 1 year
140. PitchBob - 50% off the Super Pro plan
141. InfluenceKit - 30% off for 1 year
142. Bonsai - 2 months free on annual plans
143. GrowSurf - 40% off for the first 12 months
144. LetsEnhance - 50% off 100 and 300 image monthly subscriptions for 1 year
145. Cobalt - 75% off the Growth and Scale plans for 1 year
146. Upfluence - 25% off per module for 1 year
147. LogicBalls - 50% off the Premium plan for 1 year
148. Drata - 30% off for 1 year
149. DNA FI - 50% off premium reports
150. Guideline Retirement - 3 months free
151. Acumbamail - 50% off for 6 months
152. DogQ - 70% off for 1 year
153. Clemta - 15% off all plans
154. Compass - 90% off for 1 year
155. IFTTT - 40% off the Pro+ plan for 1 year
156. CatchApp Bookings - 75% off for 1 year
157. WiseStamp - 50% off for 1 year
158. FutureLearn - 30% off Unlimited for Teams annual subscriptions
159. Toplyne - 50% off the annual Monetize and Enterprise plans
160. Balsamiq Cloud - 3 months free
161. DataCamp - 25% off the Teams plan for 1 year
162. Empuls - 95% off for 1 year
163. Dotcom-Monitor - 50% off for 1 year
164. Vmaker - 30% off monthly plans or 20% off yearly plans
165. [Promo.com](http://Promo.com) - 40% off annual plans and 20% off monthly plans
166. Wilco - 25% off the first year of an annual plan
167. FileForms - 50% off all plans for 1 year
168. MerciApp - 30% off for 1 year
169. FlexOffers - 40% off for 1 year
170. Forbes - 10% off an annual/biennial membership
171. RemotePass - 20% off for contractors and 10% off for EOR for 1 year
172. SnowcatCloud - 1 month free + 3 months free on the Startup plan
173. Oyster HR - 30% off all plans for 1 year
174. LiveChatAI - 50% off monthly and annual plans for 1 year
175. Collabstr - 10% off all orders for 1 year
176. Truzta - 50% off for 1 year
177. MyOperator - 30% off for 1 year
178. Fraud Blocker - 25% off the Starter and Pro plans for 1 year
179. Zinance - 50% off Bookkeeping, CFO and Tax services for 1 year
180. Winston AI - 30% off monthly or annual plans for 1 year
181. Flipsnack - 30% off yearly plans
182. Plane - 10% off Employer of Record and Contractor services for 1 year
183. ProofHub - 34% off the Ultimate Control plan lifetime
184. Olino Assurance - 1 month free on any contract
185. FileSplash - 50% off all plans lifetime
186. Factorial - 30% off all plans for 1 year
187. Campaigner - 35% off monthly plans for 1 year

# Links to free deals in Newline Startup Free credits

1. Google Cloud - Upto $350,000 credits for AI-Focused Startups
Link - [https://cloud.google.com/startup](https://cloud.google.com/startup)
1. Cloudflare- Upto $250,000 credits for developer platform
Link - [https://www.cloudflare.com/forstartups/](https://www.cloudflare.com/forstartups/)
1. Microsoft - Upto $150,000 Azure credits
Link - [https://foundershub.startups.microsoft.com/](https://foundershub.startups.microsoft.com/)
1. Amazon Web Services- Upto $100,000 credits for AWS Activate
Link - [https://aws.amazon.com/activate/](https://aws.amazon.com/activate/)
1. Digital Ocean - Upto $100,000 Infrastructure credits
Link - [https://www.digitalocean.com/hatch](https://www.digitalocean.com/hatch)
1. OVHCloud - Upto 100,000 euro cloud credits
Link -[https://startup.ovhcloud.com/](https://startup.ovhcloud.com/)
1. Vercel - Varies by Partner
Link - [https://vercel.com/startups](https://vercel.com/startups)
1. Anthropic - $25,000 Claude API credits
Link -[https://www.anthropic.com/startups](https://www.anthropic.com/startups)
1. Perplexity AI- $5,000 API credits
Link -[https://www.perplexity.ai/hub/blog/introducing-the-perplexity-startup-program](https://www.perplexity.ai/hub/blog/introducing-the-perplexity-startup-program)
10\. Eleven Labs - $4,000 (12 months of scale tier access)
Link - [https://elevenlabs.io/startup-grants](https://elevenlabs.io/startup-grants)
11\. Open AI- Upto $2500 API credits
Link -[https://ramp.com/rewards/openai](https://ramp.com/rewards/openai)
12\. MongoDB - Upto $20,000 Atlas credits
Link - [https://www.mongodb.com/startups](https://www.mongodb.com/startups)
13\. Couchbase - $12,750 capella credits
Link - [https://aws.amazon.com/startups/offers](https://aws.amazon.com/startups/offers)
14\. Supabase - $300 credits
Link -[https://supabase.com/partners/integrations](https://supabase.com/partners/integrations)
15\. Planetscale - Varies by company
Link - [https://planetscale.com/startups](https://planetscale.com/startups)
1. Mixpanel - $50,000 benefits with 1 year free of growth plan
Link - [https://mixpanel.com/startups](https://mixpanel.com/startups)
1. PostHog- $50,000 Benefits
Link - [https://posthog.com/startups](https://posthog.com/startups)
1. Twilio Segment - $25,000 benefits with full access to segment startup program
Link - [https://segment.com/industry/startups/](https://segment.com/industry/startups/)
1. Amplitude - 1 year free
Link - [https://amplitude.com/startups](https://amplitude.com/startups)
20\. Datadog - 1 year free
Link - [https://www.datadoghq.com/partner/datadog-for-startups/](https://www.datadoghq.com/partner/datadog-for-startups/)
21\. Sentry- Free tier + discounts
Link - [https://sentry.io/for/startups/](https://sentry.io/for/startups/)
22\. Retool - Upto $60,000 benefits
Link - [https://retool.com/startups](https://retool.com/startups)
23\. Algolia - $10,000 credits
Link - [https://www.algolia.com/startups/](https://www.algolia.com/startups/)
24\. Notion - upto $1,000 with 6 months free
Link - [https://www.notion.so/startups](https://www.notion.so/startups)
25\. Miro - upto $1,000 benefits
Link - [https://miro.com/startups/](https://miro.com/startups/)
26\. Github - 20 seats free
Link - [https://github.com/enterprise/startups](https://github.com/enterprise/startups)
27\. Linear - Upto 6 months free
Link - [https://linear.app/startups](https://linear.app/startups)
28\. Atlassian - Free/Discounted access
Link - [https://www.atlassian.com/software/startups](https://www.atlassian.com/software/startups)
29\. Twilio -$500 benefits
Link - [https://www.twilio.com/startups](https://www.twilio.com/startups)
30\. Intercom - Upto 95% off
Link - [https://www.intercom.com/early-stage](https://www.intercom.com/early-stage)
31\. Hubspot - Upto 90% off
Link - [https://www.hubspot.com/startups](https://www.hubspot.com/startups)
32\. Zendesk - 6 months free
Link - <a href=[https://www.zendesk.com/startups/](https://www.zendesk.com/startups/)
33\. Figma - $1000 benefits
Link - [https://www.figma.com/startups/](https://www.figma.com/startups/)
34\. Canva - Free tier + discounts
Link - [https://www.canva.com/teams/](https://www.canva.com/teams/)
35\. Freshworks - Upto $10,000
Link - [https://www.freshworks.com/startups/](https://www.freshworks.com/startups/)
36\. Stripe - $150 off +perks
Link - [https://stripe.com/atlas](https://stripe.com/atlas)
37\. Dropbox - 40-90% off
Link -[https://www.dropbox.com/startups](https://www.dropbox.com/startups)
38\. Zoho - 1 year free
Link - [https://www.zoho.com/one/startups/](https://www.zoho.com/one/startups/)
39\. Brex - Exclusive deals
Link -[https://www.brex.com/startups](https://www.brex.com/startups)
40\. Ramp - Extensive deals
Link - [https://ramp.com/rewards](https://ramp.com/rewards)
41\. Gusto - Discounted pricing
Link - [https://gusto.com/partners](https://gusto.com/partners)

# Task List Detailed Explanation

# Version 1 — Base Platform Release (Core Functionality)
Goal: Launch a **working PerksNest marketplace** with basic infrastructure.
Tasks:
### 1\. Backend For Admin Portal
**Objective:** Provide administrators with complete, secure control over the platform's data, users, and deals.
**Requirements for Implementation:**
*   **Database Schema (Deals/Products):** Create structured data models for `Deal`, `Partner`, and `Category`. The Admin requires full CRUD (Create, Read, Update, Delete) access to all models.
*   **User Management System:** Implement backend logic to view all registered users, suspend or ban abusive accounts, and trigger password resets.
*   **Analytics & Tracking:** Create basic aggregations to track platform health (e.g., total signups over time, total clicks per deal, total active support tickets).
*   **Proposed API Endpoints:**
    *   `GET /api/admin/users`: List users with pagination, sorting, and filtering.
    *   `POST /api/admin/deals`: Add a new deal to the platform marketplace.
    *   `PUT /api/admin/deals/:id`: Edit existing deal details, terms, or discount values.
    *   `DELETE /api/admin/deals/:id`: Soft-delete or deactivate a deal so it no longer appears on the frontend.
### 2\. Backend For The Referral Links
**Objective:** Track user acquisition and handle the logic for user-to-user referral programs and reward distribution.
**Requirements for Implementation:**
*   **Link Generation:** Automatically generate a unique, URL-safe referral code (e.g., nanoid or UUID) when a user creates an account. Example format: [`perksnest.co/ref/[unique_code]`](http://perksnest.co/ref/[unique_code]).
*   **Click Tracking & Attribution:** When a new user registers using a referral link, the backend must save a `referred_by` foreign key linking to the original referrer's user ID.
*   **Reward Logic:** Implement a `ReferralRewards` table to track successful referrals and the state of the reward (e.g., `Pending`, `Approved`, `Claimed`).
*   **Proposed API Endpoints:**
    *   `GET /api/referrals/me`: Fetch the current authenticated user's referral link and their statistics (total clicks, successful conversions).
    *   `POST /api/referrals/track`: Log a hit/visit on a referral link before signup occurs to measure conversion rates.
### 3\. Products Page Implementation for Every Deal
**Objective:** Create a dynamic, SEO-friendly, and high-converting frontend page for individual deals and products available on the platform.
**Requirements for Implementation:**
*   **Dynamic Routing:** Frontend routing (likely Next.js `[slug]` or `[id]` structure) to handle URLs like `/deals/aws-activate` or `/perks/stripe`.
*   **Data Hydration:** Fetch detailed payload from the backend for the specific deal:
    *   Partner Company Name & High-Res Logo
    *   Primary Offer (e.g., "$5,000 in AWS Credits")
    *   Detailed Description of the software/service
    *   Redemption Instructions (How to apply the perk, terms and conditions)
*   **UI/UX & Access Control:**
    *   Must have a highly visible "Claim Deal" Call-to-Action (CTA) button.
    *   If the user is _not_ logged in, clicking the CTA redirects them to the signup page.
    *   If the user _is_ logged in, clicking the CTA reveals the promo code or redirects to the partner's custom landing page.
*   **Analytics Event:** Firing a backend request when a user clicks "Claim Deal" to strictly track conversion metrics for partners.
### 4\. Backend For Space Portal
**Objective:** A dedicated, secure dashboard for Partners (the companies offering the deals) or B2B managers to manage their presence on PerksNest.
**Requirements for Implementation:**
*   **Role-Based Authentication (RBAC):** Ensure a Partner profile (`role: 'partner'`) can only access data belonging to their specific company, securely isolated from administrative and other partner data.
*   **Deal Management:** Allow partners to propose updates to their active deals (which may require Admin approval via a Webhook/Notification system) or update their company profile and logo.
*   **Redemption Metrics:** Endpoints allowing partners to view basic time-series data of how many PerksNest users have engaged with or claimed their deal.
*   **Proposed API Endpoints:**
    *   `GET /api/space/dashboard`: Fetch high-level engagement metrics for the partner's deals.
    *   `PUT /api/space/profile`: Update the partner's company information, billing, and contact details.
### 5\. Ticket System Between User, Partner, and Admin
**Objective:** A unified internal communication system to resolve user disputes, answer partner questions, and allow admins to handle customer service natively without leaving the platform.
**Requirements for Implementation:**
*   **Database Schema (Tickets):** Create a `Ticket` model incorporating:
    *   *   id, `subject`, `status` (`Open`, `In Progress`, `Resolved`, `Closed`)
    *   `priority` (`Low`, `Medium`, `High`)
    *   `creator_id` (Can be a User or Partner)
    *   `assigned_admin_id` (Nullable, tracks which admin is handling the ticket)
*   **Database Schema (TicketMessages):** A sub-model linked to the `Ticket` ID for the actual chat/thread functionality, storing `sender_id`, `message_text`, and `timestamp`.
*   **Access Permissions:**
    *   **Users:** Can only view, create, and reply to tickets they initiated.
    *   **Partners:** Can view tickets related to their specific deals or general queries they formed in the Space Portal.
    *   **Admins:** Have absolute visibility. Can view, assign, reply to, and close _any_ ticket in the system.
*   **Proposed API Endpoints:**
    *   `POST /api/tickets/create`: Initialize a new support ticket.
    *   `GET /api/tickets`: Fetch a list of tickets scoped to the current user's role.
    *   `POST /api/tickets/:id/reply`: Add a new message to an existing ticket thread.
    *   `PUT /api/tickets/:id/status`: Update the status or priority of the ticket (Admin / Automations).

# Version 2 — Marketplace Improvements
Goal: Make the **deals marketplace powerful and usable**.
Tasks:
### 1\. Deal Categorization
**Objective:** Organize the growing marketplace of deals into logical, easily navigable categories to help users find relevance quickly.
**Requirements for Implementation:**
*   **Database Schema Updates:** Add a robust `Category` and `Subcategory` model. Establish a many-to-many relationship between `Deals` and `Categories` (e.g., a Stripe deal could be under "Payment Processing" and "Startup Tools").
*   **Admin Management:** Provide the Admin portal with an interface to create, edit, and hierarchically order categories.
*   **Frontend Navigation:** Implement a dynamic category sidebar or top navigation menu on the marketplace page. Display deal counts next to each category (e.g., "Marketing (24)").
*   **Proposed API Endpoints:**
    *   `GET /api/categories`: Fetch all active categories and their nested subcategories.
    *   `PUT /api/admin/deals/:id/categories`: Assign multiple categories to a specific deal.
### 2\. Advanced Filtering of Deals
**Objective:** Allow users to rapidly narrow down hundreds of deals to find exactly what they need based on specific constraints.
**Requirements for Implementation:**
*   **Filter Parameters:** Implement URL query-based filtering state (e.g., `?category=marketing&sort=highest_value&type=lifetime_deal`).
*   **Filter Types Required:**
    *   **By Deal Type:** Free Credits, Percentage Off, Lifetime Deal, Extended Trial.
    *   **By Deal Value:** Sort by highest estimated monetary value.
    *   **By Popularity:** Sort by the number of times the deal has been claimed.
*   **Search Capabilities:** Implement a robust text search querying against deal titles, partner names, and descriptions (potentially using Prisma Full-Text Search or a lightweight search engine like Meilisearch).
*   **Proposed API Endpoints:**
    *   `GET /api/deals/search`: A single robust endpoint accepting query parameters for `q` (search term), `category_id`, `type`, and `sort`. Return paginated results.
### 3\. Deal Detail Page Improvement - Add Sections
**Objective:** Enrich the Deal Detail page created in Version 1 to provide comprehensive, persuasive information that increases conversion rates.
**Requirements for Implementation:**
*   **New Content Sections:**
    *   **"About the Partner":** A dedicated section pulling data from the Partner's profile explaining who they are.
    *   **"Who is this for?":** Bullet points highlighting the target audience (e.g., "Best for early-stage SaaS").
    *   **"Similar Deals":** A recommendation engine carousel showing 3-4 other deals in the same category.
    *   **"User Reviews/Ratings":** Allow users who have claimed the deal to leave a 1-5 star rating and a brief text review.
*   **Frontend Refactor:** Shift the layout from a simple card to a multi-column layout, ensuring it remains mobile-responsive and visually engaging.
### 4\. Eligibility Pre-check for Special Deals
**Objective:** Prevent user frustration by checking if they actually qualify for high-value perks (like $100k AWS startups credits) _before_ they attempt to claim them.
**Requirements for Implementation:**
*   **Dynamic Eligibility Rules:** Update the `Deal` schema to store JSON logic defining eligibility requirements (e.g., "Requires incorporated company", "Must have raised <$5M", "New customers only").
*   **User Profile Enrichment:** Add a "Company Profile" section to the user account where they fill in their startup's funding stage, incorporation status, and tech stack.
*   **Pre-check Logic:** When a user navigates to a deal page, the backend evaluates the user's Company Profile against the Deal's Eligibility JSON.
*   **UI/UX Impact:** If the user is eligible, show a green "You are eligible!" badge. If not, show a locked state with an explanation of _why_ they don't qualify, preventing them from wasting time.
### 5\. Savings Counter and Revenue Saved Graphs
**Objective:** Gamify the platform and clearly demonstrate the monetary ROI (Return on Investment) of being a PerksNest user.
**Requirements for Implementation:**
*   **Value Tracking:** Every deal in the database must have an `estimated_value_usd` standard integer field.
*   **User Dashboard Enhancement:** Create a "My Perks" dashboard showing:
    *   Total Lifetime Value claimed (sum of `estimated_value_usd` of claimed deals).
    *   A visual breakdown (Pie chart or Bar graph) of savings by category (e.g., $5,000 saved on Infrastructure, $2,000 on HR).
*   **Public Proof (Social Proof):** A global aggregator on the site homepage displaying "Total Dollars Saved by Founders on PerksNest" to drive new signups.
*   **Proposed API Endpoints:**
    *   `GET /api/user/analytics/savings`: Return aggregated sum and category breakdowns of the authenticated user's claimed deals.

# Version 3 — Personalization & AI
Goal: Make the platform **intelligent and personalized**.
Tasks:
### 1\. Personalization - Startup Onboarding Quiz
**Objective:** Capture rich, structured data about the user's startup during their initial sign-up to immediately tailor their experience and filter out irrelevant noise.
**Requirements for Implementation:**
*   **Onboarding Flow (Frontend):** Build a multi-step form presented immediately after email verification. It should be visually engaging (e.g., Typeform style) and low-friction.
*   **Data Points to Collect:**
    *   **Stage:** Pre-seed, Seed, Series A, Bootstrapped.
    *   **Industry/Vertical:** SaaS, E-commerce, Fintech, Healthcare, Web3, etc.
    *   **Tech Stack:** Preferred cloud provider (AWS/GCP/Azure), backend languages, frontend frameworks.
    *   **Current Needs:** "What are you actively looking to save money on today?" (Hosting, Marketing, HR, Finance tools).
*   **Database Schema Updates:** Add a `StartupProfile` table linked to the `User` model, rigidly validating the data types to ensure it is structured cleanly for AI consumption.
*   **Proposed API Endpoints:**
    *   `POST /api/user/onboarding`: Accept the JSON payload from the quiz and populate the user's `StartupProfile`.
    *   `GET /api/user/profile`: Retrieve the saved profile data to populate settings and context across the app.
### 2\. AI Integration for Recommendation Engine
**Objective:** Leverage Machine Learning or LLM-based embeddings to look at a user's `StartupProfile` and historically claimed deals, and dynamically rank the marketplace specifically for them.
**Requirements for Implementation:**
*   **Data Preparation (Embeddings):**
    *   For every `Deal`, generate a text embedding mapping its description, category, and eligibility rules into a vector representation (e.g., using OpenAI `text-embedding-3-small` or an open-source alternative). Store this in a Vector Database (like Pinecone, Qdrant, or Postgres with pgvector).
    *   Convert the user's `StartupProfile` and their `Active Needs` into a query vector.
*   **Recommendation Logic (Backend):**
    *   When a user hits the dashboard, perform a nearest-neighbor vector search comparing their Profile Vector against all Deal Vectors.
    *   **Collaborative Filtering (Optional):** "Founders at your stage who claimed \[AWS\] also claimed \[Stripe\]."
*   **Frontend Surfacing:** Create a prominent "Recommended for You" section at the very top of the marketplace. Show a high "Match Score" % visually next to these deals to build trust.
*   **Proposed API Endpoints:**
    *   `GET /api/recommendations/personalized`: Return a heavily cached list of the top 5-10 deals tailored to the specific `user_id` calling the endpoint.
### 3\. Deals Wishlist and Bookmarking
**Objective:** Allow users to save deals they are interested in but not yet ready to claim (e.g., maybe they aren't incorporated yet, or don't need marketing software right now).
**Requirements for Implementation:**
*   **Database Schema Updates:** Create a `Wishlist` or `Bookmarks` join table linking a `user_id` to a `deal_id` with a `created_at` timestamp.
*   **UI/UX Updates:**
    *   Add a "Heart" or "Bookmark" icon to every deal card and detail page across the platform.
    *   Provide immediate visual feedback (optimistic UI updates) when the button is clicked.
    *   Create a dedicated "My Wishlist" or "Saved Deals" tab in the user dashboard.
*   **Notification Hook (Optional but Recommended):** Run a scheduled CRON job that emails users an alert if a deal on their wishlist is about to expire, drop in value, or has an exclusivity limit approaching.
*   **Proposed API Endpoints:**
    *   `POST /api/wishlist/:deal_id`: Add a deal to the authenticated user's wishlist.
    *   `DELETE /api/wishlist/:deal_id`: Remove the deal from the wishlist.
    *   `GET /api/wishlist`: Fetch all deals currently bookmarked by the user.

# Version 4 — Growth & Community
Goal: Build **network effects and startup ecosystem**.
Tasks:

### 1\. Accelerators Partnerships
**Objective:** Partner with incubators, accelerators (e.g., Y Combinator, Techstars, local hubs), and VC firms to offer exclusive, gated tiers of perks to their portfolio companies.
**Requirements for Implementation:**
*   **Database Schema Updates:**
    *   Create a `PartnerOrganization` model (for the accelerators).
    *   Update the `User` model to include an `organization_id` foreign key.
    *   Update the `Deal` model to include an `exclusive_to_org_id` (nullable) field. If set, only users belonging to that organization can see/claim the deal.
*   **Verification Workflow:** Implement a flow where a user can request to join an Accelerator's "Space." This requires either:
    *   Admin manual approval.
    *   Automatic approval if they sign up with a specific domain email (e.g., `@example-vc.com`).
    *   An integration with an Identity Provider or a unique invite link generated by the Accelerator.
*   **Accelerator Dashboard:** A specialized view for Accelerator Managers to see aggregate data on their portfolio companies (e.g., "Your cohort has saved $1.2M using PerksNest this year").
*   **Proposed API Endpoints:**
    *   `POST /api/organizations/verify`: Submit proof or an invite code to join a gated organization.
    *   `GET /api/organizations/:id/exclusive-deals`: Fetch deals strictly locked to the user's verified organization.
### 2\. Founders Community
**Objective:** Create a sticky, engaging community layer where founders can ask for advice, review tools, and network with each other, increasing daily active users (DAU).
**Requirements for Implementation:**
*   **In-App Forum/Discussion Board:**
    *   Create `Thread`, `Post`, and `Upvote` models.
    *   Categorize discussions (e.g., "GTM Strategy", "Fundraising", "Tool Recommendations").
*   **User Profiles (Public):** Allow founders to make their `StartupProfile` (from V3) public-facing. Show badges for verified accelerator alumni or "Top Contributors".
*   **Deal-Linked Discussions:** Integrate the community directly into the Deal Detail page. Instead of just a 5-star review, allow a full Q&A thread (e.g., "How easy was Stripe Atlas to set up?").
*   **Moderation:** Implement robust admin tools to ban toxic users, delete spam, and pin valuable threads.
*   **Proposed API Endpoints:**
    *   `GET /api/community/threads`: Fetch a paginated feed of community discussions.
    *   `POST /api/community/threads/create`: Publish a new question or topic.
    *   `POST /api/community/threads/:id/upvote`: Upvote a helpful post.
### 3\. Resource Library - Templates for Pitch Decks & More
**Objective:** Broaden the platform's value proposition by providing free, high-quality operational templates that every startup needs, acting as an organic lead-generation magnet (SEO).
**Requirements for Implementation:**
*   **Database Schema:** Create a `Resource` model including `title`, `description`, `type` (e.g., Figma File, Google Doc, Notion Template), `download_url`, and `category`.
*   **Frontend Hub:** Build a dedicated `/resources` directory. It should be visually distinct from the Software Deals marketplace but use similar filtering mechanics.
*   **Content Types:**
    *   Pitch Deck templates (Seed, Series A).
    *   Legal templates (NDAs, Advisor Agreements) — _with appropriate disclaimers._
    *   Financial Models (Runway calculators, Cap table templates).
*   **Gating Mechanism:** Make the templates completely free, but require an account to download them. This acts as a primary funnel to acquire users who will later browse the software deals.
*   **Proposed API Endpoints:**
    *   `GET /api/resources`: Fetch the library of available templates.
    *   `POST /api/resources/:id/download`: Track the download metric and return the secure G-Drive/Notion link to the authenticated user.