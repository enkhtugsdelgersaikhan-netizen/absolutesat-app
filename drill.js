const DRILL_SECTION = document.body.dataset.drillSection || "Math";
const DRILL_BANK_URL = DRILL_SECTION === "Math"
  ? "/math-question-bank.json?v=4"
  : "/question-bank.json?v=19";
const DRILL_BASE_SECONDS = DRILL_SECTION === "Math"
  ? Math.round((70 * 60) / 44)
  : Math.round((64 * 60) / 54);
const DRILL_LIMIT = 10;
const DRILL_PACE_ADJUSTMENT = 0.25;

const domainSelect = document.getElementById("drill-domain");
const subtopicSelect = document.getElementById("drill-subtopic");
const availability = document.getElementById("drill-availability");
const startButton = document.getElementById("drill-start");
const summaryFocus = document.getElementById("drill-summary-focus");
const summaryDifficulty = document.getElementById("drill-summary-difficulty");
const summaryPace = document.getElementById("drill-summary-pace");
const summaryTarget = document.getElementById("drill-summary-target");

let drillQuestions = [];
let solvedQuestionIds = new Set();
let currentUser = null;

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  return minutes + ":" + String(seconds % 60).padStart(2, "0");
}

function selectedDifficulty() {
  return document.querySelector('input[name="drill-difficulty"]:checked')?.value || "Medium";
}

function selectedPace() {
  return document.querySelector('input[name="drill-pace"]:checked')?.value || "average";
}

function targetSeconds() {
  const mode = selectedPace();

  if (mode === "thorough") {
    return Math.round(
      DRILL_BASE_SECONDS *
      (1 + DRILL_PACE_ADJUSTMENT)
    );
  }

  if (mode === "dart") {
    return Math.max(
      15,
      Math.round(
        DRILL_BASE_SECONDS *
        (1 - DRILL_PACE_ADJUSTMENT)
      )
    );
  }

  return DRILL_BASE_SECONDS;
}

function normalizeDifficulty(value) {
  const text = String(value || "").trim().toLowerCase();
  if (text === "easy") return "Easy";
  if (text === "hard") return "Hard";
  return "Medium";
}

function questionSubtopic(q) {
  return String(q.subtopic || q.skill || q.topic || "").trim();
}

function getDrillDropdownValue(
  dropdown
) {
  return String(
    dropdown?.dataset?.value || ""
  );
}

function closeDrillDropdowns(
  except = null
) {
  document
    .querySelectorAll(
      ".drill-dropdown.open"
    )
    .forEach(
      dropdown => {
        if (dropdown === except) {
          return;
        }

        dropdown.classList.remove(
          "open"
        );

        dropdown
          .querySelector(
            ".drill-dropdown-trigger"
          )
          ?.setAttribute(
            "aria-expanded",
            "false"
          );
      }
    );
}

function setDrillDropdownOptions(
  dropdown,
  options,
  selectedValue
) {
  if (!dropdown) {
    return;
  }

  const normalizedOptions =
    options.map(
      option =>
        typeof option === "string"
          ? {
              value: option,
              label: option
            }
          : option
    );

  const validValues =
    normalizedOptions.map(
      option =>
        String(option.value)
    );

  const nextValue =
    validValues.includes(
      String(selectedValue)
    )
      ? String(selectedValue)
      : (
          validValues[0] ||
          ""
        );

  dropdown.dataset.value =
    nextValue;

  dropdown.innerHTML = "";

  const trigger =
    document.createElement(
      "button"
    );

  trigger.type = "button";
  trigger.className =
    "drill-dropdown-trigger";
  trigger.setAttribute(
    "aria-haspopup",
    "listbox"
  );
  trigger.setAttribute(
    "aria-expanded",
    "false"
  );

  const valueNode =
    document.createElement(
      "span"
    );

  valueNode.className =
    "drill-dropdown-value";

  const selectedOption =
    normalizedOptions.find(
      option =>
        String(option.value) ===
        nextValue
    );

  valueNode.textContent =
    selectedOption?.label || "—";

  const chevron =
    document.createElement(
      "span"
    );

  chevron.className =
    "drill-dropdown-chevron";
  chevron.setAttribute(
    "aria-hidden",
    "true"
  );
  chevron.textContent = "⌄";

  trigger.append(
    valueNode,
    chevron
  );

  const menu =
    document.createElement(
      "div"
    );

  menu.className =
    "drill-dropdown-menu";
  menu.setAttribute(
    "role",
    "listbox"
  );

  normalizedOptions.forEach(
    option => {
      const button =
        document.createElement(
          "button"
        );

      const optionValue =
        String(option.value);

      button.type = "button";
      button.className =
        "drill-dropdown-option";

      button.dataset.value =
        optionValue;

      button.setAttribute(
        "role",
        "option"
      );

      const active =
        optionValue ===
        nextValue;

      button.classList.toggle(
        "active",
        active
      );

      button.setAttribute(
        "aria-selected",
        active
          ? "true"
          : "false"
      );

      button.textContent =
        option.label;

      button.addEventListener(
        "click",
        event => {
          event.preventDefault();
          event.stopPropagation();

          dropdown.dataset.value =
            optionValue;

          valueNode.textContent =
            option.label;

          menu
            .querySelectorAll(
              ".drill-dropdown-option"
            )
            .forEach(
              item => {
                const isActive =
                  item.dataset.value ===
                  optionValue;

                item.classList.toggle(
                  "active",
                  isActive
                );

                item.setAttribute(
                  "aria-selected",
                  isActive
                    ? "true"
                    : "false"
                );
              }
            );

          dropdown.classList.remove(
            "open"
          );

          trigger.setAttribute(
            "aria-expanded",
            "false"
          );

          dropdown.dispatchEvent(
            new CustomEvent(
              "drillchange",
              {
                bubbles: true,
                detail: {
                  value:
                    optionValue
                }
              }
            )
          );
        }
      );

      menu.appendChild(
        button
      );
    }
  );

  trigger.addEventListener(
    "click",
    event => {
      event.preventDefault();
      event.stopPropagation();

      const willOpen =
        !dropdown.classList.contains(
          "open"
        );

      closeDrillDropdowns(
        willOpen
          ? dropdown
          : null
      );

      dropdown.classList.toggle(
        "open",
        willOpen
      );

      trigger.setAttribute(
        "aria-expanded",
        willOpen
          ? "true"
          : "false"
      );
    }
  );

  dropdown.append(
    trigger,
    menu
  );
}

