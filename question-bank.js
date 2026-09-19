
const questionBankSupabase = supabaseClient;

let allQuestions = [];
let activeSection = "Reading & Writing";
let activeSearch = "";
let activeDomain = [];
let activeSubtopic = [];
let activeDifficulty = [];
let activeStatus = [];
let reviewOnly = false;

let userAttempts = [];
let userReviews = [];
let localReviewOverrides = {};

const questionList = document.getElementById("question-list");
const questionCount = document.getElementById("question-count");
const resultsDescription = document.getElementById("results-description");
const searchInput = document.getElementById("question-search");
const topicFilter = document.getElementById("topic-filter");
const difficultyFilter = document.getElementById("difficulty-filter");
const statusFilter = document.getElementById("status-filter");
const reviewOnlyCheckbox = document.getElementById("review-only");
const sectionTabs = document.querySelectorAll(".section-tab");
let subtopicFilter = null;

const SAT_FILTER_TAXONOMY = {
    "Reading & Writing": {
        "Information and Ideas": [
            "Central Ideas and Details",
            "Command of Evidence",
            "Inferences"
        ],
        "Craft and Structure": [
            "Words in Context",
            "Text Structure and Purpose",
            "Cross-Text Connections"
        ],
        "Expression of Ideas": [
            "Rhetorical Synthesis",
            "Transitions"
        ],
        "Standard English Conventions": [
            "Boundaries",
            "Form, Structure, and Sense"
        ]
    },
    "Math": {
        "Algebra": [
            "Linear equations in one variable",
            "Linear functions",
            "Linear equations in two variables",
            "Systems of two linear equations in two variables",
            "Linear inequalities in one or two variables"
        ],
        "Advanced Math": [
            "Nonlinear functions",
            "Nonlinear equations in one variable",
            "Systems of equations in two variables",
            "Equivalent expressions"
        ],
        "Problem-Solving and Data Analysis": [
            "Ratios, rates, proportional relationships, and units",
            "Percentages",
            "One-variable data: distributions and measures of center and spread",
            "Two-variable data: models and scatterplots",
            "Probability and conditional probability",
            "Inference from sample statistics and margin of error",
            "Evaluating statistical claims: observational studies and experiments"
        ],
        "Geometry and Trigonometry": [
            "Area and volume",
            "Lines, angles, and triangles",
            "Right triangles and trigonometry",
            "Circles"
        ]
    }
};

function escapeHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function ensureDomainSubtopicFilters() {
    const existingGroup = topicFilter?.closest(".filter-group");

    if (!existingGroup || subtopicFilter) {
        return;
    }

    const label = existingGroup.querySelector("label");

    if (label) {
        label.textContent = "Domain";
    }

    topicFilter.dataset.filter = "domain";

    const subtopicGroup = document.createElement("div");
    subtopicGroup.className = "filter-group";
    subtopicGroup.innerHTML = `
        <label for="subtopic-filter">Subtopic</label>
        <div class="filter-dropdown" id="subtopic-filter" data-filter="subtopic" data-value="all">
            <button type="button" class="filter-dropdown-trigger" aria-haspopup="listbox" aria-expanded="false">
                <span class="filter-dropdown-value">All Subtopics</span>
                <span class="filter-dropdown-chevron" aria-hidden="true">⌄</span>
            </button>
            <div class="filter-dropdown-menu" role="listbox"></div>
        </div>
    `;

    existingGroup.parentElement.insertBefore(
        subtopicGroup,
        difficultyFilter.closest(".filter-group")
    );

    subtopicFilter = document.getElementById("subtopic-filter");

    const style = document.createElement("style");
    style.textContent = `
        .filters-row {
            grid-template-columns:
                minmax(0, 1.4fr)
                minmax(0, 1.4fr)
                minmax(180px, 1fr)
                minmax(180px, 1fr) !important;
        }

        @media (max-width: 1000px) {
            .filters-row {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }
        }

        @media (max-width: 700px) {
            .filters-row {
                grid-template-columns: 1fr !important;
            }
        }
    `;

    document.head.appendChild(style);
}

ensureDomainSubtopicFilters();

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

function getLocalStatusStorageKey(userId) {
    return "absoluteprep-question-status:" + userId;
}

function getLocalReviewStorageKey(userId) {
    return "absoluteprep-question-reviews:" + userId;
}

function getPracticeResetKey(userId) {
    return "absoluteprep-practice-reset:" + userId;
}

