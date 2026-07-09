/*
  recipe.js
  ---------
  OWNS: Everything on recipe.html
  BOOTS: Itself via DOMContentLoaded — no app.js needed
  DEPENDENCIES: RECIPES (data.js), AppState (state.js)
 
  READING ORDER — follow this when debugging:
  1. PageState         → what this page tracks
  2. init()            → entry point, called on DOMContentLoaded
  3. buildPage()       → assembles all sections from recipe data
  4. Feature functions → each feature is one function
  5. Event binding     → all listeners at the bottom
*/

/* ============================================================
  PAGE STATE
  Local to this page. Tracks:
  - which recipe we're showing
  - current serving count (starts at recipe's base servings)
  - current unit system (metric or imperial)
 
  WHY NOT USE AppState FROM state.js?
  AppState is for index.html's concerns — active category,
  search query, modal mode. This page has completely different
  state. Mixing them would be like storing your work files
  in someone else's folder. Separate concerns, separate state.
============================================================ */

const PageState = {
    recipe: null,
    currentServings: 1,
    unit: 'metric'
};

/*      
        UNIT CONVERSION TABLE 
Base unit is always metric (g, ml, kg).
Imperial conversion defined here.

Special cases handled separately:
- tsp,tbsp, whole, cloves, slices,fillets - never converted
because they are already universal or countable

        */
const UNIT_MAP = {
  metric: {
  g:'g', ml: 'ml', kg: 'kg', tsp: 'tsp',
  tbsp: 'tbsp', whole: '', cloves: 'cloves',
  slices: 'slices', fillets: 'fillets',
  pinch: 'pinch', cups: 'cups'
},
  imperial: {
  g: 'oz', ml: 'fl oz', kg: 'lb', tsp: 'tsp',
  tbsp: 'tbsp', whole: '', cloves: 'cloves',
  slices: 'slices', fillets: 'fillets',
  pinch: 'pinch', cups: 'cups'
}
};

const CONVERSION_FACTORS = {
  g:  0.035274,   // grams → ounces
  ml: 0.033814,   // ml → fl oz
  kg: 2.20462,    // kg → pounds
};
 
// Units that never convert — they are universal
const NO_CONVERT = ['tsp', 'tbsp', 'whole', 'cloves',
                    'slices', 'fillets', 'pinch', 'cups'];


/*    INIT - entry point
Reads the URL, finds the recipe, builds the page
*/
function init(){
  const recipe = getRecipeFromURL();
  
  if (!recipe) {
    showError();
    return
  }
  PageState.recipe = recipe;
  PageState.currentServings = recipe.servings;

  buildPage(recipe);
  bindEvents(recipe);


}

