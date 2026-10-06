const DRILL_SECTION = document.body.dataset.drillSection || "Math";
const DRILL_BANK_URL = DRILL_SECTION === "Math"
  ? "/math-question-bank.json?v=2"
  : "/question-bank.json?v=17";
const DRILL_BASE_SECONDS = DRILL_SECTION === "Math"
  ? Math.round((70 * 60) / 44)
  : Math.round((64 * 60) / 54);
const DRILL_LIMIT = 10;

const domainSelect = document.getElementById("drill-domain");
const subtopicSelect = document.getElementById("drill-subtopic");
const pacePercentRow = document.getElementById("drill-percent-row");
const pacePercentInput = document.getElementById("drill-percent");
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

function pacePercent() {
  const n = Number(pacePercentInput?.value);
  return Math.max(5, Math.min(75, Number.isFinite(n) ? n : 25));
}

function targetSeconds() {
  const mode = selectedPace();
  const percent = pacePercent() / 100;
  if (mode === "thorough") return Math.round(DRILL_BASE_SECONDS * (1 + percent));
  if (mode === "dart") return Math.max(15, Math.round(DRILL_BASE_SECONDS * (1 - percent)));
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

  domainSelect.innerHTML = "";

  [...domains.keys()]
    .sort()
    .forEach(domain => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        domain;

      option.textContent =
        domain;

      domainSelect.appendChild(
        option
      );
    });

  buildSubtopicOptions();
}

function buildSubtopicOptions() {
  const domains =
    getDomainMap();

  const selectedDomain =
    domainSelect.value;

  const subtopics =
    [
      ...(
        domains.get(
          selectedDomain
        ) || []
      )
    ].sort();

  const previous =
    subtopicSelect.value;

  subtopicSelect.innerHTML =
    '<option value="">All subtopics</option>';

  subtopics.forEach(
    subtopic => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        subtopic;

      option.textContent =
        subtopic;

      subtopicSelect.appendChild(
        option
      );
    }
  );

  if (
    previous &&
    subtopics.includes(
      previous
    )
  ) {
    subtopicSelect.value =
      previous;
  } else {
    subtopicSelect.value =
      "";
  }
}

function focusMatches(q) {
  const domain =
    String(q.domain || "").trim();

  const selectedDomain =
    domainSelect.value;

  const selectedSubtopic =
    subtopicSelect.value;

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
  const percent = pacePercent();
  pacePercentRow.hidden = pace === "average";

  const eligible = eligibleQuestions();
  const count = Math.min(DRILL_LIMIT, eligible.length);
  const focusLabel =
    subtopicSelect.value
      ? "Subtopic — " +
        subtopicSelect.value
      : "Domain — " +
        (
          domainSelect.value ||
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
  const percent = pacePercent();
  const target = targetSeconds();
  const session = {
    id: "drill-" + Date.now(),
    section: DRILL_SECTION,
    domain:
      domainSelect.value,
    subtopic:
      subtopicSelect.value || null,
    focus:
      subtopicSelect.value
        ? "subtopic::" +
          subtopicSelect.value
        : "domain::" +
          domainSelect.value,
    focusLabel:
      subtopicSelect.value
        ? "Subtopic — " +
          subtopicSelect.value
        : "Domain — " +
          domainSelect.value,
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
    "change",
    () => {
      buildSubtopicOptions();
      updateBuilder();
    }
  );

  subtopicSelect.addEventListener(
    "change",
    updateBuilder
  );

  pacePercentInput.addEventListener("input", updateBuilder);
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