function getPracticeResetAt(userId) {
    return localStorage.getItem(
        getPracticeResetKey(userId)
    );
}

function loadLocalQuestionAttempts(userId) {
    try {
        const stored =
            JSON.parse(
                localStorage.getItem(
                    getLocalStatusStorageKey(userId)
                ) || "{}"
            );

        return Object.entries(stored)
            .map(([questionId, state]) => ({
                user_id: userId,
                question_id: questionId,
                is_correct: Boolean(state?.is_correct),
                created_at:
                    state?.updated_at ||
                    state?.created_at ||
                    new Date(0).toISOString()
            }));
    } catch (error) {
        console.warn(
            "Could not load local question status:",
            error
        );
        return [];
    }
}

function saveLocalQuestionStatus(
    userId,
    questionId,
    isCorrect
) {
    try {
        const key =
            getLocalStatusStorageKey(userId);

        const stored =
            JSON.parse(
                localStorage.getItem(key) || "{}"
            );

        stored[String(questionId)] = {
            is_correct: Boolean(isCorrect),
            updated_at:
                new Date().toISOString()
        };

        localStorage.setItem(
            key,
            JSON.stringify(stored)
        );
    } catch (error) {
        console.warn(
            "Could not save local question status:",
            error
        );
    }
}

function getLocalReviewOverrides(
    userId
) {
    try {
        const stored =
            JSON.parse(
                localStorage.getItem(
                    getLocalReviewStorageKey(userId)
                ) || "{}"
            );

        if (Array.isArray(stored)) {
            const overrides = {};

            stored.forEach(
                questionId => {
                    overrides[
                        String(questionId)
                    ] = true;
                }
            );

            return overrides;
        }

        return (
            stored &&
            typeof stored === "object"
        )
            ? stored
            : {};
    } catch (error) {
        console.warn(
            "Could not load local review state:",
            error
        );

        return {};
    }
}

function saveLocalReviewOverrides(
    userId,
    overrides
) {
    try {
        localStorage.setItem(
            getLocalReviewStorageKey(userId),
            JSON.stringify(
                overrides || {}
            )
        );
    } catch (error) {
        console.warn(
            "Could not save local review state:",
            error
        );
    }
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
    const key =
        String(questionId);

    if (
        Object.prototype.hasOwnProperty.call(
            localReviewOverrides,
            key
        )
    ) {
        return Boolean(
            localReviewOverrides[key]
        );
    }

    return userReviews.some(
        review =>
            String(review.question_id) ===
            key
    );
}

async function loadUserData() {
    const user =
        await getCurrentUser();

    if (!user) {
        userAttempts = [];
        userReviews = [];
        localReviewOverrides = {};
        return;
    }

    const localAttempts =
        loadLocalQuestionAttempts(
            user.id
        );

    localReviewOverrides =
        getLocalReviewOverrides(
            user.id
        );

    const resetAt =
        getPracticeResetAt(
            user.id
        );

    const resetTime =
        resetAt
            ? new Date(
                resetAt
            ).getTime()
            : null;

    const attemptsResult =
        await questionBankSupabase
            .from("question_attempts")
            .select("*")
            .eq(
                "user_id",
                user.id
            );

    const serverAttempts =
        (
            attemptsResult.error
                ? []
                : (
                    attemptsResult.data ||
                    []
                )
        ).filter(
            attempt => {
                if (!resetTime) {
                    return true;
                }

                const createdTime =
                    new Date(
                        attempt.created_at || 0
                    ).getTime();

                return (
                    Number.isFinite(
                        createdTime
                    ) &&
                    createdTime >
                        resetTime
                );
            }
        );

    if (attemptsResult.error) {
        console.warn(
            "Could not load question attempts; keeping local status:",
            attemptsResult.error
        );
    }

    userAttempts = [
        ...serverAttempts,
        ...localAttempts
    ];

    const reviewsResult =
        await questionBankSupabase
            .from("question_reviews")
            .select(
                "question_id, created_at"
            )
            .eq(
                "user_id",
                user.id
            );

    const serverReviews =
        (
            reviewsResult.error
                ? []
                : (
                    reviewsResult.data ||
                    []
                )
        ).filter(
            review => {
                if (!resetTime) {
                    return true;
                }

                const createdTime =
                    new Date(
                        review.created_at || 0
                    ).getTime();

                return (
                    Number.isFinite(
                        createdTime
                    ) &&
                    createdTime >
                        resetTime
                );
            }
        );

    if (reviewsResult.error) {
        console.warn(
            "Could not load question reviews; keeping local review state:",
            reviewsResult.error
        );
    }

    const reviewMap =
        new Map();

    serverReviews.forEach(
        review => {
            reviewMap.set(
                String(
                    review.question_id
                ),
                review
            );
        }
    );

    /*
     * Local review overrides always win over server state.
     */
    Object.entries(
        localReviewOverrides
    ).forEach(
        ([questionId, marked]) => {
            if (marked) {
                reviewMap.set(
                    questionId,
                    {
                        user_id:
                            user.id,
                        question_id:
                            questionId
                    }
                );
            } else {
                reviewMap.delete(
                    questionId
                );
            }
        }
    );

    userReviews =
        [...reviewMap.values()];
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

    populateDomainFilter();
    populateSubtopicFilter();

    await loadUserData();

    renderQuestions();
}


