
const questionBankSupabase = supabaseClient;

let allQuestions = [];
let activeSection = "all";
let activeSearch = "";
let activeTopic = "all";
let activeDifficulty = "all";
let activeStatus = "all";
let reviewOnly = false;

let userAttempts = [];
let userReviews = [];

const questionList = document.getElementById("question-list");
const questionCount = document.getElementById("question-count");
const resultsDescription = document.getElementById("results-description");
const searchInput = document.getElementById("question-search");
const topicFilter = document.getElementById("topic-filter");
const difficultyFilter = document.getElementById("difficulty-filter");
const statusFilter = document.getElementById("status-filter");
const reviewOnlyCheckbox = document.getElementById("review-only");
const sectionTabs = document.querySelectorAll(".section-tab");

function escapeHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizeDifficulty(value) {
    const text = String(value || "medium").toLowerCase();

    if (text === "easy") return "Easy";
    if (text === "hard") return "Hard";
    return "Medium";
}

function normalizeQuestion(question) {
    return {
        id: question.id,
        groupId:
            question.groupId ||
            question.group_id ||
            question.id,
        question_number: null,
        question_text:
            question.question ||
            question.question_text ||
            "",
        choice_a:
            question.choices?.A ||
            question.choice_a ||
            "",
        choice_b:
            question.choices?.B ||
            question.choice_b ||
            "",
        choice_c:
            question.choices?.C ||
            question.choice_c ||
            "",
        choice_d:
            question.choices?.D ||
            question.choice_d ||
            "",
        correct_answer:
            question.correctAnswer ||
            question.correct_answer ||
            "",
        explanation:
            question.explanation ||
            "",
        difficulty:
            normalizeDifficulty(
                question.difficulty
            ),
        topic:
            question.skill ||
            question.topic ||
            "SAT Practice",
        section:
            question.section ||
            "SAT",
        domain:
            question.domain ||
            "",
        passage:
            question.passage ||
            ""
    };
}

function assignQuestionNumbers(questions) {
    const groupNumbers = new Map();
    let nextNumber = 1;

    questions.forEach(question => {
        const groupId = String(question.groupId);

        if (!groupNumbers.has(groupId)) {
            groupNumbers.set(
                groupId,
                nextNumber
            );

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
            groupNumbers.get(
                String(question.groupId)
            );
    });

    questions.sort((a, b) => {
        const groupA =
            groupNumbers.get(
                String(a.groupId)
            ) || 999999;

        const groupB =
            groupNumbers.get(
                String(b.groupId)
            ) || 999999;

        if (groupA !== groupB) {
            return groupA - groupB;
        }

        return (
            difficultyOrder[a.difficulty] -
            difficultyOrder[b.difficulty]
        );
    });

    return questions;
}

async function getCurrentUser() {
    const { data, error } =
        await questionBankSupabase.auth.getSession();

    if (error) {
        console.error(
            "Could not get current user:",
            error
        );

        return null;
    }

    return data?.session?.user || null;
}

function getAttemptsForQuestion(questionId) {
    return userAttempts.filter(
        attempt =>
            String(attempt.question_id) ===
            String(questionId)
    );
}

function getQuestionStatus(questionId) {
    const attempts =
        getAttemptsForQuestion(
            questionId
        );

    if (attempts.length === 0) {
        return "unanswered";
    }

    const latest =
        [...attempts].sort(
            (a, b) =>
                new Date(b.created_at || 0) -
                new Date(a.created_at || 0)
        )[0];

    return latest.is_correct
        ? "correct"
        : "incorrect";
}

function isQuestionMarkedForReview(
    questionId
) {
    return userReviews.some(
        review =>
            String(review.question_id) ===
            String(questionId)
    );
}

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
        console.warn(
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
        console.warn(
            "Could not load question reviews:",
            reviewsResult.error
        );

        userReviews = [];
    } else {
        userReviews =
            reviewsResult.data || [];
    }
}

const FALLBACK_QUESTIONS = [
    {
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
    },
    {
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
    },
    {
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
    }
];

async function loadQuestions() {
    showLoading();

    let stagedQuestions = [];

    try {
        const response =
            await fetch(
                "/question-bank.json?v=3",
                { cache: "no-store" }
            );

        if (!response.ok) {
            throw new Error(
                "Question bank returned " +
                response.status
            );
        }

        const data =
            await response.json();

        stagedQuestions =
            (data.questions || [])
                .filter(
                    question =>
                        question.status ===
                        "staged"
                )
                .map(
                    normalizeQuestion
                );
    } catch (error) {
        console.warn(
            "Could not load question-bank.json. Using fallback:",
            error
        );
    }

    if (
        stagedQuestions.length === 0
    ) {
        stagedQuestions =
            FALLBACK_QUESTIONS.map(
                normalizeQuestion
            );
    }

    allQuestions =
        assignQuestionNumbers(
            stagedQuestions
        );

    populateTopicFilter();

    await loadUserData();

    renderQuestions();
}

function populateTopicFilter() {
    if (!topicFilter) return;

    const values =
        new Map();

    allQuestions.forEach(
        question => {
            if (question.domain) {
                values.set(
                    question.domain,
                    question.domain
                );
            }

            if (question.topic) {
                values.set(
                    question.topic,
                    question.topic
                );
            }
        }
    );

    topicFilter.innerHTML =
        '<option value="all">All Topics</option>';

    [...values.values()]
        .sort()
        .forEach(value => {
            const option =
                document.createElement(
                    "option"
                );

            option.value = value;
            option.textContent = value;

            topicFilter.appendChild(
                option
            );
        });
}

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
            questions.filter(
                question =>
                    [
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
                        .toLowerCase()
                        .includes(
                            search
                        )
            );
    }

    if (activeTopic !== "all") {
        questions =
            questions.filter(
                question =>
                    question.domain ===
                        activeTopic ||
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
                    ) ===
                    activeStatus
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

    return questions;
}

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

