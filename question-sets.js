const ABSOLUTESAT_SUPABASE_URL =
    "https://ikvvixdyztyqqxkveois.supabase.co";

const ABSOLUTESAT_SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";

const questionBankSupabase =
    window.supabase.createClient(
        ABSOLUTESAT_SUPABASE_URL,
        ABSOLUTESAT_SUPABASE_PUBLISHABLE_KEY
    );


let allQuestions = [];

let activeSection = "all";
let activeSearch = "";
let activeTopic = "all";
let activeDifficulty = "all";
let activeStatus = "all";
let reviewOnly = false;
let activeSort = "newest";

let userAttempts = [];
let userReviews = [];


/* ============================================
   ELEMENTS
============================================ */

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

const sortFilter =
    document.getElementById("sort-filter");

const sectionTabs =
    document.querySelectorAll(".section-tab");


/* ============================================
   HELPERS
============================================ */

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


function getCurrentUser() {

    return questionBankSupabase.auth
        .getSession()
        .then(({ data }) => {
            return data?.session?.user || null;
        });
}


function getAttemptsForQuestion(questionId) {

    return userAttempts.filter(
        attempt =>
            String(attempt.question_id) ===
            String(questionId)
    );
}


function getQuestionPerformance(questionId) {

    const attempts =
        getAttemptsForQuestion(questionId);

    if (attempts.length === 0) {
        return {
            className: "unanswered",
            label: "Not answered yet"
        };
    }

    const sorted =
        [...attempts].sort(
            (a, b) =>
                new Date(a.created_at) -
                new Date(b.created_at)
        );

    const firstCorrectIndex =
        sorted.findIndex(
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
            label:
                "Correct after multiple attempts"
        };

    }

    return {
        className: "later-correct",
        label: "Answered incorrectly"
    };
}


function isQuestionMarkedForReview(questionId) {

    return userReviews.some(
        review =>
            String(review.question_id) ===
            String(questionId)
    );
}


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


/* ============================================
   LOAD QUESTIONS
============================================ */

async function loadQuestions() {

    showLoading();

    const {
        data,
        error
    } = await questionBankSupabase
        .from("questions")
        .select("*")
        .order("created_at", {
            ascending: false
        });

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

    allQuestions = data || [];

    populateTopicFilter();

    await loadUserData();

    renderQuestions();
}


/* ============================================
   LOAD USER DATA
============================================ */

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
            .eq("user_id", user.id);


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
            .eq("user_id", user.id);


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


/* ============================================
   TOPIC FILTER
============================================ */

function populateTopicFilter() {

    if (!topicFilter) {
        return;
    }

    const topics =
        [...new Set(
            allQuestions
                .map(question => question.topic)
                .filter(Boolean)
        )]
        .sort((a, b) =>
            a.localeCompare(b)
        );


    topicFilter.innerHTML = `
        <option value="all">
            All Topics
        </option>
    `;


    topics.forEach(topic => {

        const option =
            document.createElement("option");

        option.value = topic;
        option.textContent = topic;

        topicFilter.appendChild(option);

    });

}


/* ============================================
   FILTER QUESTIONS
============================================ */

function getFilteredQuestions() {

    let questions =
        [...allQuestions];


    if (activeSection !== "all") {

        questions =
            questions.filter(
                question =>
                    question.section ===
                    activeSection
            );

    }


    if (activeSearch) {

        const search =
            activeSearch.toLowerCase();

        questions =
            questions.filter(question => {

                const searchableText = [

                    question.question_text,
                    question.topic,
                    question.difficulty

                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

                return searchableText.includes(search);

            });

    }


    if (activeTopic !== "all") {

        questions =
            questions.filter(
                question =>
                    question.topic ===
                    activeTopic
            );

    }


    if (activeDifficulty !== "all") {

        questions =
            questions.filter(
                question =>
                    question.difficulty ===
                    activeDifficulty
            );

    }


    if (activeStatus !== "all") {

        questions =
            questions.filter(
                question =>
                    getQuestionStatus(
                        question.id
                    ) === activeStatus
            );

    }


    if (reviewOnly) {

        questions =
            questions.filter(
                question =>
                    isQuestionMarkedForReview(
                        question.id
                    )
            );

    }


    questions.sort(
        (a, b) => {

            if (activeSort === "oldest") {

                return new Date(a.created_at) -
                    new Date(b.created_at);

            }


            if (activeSort === "difficulty") {

                const order = {
                    Easy: 1,
                    Medium: 2,
                    Hard: 3,
                    Mixed: 4
                };

                return (
                    (order[a.difficulty] || 99) -
                    (order[b.difficulty] || 99)
                );

            }


            if (activeSort === "topic") {

                return String(a.topic || "")
                    .localeCompare(
                        String(b.topic || "")
                    );

            }


            return new Date(b.created_at) -
                new Date(a.created_at);

        }
    );


    return questions;
}


/* ============================================
   RENDER QUESTIONS
============================================ */

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
            questions.length === allQuestions.length
                ? "in your question bank"
                : "matching your filters";

    }


    if (questions.length === 0) {

        showEmptyState();

        return;
    }


    if (emptyState) {
        emptyState.remove();
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


/* ============================================
   CREATE QUESTION CARD
============================================ */

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
            "Mixed"
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

                <span class="
                    question-meta-tag
                    difficulty-${escapeHtml(
                        difficultyClass
                    )}
                ">
                    ${escapeHtml(difficulty)}
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


/* ============================================
   UI STATES
============================================ */

function showLoading() {

    questionList.innerHTML = `

        <div class="loading-state">

            <div class="loading-spinner"></div>

            Loading question bank...

        </div>

    `;

}


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


/* ============================================
   EVENT LISTENERS
============================================ */

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

            activeTopic =
                event.target.value;

            renderQuestions();

        }
    );

}


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


if (sortFilter) {

    sortFilter.addEventListener(
        "change",
        event => {

            activeSort =
                event.target.value;

            renderQuestions();

        }
    );

}


sectionTabs.forEach(tab => {

    tab.addEventListener(
        "click",
        () => {

            sectionTabs.forEach(
                otherTab =>
                    otherTab.classList.remove(
                        "active"
                    )
            );


            tab.classList.add("active");


            activeSection =
                tab.dataset.section ||
                "all";


            renderQuestions();

        }
    );

});


/* ============================================
   AUTH CHANGES
============================================ */

questionBankSupabase.auth.onAuthStateChange(
    async () => {

        await loadUserData();

        renderQuestions();

    }
);


/* ============================================
   START
============================================ */

loadQuestions();
