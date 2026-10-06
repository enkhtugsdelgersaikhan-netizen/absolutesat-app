document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await absolutePrepSupabase.auth.getSession();

    if (!data || !data.session) {
        window.location.href = "/login";
        return;
    }

    const user = data.session.user;
    const HISTORY_KEY = "absoluteprep-practice-history:" + user.id;
    const RESET_KEY = "absoluteprep-practice-reset:" + user.id;
    const PREFERRED_ACCURACY = 90;
    const TARGET_SECONDS = {
        "R&W": 71,
        "Math": 95
    };

    let activeSubtopicFilter = "all";
    let currentSubtopicRows = [];

    const els = {
        streak: document.getElementById("streak"),
        answered: document.getElementById("questions-answered"),
        sevenDay: document.getElementById("seven-day-chart"),
        mockChart: document.getElementById("mock-performance-chart"),
        subtopicBody: document.getElementById("subtopic-table-body"),
        priority: document.getElementById("priority-list"),
        difficulty: document.getElementById("difficulty-profile"),
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
        const ratio = Math.min(1, gap / 45);
        const hue = Math.round(155 * (1 - ratio));
        return "hsl(" + hue + " 55% 36%)";
    };

    const paceColor = (seconds, section) => {
        if (!Number.isFinite(seconds)) return "#8a9996";
        const target = TARGET_SECONDS[section] || 83;
        if (seconds <= target) return "hsl(155 55% 36%)";
        const ratio = Math.min(1, (seconds - target) / (target * 0.8));
        const hue = Math.round(155 * (1 - ratio));
        return "hsl(" + hue + " 55% 36%)";
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
        const scaleMax = getNiceActivityMaximum(maxTotal);
        const scaleMid = Math.round(scaleMax / 2);
        const maxHeight = 156;

        const grid =
            '<div class="activity-scale" aria-hidden="true">' +
                '<span style="bottom:186px">' + scaleMax + '</span>' +
                '<span style="bottom:108px">' + scaleMid + '</span>' +
                '<span style="bottom:30px">0</span>' +
            '</div>' +
            '<div class="activity-grid-line" style="bottom:186px"></div>' +
            '<div class="activity-grid-line" style="bottom:108px"></div>' +
            '<div class="activity-grid-line" style="bottom:30px"></div>';

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

        els.sevenDay.classList.remove("dashboard-empty-chart");
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
            els.mockChart.classList.add("dashboard-empty-chart");
            els.mockChart.textContent =
                "Complete a mock test to add its Composite, R&W, and Math scores here.";
            return;
        }

        const width = 760;
        const height = 245;
        const left = 48;
        const right = 48;
        const top = 18;
        const bottom = 38;
        const plotWidth = width - left - right;
        const plotHeight = height - top - bottom;
        const x = index =>
            left + ((index - 1) / 7) * plotWidth;
        const yComposite = score =>
            top + ((1600 - score) / 1200) * plotHeight;
        const ySection = score =>
            top + ((800 - score) / 600) * plotHeight;

        const compositeTicks = [1600,1300,1000,700,400];
        const sectionTicks = [800,650,500,350,200];

        const grid = compositeTicks.map((value, i) => {
            const y = yComposite(value);
            return (
                '<line class="mock-grid" x1="' + left + '" x2="' + (width-right) +
                    '" y1="' + y + '" y2="' + y + '"></line>' +
                '<text class="mock-axis-label" x="' + (left-7) + '" y="' + (y+3) +
                    '" text-anchor="end">' + value + '</text>' +
                '<text class="mock-axis-label" x="' + (width-right+7) + '" y="' + (y+3) +
                    '" text-anchor="start">' + sectionTicks[i] + '</text>'
            );
        }).join("");

        const xLabels = tests.map(test =>
            '<text class="mock-x-label' + (test.scores ? ' is-complete' : '') +
                '" x="' + x(test.index) + '" y="' + (height-8) +
                '" text-anchor="middle">Mock ' + test.index + '</text>'
        ).join("");

        const buildSeries = (key, yFn, className, label) => {
            const points = completed.map(test => ({
                test,
                x: x(test.index),
                y: yFn(test.scores[key]),
                value: test.scores[key]
            }));

            const line = points.length > 1
                ? '<polyline class="mock-series ' + className + '" points="' +
                    points.map(point => point.x + ',' + point.y).join(' ') +
                    '"></polyline>'
                : "";

            const dots = points.map(point =>
                '<g>' +
                    '<circle class="mock-dot ' + className + '" cx="' + point.x +
                        '" cy="' + point.y + '" r="4.5">' +
                        '<title>Mock ' + point.test.index + ' · ' +
                            escapeHtml(label) + ': ' + point.value + '</title>' +
                    '</circle>' +
                '</g>'
            ).join("");

            return line + dots;
        };

        const emptySlots = tests
            .filter(test => !test.scores)
            .map(test =>
                '<circle class="mock-empty-dot" cx="' + x(test.index) +
                    '" cy="' + (top + plotHeight) + '" r="3"></circle>'
            )
            .join("");

        els.mockChart.classList.remove("dashboard-empty-chart");
        els.mockChart.innerHTML =
            '<svg viewBox="0 0 ' + width + ' ' + height +
                '" role="img" aria-label="Mock test Composite, Reading and Writing, and Math score performance">' +
                grid +
                '<text class="mock-axis-title" x="10" y="' + (top + plotHeight/2) +
                    '" transform="rotate(-90 10 ' + (top + plotHeight/2) +
                    ')" text-anchor="middle">Composite</text>' +
                '<text class="mock-axis-title" x="' + (width-10) + '" y="' + (top + plotHeight/2) +
                    '" transform="rotate(90 ' + (width-10) + ' ' + (top + plotHeight/2) +
                    ')" text-anchor="middle">Section</text>' +
                buildSeries("composite", yComposite, "is-composite", "Composite") +
                buildSeries("readingWriting", ySection, "is-rw", "R&W") +
                buildSeries("math", ySection, "is-math", "Math") +
                emptySlots +
                xLabels +
            '</svg>';
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

    function renderSubtopicTable() {
        const rows = currentSubtopicRows.filter(row => {
            if (activeSubtopicFilter === "rw") return row.section === "R&W";
            if (activeSubtopicFilter === "math") return row.section === "Math";
            return true;
        });

        if (!rows.length) {
            els.subtopicBody.innerHTML =
                '<tr><td colspan="5" class="dashboard-table-empty">No subtopics found.</td></tr>';
            return;
        }

        els.subtopicBody.innerHTML = rows.map(row => {
            const accuracy = Number.isFinite(row.accuracy)
                ? Math.round(row.accuracy) + "%"
                : "—";
            const avgTime = Number.isFinite(row.averageTime)
                ? Math.round(row.averageTime) + "s"
                : "—";

            return (
                '<tr data-section="' + (row.section === "Math" ? "math" : "rw") + '">' +
                    '<td><span class="subtopic-section-chip">' + escapeHtml(row.section) + '</span></td>' +
                    '<td><span class="subtopic-name">' + escapeHtml(row.subtopic) + '</span></td>' +
                    '<td class="is-number">' + row.answered.toLocaleString() + '</td>' +
                    '<td class="is-number"><span class="performance-value" style="color:' +
                        accuracyColor(row.accuracy) + '">' + accuracy + '</span></td>' +
                    '<td class="is-number"><span class="performance-value" style="color:' +
                        paceColor(row.averageTime, row.section) + '">' + avgTime + '</span></td>' +
                '</tr>'
            );
        }).join("");
    }

    function renderPriorities(rows) {
        const practiced = rows.filter(row => row.answered >= 3);

        const ranked = practiced.map(row => {
            const accuracyGap = Number.isFinite(row.accuracy)
                ? Math.max(0, PREFERRED_ACCURACY - row.accuracy)
                : 0;
            const target = TARGET_SECONDS[row.section] || 83;
            const paceGap = Number.isFinite(row.averageTime)
                ? Math.max(0, row.averageTime - target) / target * 25
                : 0;
            const confidence = Math.min(1, row.answered / 10);
            return {
                row,
                priority: (accuracyGap * 1.25 + paceGap) * (0.55 + 0.45 * confidence)
            };
        }).sort((a, b) => b.priority - a.priority);

        const selections = ranked.filter(item => item.priority > 0.5).slice(0, 5);

        if (selections.length < 5) {
            const used = new Set(selections.map(item => item.row.section + "|" + item.row.subtopic));
            rows
                .filter(row => row.answered < 3)
                .sort((a, b) => a.answered - b.answered || a.subtopic.localeCompare(b.subtopic))
                .forEach(row => {
                    if (selections.length >= 5) return;
                    const key = row.section + "|" + row.subtopic;
                    if (!used.has(key)) {
                        selections.push({ row, priority: -1 });
                        used.add(key);
                    }
                });
        }

        if (!selections.length) {
            els.priority.innerHTML =
                '<div class="dashboard-empty-state">Practice a few questions across the bank to unlock targeted priorities.</div>';
            return;
        }

        els.priority.innerHTML = selections.map((item, index) => {
            const row = item.row;
            let reason;

            if (row.answered < 3) {
                reason = "Not enough recent evidence yet; build coverage here.";
            } else if (Number.isFinite(row.accuracy) && row.accuracy < 75) {
                reason = "Accuracy is the main constraint in this subtopic.";
            } else if (
                Number.isFinite(row.averageTime) &&
                row.averageTime > (TARGET_SECONDS[row.section] || 83) * 1.15
            ) {
                reason = "Accuracy is usable, but pace is costing too much time.";
            } else {
                reason = "This is one of the clearest remaining opportunities for improvement.";
            }

            const meta = [];
            meta.push(row.answered + " answered");
            if (Number.isFinite(row.accuracy)) meta.push(Math.round(row.accuracy) + "% accuracy");
            if (Number.isFinite(row.averageTime)) meta.push(Math.round(row.averageTime) + "s avg");

            return (
                '<div class="priority-item">' +
                    '<div class="priority-rank">' + (index + 1) + '</div>' +
                    '<div>' +
                        '<strong>' + escapeHtml(row.subtopic) + ' · ' + escapeHtml(row.section) + '</strong>' +
                        '<p>' + escapeHtml(reason) + '</p>' +
                        '<div class="priority-meta">' +
                            meta.map(value => '<span>' + escapeHtml(value) + '</span>').join("") +
                        '</div>' +
                    '</div>' +
                '</div>'
            );
        }).join("");
    }

    function renderDifficulty(attempts, metadata, timedHistory) {
        const fallbackMeta = new Map(
            timedHistory.map(row => [
                String(row.question_id),
                { difficulty: row.difficulty || "" }
            ])
        );

        const buckets = {
            Easy: { answered: 0, correct: 0 },
            Medium: { answered: 0, correct: 0 },
            Hard: { answered: 0, correct: 0 }
        };

        attempts.forEach(row => {
            const meta =
                metadata.map.get(String(row.question_id)) ||
                fallbackMeta.get(String(row.question_id));
            const difficulty = meta?.difficulty;

            if (!buckets[difficulty]) return;

            buckets[difficulty].answered += 1;
            if (Boolean(row.is_correct)) buckets[difficulty].correct += 1;
        });

        const hasData = Object.values(buckets).some(bucket => bucket.answered > 0);

        if (!hasData) {
            els.difficulty.innerHTML =
                '<div class="dashboard-empty-state">Difficulty analytics will appear after practice questions are answered.</div>';
            return;
        }

        els.difficulty.innerHTML = Object.entries(buckets).map(([label, bucket]) => {
            const accuracy = bucket.answered
                ? bucket.correct / bucket.answered * 100
                : null;
            const rounded = Number.isFinite(accuracy) ? Math.round(accuracy) : 0;
            return (
                '<div class="difficulty-row">' +
                    '<strong>' + label + '</strong>' +
                    '<div class="difficulty-track"><div class="difficulty-fill" style="width:' +
                        rounded + '%;background:' + accuracyColor(accuracy) + '"></div></div>' +
                    '<div class="difficulty-value" style="color:' + accuracyColor(accuracy) + '">' +
                        (Number.isFinite(accuracy) ? rounded + "%" : "—") + '</div>' +
                    '<small>' + bucket.answered.toLocaleString() + ' answered</small>' +
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

        let attempts;
        if (attemptsResult.status === "fulfilled") {
            attempts = attemptsResult.value.filter(row => afterReset(row, resetTime));
        } else {
            attempts = localHistory.map(row => ({
                question_id: row.question_id,
                is_correct: row.is_correct,
                created_at: row.answered_at
            }));

            els.note.hidden = false;
            els.note.textContent =
                "Server practice history could not be loaded, so this view is using the timing history saved on this device.";
            console.warn("Dashboard attempt history unavailable:", attemptsResult.reason);
        }

        attempts = attempts
            .filter(row => row && row.question_id)
            .map(row => ({
                ...row,
                created_at: row.created_at || row.answered_at || null
            }));

        renderKpis(attempts);
        renderSevenDay(attempts);
        renderMockPerformance();

        currentSubtopicRows = buildSubtopicRows(
            attempts,
            localHistory,
            metadata
        );
        renderSubtopicTable();
        renderPriorities(currentSubtopicRows);
        renderDifficulty(attempts, metadata, localHistory);

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

    if (els.reset) {
        els.reset.addEventListener("click", async () => {
            const confirmed = window.confirm(
                "Reset all practice data? This permanently removes saved question attempts, reviews, question-set results, timing analytics, and vocabulary progress."
            );

            if (!confirmed) return;

            els.reset.disabled = true;
            els.reset.textContent = "Resetting…";

            try {
                localStorage.setItem(RESET_KEY, new Date().toISOString());
                localStorage.removeItem("absoluteprep-question-status:" + user.id);
                localStorage.removeItem("absoluteprep-question-reviews:" + user.id);
                localStorage.removeItem(HISTORY_KEY);
                localStorage.removeItem("absoluteprep_vocab_state");
                localStorage.removeItem("absoluteprep_vocab_learned");

                const tables = [
                    "question_answers",
                    "question_set_attempts",
                    "question_attempts",
                    "question_reviews"
                ];
                const failures = [];

                for (const table of tables) {
                    const { error } = await absolutePrepSupabase
                        .from(table)
                        .delete()
                        .eq("user_id", user.id);

                    if (error) {
                        console.warn("Could not reset " + table + ":", error);
                        failures.push(table);
                    }
                }

                if (failures.length) {
                    window.alert(
                        "Practice data was cleared on this device, but some older server records could not be deleted."
                    );
                } else {
                    window.alert("All practice data has been reset.");
                }

                window.location.reload();
            } catch (error) {
                console.error("Practice data reset error:", error);
                els.reset.disabled = false;
                els.reset.textContent = "Reset all practice data";
                window.alert("We couldn't reset all practice data.");
            }
        });
    }

    if (els.logout) {
        els.logout.addEventListener("click", async () => {
            els.logout.disabled = true;
            els.logout.textContent = "Logging out…";

            const { error } = await absolutePrepSupabase.auth.signOut();

            if (error) {
                els.logout.disabled = false;
                els.logout.textContent = "Log out";
                console.error("Dashboard logout error:", error);
                return;
            }

            window.location.href = "/";
        });
    }

    await loadAnalytics();
});
