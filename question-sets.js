const ABSOLUTEPREP_SUPABASE_URL =
    "https://ikvvixdyztyqqxkveois.supabase.co";

const ABSOLUTEPREP_SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";

const questionBankSupabase =
    window.supabase.createClient(
        ABSOLUTEPREP_SUPABASE_URL,
        ABSOLUTEPREP_SUPABASE_PUBLISHABLE_KEY
    );


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
// SAT TOPIC STRUCTURE
// ============================================================

const topicStructure = {

    "Reading & Writing": [

        {
            domain: "Information and Ideas",
            percentage: "~26%",
            description:
                "Focuses on comprehension, locating details, and evaluating data.",
            subtopics: [
                "Central Ideas and Details",
                "Command of Evidence — Textual",
                "Command of Evidence — Quantitative",
                "Inferences"
            ]
        },

        {
            domain: "Craft and Structure",
            percentage: "~28%",
            description:
                "Focuses on vocabulary, text organization, and author's purpose.",
            subtopics: [
                "Words in Context",
                "Text Structure and Purpose",
                "Cross-Text Connections"
            ]
        },

        {
            domain: "Expression of Ideas",
            percentage: "~20%",
            description:
                "Focuses on revision and improving how a point is made.",
            subtopics: [
                "Transitions",
                "Rhetorical Synthesis"
            ]
        },

        {
            domain: "Standard English Conventions",
            percentage: "~26%",
            description:
                "Focuses on grammar, punctuation, and sentence mechanics.",
            subtopics: [
                "Boundaries",
                "Form, Structure, and Sense"
            ]
        }

    ],


    "Math": [

        {
            domain: "Algebra",
            percentage: "35%",
            description:
                "This domain focuses on linear equations and systems.",
            subtopics: [
                "Linear Equations",
                "Linear Functions",
                "Systems of Linear Equations",
                "Linear Inequalities"
            ]
        },

        {
            domain: "Advanced Math",
            percentage: "35%",
            description:
                "This domain moves beyond linear relationships into non-linear equations and functions.",
            subtopics: [
                "Quadratic Equations",
                "Exponential and Radical Functions",
                "Polynomial Operations",
                "Nonlinear Equations"
            ]
        },

        {
            domain: "Problem-Solving and Data Analysis",
            percentage: "15%",
            description:
                "This domain tests quantitative literacy in real-world contexts.",
            subtopics: [
                "Ratios, Rates, and Proportions",
                "Percentages",
                "Data Interpretation",
                "Statistics and Probability"
            ]
        },

        {
            domain: "Geometry and Trigonometry",
            percentage: "15%",
            description:
                "This domain covers spatial reasoning and basic angle relationships.",
            subtopics: [
                "Area, Perimeter, and Volume",
                "Lines, Angles, and Triangles",
                "Circles",
                "Basic Trigonometry"
            ]
        }

    ]

};


// ============================================================
// DOM ELEMENTS
// ============================================================

const questionList =
    document.getElementById("question-list");

const emptyState =
    document.getElementById("empty-state");

const questionCount =
    document.getElementById("question-count");

const resultsDescription =
    document.getElementById("results-description");

const searchInput =
    document.getElementById("question-search");

const topicFilter =
    document.getElementById("topic-filter");

const difficultyFilter =
    document.getElementById("difficulty-filter");

const statusFilter =
    document.getElementById("status-filter");

const reviewOnlyCheckbox =
    document.getElementById("review-only");

