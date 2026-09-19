const questionBankSupabase = supabaseClient;


// ============================================================
// STATE
// ============================================================

let allQuestions = [];

let activeSection = "all";
let activeSearch = "";
let activeTopic = "all";
let activeDifficulty = "all";
let activeStatus = "all";
let reviewOnly = false;

let userAttempts = [];
let userReviews = [];


// ============================================================
// DOM
// ============================================================

const questionList = document.getElementById("question-list");
const questionCount = document.getElementById("question-count");
const resultsDescription = document.getElementById("results-description");
const searchInput = document.getElementById("question-search");
const topicFilter = document.getElementById("topic-filter");
const difficultyFilter = document.getElementById("difficulty-filter");
const statusFilter = document.getElementById("status-filter");
const reviewOnlyCheckbox = document.getElementById("review-only");
const sectionTabs = document.querySelectorAll(".section-tab");


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHtml(value) {
    if (value === null || value === undefined) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// CURRENT USER
// ============================================================

async function getCurrentUser() {
    const { data, error } =
        await questionBankSupabase.auth.getSession();

    if (error) {
        console.error("Could not get current user:", error);
        return null;
    }

    return data?.session?.user || null;
}


// ============================================================
// ATTEMPTS
// ============================================================

function getAttemptsForQuestion(questionId) {
    return userAttempts.filter(
        attempt =>
            String(attempt.question_id) ===
            String(questionId)
    );
}


// ============================================================
// PERFORMANCE
// ============================================================

function getQuestionPerformance(questionId) {
    const attempts = getAttemptsForQuestion(questionId);

    if (attempts.length === 0) {
        return {
            className: "unanswered",
            label: "Not answered yet"
        };
    }

    const sorted = [...attempts].sort(
        (a, b) =>
            new Date(a.created_at) -
            new Date(b.created_at)
    );

    const firstCorrectIndex = sorted.findIndex(
        attempt => attempt.is_correct === true
    );

    if (firstCorrectIndex === 0) {
        return {
            className: "first-correct",
            label: "Correct on first attempt"
        };
    }

    if (firstCorrectIndex === 1) {
        return {
            className: "second-correct",
            label: "Correct on second attempt"
        };
    }

    if (firstCorrectIndex >= 2) {
        return {
            className: "later-correct",
            label: "Correct after multiple attempts"
        };
    }

    return {
        className: "later-correct",
        label: "Answered incorrectly"
    };
}


// ============================================================
// REVIEW
// ============================================================

function isQuestionMarkedForReview(questionId) {
    return userReviews.some(
        review =>
            String(review.question_id) ===
            String(questionId)
    );
}


// ============================================================
// STATUS
// ============================================================

function getQuestionStatus(questionId) {
    const attempts = getAttemptsForQuestion(questionId);

    if (attempts.length === 0) {
        return "unanswered";
    }

    const latest = [...attempts].sort(
        (a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
    )[0];

    return latest.is_correct
        ? "correct"
        : "incorrect";
}


// ============================================================
// NORMALIZE / NUMBER
// ============================================================

function normalizeQuestion(question) {
    const difficultyValue =
        question.difficulty
            ? String(question.difficulty)
                  .charAt(0)
                  .toUpperCase() +
              String(question.difficulty).slice(1).toLowerCase()
            : "Medium";

    return {
        id: question.id,
        groupId: question.groupId || question.group_id || question.id,
        question_number: null,
        question_text: question.question || question.question_text || "",
        choice_a: question.choices?.A || question.choice_a || "",
        choice_b: question.choices?.B || question.choice_b || "",
        choice_c: question.choices?.C || question.choice_c || "",
        choice_d: question.choices?.D || question.choice_d || "",
        correct_answer: question.correctAnswer || question.correct_answer || "",
        explanation: question.explanation || "",
        difficulty: difficultyValue,
        topic: question.skill || question.topic || "SAT Practice",
        section: question.section || "SAT",
        domain: question.domain || "",
        passage: question.passage || ""
    };
}


function assignQuestionNumbers(questions) {
    const groupNumbers = new Map();
    let nextNumber = 1;

    questions.forEach(question => {
        const groupId = String(question.groupId);

        if (!groupNumbers.has(groupId)) {
            groupNumbers.set(groupId, nextNumber);
            nextNumber++;
        }
    });

    const difficultyOrder = {
        Easy: 0,
        Medium: 1,
        Hard: 2
    };

    questions.forEach(question => {
        question.question_number =
            groupNumbers.get(String(question.groupId)) ||
            nextNumber;

    });

    questions.sort((a, b) => {
        const groupA = groupNumbers.get(String(a.groupId)) || 999999;
        const groupB = groupNumbers.get(String(b.groupId)) || 999999;

        if (groupA !== groupB) {
            return groupA - groupB;
        }

        return (
            (difficultyOrder[a.difficulty] ?? 1) -
            (difficultyOrder[b.difficulty] ?? 1)
        );
    });

    return questions;
}


// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {
    showLoading();

    /*
     * The Question Bank is intentionally driven ONLY by the
     * staged question-bank.json file.
     *
     * We do NOT merge the old Supabase "questions" table here.
     * That prevents legacy question-set questions from appearing
     * in the new Question Bank.
     */

    let stagedQuestions = [];

    try {
        const response = await fetch(
            "/question-bank.json?v=2",
            {
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error(
                "Staged question file returned " +
                response.status
            );
        }

        const stagedData = await response.json();

        stagedQuestions = (stagedData.questions || [])
            .filter(
                question =>
                    question.status === "staged"
            )
            .map(normalizeQuestion);

    } catch (error) {
        console.warn(
            "Could not load question-bank.json. Using the approved fallback question.",
            error
        );
    }

    /*
     * Keep a guaranteed fallback so the page can still show
     * the currently approved test question if a static asset
     * is temporarily unavailable.
     */

    if (stagedQuestions.length === 0) {
        stagedQuestions = [
            normalizeQuestion({
                id: "rw-central-001-easy",
                groupId: "rw-central-001",
                section: "Reading & Writing",
                domain: "Information and Ideas",
                skill: "Central Ideas and Details",
                difficulty: "easy",
                passage:
                    "When the city of Riverton replaced several empty lots with small public gardens, researchers studied how residents used the new spaces. They found that people visited the gardens most often when benches and shaded areas were available. The researchers concluded that adding comfortable places to sit encouraged residents to spend more time in the gardens. Thus, public gardens are more likely to become active community spaces when they provide seating and shade.",
                question:
                    "Which choice best states the central idea of the text?",
                choices: {
                    A:
                        "Riverton residents generally prefer gardens to other public spaces.",
                    B:
                        "Public gardens can attract more activity when they include comfortable places for people to sit.",
                    C:
                        "Researchers found that Riverton had more empty lots than nearby cities did.",
                    D:
                        "Shaded areas are more important to garden visitors than plants are."
                },
                correctAnswer: "B",
                explanation:
                    "The passage directly states that residents visited the gardens more often when seating and shade were available and concludes that these features can make gardens more active community spaces."
            }),
            normalizeQuestion({
                id: "rw-central-001-medium",
                groupId: "rw-central-001",
                section: "Reading & Writing",
                domain: "Information and Ideas",
                skill: "Central Ideas and Details",
                difficulty: "medium",
                passage:
                    "After several empty lots in Riverton were converted into public gardens, researchers monitored how residents used the spaces. Gardens with benches and shaded areas tended to receive longer visits than gardens without them. The researchers noted that other features, such as the variety of plants, also differed among the gardens, so seating and shade could not be treated as the only influences on visitors' behavior. Even so, the consistent association between comfortable seating and longer visits suggested that gardens designed for lingering, rather than merely passing through, were more likely to develop into active community spaces.",
                question:
                    "Which choice best states the central idea of the text?",
                choices: {
                    A:
                        "The variety of plants in a garden is usually less important than its physical design.",
                    B:
                        "Riverton's public gardens attracted visitors primarily because they replaced empty lots.",
                    C:
                        "Features that make public gardens comfortable for extended visits may help those gardens become more active community spaces.",
                    D:
                        "Researchers were unable to determine whether any feature of the gardens affected residents' behavior."
                },
                correctAnswer: "C",
                explanation:
                    "The passage acknowledges that factors besides seating and shade may influence behavior, but it uses the longer visits associated with comfortable features to support a broader conclusion."
            }),
            normalizeQuestion({
                id: "rw-central-001-hard",
                groupId: "rw-central-001",
                section: "Reading & Writing",
                domain: "Information and Ideas",
                skill: "Central Ideas and Details",
                difficulty: "hard",
                passage:
                    "Riverton's conversion of several vacant lots into public gardens offered researchers an opportunity to examine not simply whether residents entered these spaces but what might cause them to remain. Gardens differed in plant variety as well as in the amenities they offered, making it difficult to attribute longer visits to any single feature. Yet a pattern emerged: spaces containing benches and shaded areas were more consistently associated with extended stays. This pattern does not establish that seating or shade alone transforms a garden into a community gathering place; residents may have been responding to other qualities that happened to accompany those amenities. Still, if a garden permits people to remain comfortably rather than merely pass through, it creates a condition under which repeated and sustained use can develop. The researchers therefore suggested that the design of public gardens should be understood partly in terms of whether it supports lingering, since such design may help otherwise underused spaces become active community settings.",
                question:
                    "Which choice best states the central idea of the text?",
                choices: {
                    A:
                        "Public gardens become active community spaces only when they contain benches and shaded areas.",
                    B:
                        "Differences in plant variety make it impossible to determine why Riverton residents used some gardens more than others.",
                    C:
                        "Although no single garden feature can be identified as solely responsible for increased use, designing public gardens to accommodate extended stays may encourage them to become active community spaces.",
                    D:
                        "Riverton's researchers primarily sought to determine whether residents preferred plants or seating in public gardens."
                },
                correctAnswer: "C",
                explanation:
                    "The passage qualifies the evidence, develops the idea that comfortable spaces for lingering can support sustained use, and returns to the broader conclusion about community activity."
            })
        ];
    }

    allQuestions = assignQuestionNumbers(
        stagedQuestions
    );

    populateTopicFilter();
    await loadUserData();
    renderQuestions();
}


// ============================================================
// USER DATA
// ============================================================

async function loadUserData() {
    const user = await getCurrentUser();

    if (!user) {
        userAttempts = [];
        userReviews = [];
        return;
    }

    const attemptsResult =
        await questionBankSupabase
            .from("question_attempts")
            .select("*")
            .eq("user_id", user.id);

    userAttempts =
        attemptsResult.error
            ? []
            : (attemptsResult.data || []);

    if (attemptsResult.error) {
        console.warn(
            "Could not load question attempts:",
            attemptsResult.error
        );
    }

    const reviewsResult =
        await questionBankSupabase
            .from("question_reviews")
            .select("*")
            .eq("user_id", user.id);

    userReviews =
        reviewsResult.error
            ? []
            : (reviewsResult.data || []);

    if (reviewsResult.error) {
        console.warn(
            "Could not load question reviews:",
            reviewsResult.error
        );
    }
}


// ============================================================
// TOPIC FILTER
// ============================================================

function populateTopicFilter() {
    if (!topicFilter) {
        return;
    }

    topicFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Topics";
    topicFilter.appendChild(allOption);

    const domains = new Set();
    const topics = new Set();

    allQuestions.forEach(question => {
        if (question.domain) {
            domains.add(question.domain);
        }

        if (question.topic) {
            topics.add(question.topic);
        }
    });

    [...domains]
        .sort()
        .forEach(domain => {
            const option = document.createElement("option");
            option.value = domain;
            option.textContent = domain;
            topicFilter.appendChild(option);
        });

    [...topics]
        .sort()
        .forEach(topic => {
            if (domains.has(topic)) {
                return;
            }

            const option = document.createElement("option");
            option.value = topic;
            option.textContent = topic;
            topicFilter.appendChild(option);
        });
}


// ============================================================
// FILTER
// ============================================================

function getFilteredQuestions() {
    let questions = [...allQuestions];

    if (activeSection !== "all") {
        questions = questions.filter(
            question =>
                question.section === activeSection
        );
    }

    if (activeSearch) {
        const search = activeSearch.toLowerCase();

        questions = questions.filter(question => {
            const searchableText = [
                question.question_text,
                question.passage,
                question.topic,
                question.domain,
                question.difficulty,
                question.section,
                question.choice_a,
                question.choice_b,
                question.choice_c,
                question.choice_d
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return searchableText.includes(search);
        });
    }

    if (activeTopic !== "all") {
        questions = questions.filter(
            question =>
                question.domain === activeTopic ||
                question.topic === activeTopic
        );
    }

    if (activeDifficulty !== "all") {
        questions = questions.filter(
            question =>
                question.difficulty === activeDifficulty
        );
    }

    if (activeStatus !== "all") {
        questions = questions.filter(
            question =>
                getQuestionStatus(question.id) ===
                activeStatus
        );
    }

    if (reviewOnly) {
        questions = questions.filter(
            question =>
                isQuestionMarkedForReview(
                    question.id
                )
        );
    }

    return questions;
}


// ============================================================
// RENDER
// ============================================================

function renderQuestions() {
    const questions = getFilteredQuestions();

    if (questionCount) {
        questionCount.textContent =
            questions.length +
            (questions.length === 1
                ? " question"
                : " questions");
    }

    if (resultsDescription) {
        resultsDescription.textContent =
            questions.length === allQuestions.length
                ? "in your question bank"
                : "matching your filters";
    }

    if (questions.length === 0) {
        showEmptyState();
        return;
    }

    questionList.innerHTML = "";

    questions.forEach((question, index) => {
        questionList.appendChild(
            createQuestionCard(question, index)
        );
    });
}


// ============================================================
// QUESTION CARD
// ============================================================

function createQuestionCard(question, index) {
    const card = document.createElement("article");
    card.className = "question-card";

    const performance =
        getQuestionPerformance(question.id);

    const marked =
        isQuestionMarkedForReview(question.id);

    const difficulty =
        String(question.difficulty || "Medium");

    const difficultyClass =
        difficulty.toLowerCase();

    const questionNumber =
        question.question_number || index + 1;

    const choices = [
        ["A", question.choice_a],
        ["B", question.choice_b],
        ["C", question.choice_c],
        ["D", question.choice_d]
    ];

    const choiceMarkup = choices
        .map(
            choice =>
                '<div class="question-choice">' +
                    '<span class="question-choice-letter">' +
                        escapeHtml(choice[0]) +
                    '</span>' +
                    '<span class="question-choice-text">' +
                        escapeHtml(choice[1]) +
                    '</span>' +
                '</div>'
        )
        .join("");

    card.innerHTML =
        '<div class="question-card-header">' +
            '<div class="question-card-number difficulty-' +
                escapeHtml(difficultyClass) +
                '" title="' +
                escapeHtml(difficulty) +
                '">' +
                escapeHtml(questionNumber) +
            '</div>' +

            '<div class="question-card-heading">' +
                '<div class="question-card-topic">' +
                    escapeHtml(
                        question.topic ||
                        "SAT Practice"
                    ) +
                '</div>' +

                '<div class="question-card-section">' +
                    escapeHtml(
                        question.section ||
                        "SAT"
                    ) +
                '</div>' +
            '</div>' +

            '<div class="question-card-actions">' +
                (
                    marked
                        ? '<div class="question-card-review" title="Marked for review" aria-label="Marked for review">★</div>'
                        : ''
                ) +

                '<div class="question-card-performance">' +
                    '<div class="performance-indicator ' +
                        escapeHtml(performance.className) +
                        '" title="' +
                        escapeHtml(performance.label) +
                        '" aria-label="' +
                        escapeHtml(performance.label) +
                        '">' +
                        (
                            performance.className === "unanswered"
                                ? '<span class="performance-dot"></span>'
                                : ''
                        ) +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>' +

        (
            question.passage
                ? '<div class="question-card-passage">' +
                    escapeHtml(question.passage) +
                  '</div>'
                : ''
        ) +

        '<div class="question-card-prompt">' +
            escapeHtml(
                question.question_text ||
                "Question"
            ) +
        '</div>' +

        '<div class="question-choices">' +
            choiceMarkup +
        '</div>' +

        '<div class="question-card-footer">' +
            '<div class="question-card-meta">' +
                '<span class="question-meta-tag">' +
                    escapeHtml(
                        question.domain ||
                        "SAT"
                    ) +
                '</span>' +
            '</div>' +

            '<button ' +
                'type="button" ' +
                'class="practice-button" ' +
                'data-question-id="' +
                    escapeHtml(question.id) +
                '">' +
                'Practice' +
            '</button>' +
        '</div>';

    const practiceButton =
        card.querySelector(".practice-button");

    if (practiceButton) {
        practiceButton.addEventListener(
            "click",
            () => {
                window.location.href =
                    "/question?id=" +
                    encodeURIComponent(question.id);
            }
        );
    }

    return card;
}


// ============================================================
// STATES
// ============================================================

function showLoading() {
    questionList.innerHTML =
        '<div class="loading-state">' +
            '<div class="loading-spinner"></div>' +
            'Loading question bank...' +
        '</div>';
}


function showEmptyState() {
    questionList.innerHTML =
        '<div class="empty-state">' +
            '<div class="empty-icon">' +
                '<svg viewBox="0 0 24 24" aria-hidden="true">' +
                    '<path d="M6 3h12v18H6z"></path>' +
                    '<path d="M9 7h6"></path>' +
                    '<path d="M9 11h6"></path>' +
                    '<path d="M9 15h4"></path>' +
                '</svg>' +
            '</div>' +
            '<h2>No questions found</h2>' +
            '<p>Try changing your filters or search.</p>' +
        '</div>';
}


// ============================================================
// EVENTS
// ============================================================

if (searchInput) {
    searchInput.addEventListener(
        "input",
        event => {
            activeSearch =
                event.target.value.trim();
            renderQuestions();
        }
    );
}

if (topicFilter) {
    topicFilter.addEventListener(
        "change",
        event => {
            activeTopic = event.target.value;
            renderQuestions();
        }
    );
}

if (difficultyFilter) {
    difficultyFilter.addEventListener(
        "change",
        event => {
            activeDifficulty = event.target.value;
            renderQuestions();
        }
    );
}

if (statusFilter) {
    statusFilter.addEventListener(
        "change",
        event => {
            activeStatus = event.target.value;
            renderQuestions();
        }
    );
}

if (reviewOnlyCheckbox) {
    reviewOnlyCheckbox.addEventListener(
        "change",
        event => {
            reviewOnly =
                event.target.checked;
            renderQuestions();
        }
    );
}

sectionTabs.forEach(tab => {
    tab.addEventListener(
        "click",
        () => {
            sectionTabs.forEach(otherTab =>
                otherTab.classList.remove("active")
            );

            tab.classList.add("active");

            activeSection =
                tab.dataset.section || "all";

            activeTopic = "all";

            if (topicFilter) {
                topicFilter.value = "all";
            }

            renderQuestions();
        }
    );
});


// ============================================================
// AUTH REFRESH
// ============================================================

questionBankSupabase.auth.onAuthStateChange(
    async () => {
        await loadUserData();
        renderQuestions();
    }
);


// ============================================================
// INITIAL LOAD
// ============================================================

async function initializeQuestionBank() {
    const {
        data: { session },
        error
    } =
        await questionBankSupabase.auth.getSession();

    if (error || !session) {
        const currentPath =
            window.location.pathname +
            window.location.search;

        window.location.replace(
            "/login?redirect=" +
            encodeURIComponent(currentPath)
        );

        return;
    }

    await loadQuestions();
}

initializeQuestionBank();