function getDropdownValues(dropdown) {
    if (!dropdown) return [];

    try {
        const parsed = JSON.parse(
            dropdown.dataset.values || "[]"
        );

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch {
        return [];
    }
}

function setDropdownSelections(
    dropdown,
    values,
    options
) {
    if (!dropdown) return;

    const selectedValues = Array.isArray(values)
        ? values.filter(value => value !== "all")
        : [];

    dropdown.dataset.values = JSON.stringify(
        selectedValues
    );

    const valueElement =
        dropdown.querySelector(
            ".filter-dropdown-value"
        );

    const allOption =
        options.find(
            option => option.value === "all"
        );

    if (valueElement) {
        if (selectedValues.length === 0) {
            valueElement.textContent =
                allOption?.label || "All";
        } else {
            const labels = selectedValues
                .map(value => {
                    const match = options.find(
                        option =>
                            String(option.value) ===
                            String(value)
                    );

                    return match?.label || value;
                });

            if (labels.length <= 2) {
                valueElement.textContent =
                    labels.join(", ");
            } else {
                valueElement.textContent =
                    labels[0] + ", ...";
            }
        }
    }

    dropdown
        .querySelectorAll(
            ".filter-dropdown-option"
        )
        .forEach(option => {
            const value =
                option.dataset.value || "all";

            const active =
                value === "all"
                    ? selectedValues.length === 0
                    : selectedValues.includes(value);

            option.classList.toggle(
                "active",
                active
            );

            option.setAttribute(
                "aria-selected",
                active
                    ? "true"
                    : "false"
            );
        });
}

function closeAllDropdowns(
    except = null
) {
    document
        .querySelectorAll(
            ".filter-dropdown.open"
        )
        .forEach(dropdown => {
            if (dropdown !== except) {
                dropdown.classList.remove(
                    "open"
                );

                dropdown
                    .querySelector(
                        ".filter-dropdown-trigger"
                    )
                    ?.setAttribute(
                        "aria-expanded",
                        "false"
                    );
            }
        });
}

function setupFilterDropdown(
    dropdown,
    onChange
) {
    if (!dropdown) return;

    const trigger =
        dropdown.querySelector(
            ".filter-dropdown-trigger"
        );

    const menu =
        dropdown.querySelector(
            ".filter-dropdown-menu"
        );

    if (!trigger || !menu) return;

    trigger.addEventListener(
        "click",
        event => {
            event.stopPropagation();

            const open =
                !dropdown.classList.contains(
                    "open"
                );

            closeAllDropdowns(
                dropdown
            );

            dropdown.classList.toggle(
                "open",
                open
            );

            trigger.setAttribute(
                "aria-expanded",
                open
                    ? "true"
                    : "false"
            );
        }
    );

    menu.addEventListener(
        "click",
        event => {
            const option =
                event.target.closest(
                    ".filter-dropdown-option"
                );

            if (!option) return;

            event.stopPropagation();

            const value =
                option.dataset.value || "all";

            const currentValues =
                getDropdownValues(
                    dropdown
                );

            let nextValues = [
                ...currentValues
            ];

            if (value === "all") {
                nextValues = [];
            } else if (
                nextValues.includes(value)
            ) {
                nextValues =
                    nextValues.filter(
                        selected =>
                            selected !== value
                    );
            } else {
                nextValues.push(value);
            }

            const options = [
                ...menu.querySelectorAll(
                    ".filter-dropdown-option"
                )
            ].map(option => ({
                value:
                    option.dataset.value ||
                    "all",
                label:
                    option.textContent.trim()
            }));

            setDropdownSelections(
                dropdown,
                nextValues,
                options
            );

            onChange(nextValues);

            // Keep the menu open so multiple values
            // can be selected in one pass.
        }
    );

    dropdown.addEventListener(
        "keydown",
        event => {
            if (event.key === "Escape") {
                dropdown.classList.remove(
                    "open"
                );

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );

                trigger.focus();
            }
        }
    );
}