/* 
          FEATURE 1 — URL PARAMETER READING
  
  window.location.search = "?id=4"
  URLSearchParams parses that string into key/value pairs.
  params.get('id') returns the string "4".
  parseInt converts "4" to the number 4.
  RECIPES.find() searches for the recipe with id === 4.

  */
 function getRecipeFromURL() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  if (!id) return null;
  return RECIPES.find(r => r.id === id) || null;
 }

 /*
        FEATURE 2 — PAGE BUILDING
  One function that calls all section builders.
  Each section is its own function — single responsibility.
  If the hero breaks, you look at buildHero(). 
  If ingredients break, you look at buildIngredients().
  You never have to search through 300 lines.
 */

  function buildPage (recipe) {
    //update browser tab title
    document.title = `${recipe.title} - Savour`;
    document.getElementById('pageTitle').textContent = `${recipe.title} - Savour`;

    buildNav(recipe);
    buildHero(recipe);
    buildAuthor(recipe);
    buildSummary(recipe);
    buildStats(recipe);
    buildNutritionBar(recipe);
    buildNutritionBarMobile(recipe); 
    buildIngredients(recipe);
    buildSteps(recipe);
    buildVideo(recipe);
    buildRelated(recipe);
    buildReviews(recipe);
    updateSaveState(recipe.id);

  }

  /*    NAV / BREADCRUMB    */
  function buildNav (recipe) {
    // Breadcrumb: Home › Recipes › Greek Buddha Bowl
    document.getElementById('breadcrumbTitle').textContent  = recipe.title;
  }

  /*    HERO    */
  function buildHero(recipe) {
 
    // Step 1: Set background image directly on .rc-hero-img div
    // NOT via CSS variable — .rc-hero-img is a real element we can target
    const heroImg = document.getElementById('rcHeroImg');
    if (heroImg) {
      heroImg.style.backgroundImage = `url('${recipe.image}')`;
    }
 
    // Step 2: Tags row — badge + cuisine + difficulty
    const diffLabel = { easy: '🟢 Easy', medium: '🟡 Medium', hard: '🔴 Hard' };
    const metaEl = document.getElementById('rcHeroMeta');
    if (metaEl) {
      metaEl.innerHTML = `
        <span class="rc-hero-tag rc-hero-tag-badge">${recipe.badge}</span>
        <span class="rc-hero-tag rc-hero-tag-meta">${recipe.cuisine}</span>
        <span class="rc-hero-tag rc-hero-tag-meta">${diffLabel[recipe.difficulty]}</span>
      `;
    }
 
    // Step 3: Title
    const titleEl = document.getElementById('rcHeroTitle');
    if (titleEl) titleEl.textContent = recipe.title;
 
    // Step 4: Short description teaser (uses description, not summary)
    const descEl = document.getElementById('rcHeroDesc');
    if (descEl) descEl.textContent = recipe.description;
 
    // Step 5: Rating row — stars + number + count
    const ratingEl = document.getElementById('rcHeroRating');
    if (ratingEl) {
      const filled = Math.round(recipe.rating);
      const stars  = '★'.repeat(filled) + '☆'.repeat(5 - filled);
      ratingEl.innerHTML = `
        <span class="rc-hero-stars">${stars}</span>
        <span class="rc-hero-rating-num">${recipe.rating} /5</span>
       
      `;
    }
  }
 
 
/*    AUTHOR      */
function buildAuthor(recipe){
  const { author } = recipe;
  const el = document.getElementById("rcHeroAuthor");
  if (!el || !author) return;

  // Generate initials avatar from name — no image URL needed
  const initials = author.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  el.innerHTML = `
    <div class="rc-hero-author-avatar" aria-hidden="true">
      ${initials}
    </div>
    <div>
      <div class="rc-hero-author-name">${author.name}</div>
      <div class="rc-hero-author-meta">${author.bio}</div>
    </div>
  `;
}

 
/*    SUMMARY   */
function buildSummary(recipe){
  document.getElementById('rcSummary').textContent = recipe.summary;
 
}
 
