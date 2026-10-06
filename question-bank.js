
const questionBankSupabase = supabaseClient;

let allQuestions = [];
let activeSection =
    document.body?.dataset.questionSection ||
    "Reading & Writing";
let activeSearch = "";
let activeSkill = [];
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
const skillPicker = document.getElementById("skill-picker-options");
const difficultyFilter = document.getElementById("difficulty-filter");
const statusFilter = document.getElementById("status-filter");
const reviewOnlyCheckbox = document.getElementById("review-only");

const SAT_FILTER_TAXONOMY = {
    "Reading & Writing": {
        "Information & Ideas": [
            "Central Ideas & Details",
            "Inferences",
            "Textual Command of Evidence",
            "Qualitative Command of Evidence"
        ],
        "Craft & Structure": [
            "Words in Context",
            "Text Structure & Purpose",
            "Cross-Text Connections"
        ],
        "Expression of Ideas": [
            "Rhetorical Synthesis",
            "Transitions"
        ],
        "Standard English Conventions": [
            "Boundaries",
            "Form, Structure & Sense"
        ]
    },
    "Math": {
        "Algebra": [
            "Linear Equations",
            "Linear Functions",
            "Systems of Linear Equations",
            "Linear Inequalities",
            "Other Algebra"
        ],
        "Advanced Math": [
            "Quadratics",
            "Equivalent Expressions",
            "Polynomial Functions",
            "Exponential Functions",
            "Rational/Radical Equations",
            "Nonlinear Equations/Functions"
        ],
        "Problem-Solving & Data Analysis": [
            "Ratio, Rates, Percentages",
            "Statistics",
            "Probability"
        ],
        "Geometry & Trigonometry": [
            "Lines, Angles, and Triangles",
            "Area and Volume",
            "Circles",
            "Trigonometry"
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


const QUESTION_BANK_FILTER_STORAGE_KEY =
    "absoluteprep-question-bank-filters:v4:" +
    activeSection;

function saveQuestionBankFilters() {
    try {
        localStorage.setItem(
            QUESTION_BANK_FILTER_STORAGE_KEY,
            JSON.stringify({
                search: activeSearch,
                skill: activeSkill,
                difficulty: activeDifficulty,
                status: activeStatus,
                reviewOnly
            })
        );
    } catch (error) {
        console.warn(
            "Could not save Question Bank filters:",
            error
        );
    }
}

function loadQuestionBankFilters() {
    try {
        const stored = JSON.parse(
            localStorage.getItem(
                QUESTION_BANK_FILTER_STORAGE_KEY
            ) || "null"
        );

        if (!stored || typeof stored !== "object") {
            return;
        }

        activeSearch =
            typeof stored.search === "string"
                ? stored.search
                : "";

        activeSkill =
            Array.isArray(stored.skill)
                ? stored.skill
                : Array.isArray(stored.subtopic)
                    ? stored.subtopic
                    : [];

        activeDifficulty =
            Array.isArray(stored.difficulty)
                ? stored.difficulty
                : [];

        activeStatus =
            Array.isArray(stored.status)
                ? stored.status
                : [];

        reviewOnly =
            stored.reviewOnly === true;
    } catch (error) {
        console.warn(
            "Could not load Question Bank filters:",
            error
        );
    }
}

function syncQuestionBankFilterUI() {
    if (searchInput) {
        searchInput.value = activeSearch;
    }

    if (reviewOnlyCheckbox) {
        reviewOnlyCheckbox.checked =
            reviewOnly;
    }

    const syncDropdown = (
        dropdown,
        values
    ) => {
        if (!dropdown) return [];

        const options = [
            ...dropdown.querySelectorAll(
                ".filter-dropdown-option"
            )
        ].map(option => ({
            value:
                option.dataset.value ||
                "all",
            label:
                option.textContent.trim()
        }));

        const allowed =
            new Set(
                options
                    .map(option => option.value)
                    .filter(value => value !== "all")
            );

        const validValues =
            (Array.isArray(values) ? values : [])
                .filter(value =>
                    allowed.has(value)
                );

        setDropdownSelections(
            dropdown,
            validValues,
            options
        );

        return validValues;
    };

    activeDifficulty =
        syncDropdown(
            difficultyFilter,
            activeDifficulty
        );

    activeStatus =
        syncDropdown(
            statusFilter,
            activeStatus
        );

    renderSkillPicker();
}

loadQuestionBankFilters();

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
    const nextBySection = new Map();

    questions.forEach(question => {
        const section =
            String(question.section || "SAT");
        const groupId =
            section + "::" +
            String(question.groupId);

        if (!groupNumbers.has(groupId)) {
            const nextNumber =
                nextBySection.get(section) ||
                1;

            groupNumbers.set(
                groupId,
                nextNumber
            );

            nextBySection.set(
                section,
                nextNumber + 1
            );
        }
    });

    const difficultyOrder = {
        Easy: 0,
        Medium: 1,
        Hard: 2
    };

    questions.forEach(question => {
        const groupId =
            String(question.section || "SAT") +
            "::" +
            String(question.groupId);

        question.question_number =
            groupNumbers.get(groupId);
    });

    questions.sort((a, b) => {
        const sectionCompare =
            String(a.section).localeCompare(
                String(b.section)
            );

        if (sectionCompare !== 0) {
            return sectionCompare;
        }

        const groupA =
            groupNumbers.get(
                String(a.section || "SAT") +
                "::" +
                String(a.groupId)
            ) || 999999;

        const groupB =
            groupNumbers.get(
                String(b.section || "SAT") +
                "::" +
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

const FALLBACK_QUESTIONS = [];

async function loadQuestions() {
    showLoading();

    let stagedQuestions = [];

    try {
        const bankUrl =
            activeSection === "Math"
                ? "/math-question-bank.json?v=4"
                : "/question-bank.json?v=19";

        const response =
            await fetch(
                bankUrl,
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

    renderSkillPicker();

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



function getTaxonomyForSection() {
    return (
        SAT_FILTER_TAXONOMY[activeSection] ||
        {}
    );
}

function getSkillsForSection() {
    return [
        ...new Set(
            Object.values(
                getTaxonomyForSection()
            ).flat()
        )
    ];
}

function renderSkillPicker() {
    if (!skillPicker) return;

    const taxonomy =
        getTaxonomyForSection();

    const skills =
        getSkillsForSection();

    activeSkill =
        activeSkill.filter(
            skill =>
                skills.includes(skill)
        );

    const domains =
        Object.entries(taxonomy)
            .map(([domain, subtopics]) => {
                const selectedCount =
                    subtopics.filter(
                        subtopic =>
                            activeSkill.includes(
                                subtopic
                            )
                    ).length;

                const domainActive =
                    selectedCount ===
                    subtopics.length &&
                    subtopics.length > 0;

                const partial =
                    selectedCount > 0 &&
                    !domainActive;

                const subtopicButtons =
                    subtopics.map(subtopic => {
                        const active =
                            activeSkill.includes(
                                subtopic
                            );

                        return '<button type="button" class="subtopic-choice' +
                            (active ? ' active' : '') +
                            '" data-skill="' +
                            escapeHtml(subtopic) +
                            '" aria-pressed="' +
                            (active ? 'true' : 'false') +
                            '"><span class="subtopic-check" aria-hidden="true">✓</span><span>' +
                            escapeHtml(subtopic) +
                            '</span></button>';
                    }).join("");

                return '<section class="domain-skill-group' +
                    (partial ? ' partial' : '') +
                    (domainActive ? ' active' : '') +
                    '"><button type="button" class="domain-choice" data-domain="' +
                    escapeHtml(domain) +
                    '" aria-pressed="' +
                    (domainActive ? 'true' : 'false') +
                    '"><span class="domain-choice-kicker">DOMAIN</span><strong>' +
                    escapeHtml(domain) +
                    '</strong><small>' +
                    (selectedCount > 0
                        ? selectedCount + ' of ' + subtopics.length + ' selected'
                        : subtopics.length + ' skills') +
                    '</small><span class="domain-choice-mark" aria-hidden="true">✓</span></button><div class="subtopic-choice-grid">' +
                    subtopicButtons +
                    '</div></section>';
            }).join("");

    skillPicker.innerHTML =
        '<div class="domain-skill-list">' +
        domains +
        '</div>';
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

    if (activeSkill.length > 0) {
        questions =
            questions.filter(
                question =>
                    activeSkill.includes(
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
        '<p>Try choosing different skills, difficulty, status, or search terms.</p>' +
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
        activeSkill.length === 0 &&
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

    const groups = new Map();

    [...questions]
        .sort((a, b) => {
            const numberDifference =
                Number(a.question_number) -
                Number(b.question_number);

            if (numberDifference !== 0) {
                return numberDifference;
            }

            return (
                difficultyOrder[a.difficulty] -
                difficultyOrder[b.difficulty]
            );
        })
        .forEach(question => {
            const key = String(question.groupId);

            if (!groups.has(key)) {
                groups.set(key, []);
            }

            groups.get(key).push(question);
        });

    groups.forEach(groupQuestions => {
        const groupElement =
            document.createElement("div");

        groupElement.className =
            "question-group";

        groupQuestions
            .sort(
                (a, b) =>
                    difficultyOrder[a.difficulty] -
                    difficultyOrder[b.difficulty]
            )
            .forEach(question => {
                groupElement.appendChild(
                    createQuestionIcon(question)
                );
            });

        questionList.appendChild(
            groupElement
        );
    });
}

if (searchInput) {
    searchInput.addEventListener(
        "input",
        event => {
            activeSearch =
                event.target.value.trim();

            saveQuestionBankFilters();
            renderQuestions();
        }
    );
}

if (skillPicker) {
    skillPicker.addEventListener(
        "click",
        event => {
            const domainButton =
                event.target.closest(
                    "[data-domain]"
                );

            const skillButton =
                event.target.closest(
                    "[data-skill]"
                );

            if (
                !domainButton &&
                !skillButton
            ) return;

            if (domainButton) {
                const domain =
                    domainButton.dataset.domain;

                const domainSkills =
                    getTaxonomyForSection()[
                        domain
                    ] || [];

                const allSelected =
                    domainSkills.every(
                        skill =>
                            activeSkill.includes(
                                skill
                            )
                    );

                if (allSelected) {
                    activeSkill =
                        activeSkill.filter(
                            skill =>
                                !domainSkills.includes(
                                    skill
                                )
                        );
                } else {
                    activeSkill = [
                        ...new Set([
                            ...activeSkill,
                            ...domainSkills
                        ])
                    ];
                }
            } else if (skillButton) {
                const skill =
                    skillButton.dataset.skill;

                if (
                    activeSkill.includes(skill)
                ) {
                    activeSkill =
                        activeSkill.filter(
                            selected =>
                                selected !== skill
                        );
                } else {
                    activeSkill.push(skill);
                }
            }

            saveQuestionBankFilters();
            renderSkillPicker();
            renderQuestions();
        }
    );
}

setupFilterDropdown(
    difficultyFilter,
    values => {
        activeDifficulty = values;
        saveQuestionBankFilters();
        renderQuestions();
    }
);

setupFilterDropdown(
    statusFilter,
    values => {
        activeStatus = values;
        saveQuestionBankFilters();
        renderQuestions();
    }
);

if (reviewOnlyCheckbox) {
    reviewOnlyCheckbox.addEventListener(
        "change",
        event => {
            reviewOnly =
                event.target.checked;

            saveQuestionBankFilters();
            renderQuestions();
        }
    );
}

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

    syncQuestionBankFilterUI();
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