function setDropdownOptions(
    dropdown,
    options,
    selectedValues = []
) {
    if (!dropdown) return;

    const menu =
        dropdown.querySelector(
            ".filter-dropdown-menu"
        );

    if (!menu) return;

    menu.innerHTML =
        options
            .map(option => `
                <button
                    type="button"
                    class="filter-dropdown-option"
                    role="option"
                    data-value="${escapeHtml(option.value)}"
                    aria-selected="false"
                >
                    <span class="filter-option-check" aria-hidden="true"></span>
                    <span>${escapeHtml(option.label)}</span>
                </button>
            `)
            .join("");

    setDropdownSelections(
        dropdown,
        selectedValues,
        options
    );
}



function getDomainsForSection() {
    return (
        SAT_FILTER_TAXONOMY[activeSection] ||
        {}
    );
}

function populateDomainFilter() {
    if (!topicFilter) return;

    const domains =
        getDomainsForSection();

    const options = [
        {
            value: "all",
            label: "All Domains"
        },
        ...Object.keys(domains).map(domain => ({
            value: domain,
            label: domain
        }))
    ];

    const validValues =
        activeDomain.filter(
            value =>
                Object.prototype.hasOwnProperty.call(
                    domains,
                    value
                )
        );

    activeDomain = validValues;

    setDropdownOptions(
        topicFilter,
        options,
        activeDomain
    );
}

function populateSubtopicFilter() {
    if (!subtopicFilter) return;

    const domains =
        getDomainsForSection();

    let subtopics = [];

    if (activeDomain.length === 0) {
        subtopics =
            Object.values(domains).flat();
    } else {
        activeDomain.forEach(
            domain => {
                if (domains[domain]) {
                    subtopics.push(
                        ...domains[domain]
                    );
                }
            }
        );
    }

    const uniqueSubtopics =
        [...new Set(subtopics)];

    const validValues =
        activeSubtopic.filter(
            value =>
                uniqueSubtopics.includes(
                    value
                )
        );

    activeSubtopic =
        validValues;

    const options = [
        {
            value: "all",
            label: "All Subtopics"
        },
        ...uniqueSubtopics.map(subtopic => ({
            value: subtopic,
            label: subtopic
        }))
    ];

    setDropdownOptions(
        subtopicFilter,
        options,
        activeSubtopic
    );
}