/*    STATS   */
function buildStats(recipe) {
  const diffLabel = { easy: "Easy", medium: "Medium", hard: "Hard" };
  const totalTime = recipe.prepTime + recipe.cookTime;
 
  document.getElementById("rcStatRows").innerHTML = `
    <div class="rc-stat">
      <span class="rc-stat-icon">🔪</span>
      <span class="rc-stat-value">${recipe.prepTime} min</span>
      <span class="rc-stat-label">Prep</span>
    </div>
    <div class="rc-stat">
      <span class="rc-stat-icon">🔥</span>
      <span class="rc-stat-value">${recipe.cookTime} min</span>
      <span class="rc-stat-label">Cook</span>
    </div>
    <div class="rc-stat">
      <span class="rc-stat-icon">⏱</span>
      <span class="rc-stat-value">${totalTime} min</span>
      <span class="rc-stat-label">Total</span>
    </div>
    <div class="rc-stat">
      <span class="rc-stat-icon">⚡</span>
      <span class="rc-stat-value">${recipe.calories}</span>
      <span class="rc-stat-label">Calories</span>
    </div>
    <div class="rc-stat">
      <span class="rc-stat-icon">👤</span>
      <span class="rc-stat-value" id="statServings">${recipe.servings}</span>
      <span class="rc-stat-label">Servings</span>
    </div>
    <div class="rc-stat">
      <span class="rc-stat-icon">📊</span>
      <span class="rc-stat-value">${diffLabel[recipe.difficulty]}</span>
      <span class="rc-stat-label">Difficulty</span>
    </div>
  `;
}
 
 
/*    NUTRITION BAR   */
function buildNutritionBar(recipe) {
  const ratio = PageState.currentServings / recipe.servings;
 
  const protein = Math.round(recipe.protein * ratio);
  const carbs = Math.round(recipe.carbs * ratio);
  const fat = Math.round(recipe.fat * ratio);
  const cals = Math.round(recipe.calories * ratio);
  const total = protein + carbs + fat;
 
  const proteinPct = Math.round((protein / total) * 100);
  const carbsPct = Math.round((carbs / total) * 100);
  const fatPct = 100 - proteinPct - carbsPct; // avoids rounding to 101%
 
  document.getElementById("nutritionBar").innerHTML = `
    <div class="nutrition-segment nutrition-protein"
         style="width:${proteinPct}%"></div>
    <div class="nutrition-segment nutrition-carbs"
         style="width:${carbsPct}%"></div>
    <div class="nutrition-segment nutrition-fat"
         style="width:${fatPct}%"></div>
  `;
 
  document.getElementById("nutritionLegend").innerHTML = `
    <div class="nutrition-legend-row">
      <span class="nutrition-legend-label">
        <span class="nutrition-dot" style="background:#4CAF50"></span>
        Protein
      </span>
      <span class="nutrition-value">${protein}g</span>
    </div>
    <div class="nutrition-legend-row">
      <span class="nutrition-legend-label">
        <span class="nutrition-dot" style="background:#FF9800"></span>
        Carbohydrates
      </span>
      <span class="nutrition-value">${carbs}g</span>
    </div>
    <div class="nutrition-legend-row">
      <span class="nutrition-legend-label">
        <span class="nutrition-dot" style="background:#F44336"></span>
        Fat
      </span>
      <span class="nutrition-value">${fat}g</span>
    </div>
    <div class="nutrition-legend-row" style="border-top:1px solid var(--color-border);padding-top:0.5rem;margin-top:0.25rem;">
      <span class="nutrition-legend-label" style="font-weight:600;color:var(--color-text)">
        Calories
      </span>
      <span class="nutrition-value">${cals} kcal</span>
    </div>
  `;
}

/*    buildNutritionBarMobile()
  Renders the same nutrition data into the inline collapsible
  panel on mobile. Uses separate element IDs (nutritionBarMobile,
  nutritionLegendMobile) so desktop and mobile panels are
  independent — toggling one doesn't break the other.
*/
function buildNutritionBarMobile(recipe) {
  const ratio = PageState.currentServings / recipe.servings;

  const protein = Math.round(recipe.protein * ratio);
  const carbs = Math.round(recipe.carbs * ratio);
  const fat = Math.round(recipe.fat * ratio);
  const cals = Math.round(recipe.calories * ratio);
  const total = protein + carbs + fat;

  const proteinPct = Math.round((protein / total) * 100);
  const carbsPct = Math.round((carbs / total) * 100);
  const fatPct = 100 - proteinPct - carbsPct;

  const barEl = document.getElementById("nutritionBarMobile");
  const legendEl = document.getElementById("nutritionLegendMobile");

  if (barEl) {
    barEl.innerHTML = `
      <div class="nutrition-segment nutrition-protein" style="width:${proteinPct}%"></div>
      <div class="nutrition-segment nutrition-carbs"   style="width:${carbsPct}%"></div>
      <div class="nutrition-segment nutrition-fat"     style="width:${fatPct}%"></div>
    `;
  }

  if (legendEl) {
    legendEl.innerHTML = `
      <div class="nutrition-legend-row">
        <span class="nutrition-legend-label">
          <span class="nutrition-dot" style="background:#4CAF50"></span>Protein
        </span>
        <span class="nutrition-value">${protein}g</span>
      </div>
      <div class="nutrition-legend-row">
        <span class="nutrition-legend-label">
          <span class="nutrition-dot" style="background:#FF9800"></span>Carbs
        </span>
        <span class="nutrition-value">${carbs}g</span>
      </div>
      <div class="nutrition-legend-row">
        <span class="nutrition-legend-label">
          <span class="nutrition-dot" style="background:#F44336"></span>Fat
        </span>
        <span class="nutrition-value">${fat}g</span>
      </div>
      <div class="nutrition-legend-row" style="
        border-top: 1px solid var(--color-border);
        padding-top: 0.5rem;
        margin-top: 0.25rem;
        font-weight: 600;
        color: var(--color-text);
      ">
        <span>Calories</span>
        <span class="nutrition-value">${cals} kcal</span>
      </div>
    `;
  }
}

 
 