document.addEventListener(
  "click",
  () =>
    closeDrillDropdowns()
);

document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeDrillDropdowns();
    }
  }
);

function getDomainMap() {
  const domains = new Map();

  drillQuestions.forEach(q => {
    const domain =
      String(q.domain || "Other").trim() ||
      "Other";

    const subtopic =
      questionSubtopic(q);

    if (!domains.has(domain)) {
      domains.set(
        domain,
        new Set()
      );
    }

    if (subtopic) {
      domains
        .get(domain)
        .add(subtopic);
    }
  });

  return domains;
}

function buildDomainOptions() {
  const domains =
    getDomainMap();

  const options =
    [...domains.keys()]
      .sort();

  const previous =
    getDrillDropdownValue(
      domainSelect
    );

  setDrillDropdownOptions(
    domainSelect,
    options,
    options.includes(previous)
      ? previous
      : options[0]
  );

  buildSubtopicOptions();
}

function buildSubtopicOptions() {
  const domains =
    getDomainMap();

  const selectedDomain =
    getDrillDropdownValue(
      domainSelect
    );

  const subtopics =
    [
      ...(
        domains.get(
          selectedDomain
        ) || []
      )
    ].sort();

  const previous =
    getDrillDropdownValue(
      subtopicSelect
    );

  const options = [
    {
      value: "",
      label: "All subtopics"
    },
    ...subtopics.map(
      subtopic => ({
        value:
          subtopic,
        label:
          subtopic
      })
    )
  ];

  setDrillDropdownOptions(
    subtopicSelect,
    options,
    subtopics.includes(
      previous
    )
      ? previous
      : ""
  );
}

function focusMatches(q) {
  const domain =
    String(q.domain || "").trim();

  const selectedDomain =
    getDrillDropdownValue(domainSelect);

  const selectedSubtopic =
    getDrillDropdownValue(subtopicSelect);

  if (
    domain !== selectedDomain
  ) {
    return false;
  }

  if (!selectedSubtopic) {
    return true;
  }

  return (
    questionSubtopic(q) ===
    selectedSubtopic
  );
}

function eligibleQuestions() {
  const difficulty = selectedDifficulty();
  return drillQuestions.filter(q =>
    !solvedQuestionIds.has(String(q.id)) &&
    normalizeDifficulty(q.difficulty) === difficulty &&
    focusMatches(q)
  );
}

function updateBuilder() {
  const pace = selectedPace();
  const percent =
    Math.round(
      DRILL_PACE_ADJUSTMENT * 100
    );

  const eligible = eligibleQuestions();
  const count = Math.min(DRILL_LIMIT, eligible.length);
  const focusLabel =
    getDrillDropdownValue(subtopicSelect)
      ? "Subtopic — " +
        getDrillDropdownValue(subtopicSelect)
      : "Domain — " +
        (
          getDrillDropdownValue(domainSelect) ||
          "—"
        );
  const difficulty = selectedDifficulty();
  const target = targetSeconds();

  summaryFocus.textContent = focusLabel;
  summaryDifficulty.textContent = difficulty;
  summaryPace.textContent =
    pace === "average"
      ? "Average"
      : pace === "thorough"
        ? "Thorough +" + percent + "%"
        : "Dart −" + percent + "%";
  summaryTarget.textContent = formatTime(target) + " / question";

  if (eligible.length === 0) {
    availability.className = "drill-availability empty";
    availability.textContent = "No unsolved " + difficulty.toLowerCase() + " questions match this focus.";
    startButton.disabled = true;
    startButton.textContent = "No unsolved questions";
    return;
  }

  availability.className = "drill-availability ready";
  availability.textContent =
    eligible.length + " unsolved question" + (eligible.length === 1 ? "" : "s") +
    " match. This drill will use " + count + ".";
  startButton.disabled = false;
  startButton.textContent = "Start " + count + "-question drill";
}

