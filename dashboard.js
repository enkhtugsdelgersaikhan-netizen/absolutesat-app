document.addEventListener("DOMContentLoaded", async () => {
    const dashboardRoot = document.getElementById("home-dashboard");
    if (!dashboardRoot) return;

    // Every visitor can use their own device-local practice profile.
    const user = window.lexlogicaLocalUser || { id: "local" };
    dashboardRoot.hidden = false;
    dashboardRoot.classList.remove("is-guest");
    const example=document.getElementById("home-progress-example");
    if (example) example.hidden=true;
    const settingsPanel = dashboardRoot.querySelector(".dashboard-account-settings");
    if (settingsPanel) settingsPanel.hidden = false;
    const title = document.getElementById("home-dashboard-title");
    const intro = document.getElementById("home-dashboard-intro");
    if (title) title.textContent = "Welcome back.";
    if (intro) intro.textContent =
        "Your progress is saved on this device. Pick up where you left off and follow your study plan.";
    // Legacy study-guide links now point to the embedded section. Wait until
    // authentication reveals the container before scrolling to the anchor.
    if (window.location.hash === "#study-guide") {
        requestAnimationFrame(() => requestAnimationFrame(() => {
            document.getElementById("study-guide")?.scrollIntoView({block:"start"});
        }));
    }
    const HISTORY_KEY = "absoluteprep-practice-history:" + user.id;
    const RESET_KEY = "absoluteprep-practice-reset:" + user.id;
    const PREFERRED_ACCURACY = 90;
    const TARGET_SECONDS = {
        "R&W": 71,
        "Math": 95
    };

    const DASHBOARD_SKILL_TAXONOMY = {
        "R&W": {
            "Information & Ideas": ["Central Ideas & Details","Inferences","Textual Command of Evidence","Qualitative Command of Evidence"],
            "Craft & Structure": ["Words in Context","Text Structure & Purpose","Cross-Text Connections"],
            "Expression of Ideas": ["Rhetorical Synthesis","Transitions"],
            "Standard English Conventions": ["Boundaries","Form, Structure & Sense"]
        },
        "Math": {
            "Algebra": ["Linear Equations","Linear Functions","Systems of Linear Equations","Linear Inequalities","Other Algebra"],
            "Advanced Math": ["Quadratics","Equivalent Expressions","Polynomial Functions","Exponential Functions","Rational/Radical Equations","Nonlinear Equations/Functions"],
            "Problem-Solving & Data Analysis": ["Ratio, Rates, Percentages","Statistics","Probability"],
            "Geometry & Trigonometry": ["Lines, Angles, and Triangles","Area and Volume","Circles","Trigonometry"]
        }
    };

    let activeSubtopicFilter = "all";
    let currentSubtopicRows = [];

    const els = {
        streak: document.getElementById("streak"),
        answered: document.getElementById("questions-answered"),
        sevenDay: document.getElementById("seven-day-chart"),
        mockChart: document.getElementById("mock-performance-chart"),
        subtopicBody: document.getElementById("subtopic-skill-groups"),
        priority: document.getElementById("priority-list"),
        note: document.getElementById("dashboard-data-note"),
        reset: document.getElementById("dashboard-reset"),
        logout: document.getElementById("dashboard-logout")
    };

    const safeJson = (value, fallback) => {
        try {
            const parsed = JSON.parse(value);
            return parsed ?? fallback;
        } catch {
            return fallback;
        }
    };

    const escapeHtml = value =>
        String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    const normalizeSection = value => {
        const text = String(value || "").toLowerCase();
        return text.includes("math") ? "Math" : "R&W";
    };

    const dateKey = value => {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return y + "-" + m + "-" + d;
    };

    const startOfLocalDay = date => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const addDays = (date, amount) => {
        const d = new Date(date);
        d.setDate(d.getDate() + amount);
        return d;
    };

    const average = values => {
        const nums = values.map(Number).filter(Number.isFinite);
        if (!nums.length) return null;
        return nums.reduce((sum, value) => sum + value, 0) / nums.length;
    };

    const accuracyColor = value => {
        if (!Number.isFinite(value)) return "#8a9996";
        const gap = Math.max(0, PREFERRED_ACCURACY - value);
        if (gap >= 30) return "#8b4d4a";
        if (gap >= 18) return "#8a6245";
        if (gap >= 8) return "#7b7047";
        return "#326958";
    };

    const paceColor = (seconds, section) => {
        if (!Number.isFinite(seconds)) return "#8a9996";
        const target = TARGET_SECONDS[section] || 83;
        const over = (seconds - target) / target;
        if (over >= 0.55) return "#8b4d4a";
        if (over >= 0.3) return "#8a6245";
        if (over >= 0.12) return "#7b7047";
        return "#326958";
    };

    async function fetchBank(path) {
        const response = await fetch(path, { cache: "no-store" });
        if (!response.ok) throw new Error(path + " returned " + response.status);
        const payload = await response.json();
        return Array.isArray(payload.questions) ? payload.questions : [];
    }

    async function loadQuestionMetadata() {
        const [mathResult, rwResult] = await Promise.allSettled([
            fetchBank("/math-question-bank.json?v=5"),
            fetchBank("/question-bank.json?v=19")
        ]);

        const questions = [
            ...(mathResult.status === "fulfilled" ? mathResult.value : []),
            ...(rwResult.status === "fulfilled" ? rwResult.value : [])
        ];

        const map = new Map();
        const subtopics = new Map();

        questions.forEach(question => {
            const section = normalizeSection(question.section || question.id);
            const subtopic = question.subtopic || question.skill || question.topic || "Other";
            const meta = {
                section,
                domain: question.domain || question.topic || "",
                subtopic,
                difficulty: question.difficulty || ""
            };
            map.set(String(question.id), meta);

            const key = section + "|" + subtopic;
            if (!subtopics.has(key)) {
                subtopics.set(key, meta);
            }
        });

        return { map, subtopics };
    }

    async function fetchAllAttempts() {
        if (user.id === "local") return [];
        const rows = [];
        const pageSize = 1000;
        let from = 0;

        while (true) {
            const { data, error } = await absolutePrepSupabase
                .from("question_attempts")
                .select("question_id,is_correct,created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: true })
                .range(from, from + pageSize - 1);

            if (error) throw error;

            const batch = Array.isArray(data) ? data : [];
            rows.push(...batch);

            if (batch.length < pageSize) break;
            from += pageSize;

            if (from > 50000) break;
        }

        return rows;
    }

    function getLocalHistory() {
        const history = safeJson(localStorage.getItem(HISTORY_KEY) || "[]", []);
        return Array.isArray(history) ? history : [];
    }

    function mergePracticeAttempts(
        serverAttempts,
        localHistory
    ) {
        const server = (
            Array.isArray(serverAttempts)
                ? serverAttempts
                : []
        )
            .filter(row => row && row.question_id)
            .map(row => ({
                ...row,
                created_at:
                    row.created_at ||
                    row.answered_at ||
                    null
            }));

        const local = (
            Array.isArray(localHistory)
                ? localHistory
                : []
        )
            .filter(row => row && row.question_id)
            .map(row => ({
                question_id:
                    String(row.question_id),
                is_correct:
                    Boolean(row.is_correct),
                created_at:
                    row.answered_at ||
                    row.created_at ||
                    null,
                answered_at:
                    row.answered_at ||
                    row.created_at ||
                    null,
                elapsed_seconds:
                    row.elapsed_seconds,
                section:
                    row.section,
                domain:
                    row.domain,
                subtopic:
                    row.subtopic,
                difficulty:
                    row.difficulty,
                source:
                    "local-first-attempt"
            }))
            .filter(row =>
                Number.isFinite(
                    new Date(row.created_at || 0)
                        .getTime()
                )
            );

        /*
         * Local analytics records one event per question's first attempt.
         * Once that tracker began, use it instead of the server rows for
         * that period so retries do not inflate "questions answered" and
         * fresh practice appears immediately. Older server history is kept.
         */
        if (!local.length) {
            return server;
        }

        const firstLocalTime =
            Math.min(
                ...local.map(row =>
                    new Date(row.created_at)
                        .getTime()
                )
            );

        const historicalServer =
            server.filter(row => {
                const time =
                    new Date(
                        row.created_at || 0
                    ).getTime();

                return (
                    Number.isFinite(time) &&
                    time <
                        firstLocalTime -
                        5000
                );
            });

        return [
            ...historicalServer,
            ...local
        ].sort((a, b) =>
            new Date(a.created_at || 0) -
            new Date(b.created_at || 0)
        );
    }


    function getResetTime() {
        const value = localStorage.getItem(RESET_KEY);
        if (!value) return null;
        const time = new Date(value).getTime();
        return Number.isFinite(time) ? time : null;
    }

    function afterReset(row, resetTime) {
        if (!resetTime) return true;
        const raw = row.created_at || row.answered_at;
        const time = new Date(raw || 0).getTime();
        return Number.isFinite(time) && time > resetTime;
    }

    function calculateStreak(attempts) {
        const days = new Set(
            attempts
                .map(row => dateKey(row.created_at || row.answered_at))
                .filter(Boolean)
        );

        if (!days.size) return 0;

        const today = startOfLocalDay(new Date());
        let cursor = today;

        if (!days.has(dateKey(cursor))) {
            cursor = addDays(cursor, -1);
            if (!days.has(dateKey(cursor))) return 0;
        }

        let streak = 0;
        while (days.has(dateKey(cursor))) {
            streak += 1;
            cursor = addDays(cursor, -1);
        }
        return streak;
    }

    function renderKpis(attempts) {
        const streak = calculateStreak(attempts);
        els.streak.textContent = streak + (streak === 1 ? " day" : " days");
        els.answered.textContent = attempts.length.toLocaleString();
    }

    function getNiceActivityMaximum(value) {
        const maximum = Math.max(0, Number(value) || 0);
        if (maximum <= 5) return 5;
        if (maximum <= 10) return 10;
        if (maximum <= 20) return Math.ceil(maximum / 5) * 5;
        if (maximum <= 50) return Math.ceil(maximum / 10) * 10;
        return Math.ceil(maximum / 20) * 20;
    }

    function renderSevenDay(attempts) {
        const today = startOfLocalDay(new Date());
        const days = [];

        for (let offset = -6; offset <= 0; offset += 1) {
            const date = addDays(today, offset);
            const key = dateKey(date);
            const dayAttempts = attempts.filter(row =>
                dateKey(row.created_at || row.answered_at) === key
            );
            days.push({
                date,
                key,
                correct: dayAttempts.filter(row => Boolean(row.is_correct)).length,
                incorrect: dayAttempts.filter(row => !Boolean(row.is_correct)).length
            });
        }

        const maxTotal = Math.max(
            0,
            ...days.map(day => day.correct + day.incorrect)
        );

        if (maxTotal === 0) {
            els.sevenDay.className =
                "seven-day-chart dashboard-chart-empty-state";

            els.sevenDay.innerHTML =
                '<strong>No questions answered in the last 7 days.</strong>' +
                '<span>Your daily correct/incorrect bars will appear here after practice.</span>' +
                '<div class="empty-day-strip">' +
                    days.map((day, index) =>
                        '<div' + (index === 6 ? ' class="is-today"' : '') + '>' +
                            '<b>0</b>' +
                            '<small>' +
                                escapeHtml(
                                    day.date.toLocaleDateString(
                                        undefined,
                                        { weekday: "short" }
                                    )
                                ) +
                            '</small>' +
                        '</div>'
                    ).join("") +
                '</div>';
            return;
        }

        const scaleMax = getNiceActivityMaximum(maxTotal);
        const scaleMid = Math.round(scaleMax / 2);
        const maxHeight = 132;

        const grid =
            '<div class="activity-scale" aria-hidden="true">' +
                '<span style="bottom:156px">' + scaleMax + '</span>' +
                '<span style="bottom:90px">' + scaleMid + '</span>' +
                '<span style="bottom:24px">0</span>' +
            '</div>' +
            '<div class="activity-grid-line" style="bottom:156px"></div>' +
            '<div class="activity-grid-line" style="bottom:90px"></div>' +
            '<div class="activity-grid-line" style="bottom:24px"></div>';

        const bars = days.map((day, index) => {
            const total = day.correct + day.incorrect;
            const totalHeight = total
                ? Math.round(total / scaleMax * maxHeight)
                : 0;
            const correctHeight = total
                ? Math.round(totalHeight * day.correct / total)
                : 0;
            const incorrectHeight = Math.max(0, totalHeight - correctHeight);
            const label = day.date.toLocaleDateString(undefined, { weekday: "short" });
            const full = day.date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

            return (
                '<div class="activity-day' + (index === 6 ? ' is-today' : '') +
                '" title="' + escapeHtml(full + ": " + total + " answered") + '">' +
                    '<div class="activity-count">' + total + '</div>' +
                    '<div class="activity-bar-track" aria-label="' +
                        escapeHtml(total + " questions: " + day.correct + " correct, " + day.incorrect + " incorrect") + '">' +
                        '<div class="activity-segment incorrect" style="height:' + incorrectHeight + 'px"></div>' +
                        '<div class="activity-segment correct" style="height:' + correctHeight + 'px"></div>' +
                    '</div>' +
                    '<div class="activity-day-label">' + escapeHtml(label) + '</div>' +
                '</div>'
            );
        }).join("");

        els.sevenDay.className = "seven-day-chart";
        els.sevenDay.innerHTML =
            grid +
            '<div class="activity-bars">' +
                bars +
            '</div>' +
            '<div class="activity-axis-title">Questions</div>';
    }

    function roundSatScoreToNearestTen(value) {
        return Math.round(Number(value) / 10) * 10;
    }

    function calculateMockSatScores(readingWritingCorrect, mathCorrect) {
        const r = Math.max(0, Math.min(54, Number(readingWritingCorrect) || 0));
        const m = Math.max(0, Math.min(44, Number(mathCorrect) || 0));

        const readingWriting = roundSatScoreToNearestTen(
            200 + 600 * (r / 54)
        );
        const math = roundSatScoreToNearestTen(
            200 + 600 * (m / 44)
        );
        const composite = roundSatScoreToNearestTen(
            400 + 600 * (r / 54 + m / 44)
        );

        return {
            composite: Math.max(400, Math.min(1600, composite)),
            readingWriting: Math.max(200, Math.min(800, readingWriting)),
            math: Math.max(200, Math.min(800, math))
        };
    }

    function getMockScoresFromState(state) {
        if (!state || !state.completed) return null;

        const stored = state.satScores;
        if (
            stored &&
            Number.isFinite(Number(stored.composite)) &&
            Number.isFinite(Number(stored.readingWriting)) &&
            Number.isFinite(Number(stored.math))
        ) {
            return {
                composite: Number(stored.composite),
                readingWriting: Number(stored.readingWriting),
                math: Number(stored.math)
            };
        }

        const modules = state.completedModules || {};
        const hasRequiredModules =
            modules.rw_m1 &&
            modules.rw_m2 &&
            modules.math_m1 &&
            modules.math_m2;

        if (!hasRequiredModules) return null;

        const rwCorrect =
            Number(modules.rw_m1.correct || 0) +
            Number(modules.rw_m2.correct || 0);
        const mathCorrect =
            Number(modules.math_m1.correct || 0) +
            Number(modules.math_m2.correct || 0);

        return calculateMockSatScores(rwCorrect, mathCorrect);
    }

    function loadMockPerformance() {
        const tests = [];

        for (let index = 1; index <= 8; index += 1) {
            const id = "mock-test-" + index;
            const key =
                "lexlogica-mock-state:" +
                user.id +
                ":" +
                id;

            const state = safeJson(
                localStorage.getItem(key) || "null",
                null
            );

            tests.push({
                index,
                id,
                scores: getMockScoresFromState(state)
            });
        }

        return tests;
    }

    function renderMockPerformance() {
        const tests = loadMockPerformance();
        const completed = tests.filter(test => test.scores);
        if (!completed.length) {
            els.mockChart.className =
                "mock-performance-chart dashboard-chart-empty-state mock-empty-state";
            els.mockChart.innerHTML =
                '<strong>No completed mock tests yet.</strong>' +
                '<span>Your R&W and Math scores will stack into a composite bar for each finished mock.</span>' +
                '<div class="mock-empty-slots">' +
                    tests.map(test =>
                        '<div><b>' + test.index + '</b><small>Mock</small></div>'
                    ).join("") +
                '</div>';
            return;
        }

        // All scores share one 0–1600 scale: the sections add up to the total.
        const ticks = [400,800,1200,1600];
        const grid = ticks.map(score =>
            '<span class="mock-stacked-gridline" style="bottom:' +
            (score / 1600 * 90) + '%" aria-hidden="true"></span>'
        ).join("");
        const scale = ticks.map(score =>
            '<span style="bottom:' + (score / 1600 * 90) + '%">' + score + '</span>'
        ).join("");
        const columns = tests.map(test => {
            const scores = test.scores;
            if (!scores) {
                return '<div class="mock-stacked-column is-empty">' +
                    '<div class="mock-stacked-barslot"><div class="mock-stacked-placeholder" aria-label="Mock ' +
                    test.index + ' not completed">—</div></div>' +
                    '<span class="mock-stacked-test-label">Mock ' + test.index + '</span></div>';
            }
            const rw = Math.max(0,Math.min(800,Number(scores.readingWriting)||0));
            const math = Math.max(0,Math.min(800,Number(scores.math)||0));
            const composite = rw + math;
            const heightPercent = composite / 1600 * 90;
            return '<div class="mock-stacked-column is-complete" role="img" aria-label="Mock ' +
                test.index + ': composite ' + composite + ', Reading and Writing ' +
                rw + ', Math ' + math + '">' +
                '<div class="mock-stacked-barslot">' +
                    '<strong class="mock-stacked-total" style="bottom:calc(' +
                        heightPercent + '% + 5px)">' + composite + '</strong>' +
                    '<div class="mock-stacked-segments" style="height:' + heightPercent + '%">' +
                        '<div class="mock-stacked-segment is-math" style="flex:' + math +
                            '" title="Math: ' + math + '"><span>' + math + '</span></div>' +
                        '<div class="mock-stacked-segment is-rw" style="flex:' + rw +
                            '" title="Reading &amp; Writing: ' + rw + '"><span>' + rw + '</span></div>' +
                    '</div></div>' +
                '<span class="mock-stacked-test-label">Mock ' + test.index + '</span></div>';
        }).join("");

        els.mockChart.className = "mock-performance-chart mock-performance-stacked";
        els.mockChart.innerHTML =
            '<div class="mock-stacked-chart" role="group" aria-label="Mock tests 1 to 8, stacked section scores with the composite above each bar">' +
                '<div class="mock-stacked-scale" aria-hidden="true">' + scale + '</div>' +
                '<div class="mock-stacked-scroll" tabindex="0" aria-label="Scroll horizontally to inspect all mock-test bars">' +
                    '<div class="mock-stacked-plot">' + grid +
                        '<div class="mock-stacked-columns">' + columns + '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    function buildSubtopicRows(attempts, timedHistory, metadata) {
        const grouped = new Map();

        metadata.subtopics.forEach((meta, key) => {
            grouped.set(key, {
                ...meta,
                answered: 0,
                correct: 0,
                times: []
            });
        });

        const fallbackMeta = new Map();
        timedHistory.forEach(row => {
            fallbackMeta.set(String(row.question_id), {
                section: normalizeSection(row.section || row.question_id),
                domain: row.domain || "",
                subtopic: row.subtopic || "Other",
                difficulty: row.difficulty || ""
            });
        });

        attempts.forEach(row => {
            const meta =
                metadata.map.get(String(row.question_id)) ||
                fallbackMeta.get(String(row.question_id));

            if (!meta) return;

            const key = meta.section + "|" + meta.subtopic;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    ...meta,
                    answered: 0,
                    correct: 0,
                    times: []
                });
            }

            const entry = grouped.get(key);
            entry.answered += 1;
            if (Boolean(row.is_correct)) entry.correct += 1;
        });

        timedHistory.forEach(row => {
            const meta =
                metadata.map.get(String(row.question_id)) ||
                fallbackMeta.get(String(row.question_id));
            const rawSeconds = Number(row.elapsed_seconds);
            const seconds =
                Number.isFinite(rawSeconds)
                    ? Math.min(180, rawSeconds)
                    : rawSeconds;

            if (!meta || !Number.isFinite(seconds) || seconds <= 0) return;

            const key = meta.section + "|" + meta.subtopic;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    ...meta,
                    answered: 0,
                    correct: 0,
                    times: []
                });
            }
            grouped.get(key).times.push(seconds);
        });

        return Array.from(grouped.values()).map(row => ({
            ...row,
            accuracy: row.answered ? row.correct / row.answered * 100 : null,
            averageTime: average(row.times),
            timedCount: row.times.length
        })).sort((a, b) => {
            if (a.section !== b.section) return a.section === "R&W" ? -1 : 1;
            if (b.answered !== a.answered) return b.answered - a.answered;
            return a.subtopic.localeCompare(b.subtopic);
        });
    }

    function getSkillSeverityClass(row) {
        if (!row || !row.answered) return "severity-neutral";

        const target = TARGET_SECONDS[row.section] || 83;
        const accuracyPenalty = Number.isFinite(row.accuracy)
            ? Math.min(1, Math.max(0, (PREFERRED_ACCURACY - row.accuracy) / 45))
            : 0;
        const pacePenalty = Number.isFinite(row.averageTime)
            ? Math.min(1, Math.max(0, (row.averageTime - target) / (target * 0.8)))
            : 0;

        /*
         * Accuracy carries most of the visual severity. Pace can push a
         * skill warmer/redder, but a slow-yet-accurate skill should not look
         * as weak as a genuinely inaccurate one. Small samples are softened.
         */
        const evidence = Math.min(1, row.answered / 6);
        const severity =
            (accuracyPenalty * 0.78 + pacePenalty * 0.22) *
            (0.6 + evidence * 0.4);

        if (severity >= 0.58) return "severity-critical";
        if (severity >= 0.34) return "severity-weak";
        if (severity >= 0.14) return "severity-watch";
        return "severity-strong";
    }

    function getSkillPracticeDescription(row) {
        if (!row.answered) {
            return "No practice data yet. Answer a few questions here to establish an accuracy and pace baseline.";
        }
        if (row.answered < 4) {
            return "Keep building evidence here before treating the current accuracy or pace as a reliable pattern.";
        }

        const target = TARGET_SECONDS[row.section] || 83;
        const lowAccuracy = Number.isFinite(row.accuracy) && row.accuracy < PREFERRED_ACCURACY;
        const slow = Number.isFinite(row.averageTime) && row.averageTime > target * 1.1;

        if (lowAccuracy && slow) {
            return "Prioritize accuracy first, then bring the setup time down once the method is consistent.";
        }
        if (lowAccuracy) {
            return "Focus on the recurring error pattern here before pushing for more speed.";
        }
        if (slow) {
            return "Accuracy is usable; work on recognizing the setup faster and reducing unnecessary steps.";
        }
        return "This skill is on track. Maintain it while directing more practice toward weaker areas.";
    }

    // The study guide owns the eight domain cards. Do not create a separate
    // analytics hierarchy: populate each card's expandable skill breakdown.
    function renderSubtopicTable() {
        const disclosures = document.querySelectorAll(
            "#sg-all-domains .sg-domain-analytics[data-domain-analytics]"
        );
        disclosures.forEach(details => {
            const key = details.dataset.domainAnalytics || "";
            const cut = key.indexOf("::");
            if (cut < 0) return;
            const section = key.slice(0,cut) === "math" ? "Math" : "R&W";
            const domain = key.slice(cut + 2);
            const skillOrder = DASHBOARD_SKILL_TAXONOMY[section]?.[domain] || [];
            const rows = currentSubtopicRows
                .filter(row => row.section === section && row.domain === domain)
                .sort((a,b) => {
                    const ai=skillOrder.indexOf(a.subtopic);
                    const bi=skillOrder.indexOf(b.subtopic);
                    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi) ||
                        a.subtopic.localeCompare(b.subtopic);
                });
            const body = details.querySelector(".sg-domain-analytics-body");
            const count = details.querySelector(".sg-analytics-count");
            if (!body) return;
            const practiced = rows.filter(row => row.answered > 0).length;
            if (count) count.textContent = rows.length
                ? practiced + " of " + rows.length + " skills practiced"
                : "Not assessed yet";
            if (!rows.length) {
                body.innerHTML = '<p class="sg-domain-analytics-empty">No subtopic attempts yet. ' +
                    'Complete a drill to see accuracy and pace here.</p>';
                return;
            }
            body.innerHTML =
                '<p class="sg-domain-analytics-caption">Practice history by subtopic. ' +
                    'Accuracy target: 90%; pace targets: 71s for R&W and 95s for Math. ' +
                    'Timing reflects recorded first attempts.</p>' +
                '<div class="dashboard-domain-subtopics">' +
                    rows.map(row => {
                        const accuracy = Number.isFinite(row.accuracy)
                            ? Math.round(row.accuracy) + "%" : "—";
                        const avgTime = Number.isFinite(row.averageTime)
                            ? Math.round(row.averageTime) + "s" : "—";
                        return '<article class="dashboard-subtopic-card ' +
                            getSkillSeverityClass(row) + '">' +
                            '<div class="dashboard-subtopic-card-head"><strong>' +
                                escapeHtml(row.subtopic) + '</strong><span>' +
                                row.answered.toLocaleString() + ' answered</span></div>' +
                            '<div class="dashboard-subtopic-metrics">' +
                                '<span>Accuracy <b style="color:' + accuracyColor(row.accuracy) +
                                    '">' + accuracy + '</b></span>' +
                                '<span>Pace <b style="color:' + paceColor(row.averageTime,row.section) +
                                    '">' + avgTime + '</b></span>' +
                            '</div><p>' + escapeHtml(getSkillPracticeDescription(row)) +
                            '</p></article>';
                    }).join("") +
                '</div>';
        });
    }

    function renderPriorities(rows) {
        const MIN_EVIDENCE = 4;
        const eligible = rows.filter(row => row.answered >= MIN_EVIDENCE);

        if (!eligible.length) {
            els.priority.innerHTML =
                '<div class="dashboard-empty-state priority-unlock">' +
                    '<strong>Not enough evidence yet.</strong> ' +
                    'Answer at least ' + MIN_EVIDENCE +
                    ' questions in a few subtopics and this will identify the highest-return work instead of guessing.' +
                '</div>';
            return;
        }

        const ranked = eligible.map(row => {
            const accuracy =
                Number.isFinite(row.accuracy)
                    ? row.accuracy
                    : 0;
            const accuracyGap =
                Math.max(0, PREFERRED_ACCURACY - accuracy);
            const target =
                TARGET_SECONDS[row.section] || 83;
            const paceRatio =
                Number.isFinite(row.averageTime) && row.averageTime > target
                    ? (row.averageTime - target) / target
                    : 0;

            /*
             * Accuracy drives most of the priority. Pace only becomes
             * important when the student is meaningfully over target.
             * Evidence weight prevents a tiny sample from outranking a
             * persistent weakness.
             */
            const evidence =
                Math.min(1, row.answered / 12);
            const score =
                (
                    accuracyGap * 1.45 +
                    Math.min(30, paceRatio * 30)
                ) *
                (0.65 + evidence * 0.35);

            return {
                row,
                score,
                accuracyGap,
                paceRatio
            };
        }).sort((a, b) => b.score - a.score);

        const selections = ranked
            .filter(item => item.score > 1)
            .slice(0, 3);

        if (!selections.length) {
            const strongest = eligible
                .slice()
                .sort((a, b) => b.answered - a.answered)
                .slice(0, 3);

            els.priority.innerHTML = strongest.map((row, index) =>
                '<div class="priority-item">' +
                    '<div class="priority-rank">Maintain</div>' +
                    '<strong>' + escapeHtml(row.subtopic) + ' · ' + escapeHtml(row.section) + '</strong>' +
                    '<p>No major accuracy or pace problem is showing here. Keep it warm while expanding coverage elsewhere.</p>' +
                    '<div class="priority-meta">' +
                        '<span>' + row.answered + ' answered</span>' +
                        (Number.isFinite(row.accuracy)
                            ? '<span>' + Math.round(row.accuracy) + '% accuracy</span>'
                            : '') +
                    '</div>' +
                '</div>'
            ).join("");
            return;
        }

        els.priority.innerHTML = selections.map((item, index) => {
            const row = item.row;
            const target = TARGET_SECONDS[row.section] || 83;
            const lowAccuracy =
                Number.isFinite(row.accuracy) &&
                row.accuracy < PREFERRED_ACCURACY;
            const slow =
                Number.isFinite(row.averageTime) &&
                row.averageTime > target * 1.1;

            let label;
            let reason;

            if (lowAccuracy && item.accuracyGap >= item.paceRatio * 30) {
                label = index === 0 ? "Highest return" : "Fix accuracy";
                reason =
                    "Accuracy is costing more than pace here; review the recurring error pattern before adding speed.";
            } else if (slow) {
                label = index === 0 ? "Highest return" : "Fix pace";
                reason =
                    "Accuracy is comparatively usable, but this skill is consuming too much test time.";
            } else {
                label = index === 0 ? "Highest return" : "Stabilize";
                reason =
                    "This is the clearest combined accuracy-and-pace opportunity in your current data.";
            }

            const meta = [
                row.answered + " answered",
                Number.isFinite(row.accuracy)
                    ? Math.round(row.accuracy) + "% accuracy"
                    : null,
                Number.isFinite(row.averageTime)
                    ? Math.round(row.averageTime) + "s avg"
                    : null
            ].filter(Boolean);

            return (
                '<div class="priority-item">' +
                    '<div class="priority-rank">' + escapeHtml(label) + '</div>' +
                    '<strong>' + escapeHtml(row.subtopic) + ' · ' + escapeHtml(row.section) + '</strong>' +
                    '<p>' + escapeHtml(reason) + '</p>' +
                    '<div class="priority-meta">' +
                        meta.map(value => '<span>' + escapeHtml(value) + '</span>').join("") +
                    '</div>' +
                '</div>'
            );
        }).join("");
    }


    async function loadAnalytics() {
        const resetTime = getResetTime();
        const localHistory = getLocalHistory().filter(row => afterReset(row, resetTime));

        const [metadataResult, attemptsResult] = await Promise.allSettled([
            loadQuestionMetadata(),
            fetchAllAttempts()
        ]);

        const metadata = metadataResult.status === "fulfilled"
            ? metadataResult.value
            : { map: new Map(), subtopics: new Map() };

        let serverAttempts = [];

        if (attemptsResult.status === "fulfilled") {
            serverAttempts =
                attemptsResult.value.filter(
                    row =>
                        afterReset(
                            row,
                            resetTime
                        )
                );
        } else {
            els.note.hidden = false;
            els.note.textContent =
                "Server practice history could not be loaded, so this view is using practice history saved on this device.";
            console.warn(
                "Dashboard attempt history unavailable:",
                attemptsResult.reason
            );
        }

        const attempts =
            mergePracticeAttempts(
                serverAttempts,
                localHistory
            );

        renderKpis(attempts);
        renderSevenDay(attempts);
        renderMockPerformance();

        currentSubtopicRows = buildSubtopicRows(
            attempts,
            localHistory,
            metadata
        );
        renderSubtopicTable();

        if (metadataResult.status === "rejected") {
            els.note.hidden = false;
            els.note.textContent =
                "Question metadata could not be loaded, so some subtopic and difficulty analytics may be incomplete.";
            console.warn("Dashboard question metadata unavailable:", metadataResult.reason);
        }
    }

    document.querySelectorAll("[data-subtopic-filter]").forEach(button => {
        button.addEventListener("click", () => {
            activeSubtopicFilter = button.dataset.subtopicFilter || "all";
            document.querySelectorAll("[data-subtopic-filter]").forEach(item => {
                item.classList.toggle(
                    "is-active",
                    item.dataset.subtopicFilter === activeSubtopicFilter
                );
            });
            renderSubtopicTable();
        });
    });

    window.addEventListener("lexlogica:domains-rendered", renderSubtopicTable);

    // An intentionally recessed, two-stage destructive action:
    // open the settings disclosure, then type RESET before deletion is enabled.
    const resetConfirmation = document.getElementById("dashboard-reset-confirmation");
    const resetInput = document.getElementById("dashboard-reset-confirm-input");
    const resetConfirm = document.getElementById("dashboard-reset-confirm");
    const resetCancel = document.getElementById("dashboard-reset-cancel");

    if (els.reset && resetConfirmation && resetInput && resetConfirm && resetCancel) {
        els.reset.addEventListener("click", () => {
            els.reset.hidden = true;
            resetConfirmation.hidden = false;
            resetInput.value = "";
            resetConfirm.disabled = true;
            resetInput.focus();
        });
        resetInput.addEventListener("input", () => {
            resetConfirm.disabled = resetInput.value.trim() !== "RESET";
        });
        resetCancel.addEventListener("click", () => {
            resetInput.value = "";
            resetConfirm.disabled = true;
            resetConfirmation.hidden = true;
            els.reset.hidden = false;
            els.reset.focus();
        });
        resetConfirm.addEventListener("click", async () => {
            if (resetInput.value.trim() !== "RESET" || resetConfirm.disabled) return;
            resetConfirm.disabled = true;
            resetCancel.disabled = true;
            resetConfirm.textContent = "Deleting…";

            try {
                localStorage.setItem(RESET_KEY, new Date().toISOString());
                localStorage.removeItem("absoluteprep-question-status:" + user.id);
                localStorage.removeItem("absoluteprep-question-reviews:" + user.id);
                localStorage.removeItem(HISTORY_KEY);
                localStorage.removeItem("absoluteprep_vocab_state");
                localStorage.removeItem("absoluteprep_vocab_learned");
                localStorage.removeItem("lexlogica_formula_fluency_state_v1");
                localStorage.removeItem("lexlogica-guided-vocab:v1");
                localStorage.removeItem("lexlogica-guided-formulas:v1");
                localStorage.removeItem("absoluteprep-drill-history:" + user.id);
                localStorage.removeItem("absoluteprep-drill-session");
                localStorage.removeItem("lexlogica-study-baseline:v1:" + user.id);
                localStorage.removeItem("lexlogica-study-goal:v1:" + user.id);
                localStorage.removeItem("lexlogica-study-checks:v1:" + user.id);
                localStorage.removeItem("lexlogica-study-guided-session:v1:" + user.id);
                for (const key of Object.keys(localStorage)) {
                    if (key.startsWith("lexlogica-study-domain-completions:v2:" + user.id + ":")) {
                        localStorage.removeItem(key);
                    }
                }
                for (let number = 1; number <= 8; number += 1) {
                    localStorage.removeItem("lexlogica-mock-state:" + user.id + ":mock-test-" + number);
                }

                // Accountless practice data stays on this device only.
                const failures = [];

                window.alert(
                    failures.length
                        ? "Data on this device was cleared, but some server practice records could not be deleted. Please try again later."
                        : "Your practice data has been reset."
                );
                window.location.reload();
            } catch (error) {
                console.error("Practice data reset error:", error);
                resetConfirm.textContent = "Delete practice data";
                resetConfirm.disabled = resetInput.value.trim() !== "RESET";
                resetCancel.disabled = false;
                window.alert("We couldn't reset all practice data.");
            }
        });
    }

    window.addEventListener(
        "storage",
        event => {
            if (
                event.key ===
                HISTORY_KEY
            ) {
                loadAnalytics();
            }
        }
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                loadAnalytics();
            }
        }
    );

    await loadAnalytics();
});