/*      INGREDIENTS     */
function buildIngredients(recipe) {
  const list = document.getElementById("ingredientsList");
  const ratio = PageState.currentServings / recipe.servings;

  list.innerHTML = recipe.ingredients
    .map((ing, index) => {
      const { displayAmount, displayUnit } = convertAmount(
        ing.amount,
        ing.unit,
        ratio,
      );

      const subHTML = ing.substitution
        ? `<span class="ingredient-sub">
           💡 Sub: ${ing.substitution}
         </span>
         <span class="ingredient-sub-icon">💡</span>`
        : "";

      return `
      <li
        class="rc-ingredient-item"
        data-index="${index}"
        role="button"
        tabindex="0"
        aria-label="${ing.name}, ${displayAmount} ${displayUnit}"
      >
        <span class="ingredient-check">✓</span>
        <span class="ingredient-amount">
          ${displayAmount} ${displayUnit}
        </span>
        <span class="ingredient-name">${ing.name}</span>
        ${subHTML}
      </li>
    `;
    })
    .join("");

  // Re-bind tick events after rebuilding
  bindIngredientTicks();
}
 



/*      UNIT CONVERSION       */
function convertAmount(amount, unit, ratio) {
  // Scale first
  const scaled = amount * ratio;

  // Units that never convert
  if (NO_CONVERT.includes(unit)) {
    return {
      displayAmount: formatNumber(scaled),
      displayUnit: unit === "whole" ? "" : unit,
    };
  }

  if (PageState.unit === "metric") {
    return {
      displayAmount: formatNumber(scaled),
      displayUnit: unit,
    };
  }

  // Imperial conversion
  if (unit === "ml") {
    // Smart ml → cups/tbsp/tsp conversion
    if (scaled >= 240) {
      return {
        displayAmount: formatNumber(scaled / 240),
        displayUnit: "cups",
      };
    } else if (scaled >= 15) {
      return {
        displayAmount: formatNumber(scaled / 15),
        displayUnit: "tbsp",
      };
    } else if (scaled >= 5) {
      return {
        displayAmount: formatNumber(scaled / 5),
        displayUnit: "tsp",
      };
    } else {
      return {
        displayAmount: formatNumber(scaled * CONVERSION_FACTORS.ml),
        displayUnit: "fl oz",
      };
    }
  }

  if (unit === "g") {
    // Smart g → oz/lb conversion
    const oz = scaled * CONVERSION_FACTORS.g;
    if (oz >= 16) {
      return {
        displayAmount: formatNumber(oz / 16),
        displayUnit: "lb",
      };
    }
    return {
      displayAmount: formatNumber(oz),
      displayUnit: "oz",
    };
  }

  if (unit === "kg") {
    return {
      displayAmount: formatNumber(scaled * CONVERSION_FACTORS.kg),
      displayUnit: "lb",
    };
  }

  // Fallback — return as-is
  return { displayAmount: formatNumber(scaled), displayUnit: unit };
}
/*
  formatNumber — makes amounts look clean.
  
  WHY NOT JUST toFixed(2)?
  toFixed(2) always shows 2 decimal places.
  "2.00 cups" looks wrong. "2 cups" is correct.
  "0.50 tsp" is confusing. "½ tsp" would be ideal
  but fractions in code are complex.
  We compromise: show up to 1 decimal place,
  remove trailing zero, and round very small numbers.
*/
function formatNumber(n) {
  if (n === 0) return '0';
  if (n < 0.1) return '<⅛';
  // Round to 1 decimal, remove trailing .0
  const rounded = Math.round(n * 10) / 10;
  return rounded % 1 === 0
    ? rounded.toString()
    : rounded.toFixed(1);
}