function createQuestionIcon(question) {
    const wrapper =
        document.createElement(
            "div"
        );

    wrapper.className =
        "question-icon-wrapper";

    const status =
        getQuestionStatus(
            question.id
        );

    const reviewed =
        isQuestionMarkedForReview(
            question.id
        );

    const button =
        document.createElement(
            "button"
        );

    button.type = "button";

    button.className =
        "question-icon " +
        "difficulty-" +
        question.difficulty.toLowerCase();

    button.setAttribute(
        "aria-label",
        "Question " +
        question.question_number +
        " " +
        question.difficulty
    );

    button.innerHTML =
        '<span class="question-icon-number">' +
            escapeHtml(
                question.question_number
            ) +
        '</span>' +

        '<span class="question-status-dot ' +
            status +
            '" title="' +
            (status === "correct"
                ? "Got right"
                : status === "incorrect"
                    ? "Got wrong"
                    : "Unanswered") +
        '"></span>';

    button.addEventListener(
        "click",
        () => {
            window.location.href =
                "/question?id=" +
                encodeURIComponent(
                    question.id
                );
        }
    );

    const reviewButton =
        document.createElement(
            "button"
        );

    reviewButton.type = "button";

    reviewButton.className =
        "question-review-icon" +
        (reviewed
            ? " active"
            : "");

    reviewButton.setAttribute(
        "aria-label",
        reviewed
            ? "Remove from review"
            : "Mark for review"
    );

    reviewButton.setAttribute(
        "title",
        reviewed
            ? "Remove from review"
            : "Mark for review"
    );

    reviewButton.textContent =
        reviewed
            ? "★"
            : "☆";

    reviewButton.addEventListener(
        "click",
        async event => {
            event.stopPropagation();

            await toggleQuestionReview(
                question.id
            );
        }
    );

    wrapper.appendChild(
        button
    );

    wrapper.appendChild(
        reviewButton
    );

    return wrapper;
}

async function toggleQuestionReview(
    questionId
) {
    const user =
        await getCurrentUser();

    if (!user) {
        window.location.href =
            "/login?redirect=" +
            encodeURIComponent(
                "/question-bank"
            );
        return;
    }

    const currentlyMarked =
        isQuestionMarkedForReview(
            questionId
        );

    const previousReviews =
        [...userReviews];

    if (currentlyMarked) {
        userReviews =
            userReviews.filter(
                review =>
                    !(
                        String(
                            review.question_id
                        ) ===
                        String(questionId)
                    )
            );
    } else {
        userReviews = [
            ...userReviews,
            {
                user_id: user.id,
                question_id: questionId
            }
        ];
    }

    renderQuestions();

    let error = null;

    try {
        if (currentlyMarked) {
            const result =
                await questionBankSupabase
                    .from(
                        "question_reviews"
                    )
                    .delete()
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "question_id",
                        questionId
                    );

            error =
                result.error || null;
        } else {
            const deleteExisting =
                await questionBankSupabase
                    .from(
                        "question_reviews"
                    )
                    .delete()
                    .eq(
                        "user_id",
                        user.id
                    )
                    .eq(
                        "question_id",
                        questionId
                    );

            if (!deleteExisting.error) {
                const insertResult =
                    await questionBankSupabase
                        .from(
                            "question_reviews"
                        )
                        .insert({
                            user_id:
                                user.id,
                            question_id:
                                questionId
                        });

                error =
                    insertResult.error ||
                    null;
            } else {
                error =
                    deleteExisting.error;
            }
        }
    } catch (requestError) {
        error = requestError;
    }

    if (error) {
        console.error(
            "Could not save review status:",
            error
        );

        userReviews =
            previousReviews;

        renderQuestions();
    }
}

function renderQuestions() {
    const questions =
        getFilteredQuestions();

    questionCount.textContent =
        questions.length +
        (
            questions.length === 1
                ? " question"
                : " questions"
        );

    resultsDescription.textContent =
        questions.length ===
        allQuestions.length
            ? "in your question bank"
            : "matching your filters";

    if (questions.length === 0) {
        showEmptyState();
        return;
    }

    questionList.innerHTML = "";

    const grouped =
        new Map();

    questions.forEach(
        question => {
            const number =
                question.question_number;

            if (!grouped.has(number)) {
                grouped.set(
                    number,
                    []
                );
            }

            grouped.get(number).push(
                question
            );
        }
    );

    [...grouped.entries()]
        .sort(
            (a, b) =>
                Number(a[0]) -
                Number(b[0])
        )
        .forEach(
            ([number, group]) => {
                const groupElement =
                    document.createElement(
                        "div"
                    );

                groupElement.className =
                    "question-group";

                group
                    .sort(
                        (a, b) => {
                            const order =
                                {
                                    Easy: 0,
                                    Medium: 1,
                                    Hard: 2
                                };

                            return (
                                order[
                                    a.difficulty
                                ] -
                                order[
                                    b.difficulty
                                ]
                            );
                        }
                    )
                    .forEach(
                        question => {
                            groupElement.appendChild(
                                createQuestionIcon(
                                    question
                                )
                            );
                        }
                    );

                questionList.appendChild(
                    groupElement
                );
            }
        );
}

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

questionBankSupabase.auth.onAuthStateChange(
    async () => {
        await loadUserData();
        renderQuestions();
    }
);

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
            encodeURIComponent(
                currentPath
            )
        );

        return;
    }

    await loadQuestions();
}

initializeQuestionBank();