function localSolvedIds(userId) {
  const ids = new Set();
  try {
    const resetAt = localStorage.getItem("absoluteprep-practice-reset:" + userId);
    const resetTime = resetAt ? new Date(resetAt).getTime() : null;
    const stored = JSON.parse(localStorage.getItem("absoluteprep-question-status:" + userId) || "{}");
    Object.entries(stored).forEach(([id, state]) => {
      const time = new Date(state?.updated_at || state?.created_at || 0).getTime();
      if (!resetTime || (Number.isFinite(time) && time > resetTime)) ids.add(String(id));
    });
  } catch (error) {
    console.warn("Could not load local drill status:", error);
  }
  return ids;
}

async function loadSolvedState() {
  solvedQuestionIds = localSolvedIds(currentUser.id);
  const resetAt = localStorage.getItem("absoluteprep-practice-reset:" + currentUser.id);
  const resetTime = resetAt ? new Date(resetAt).getTime() : null;

  try {
    const result = await supabaseClient
      .from("question_attempts")
      .select("question_id, created_at")
      .eq("user_id", currentUser.id);

    if (result.error) throw result.error;

    (result.data || []).forEach(attempt => {
      const time = new Date(attempt.created_at || 0).getTime();
      if (!resetTime || (Number.isFinite(time) && time > resetTime)) {
        solvedQuestionIds.add(String(attempt.question_id));
      }
    });
  } catch (error) {
    console.warn("Could not load server drill status; using local status:", error);
  }
}

function shuffled(items) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function startDrill() {
  const selected = shuffled(eligibleQuestions()).slice(0, DRILL_LIMIT);
  if (!selected.length) return;

  const mode = selectedPace();
  const percent =
    Math.round(
      DRILL_PACE_ADJUSTMENT * 100
    );
  const target = targetSeconds();
  const session = {
    id: "drill-" + Date.now(),
    section: DRILL_SECTION,
    domain:
      getDrillDropdownValue(domainSelect),
    subtopic:
      getDrillDropdownValue(subtopicSelect) || null,
    focus:
      getDrillDropdownValue(subtopicSelect)
        ? "subtopic::" +
          getDrillDropdownValue(subtopicSelect)
        : "domain::" +
          getDrillDropdownValue(domainSelect),
    focusLabel:
      getDrillDropdownValue(subtopicSelect)
        ? "Subtopic — " +
          getDrillDropdownValue(subtopicSelect)
        : "Domain — " +
          getDrillDropdownValue(domainSelect),
    difficulty: selectedDifficulty(),
    paceMode: mode,
    pacePercent: mode === "average" ? 0 : percent,
    targetSeconds: target,
    questionIds: selected.map(q => String(q.id)),
    timeSpent: {},
    startedAt: new Date().toISOString()
  };

  sessionStorage.setItem("absoluteprep-drill-session", JSON.stringify(session));
  sessionStorage.setItem(
    "absoluteprep-question-bank-navigation",
    JSON.stringify({
      questionIds: session.questionIds,
      currentQuestionId: session.questionIds[0],
      userId: currentUser.id,
      source: "drill"
    })
  );

  window.location.href =
    "/question?id=" + encodeURIComponent(session.questionIds[0]) + "&drill=1";
}

async function initializeDrill() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data?.session?.user) {
    const redirect = window.location.pathname + window.location.search;
    window.location.replace("/login?redirect=" + encodeURIComponent(redirect));
    return;
  }

  currentUser = data.session.user;

  const response = await fetch(DRILL_BANK_URL, { cache: "no-store" });
  if (!response.ok) throw new Error("Question bank returned " + response.status);
  const dataBank = await response.json();

  drillQuestions = (dataBank.questions || []).filter(q =>
    q.status === "staged" &&
    String(q.section || "") === DRILL_SECTION
  );

  await loadSolvedState();
  buildDomainOptions();

  document.querySelectorAll('input[name="drill-difficulty"],input[name="drill-pace"]')
    .forEach(input => input.addEventListener("change", updateBuilder));

  domainSelect.addEventListener(
    "drillchange",
    () => {
      buildSubtopicOptions();
      updateBuilder();
    }
  );

  subtopicSelect.addEventListener(
    "drillchange",
    updateBuilder
  );

  startButton.addEventListener("click", startDrill);

  updateBuilder();

  const params = new URLSearchParams(window.location.search);
  if (params.get("complete") === "1") {
    document.getElementById("drill-complete")?.removeAttribute("hidden");
    history.replaceState({}, "", window.location.pathname);
  }
}

initializeDrill().catch(error => {
  console.error("Could not initialize drill:", error);
  availability.className = "drill-availability empty";
  availability.textContent = "The drill builder could not load. Refresh and try again.";
  startButton.disabled = true;
});