/*      STEPS     */
function buildSteps(recipe) {
  const list = document.getElementById("stepsList");
  const stepCountEl = document.getElementById("stepCount");
  if (stepCountEl) stepCountEl.textContent = `${recipe.steps.length} steps`;

  list.innerHTML = recipe.steps
    .map(
      (step) => `
    <li
      class="rc-step-item"
      data-step="${step.number}"
      role="button"
      tabindex="0"
      aria-label="Step ${step.number}"
    >
      <span class="step-number">${step.number}</span>
      <p class="step-text">${step.instruction}</p>
    </li>
  `,
    )
    .join("");

  bindStepCompletion();
}

/* ---- VIDEO ---- */
function buildVideo(recipe) {
const iframe = document.getElementById("recipeVideo");
// if (iframe && recipe.video) {
//   iframe.src = recipe.video;
// }

// const watchUrl = recipe.video
//   ? recipe.video.replace("youtube.com/embed/", "youtube.com/watch?v=")
//   : "#";

// const videoSection = document.getElementById("videoSection");
// if (videoSection && !videoSection.querySelector(".rc-youtube-link")) {
//   const link = document.createElement("a");
//   link.className = "rc-youtube-link";
//   link.href = watchUrl;
//   link.target = "_blank";
//   link.rel = "noopener noreferrer";
//   link.textContent = "▶ Watch full video on YouTube";
//   videoSection.appendChild(link);
// }
}


/*      RELATED RECIPES       */
  function buildRelated(recipe) {
    const grid = document.getElementById("relatedGrid");

    let related = RECIPES.filter(
      (r) => r.id !== recipe.id && r.cuisine === recipe.cuisine,
    ).slice(0, 3);

    // Top up with category matches if needed
    if (related.length < 3) {
      const extra = RECIPES.filter(
        (r) =>
          r.id !== recipe.id &&
          r.category === recipe.category &&
          !related.find((rel) => rel.id === r.id),
      ).slice(0, 3 - related.length);
      related = [...related, ...extra];
    }

    if (related.length === 0) {
      grid.parentElement.style.display = "none";
      return;
    }

    grid.innerHTML = related.map((r) => relatedCardTemplate(r)).join("");

    // Wire clicks on related cards
    grid.querySelectorAll(".recipe-card").forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.dataset.recipeId;
        window.location.href = `dish.html?id=${id}`;
      });
    });
  }

  function relatedCardTemplate(recipe) {
    const diffClass = {
      easy: "badge-easy",
      medium: "badge-medium",
      hard: "badge-hard",
    };
    const diffLabel = { easy: "🟢 Easy", medium: "🟡 Medium", hard: "🔴 Hard" };

    return `
        <a href="dish.html?id=${recipe.id}" class="recipe-card-link">
      <article
        class="recipe-card"
        aria-label="View ${recipe.title}"
      >
        <div class="recipe-card-img">
          <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" />
          <span class="recipe-badge">${recipe.badge}</span>
          <span class="difficulty-badge ${diffClass[recipe.difficulty]}">
            ${diffLabel[recipe.difficulty]}
          </span>
        </div>
        <div class="recipe-card-body">
          <div class="recipe-card-meta">
            <span>⏱ ${recipe.time}</span>
            <span>🔥 ${recipe.calories} kcal</span>
            <span>👤 ${recipe.servings}</span>
          </div>
          <h3>${recipe.title}</h3>
          <p>${recipe.description}</p>
        </div>
        <div class="recipe-card-footer">
          <div class="recipe-tags">
            ${recipe.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <span class="recipe-rating">★ ${recipe.rating}</span>
        </div>
      </article>
    </a>
  `;
  }


  /* ---- REVIEWS SECTION ---- */
  function buildReviews(recipe) {
    const stars =
      "★".repeat(Math.round(recipe.rating)) +
      "☆".repeat(5 - Math.round(recipe.rating));

    const el = document.getElementById("reviewsDisplay");
    if (!el) return;

    el.innerHTML = `
    <span class="rating-stars">${stars}</span>
    <span class="rating-number">${recipe.rating}</span>
    <span class="rating-count">(${recipe.reviewCount} reviews)</span>
  `;
  }

/*        SAVE RECIPES + MEAL PLAN      */
function getSavedRecipes() {
  return JSON.parse(localStorage.getItem("savedRecipes") || "[]");
}
 
function getMealPlan() {
  return JSON.parse(localStorage.getItem("mealPlan") || "[]");
}
 
