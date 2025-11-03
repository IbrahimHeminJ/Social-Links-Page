# Social-Links-Page

## Introduction
Social links page is a web application made using Vue3 TS + Spring boot, Social links page is about a tool that helps user to make a web page of there own that contains desired links of there social media, users can login into there account through a login process or they can make one in case they were new, the Scoial links page of the user is managed through a dashboard, Where loaded with options for cusomization.

## Problem and Solution
Nowadays people have an account in almost all social medias, In networking with other people sending links separatly and paragraphs that contian all the social medias can be anoyning, un-proffesional and in-efficiant.
We provide a sloution for that where users can gather all there social contacts into a single web page were it is accessable every where and easliy managable through dashboard.
Sending a single link or qr code that contains all desired social medias is all you need.   


## System users
* Admin
* Normal User
* Premium Users

## Target User
Our Targeted Users are a wide rang of people, such as Influcers, content creator, tech enthusiast and Anyone in needs for the feature.   

## Success Criteria
To determine the success of the Social Links Page project, the following measurable criteria have been established:

1. **Complete User Authentication System**
   A fully functional login and signup mechanism that securely manages user registration, authentication, and access control.
2. **Interactive Dashboard with Full CRUD Functionality**
   A responsive and intuitive dashboard that enables users to create, read, update, and delete their social media links efficiently.
3. **Publicly Accessible User Pages**
   Each user’s customized social links page must be successfully deployed and accessible through a public URL.
4. **Structured and Well-Designed Database Schema**
   A properly designed and normalized database diagram ensuring data integrity, scalability, and maintainability.
5. **Robust and Well-Documented APIs**
   The system must provide clear, secure, and reliable API endpoints for all necessary operations between the frontend and backend.

## Core Features

| ID | Feature                 | Description                                      |
| -- | ----------------------- | ------------------------------------------------ |
| F1 | User Profile Management | Create, view, update personal information        |
| F2 | Button/Links Management | Add, view, update, reorder and soft-delete links |
| F3 | Interests & Search (explore page)     | Search users via interest tags                   |
| F4 | Reporting System        | Report users for inappropriate content           |
| F5 | Domain Filtering        | Detect and block harmful domains in links        |
| F6 | Admin Privileges        | Moderation of reports & user accounts            |


## **Non-Goals**
To maintain focus and ensure timely delivery, the following items are explicitly out of scope for the current version of the project:

1. **Advanced Analytics and Reporting**
   The system will not include complex analytics features such as visitor tracking, heatmaps, or click statistics.
2. **Third-Party Authentication Integration**
   External login options (e.g., Google, Facebook, GitHub) will not be supported in this release.
4. **Drag-and-Drop Link Arrangement**
   Dynamic link rearrangement through drag-and-drop functionality is not included in the current scope.
5. **Custom Domain Linking**
   Users will not be able to connect personal or custom domains to their social links page.
6. **Premium or Subscription-Based Features**
   All features will remain free; paid plans or monetization mechanisms are outside the current project phase.
7. **Search Engine Optimization (SEO) Tools**
   The project will not include built-in SEO or meta-tag management tools for user pages.
8. **Media Hosting Services**
   Users will not be able to upload or host images or videos directly within the platform; only external links are supported.
9. **Multi-Language Support**
   The application will only be available in English, with no immediate plan for localization.


## Expected Time Table

| Weeks | Task |
|-------|------|
| 1     | **Project Setup & Database Design**<br>• Set up Spring Boot backend project structure<br>• Set up Vue 3 + TypeScript frontend project<br>• Configure development environment and Git repository<br>• Create basic project documentation |
| 2     | **Authentication & Backend APIs**<br>• Implement user registration (signup) endpoint<br>• Implement login and JWT-based authentication<br>• Create CRUD API endpoints for social links management<br>• Implement logout functionality<br>• Write API documentation<br>• Conduct API testing (Postman/Thunder Client) |
| 3     | **Frontend Development & Dashboard**<br>• Build authentication pages (Login & Signup)<br>• Create user dashboard with CRUD functionality for links<br>• Implement link customization features (colors, styling)<br>• Build preview functionality for social links page<br>• Integrate frontend with backend APIs<br>• Implement responsive design |
| 4     | **Public Page & Deployment**<br>• Build public-facing social links page with unique URLs<br>• Implement copy/share URL functionality<br>• Conduct end-to-end testing and bug fixes<br>• Deploy backend to cloud platform (Heroku/Railway/AWS)<br>• Deploy frontend (Vercel/Netlify)<br>• Final documentation and project presentation preparation |

## User-Stories
Here we have **9 user stories** :

1. **As a new user**, I want to **sign up with my email and password**, so that I can **create an account and start building my social links page**.
2. **As a returning user**, I want to **log in securely to my dashboard**, so that I can **manage and edit my existing links**.
3. **As a user**, I wanna **add links to my various social media platforms**, so that **visitors can easily access all my online profiles from one page**.
4. **As a user**, I wanna **customize the appearance of my social links page (colors)**, so that **it matches my personal or brand style**.
5. **As a user**, I wanna **preview my social links page before publishing**, so that **I can ensure it looks the way I want**.
6. **As a user**, I wanna **copy or share a single public URL to my social links page**, so that **I can share all my social accounts easily with others**.
7. **As a user**, I wanna **edit or remove links from my dashboard**, so that **I can keep my page updated with my latest social media accounts**.
8. **As a user**, I wanna **log out securely**, so that **my personal data and account remain protected on shared devices**.