const sectionTabs =
    document.querySelectorAll(".section-tab");


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
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

    const {
        data,
        error
    } = await questionBankSupabase.auth.getSession();

    if (error) {

        console.error(
            "Could not get current user:",
            error
        );

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

    const attempts =
        getAttemptsForQuestion(questionId);

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


    const firstCorrectIndex =
        sorted.findIndex(
            attempt =>
                attempt.is_correct === true
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
// REVIEW STATUS
// ============================================================

function isQuestionMarkedForReview(questionId) {

    return userReviews.some(
        review =>
            String(review.question_id) ===
            String(questionId)
    );
}


// ============================================================
// QUESTION STATUS
// ============================================================

function getQuestionStatus(questionId) {

    const attempts =
        getAttemptsForQuestion(questionId);


    if (attempts.length === 0) {

        return "unanswered";

    }


    const latest =
        [...attempts].sort(
            (a, b) =>
                new Date(b.created_at) -
                new Date(a.created_at)
        )[0];


    if (latest.is_correct) {

        return "correct";

    }


    return "incorrect";
}


// ============================================================
// LOAD QUESTIONS
// ============================================================

async function loadQuestions() {

    showLoading();


    const {
        data,
        error
    } = await questionBankSupabase
        .from("questions")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Question loading error:",
            error
        );

        showError(
            "We couldn't load the question bank."
        );

        return;
    }


    allQuestions =
        data || [];


    /*
     * Also load reviewed/staged questions from the
     * repository JSON file. These are not inserted into
     * Supabase until they are formally deployed.
     */

    try {

        const stagedResponse =
            await fetch(
                "/question-bank.json",
                {
                    cache: "no-store"
                }
            );

        if (stagedResponse.ok) {

            const stagedData =
                await stagedResponse.json();

            const stagedQuestions =
                (stagedData.questions || [])
                    .filter(
                        question =>
                            question.status ===
                            "staged"
                    )
                    .map(
                        question => ({

                            id:
                                question.id,

                            question_number:
                                null,

                            question_text:
                                question.question,

                            choice_a:
                                question.choices?.A ||
                                "",

                            choice_b:
                                question.choices?.B ||
                                "",

                            choice_c:
                                question.choices?.C ||
                                "",

                            choice_d:
                                question.choices?.D ||
                                "",

                            correct_answer:
                                question.correctAnswer,

                            explanation:
                                question.explanation ||
                                "",

                            difficulty:
                                question.difficulty
                                    ? (
                                        question.difficulty
                                            .charAt(0)
                                            .toUpperCase() +
                                        question.difficulty
                                            .slice(1)
                                    )
                                    : "Medium",

                            topic:
                                question.skill ||
                                "SAT Practice",

                            section:
                                question.section ||
                                "SAT",

                            domain:
                                question.domain ||
                                ""

                        })
                    );


            allQuestions = [
                ...allQuestions,
                ...stagedQuestions
            ];

        }

    } catch (stagedError) {

        console.warn(
            "Could not load staged question bank JSON:",
            stagedError
        );

    }


    populateTopicFilter();


    await loadUserData();


    renderQuestions();
}


// ============================================================
// LOAD USER DATA
// ============================================================