function toggleSave(id) {
  const saved = getSavedRecipes();
  const idx = saved.indexOf(id);
 
  if (idx === -1) {
    saved.push(id);
    showToast("Recipe saved! ♡");
  } else {
    saved.splice(idx, 1);
    showToast("Recipe removed from saved");
  }
 
  localStorage.setItem("savedRecipes", JSON.stringify(saved));
  updateSaveState(id);
}
 
function updateSaveState(id) {
  const isSaved = getSavedRecipes().includes(id);
  const navBtn = document.getElementById("saveRecipeBtn");
  const sidebarBtn = document.getElementById("sidebarSaveBtn");
  const mobileBtn  = document.getElementById('mobileSaveBtn');
  
  if (mobileBtn) {
    mobileBtn.innerHTML = isSaved
      ? '<span>♥</span><span>Saved</span>'
      : '<span>♡</span><span>Save</span>';
  }

 
  // Update both save buttons simultaneously
  if (navBtn) {
    navBtn.classList.toggle("saved", isSaved);
    navBtn.querySelector(".save-label").textContent = isSaved
      ? "Saved"
      : "Save";
    navBtn.querySelector(".save-icon").textContent = isSaved ? "♥" : "♡";
  }
 
  if (sidebarBtn) {
    sidebarBtn.classList.toggle("saved", isSaved);
    sidebarBtn.innerHTML = isSaved
      ? '<span class="action-icon">♥</span> Saved'
      : '<span class="action-icon">♡</span> Save Recipe';
  }
}
 
function addToMealPlan(id) {
  const plan = getMealPlan();
  if (!plan.includes(id)) {
    plan.push(id);
    localStorage.setItem("mealPlan", JSON.stringify(plan));
    showToast("Added to meal plan! 📅");
  } else {
    showToast("Already in your meal plan");
  }
}


/*
  TOAST NOTIFICATION
  The same pattern as modal.js but self-contained here.
  Shows a message for 3 seconds then disappears.
  Uses CSS classes for the animation — JS only toggles the class.
*/
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

/* 
  ERROR STATE — recipe not found
  If the URL has no id or an invalid id,
  show a clear message and a link back to browse.
 */
