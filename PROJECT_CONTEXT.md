# Be Glowing - Project Context

## Overview
**Brand:** Be Glowing (Moroccan jewelry & accessories brand)
**Products:** Imitation jewelry (copy jewelry, not real gold/platinum).
**Type:** E-commerce store.
**Vibe/Aesthetics:** Simple, minimalistic, premium UI/UX design.

## Tech Stack
- **Frontend/Backend:** Next.js (React)
- **UI Framework:** Tailwind CSS with Shadcn UI for minimal, premium design.
- **Database:** MongoDB Atlas (Free tier). DB is already connected.
- **Media Storage:** Cloudinary (Free tier) for storing product images.

## Core Features & Constraints
- **Payment System:** No online payment processing. Orders will be sent via WhatsApp or managed directly through the website dashboard.
- **Database Collections:** 
  - `Users`
  - `Categories`
  - `Products`
  - `Stock`
  - `Orders`

## Development Roadmap
The development will proceed section by section. After completing each major section/functionality, changes will be pushed to a specific branch on GitHub.

### Phase 1: Admin Dashboard & Database Collections
1. Setup MongoDB models/schemas (Users, Categories, Products, Stock, Orders).
2. Build simple and minimalistic Admin Dashboard using Shadcn UI.
3. Create CRUD operations for Categories, Products, and Stock.
4. Order management view (no payment integration, just status tracking and details).

### Phase 2: Frontend Store (Customer Facing)
1. Implement a premium, simple UI/UX using Shadcn UI.
2. Product listing and category filtering.
3. Product details page.
4. Cart and Checkout process (WhatsApp redirection or simple form submission to dashboard).

## Workflow Guidelines
- Push changes to a GitHub branch upon completing a logical functionality.
- Prioritize high-quality, minimalistic, and premium aesthetics.