## ER diagram of database schema
<img width="1635" height="844" alt="image" src="https://github.com/user-attachments/assets/be63ea0b-3b6e-426f-8828-a49df351f5ad" />

## Workflow Diagrams

### Creating a Social Button

```
User Clicks Add Button → Server Receives Request → Validate Domain → Insert into buttonLinks → Insert into userButtonMapping (order)
```

### Searching Users by Interest

```
Search Input → Find Interest ID → Get Users with that Interest → Return user cards with profile info
```

### Reporting a User

```
User Submits a Report → Save into Reports Table → Admin Review → Update Status (RESOLVED / REJECTED) + ReasonOfAction
```

## Database overview
Here is a qucik discription of the database

### `users`

This is the **central table** — everything else connects to users.

**Fields summary:**

* `id`: Primary key
* `username`, `email`, `name`, `phoneNo`: Basic user info
* `profileImage`: Blob for the user’s avatar
* `passwordHashed`: Hashed password (good security practice)
* `role`: Enum for roles (e.g., admin, user, moderator)
* `created_at`, `updated_at`: Timestamps for account tracking
* `isDeleted`, `isPremium`: Status flags
* `failedLoginAttempts`: For login security

**Purpose:** Stores all registered users and their profile data.



### `themePresets` + `userPage`

* `themePresets` defines the **available design themes** (e.g., “dark mode,” “minimalist”).
* `userPage` links each user to a chosen theme:

  * `userId` → references `users.id`
  * `themeId` → references `themePresets.id`

**Purpose:** Every user can have their own page with a selected theme.



### `buttonLinks` + `userButtonMapping`

* `buttonLinks` contains information about **link buttons** (e.g., “GitHub,” “Instagram,” “Portfolio”):

  * Fields like `title`, `description`, `icon`, `link`, `timestampOfCreation`, etc.
  * `isActive` and `isVisible` indicate the button’s state.
  * `noClicks` can track analytics.

* `userButtonMapping` connects users to their buttons:

  * `userId` → references `users.id`
  * `buttonId` → references `buttonLinks.id`
  * `order` defines the button’s display sequence.

**Purpose:** Users can add, reorder, and manage multiple social buttons on their page.



### `reports`

Handles **user reporting system**, allowing reports on inappropriate users or content.

**Fields summary:**

* `emailOfReporter`: who submitted the report
* `reportedOnUser`: which user is being reported (linked to `users.id`)
* `title`, `description`: details about the issue
* `reportTypeId`: type/category of report
* `reportStatus`, `handledBy`, `reasonOfAction`: for admin moderation

**Purpose:** Supports community moderation and admin action tracking.



### `domainBlockList`

Contains **blocked domains**, likely to prevent users from linking to harmful or blacklisted websites.

**Purpose:** Used for link safety checks before allowing users to add a button link.



### `interests` + `userInterestMapping`

* `interests` lists all possible interest categories (e.g., “Technology,” “Design,” “Travel”).
* `userInterestMapping` connects users with their interests:

  * `userId` → references `users.id`
  * `interestId` → references `interests.id`

**Purpose:** Lets users define their personal interests, possibly for recommendation or filtering.



### Summary of Relationships

| Relationship                            | Type        | Description                          |
| --------------------------------------- | ----------- | ------------------------------------ |
| users ↔ userPage                        | 1–1         | Each user has one page and one theme |
| users ↔ userButtonMapping ↔ buttonLinks | 1–M         | Users can have multiple links        |
| users ↔ reports                         | 1–M         | Users can be reported multiple times |
| users ↔ userInterestMapping ↔ interests | M–M         | Users can have multiple interests    |
| buttonLinks ↔ domainBlockList           | –           | Used indirectly for validation       |
| themePresets                            | independent | Defines reusable themes              |


### Overall
database is **clean, modular, and scalable** — it supports:

* User profiles with theming and customization
* Personal and social link management
* Interest-based personalization
* Security via blocked domains and report handling
* Analytics (click tracking)

**In short:**
This database powers a **customizable social link page platform** where users create personal pages with buttons (links) to their social media or content, choose themes, declare interests, and where admins can handle reports and restrict unsafe domains.



## Team Members 
- [Halwest Salam](https://github.com/Halwest-S)
- [Ibrahim Hemin](https://github.com/IbrahimHeminJ)
- [Mustafa Kabeer](https://github.com/Mustafa-Kabeer)
- [Suhaeb Fazel](https://github.com/SuhaebFazelMohammad)
- [Zheer Salam](https://github.com/Zheers9)


## Team Links Resources
[Our Kanban](https://trello.com/invite/b/68f2864a1d463749d57c831f/ATTIe20ffc9dde2872cde5513eea36c5bfbbBF22C3AD/social-links-page)   
[Figma design](https://www.figma.com/design/YyVY83BTaMs8ojsVnbOHZk/Social-Links-Page?node-id=0-1&t=lYUZrxpuYDuBCmtm-1)