async function loadUserData() {

    const user =
        await getCurrentUser();


    if (!user) {

        userAttempts = [];
        userReviews = [];

        return;
    }


    const attemptsResult =
        await questionBankSupabase
            .from("question_attempts")
            .select("*")
            .eq(
                "user_id",
                user.id
            );


    if (attemptsResult.error) {

        console.error(
            "Could not load question attempts:",
            attemptsResult.error
        );

        userAttempts = [];

    } else {

        userAttempts =
            attemptsResult.data || [];

    }


    const reviewsResult =
        await questionBankSupabase
            .from("question_reviews")
            .select("*")
            .eq(
                "user_id",
                user.id
            );


    if (reviewsResult.error) {

        console.error(
            "Could not load question reviews:",
            reviewsResult.error
        );

        userReviews = [];

    } else {

        userReviews =
            reviewsResult.data || [];

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


    const allOption =
        document.createElement("option");

    allOption.value = "all";
    allOption.textContent = "All Topics";

    topicFilter.appendChild(
        allOption
    );


    const sectionOrder = [
        "Reading & Writing",
        "Math"
    ];


    sectionOrder.forEach(
        sectionName => {

            const domains =
                topicStructure[sectionName];

            if (!domains) {
                return;
            }


            const group =
                document.createElement("optgroup");

            group.label =
                sectionName;


            domains.forEach(
                domain => {

                    // Domain option

                    const domainOption =
                        document.createElement("option");

                    domainOption.value =
                        domain.domain;

                    domainOption.textContent =
                        `${domain.domain} (${domain.percentage})`;

                    group.appendChild(
                        domainOption
                    );


                    // Subtopic options

                    domain.subtopics.forEach(
                        subtopic => {

                            const subtopicOption =
                                document.createElement("option");

                            subtopicOption.value =
                                subtopic;

                            subtopicOption.textContent =
                                `  ${subtopic}`;

                            group.appendChild(
                                subtopicOption
                            );

                        }
                    );

                }
            );


            topicFilter.appendChild(
                group
            );

        }
    );

}


// ============================================================
// FILTER QUESTIONS
// ============================================================

function getFilteredQuestions() {

    let questions =
        [...allQuestions];


    // SECTION

    if (activeSection !== "all") {

        questions =
            questions.filter(
                question =>
                    question.section ===
                    activeSection
            );

    }


    // SEARCH

    if (activeSearch) {

        const search =
            activeSearch.toLowerCase();


        questions =
            questions.filter(
                question => {

                    const searchableText = [

                        question.question_text,
                        question.topic,
                        question.difficulty,
                        question.section

                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        search
                    );

                }
            );

    }


    // TOPIC

    if (activeTopic !== "all") {

        questions =
            questions.filter(
                question =>
                    question.topic ===
                    activeTopic
            );

    }


    // DIFFICULTY

    if (activeDifficulty !== "all") {

        questions =
            questions.filter(
                question =>
                    question.difficulty ===
                    activeDifficulty
            );

    }


    // STATUS

    if (activeStatus !== "all") {

        questions =
            questions.filter(
                question =>
                    getQuestionStatus(
                        question.id
                    ) === activeStatus
            );

    }


    // REVIEW

    if (reviewOnly) {

        questions =
            questions.filter(
                question =>
                    isQuestionMarkedForReview(
                        question.id
                    )
            );

    }


    // Keep database order.
    //
    // No "Newest / Oldest / Difficulty / Topic"
    // sorting button is used anymore.

    return questions;
}


// ============================================================
// RENDER QUESTIONS
// ============================================================

function renderQuestions() {

    const questions =
        getFilteredQuestions();


    if (questionCount) {

        questionCount.textContent =
            `${questions.length} ${
                questions.length === 1
                    ? "question"
                    : "questions"
            }`;

    }


    if (resultsDescription) {

        resultsDescription.textContent =
            questions.length ===
            allQuestions.length
                ? "in your question bank"
                : "matching your filters";

    }


    if (questions.length === 0) {

        showEmptyState();

        return;
    }


    questionList.innerHTML = "";


    questions.forEach(
        (question, index) => {

            questionList.appendChild(
                createQuestionCard(
                    question,
                    index
                )
            );

        }
    );
}


// ============================================================
// QUESTION CARD
// ============================================================

function createQuestionCard(
    question,
    index
) {

    const card =
        document.createElement("article");


    card.className =
        "question-card";


    const performance =
        getQuestionPerformance(
            question.id
        );


    const marked =
        isQuestionMarkedForReview(
            question.id
        );


    const difficulty =
        String(
            question.difficulty ||
            "Medium"
        );


    const difficultyClass =
        difficulty.toLowerCase();


    const questionNumber =
        question.question_number ||
        index + 1;


    card.innerHTML = `

        <div class="question-card-number">
            #${escapeHtml(questionNumber)}
        </div>


        <div class="question-card-main">

            <div class="question-card-top">

                <span class="question-card-topic">
                    ${escapeHtml(
                        question.topic ||
                        "SAT Practice"
                    )}
                </span>

            </div>


            <div class="question-card-description">

                ${escapeHtml(
                    question.question_text ||
                    "Question"
                )}

            </div>


            <div class="question-card-meta">

                <span class="question-meta-tag">
                    ${escapeHtml(
                        question.section ||
                        "SAT"
                    )}
                </span>


                <span
                    class="
                        question-meta-tag
                        difficulty-${escapeHtml(
                            difficultyClass
                        )}
                    "
                >
                    ${escapeHtml(
                        difficulty
                    )}
                </span>

            </div>

        </div>


        ${
            marked
                ? `
                    <div
                        class="question-card-review"
                        title="Marked for review"
                        aria-label="Marked for review"
                    >
                        ★
                    </div>
                `
                : ""
        }


        <div class="question-card-performance">

            <div
                class="
                    performance-indicator
                    ${performance.className}
                "
                title="${escapeHtml(
                    performance.label
                )}"
                aria-label="${escapeHtml(
                    performance.label
                )}"
            >

                ${
                    performance.className ===
                    "unanswered"
                        ? `
                            <span
                                class="performance-dot"
                            ></span>
                        `
                        : ""
                }

            </div>

        </div>


        <button
            type="button"
            class="practice-button"
            data-question-id="${escapeHtml(
                question.id
            )}"
        >
            Practice
        </button>

    `;


    const practiceButton =
        card.querySelector(
            ".practice-button"
        );


    if (practiceButton) {

        practiceButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    `/question?id=${
                        encodeURIComponent(
                            question.id
                        )
                    }`;

            }
        );

    }


    return card;
}