function getFilteredQuestions() {
    let questions =
        [...allQuestions];

    if (activeSection) {
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
                        .includes(search)
            );
    }

    if (activeDomain.length > 0) {
        questions =
            questions.filter(
                question =>
                    activeDomain.includes(
                        question.domain
                    )
            );
    }

    if (activeSubtopic.length > 0) {
        questions =
            questions.filter(
                question =>
                    activeSubtopic.includes(
                        question.topic
                    )
            );
    }

    if (activeDifficulty.length > 0) {
        questions =
            questions.filter(
                question =>
                    activeDifficulty.includes(
                        question.difficulty
                    )
            );
    }

    if (activeStatus.length > 0) {
        questions =
            questions.filter(
                question => {
                    const status =
                        getQuestionStatus(
                            question.id
                        );

                    return activeStatus.some(
                        selectedStatus => {
                            if (
                                selectedStatus ===
                                "solved"
                            ) {
                                return (
                                    status !==
                                    "unanswered"
                                );
                            }

                            if (
                                selectedStatus ===
                                "correct"
                            ) {
                                return (
                                    status ===
                                    "correct"
                                );
                            }

                            if (
                                selectedStatus ===
                                "incorrect"
                            ) {
                                return (
                                    status ===
                                    "incorrect"
                                );
                            }

                            if (
                                selectedStatus ===
                                "unanswered"
                            ) {
                                return (
                                    status ===
                                    "unanswered"
                                );
                            }

                            return false;
                        }
                    );
                }
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
                ? "Solved — correct"
                : status === "incorrect"
                    ? "Solved — incorrect"
                    : "Unsolved") +
        '"></span>';

    button.addEventListener(
        "click",
        () => {
            const filteredQuestions =
                getFilteredQuestions();

            try {
                sessionStorage.setItem(
                    "absoluteprep-question-bank-navigation",
                    JSON.stringify({
                        questionIds:
                            filteredQuestions.map(
                                filteredQuestion =>
                                    String(
                                        filteredQuestion.id
                                    )
                            ),
                        currentQuestionId:
                            String(question.id)
                    })
                );
            } catch (error) {
                console.warn(
                    "Could not save Question Bank navigation state:",
                    error
                );
            }

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

    reviewButton.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5z"></path>' +
        '</svg>';

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

    const nextMarked =
        !currentlyMarked;

    /*
     * Persist the desired state locally before touching Supabase.
     * This makes review toggling instant and prevents a failed
     * server DELETE/INSERT from flashing back to the old state.
     */
    localReviewOverrides[
        String(questionId)
    ] =
        nextMarked;

    saveLocalReviewOverrides(
        user.id,
        localReviewOverrides
    );

    if (nextMarked) {
        userReviews = [
            ...userReviews.filter(
                review =>
                    String(
                        review.question_id
                    ) !==
                    String(questionId)
            ),
            {
                user_id:
                    user.id,
                question_id:
                    questionId
            }
        ];
    } else {
        userReviews =
            userReviews.filter(
                review =>
                    String(
                        review.question_id
                    ) !==
                    String(questionId)
            );
    }

    renderQuestions();

    try {
        if (nextMarked) {
            /*
             * Insert only. The local override is authoritative
             * if the table policy rejects the write.
             */
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

            if (insertResult.error) {
                console.warn(
                    "Could not save review to Supabase; keeping local review state:",
                    insertResult.error
                );
            }
        } else {
            const deleteResult =
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

            if (deleteResult.error) {
                console.warn(
                    "Could not remove review from Supabase; keeping local review state:",
                    deleteResult.error
                );
            }
        }
    } catch (error) {
        console.warn(
            "Review sync failed; keeping local review state:",
            error
        );
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
        allQuestions.filter(
            question =>
                question.section ===
                activeSection
        ).length &&
        !activeSearch &&
        activeDomain.length === 0 &&
        activeSubtopic.length === 0 &&
        activeDifficulty.length === 0 &&
        activeStatus.length === 0 &&
        !reviewOnly
            ? "in this section"
            : "matching your filters";

    if (questions.length === 0) {
        showEmptyState();
        return;
    }

    questionList.innerHTML = "";

    const difficultyOrder = {
        Easy: 0,
        Medium: 1,
        Hard: 2
    };

    [...questions]
        .sort(
            (a, b) => {
                const numberDifference =
                    Number(
                        a.question_number
                    ) -
                    Number(
                        b.question_number
                    );

                if (
                    numberDifference !== 0
                ) {
                    return numberDifference;
                }

                return (
                    difficultyOrder[
                        a.difficulty
                    ] -
                    difficultyOrder[
                        b.difficulty
                    ]
                );
            }
        )
        .forEach(
            question => {
                questionList.appendChild(
                    createQuestionIcon(
                        question
                    )
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

setupFilterDropdown(
    topicFilter,
    values => {
        activeDomain = values;
        activeSubtopic = [];
        populateDomainFilter();
        populateSubtopicFilter();
        renderQuestions();
    }
);

setupFilterDropdown(
    subtopicFilter,
    values => {
        activeSubtopic = values;
        renderQuestions();
    }
);

setupFilterDropdown(
    difficultyFilter,
    values => {
        activeDifficulty = values;
        renderQuestions();
    }
);

setupFilterDropdown(
    statusFilter,
    values => {
        activeStatus = values;
        renderQuestions();
    }
);

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
                    "Reading & Writing";

                activeDomain = [];
                activeSubtopic = [];
                activeDifficulty = [];
                activeStatus = [];

                populateDomainFilter();
                populateSubtopicFilter();

                renderQuestions();
            }
        );
    }
);

document.addEventListener(
    "click",
    event => {
        if (
            !event.target.closest(
                ".filter-dropdown"
            )
        ) {
            closeAllDropdowns();
        }
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

window.addEventListener(
    "pageshow",
    async () => {
        await loadUserData();
        renderQuestions();
    }
);

initializeQuestionBank();