function showError() {
  document.body.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: var(--font-body);
      text-align: center;
      padding: 2rem;
      background: var(--cream);
    ">
      <p style="font-size: 3rem; margin-bottom: 1rem;">🍽️</p>
      <h1 style="font-family: var(--font-display); font-size: 2rem;
                 color: var(--brown-deep); margin-bottom: 0.75rem;">
        Recipe not found
      </h1>
      <p style="color: var(--color-text-secondary); margin-bottom: 2rem;">
        This recipe doesn't exist or the link is broken.
      </p>
      <a href="recipes.html"
         style="background: var(--color-accent); color: white;
                padding: 0.8rem 2rem; border-radius: 24px;
                text-decoration: none; font-weight: 600;">
        Browse All Recipes
      </a>
    </div>
  `;
}

/* 
  EVENT BINDING — all listeners grouped here
  Called once after buildPage() is complete.
  WHY AFTER buildPage()?
  Because we're attaching listeners to elements that
  buildPage() just created. If we bind before building,
  the elements don't exist yet and querySelector returns null.
*/
function bindEvents(recipe) {
  bindServingsAdjuster(recipe);
  bindUnitToggle(recipe);
  bindSaveButtons(recipe);
  bindMealPlan(recipe);
  bindPrintDownload();
  bindResetSteps();
  bindMobileActions(recipe);
  bindNutritionToggle();

}
 

 /*       SERVINGS ADJUSTER BINDING       */
function bindServingsAdjuster(recipe) {
  const downBtn = document.getElementById("servingsDown");
  const upBtn = document.getElementById("servingsUp");
  const countEl = document.getElementById("servingsCount");

  downBtn.addEventListener("click", () => {
    if (PageState.currentServings <= 1) return;
    PageState.currentServings--;
    countEl.textContent = PageState.currentServings;
    document.getElementById("statServings").textContent =
      PageState.currentServings;
    buildIngredients(recipe);
    buildNutritionBar(recipe);
    buildNutritionBarMobile(recipe);
  });

  upBtn.addEventListener("click", () => {
    if (PageState.currentServings >= 20) return;
    PageState.currentServings++;
    countEl.textContent = PageState.currentServings;
    document.getElementById("statServings").textContent =
      PageState.currentServings;
    buildIngredients(recipe);
    buildNutritionBar(recipe);
    buildNutritionBarMobile(recipe);
  });
}


/*        UNIT TOGGLE BINDING         */
function bindUnitToggle(recipe) {
  const metricBtn = document.getElementById("unitMetric");
  const imperialBtn = document.getElementById("unitImperial");

  metricBtn.addEventListener("click", () => {
    PageState.unit = "metric";
    metricBtn.classList.add("active");
    imperialBtn.classList.remove("active");
    buildIngredients(recipe);
  });

  imperialBtn.addEventListener("click", () => {
    PageState.unit = "imperial";
    imperialBtn.classList.add("active");
    metricBtn.classList.remove("active");
    buildIngredients(recipe);
  });
}
 
/*        INGREDIENT TICK-OFF       */
function bindIngredientTicks() {
  document.querySelectorAll(".rc-ingredient-item").forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("ticked");
    });

    // Keyboard accessibility — Enter key also toggles
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        item.classList.toggle("ticked");
      }
    });
  });
}


/*        STEP COMPLETION BINDING     */
function bindStepCompletion() {
  document.querySelectorAll(".rc-step-item").forEach((step) => {
    step.addEventListener("click", () => {
      step.classList.toggle("completed");
    });

    step.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        step.classList.toggle("completed");
      }
    });
  });
}

/* ---- SAVE BUTTONS ---- */
function bindSaveButtons(recipe) {
  const navBtn = document.getElementById("saveRecipeBtn");
  const sidebarBtn = document.getElementById("sidebarSaveBtn");

  if (navBtn) navBtn.addEventListener("click", () => toggleSave(recipe.id));
  if (sidebarBtn)
    sidebarBtn.addEventListener("click", () => toggleSave(recipe.id));
}

/* ---- MEAL PLAN ---- */
function bindMealPlan(recipe) {
  const btn = document.getElementById("mealPlanBtn");
  if (btn) btn.addEventListener("click", () => addToMealPlan(recipe.id));
}


/*      PRINT & DOWNLOAD      */
function bindPrintDownload() {
  const printBtn = document.getElementById("printBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  if (printBtn) printBtn.addEventListener("click", () => window.print());
  if (downloadBtn) downloadBtn.addEventListener("click", () => window.print());
}

/*     RESET STEPS  website n */
function bindResetSteps() {
  const btn = document.getElementById('resetSteps');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rc-step-item').forEach(s =>
      s.classList.remove('completed')
    );
    document.querySelectorAll('.rc-ingredient-item').forEach(i =>
      i.classList.remove('ticked')
    );
    showToast('Progress reset');
  });
  
}
 
 
/*
  MOBILE ACTIONS BINDING
  The mobile action bar (save/meal plan/print) is separate HTML
  from the sidebar buttons. They call the same functions.
  This is intentional — same action, two triggers, one handler.
  DRY: we don't duplicate the logic, just add another event source.
*/
function bindNutritionToggle() {
  const toggle = document.getElementById("nutritionToggle");
  const panel = document.getElementById("rcInlineNutrition");
  const chevron = document.getElementById("nutritionChevron");

  if (!toggle || !panel) return;

  toggle.addEventListener("click", () => {
    const isOpen = panel.classList.toggle("is-open");
    chevron.textContent = isOpen ? "▲ Hide" : "▼ Show";
    toggle.setAttribute("aria-expanded", isOpen.toString());
  });
}

function bindMobileActions(recipe) {
  const saveBtn = document.getElementById("mobileSaveBtn");
  const mealBtn = document.getElementById("mobileMealBtn");
  const printBtn = document.getElementById("mobilePrintBtn");

  if (saveBtn) saveBtn.addEventListener("click", () => toggleSave(recipe.id));
  if (mealBtn)
    mealBtn.addEventListener("click", () => addToMealPlan(recipe.id));
  if (printBtn) printBtn.addEventListener("click", () => window.print());
}


document.addEventListener('DOMContentLoaded', init);
 