// ============================================================
// LOADING STATE
// ============================================================

function showLoading() {

    questionList.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            Loading question bank...

        </div>

    `;
}


// ============================================================
// EMPTY STATE
// ============================================================

function showEmptyState() {

    questionList.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M6 3h12v18H6z"></path>
                    <path d="M9 7h6"></path>
                    <path d="M9 11h6"></path>
                    <path d="M9 15h4"></path>
                </svg>

            </div>


            <h2>
                No questions found
            </h2>


            <p>
                Try changing your filters or search.
            </p>

        </div>

    `;
}


// ============================================================
// ERROR STATE
// ============================================================

function showError(message) {

    questionList.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">

                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >

                    <path d="M12 3v10"></path>

                    <path d="M12 17v1"></path>

                    <circle
                        cx="12"
                        cy="12"
                        r="9"
                    ></circle>

                </svg>

            </div>


            <h2>
                Something went wrong
            </h2>


            <p>
                ${escapeHtml(message)}
            </p>

        </div>

    `;
}


// ============================================================
// SEARCH
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


// ============================================================
// TOPIC FILTER
// ============================================================

if (topicFilter) {

    topicFilter.addEventListener(
        "change",
        event => {

            activeTopic =
                event.target.value;

            renderQuestions();

        }
    );

}


// ============================================================
// DIFFICULTY FILTER
// ============================================================

if (difficultyFilter) {

    difficultyFilter.addEventListener(
        "change",
        event => {

            activeDifficulty =
                event.target.value;

            renderQuestions();

        }
    );

}


// ============================================================
// STATUS FILTER
// ============================================================

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        event => {

            activeStatus =
                event.target.value;

            renderQuestions();

        }
    );

}


// ============================================================
// REVIEW FILTER
// ============================================================

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


// ============================================================
// SECTION TABS
// ============================================================

sectionTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                sectionTabs.forEach(
                    otherTab =>
                        otherTab.classList.remove(
                            "active"
                        )
                );


                tab.classList.add(
                    "active"
                );


                activeSection =
                    tab.dataset.section ||
                    "all";


                /*
                 * When switching between
                 * Reading & Writing and Math,
                 * reset the topic filter so the
                 * user doesn't accidentally keep
                 * a topic from the other section.
                 */

                activeTopic = "all";


                if (topicFilter) {

                    topicFilter.value =
                        "all";

                }


                renderQuestions();

            }
        );

    }
);


// ============================================================
// AUTH STATE
// ============================================================

questionBankSupabase.auth.onAuthStateChange(
    async () => {

        await loadUserData();

        renderQuestions();

    }
);


// ============================================================
// INITIAL LOAD — REQUIRE AUTHENTICATION FIRST
// ============================================================

async function initializeQuestionBank() {

    const {
        data: { session },
        error
    } = await questionBankSupabase.auth.getSession();

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
