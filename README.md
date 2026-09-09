<div align="center">

# ✦ Savour

### Recipes built around you, not the other way around.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

[View Live](#) · [Report a Bug](https://github.com/luthomgo/savour/issues) · [Request a Feature](https://github.com/luthomgo/savour/issues)

</div> 

---

## The Problem

Eating healthy sounds simple. In practice it is exhausting.

You decide to start working out. You want to eat clean, track your calories, maintain your body. But the tools available make it harder than it needs to be.

Most recipe sites do not show accurate calorie information. The ones that do do not account for your portion size, your substitutions, or your specific dietary restrictions. Counting calories manually is a tedious mental load that most people eventually give up on.

Then there is the fridge problem. You open the cupboard. There is food — but not enough of the right things to make any recipe you can think of. So you order out. The diet breaks. The food gets wasted.

This happens not because people do not want to eat well — but because no tool meets them where they actually are.

---

## The Solution

Savour is a personalised recipe platform built for people who are serious about what they eat — from beginners building healthy habits to experienced home cooks who want to make the most of what they have.

- **Tell it what is in your cupboard** — get recipes built from what you already have
- **Set your calorie goal** — see exactly what you consume, scaled to your portion
- **Filter by your diet** — vegan, gluten-free, halal, keto and more
- **Plan your week** — meal planner with shopping list generation
- **Cook with confidence** — step-by-step instructions with ingredient tick-off

---

## Screenshots

> Screenshots coming soon. Run the project locally to see it in action.

<!-- 
  Replace the placeholders below with your actual screenshots.
  Put images in a /screenshots folder in the root.
  How to take them: see SCREENSHOT_GUIDE in your local PROJECT notes.

  Best shots to take:
  1. Landing page hero (full width)
  2. Browse page with filters active
  3. Recipe detail page — hero + stats strip
  4. Mobile view of landing page (Chrome DevTools → phone icon)
  5. Nutrition panel expanded on mobile
-->

| Landing Page | Browse & Filter |
|---|---|
| ![Landing page](screenshots/hero.png) | ![Browse page](screenshots/browse.png) |

| Recipe Detail | Mobile View |
|---|---|
| ![Recipe detail](screenshots/dish.png) | ![Mobile](screenshots/mobile.png) |

---

## Features

### Currently built
- **Landing page** — editorial hero, category browser, trending recipes, AI features teaser
- **Browse page** — filter by cuisine, diet, difficulty, prep time, sort by rating or time, Surprise Me
- **Recipe detail page** — full ingredients with metric/imperial toggle, servings adjuster, step-by-step instructions, nutrition bar, save to collection, add to meal plan, print
- **Mobile responsive** — fully adapted layout across all three pages

### Coming in Phase 2
- Ingredient filter — enter what is in your cupboard, get matching recipes
- Persistent auth — login and signup state saved across sessions
- Daily calorie toggle — opt-in calorie goal tracking
- Saved recipes page
- Meal planner with weekly calendar view

---

## Tech Stack

Built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no libraries, no build tools.

| Layer | What |
|---|---|
| Structure | HTML5 with semantic elements and ARIA labels |
| Styling | CSS3 with custom properties, Grid, Flexbox, and CSS animations |
| Logic | Vanilla JavaScript with namespace pattern and single-source-of-truth state |
| Storage | localStorage for saved recipes and meal plan |
| Data | Mock recipe data (Spoonacular API integration planned for Phase 4) |

**Why vanilla?** Learning the fundamentals properly first. Understanding DOM manipulation, event delegation, and state management manually means every framework makes complete sense when you get there.

---

## Project Structure

```
savour/
├── index.html              Landing page
├── recipes.html            Browse and filter page
├── dish.html               Recipe detail page
│
├── css/
│   ├── base.css            Design tokens — colours, fonts, spacing
│   ├── layout.css          Page structure — navbar, hero, footer
│   ├── components.css      Shared UI — cards, pills, search, toast
│   ├── modal.css           Auth and recipe modals
│   ├── recipes-pages.css   Browse page layout
│   └── dish.css            Recipe detail page styles
│
└── js/
    ├── data.js             18 recipes with ingredients, steps, nutrition
    ├── state.js            AppState — single source of truth
    ├── recipes.js          Landing page recipe grid
    ├── recipes-pages.js    Browse page filter engine
    ├── dish.js             Recipe detail — all interactions
    ├── modal.js            Auth modal logic
    ├── surprise.js         Surprise Me feature
    ├── navbar.js           Scroll effect
    └── app.js              Entry point — boots features, wires events
```

---

## How to Run Locally

No installation needed. No build step. No server required.

1. Clone the repo
```bash
git clone https://github.com/luthomgo/savour.git
```

2. Open `index.html` in your browser

That is it. Every page works by opening the HTML file directly.

**Recommended:** Use the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code for auto-reload on save.

---

## Roadmap

- [x] Landing page
- [x] Browse page with advanced filters
- [x] Recipe detail page
- [x] Mobile responsive design
- [ ] Ingredient filter — "what is in your cupboard?"
- [ ] Persistent auth with localStorage
- [ ] Daily calorie goal toggle
- [ ] Saved recipes page
- [ ] Meal planner with weekly calendar
- [ ] Spoonacular API integration
- [ ] Deploy to Netlify

---

## Built By

**Lutho Mgolombane** — Full-stack developer and AI engineer based in Cape Town, South Africa.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/lutho-mgolombane/)
[![Portfolio](https://img.shields.io/badge/Portfolio-C4622D?style=flat&logo=firefox&logoColor=white)](https://luthomgo.netlify.app/)

---

<div align="center">

Built with care and vanilla JS · No frameworks were harmed in the making of this project

</div>
