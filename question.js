/* ============================================================
   ABSOLUTEPREP QUESTION SYSTEM
   ============================================================ */


/* ============================================================
   SUPABASE
   ============================================================ */

const SUPABASE_URL =
    "https://ikvvixdyztyqqxkveois.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* ============================================================
   SETTINGS
   ============================================================ */




/* ============================================================
   STATE
   ============================================================ */

let questions = [];

let currentQuestionIndex = 0;

let answers = {};

let markedForReview = {};

let elapsedSeconds = 0;

let timerInterval = null;

let eliminatedChoices = {};
let checkedResults = {};


let currentSet = null;

let currentUser = null;

let submitted = false;


/* ============================================================
   DOM ELEMENTS
   ============================================================ */

const loadingScreen =
    document.getElementById(
        "loading-screen"
    );

const questionApp =
    document.getElementById(
        "question-app"
    );

const resultsScreen =
    document.getElementById(
        "results-screen"
    );

const setTitle =
    document.getElementById(
        "set-title"
    );

const questionNumber =
    document.getElementById(
        "question-number"
    );

const questionText =
    document.getElementById(
        "question-text"
    );

const choicesContainer =
    document.getElementById(
        "choices"
    );

const previousButton =
    document.getElementById(
        "previous-button"
    );

const nextButton =
    document.getElementById(
        "next-button"
    );

const clearButton =
    document.getElementById(
        "clear-button"
    );

const reviewButton =
    document.getElementById(
        "review-button"
    );

const reviewText =
    document.getElementById(
        "review-text"
    );

const questionNavigator =
    document.getElementById(
        "question-navigator"
    );

const submitButton =
    document.getElementById(
        "submit-button"
    );

const timerElement =
    document.getElementById(
        "timer"
    );

const scoreNumber =
    document.getElementById(
        "score-number"
    );

const correctCount =
    document.getElementById(
        "correct-count"
    );

const incorrectCount =
    document.getElementById(
        "incorrect-count"
    );

const unansweredCount =
    document.getElementById(
        "unanswered-count"
    );

const resultsSetTitle =
    document.getElementById(
        "results-set-title"
    );

const resultsMessage =
    document.getElementById(
        "results-message"
    );

const reviewResultsButton =
    document.getElementById(
        "review-results-button"
    );

const resultsReview =
    document.getElementById(
        "results-review"
    );

const resultsReviewList =
    document.getElementById(
        "results-review-list"
    );

const checkAnswerButton =
    document.getElementById(
        "check-answer-button"
    );

const answerFeedback =
    document.getElementById(
        "answer-feedback"
    );

const answerFeedbackTitle =
    document.getElementById(
        "answer-feedback-title"
    );

const answerFeedbackExplanation =
    document.getElementById(
        "answer-feedback-explanation"
    );


/* ============================================================
   GET SET SLUG
   ============================================================ */

function getSetSlug() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("set");

}


/* ============================================================
   ESCAPE HTML
   ============================================================ */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function getReviewStorageKey() {

    return currentUser
        ? "absoluteprep-question-reviews:" +
            currentUser.id
        : null;

}


function getLocalReviewIds() {

    const key =
        getReviewStorageKey();

    if (!key) {
        return [];
    }

    try {

        const stored =
            JSON.parse(
                localStorage.getItem(
                    key
                ) || "[]"
            );

        return Array.isArray(
            stored
        )
            ? stored.map(
                id => String(id)
            )
            : [];

    } catch {

        return [];

    }

}


function saveLocalReviewIds(
    ids
) {

    const key =
        getReviewStorageKey();

    if (!key) {
        return;
    }

    try {

        localStorage.setItem(
            key,
            JSON.stringify(
                [...new Set(
                    ids.map(
                        id => String(id)
                    )
                )]
            )
        );

    } catch {

        // Local storage is only a fallback.

    }

}


/* ============================================================
   INITIALIZE
   ============================================================ */

async function initialize() {

    try {

        /*
         * IMPORTANT:
         *
         * getSession() reads the session that Supabase
         * has already saved in the browser.
         *
         * This allows the user to move between:
         *
         * Login
         * Question Bank
         * Question
         *
         * without being treated as logged out.
         */

        const {
            data: {
                session
            },
            error: sessionError
        } =
            await supabaseClient.auth.getSession();


        if (sessionError) {

            console.error(
                "Could not restore Supabase session:",
                sessionError
            );

            showError(
                "We could not restore your login session. Please try logging in again."
            );

            return;

        }


        /*
         * No saved session.
         */

        if (!session) {

            const currentUrl =
                window.location.pathname +
                window.location.search;


            window.location.replace(
                "/login?redirect=" +
                encodeURIComponent(
                    currentUrl
                )
            );

            return;

        }


        /*
         * Saved session exists.
         */

        currentUser =
            session.user;


        const params =
            new URLSearchParams(
                window.location.search
            );

        const questionId =
            params.get("id");

        const slug =
            params.get("set");


        /*
         * Question Bank questions use ?id=...
         * while legacy question sets use ?set=...
         */

        if (questionId) {

            await loadQuestionById(
                questionId
            );

            return;

        }


        if (!slug) {

            showError(
                "No question was specified."
            );

            return;

        }


        await loadQuestionSet(
            slug
        );

    } catch (error) {

        console.error(
            "Question initialization error:",
            error
        );


        showError(
            "Something went wrong while loading the question."
        );

    }

}


async function loadQuestionReviewState(
    questionId
) {

    const localIds =
        getLocalReviewIds();

    markedForReview[
        questionId
    ] =
        localIds.includes(
            String(questionId)
        );


    if (!currentUser) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "question_reviews"
                )
                .select(
                    "question_id"
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .eq(
                    "question_id",
                    questionId
                )
                .limit(1);


        if (error) {

            console.warn(
                "Could not load question review status; using local state:",
                error
            );

            return;

        }


        const serverMarked =
            Array.isArray(data) &&
            data.length > 0;


        markedForReview[
            questionId
        ] =
            serverMarked;


        const nextLocalIds =
            serverMarked
                ? [
                    ...localIds,
                    String(questionId)
                ]
                : localIds.filter(
                    id =>
                        id !==
                        String(questionId)
                );


        saveLocalReviewIds(
            nextLocalIds
        );

    } catch (error) {

        console.warn(
            "Could not load question review status; using local state:",
            error
        );

    }

}


async function loadReviewStatesForQuestions(
    questionList
) {

    markedForReview = {};

    const localIds =
        getLocalReviewIds();

    questionList.forEach(question => {
        markedForReview[
            question.id
        ] =
            localIds.includes(
                String(question.id)
            );
    });

    if (!currentUser || !questionList.length) {
        return;
    }

    try {
        const questionIds =
            questionList.map(
                question => question.id
            );

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "question_reviews"
                )
                .select(
                    "question_id"
                )
                .eq(
                    "user_id",
                    currentUser.id
                )
                .in(
                    "question_id",
                    questionIds
                );

        if (error) {
            console.warn(
                "Could not load question review states:",
                error
            );
            return;
        }

        (data || []).forEach(
            review => {
                markedForReview[
                    review.question_id
                ] = true;
            }
        );

    } catch (error) {
        console.warn(
            "Could not load question review states:",
            error
        );
    }
}


/* ============================================================
   LOAD QUESTION BY ID
   ============================================================ */

async function loadQuestionById(
    questionId
) {

    const {
        data: liveQuestion,
        error: liveQuestionError
    } =
        await supabaseClient
            .from("questions")
            .select(`
                id,
                set_id,
                question_number,
                question_text,
                choice_a,
                choice_b,
                choice_c,
                choice_d,
                correct_answer,
                explanation,
                difficulty,
                topic
            `)
            .eq(
                "id",
                questionId
            )
            .maybeSingle();


    if (
        liveQuestionError &&
        liveQuestionError.code !== "PGRST116"
    ) {

        console.warn(
            "Live question lookup failed:",
            liveQuestionError
        );

    }


    if (liveQuestion) {

        questions = [
            liveQuestion
        ];


        if (liveQuestion.set_id) {

            const {
                data: setData
            } =
                await supabaseClient
                    .from("question_sets")
                    .select("*")
                    .eq(
                        "id",
                        liveQuestion.set_id
                    )
                    .maybeSingle();

            currentSet =
                setData || null;

        }


        await loadQuestionReviewState(
            questionId
        );


        const setName =
            currentSet?.name ||
            "Question Bank";


        setTitle.textContent =
            setName;


        resultsSetTitle.textContent =
            setName;


        renderQuestionNavigator();
        renderCurrentQuestion();
        startTimer();


        loadingScreen.classList.add(
            "hidden"
        );

        questionApp.classList.remove(
            "hidden"
        );

        return;

    }


    try {

        const response =
            await fetch(
                "/question-bank.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Staged question file could not be loaded."
            );

        }


        const stagedData =
            await response.json();


        const stagedQuestion =
            (stagedData.questions || [])
                .find(
                    question =>
                        String(question.id) ===
                        String(questionId) &&
                        question.status ===
                        "staged"
                );


        if (!stagedQuestion) {

            showError(
                "The question could not be found."
            );

            return;

        }


        currentSet = null;


        questions = [

            {
                id:
                    stagedQuestion.id,

                question_number:
                    null,

                question_text:
                    stagedQuestion.passage +
                    "\n\n" +
                    stagedQuestion.question,

                choice_a:
                    stagedQuestion.choices?.A ||
                    "",

                choice_b:
                    stagedQuestion.choices?.B ||
                    "",

                choice_c:
                    stagedQuestion.choices?.C ||
                    "",

                choice_d:
                    stagedQuestion.choices?.D ||
                    "",

                correct_answer:
                    stagedQuestion.correctAnswer,

                explanation:
                    stagedQuestion.explanation ||
                    "",

                difficulty:
                    stagedQuestion.difficulty
                        ? (
                            stagedQuestion.difficulty
                                .charAt(0)
                                .toUpperCase() +
                            stagedQuestion.difficulty
                                .slice(1)
                        )
                        : "Medium",

                topic:
                    stagedQuestion.skill ||
                    "SAT Practice",

                section:
                    stagedQuestion.section ||
                    "SAT"

            }

        ];


        await loadQuestionReviewState(
            stagedQuestion.id
        );


        setTitle.textContent =
            "Question Bank";


        resultsSetTitle.textContent =
            "Question Bank";


        renderQuestionNavigator();
        renderCurrentQuestion();
        startTimer();


        loadingScreen.classList.add(
            "hidden"
        );

        questionApp.classList.remove(
            "hidden"
        );

    } catch (error) {

        console.error(
            "Staged question loading error:",
            error
        );


        showError(
            "The question could not be loaded."
        );

    }

}


/* ============================================================
   LOAD QUESTION SET
   ============================================================ */

async function loadQuestionSet(
    slug
) {

    const {
        data: setData,
        error: setError
    } =
        await supabaseClient
            .from("question_sets")
            .select("*")
            .eq("slug", slug)
            .single();


    if (setError) {

        console.error(
            "Question set error:",
            setError
        );


        showError(
            "The question could not be found."
        );

        return;

    }


    currentSet =
        setData;


    const {
        data: questionData,
        error: questionError
    } =
        await supabaseClient
            .from("questions")
            .select(`
                id,
                set_id,
                question_number,
                question_text,
                choice_a,
                choice_b,
                choice_c,
                choice_d,
                correct_answer,
                explanation,
                difficulty,
                topic
            `)
            .eq(
                "set_id",
                currentSet.id
            )
            .order(
                "question_number",
                {
                    ascending: true
                }
            );


    if (questionError) {

        console.error(
            "Question loading error:",
            questionError
        );


        showError(
            "The questions could not be loaded."
        );

        return;

    }


    if (
        !questionData ||
        questionData.length === 0
    ) {

        showError(
            "This question does not contain any questions yet."
        );

        return;

    }


    questions =
        questionData;

    await loadReviewStatesForQuestions(
        questions
    );

    setTitle.textContent =
        currentSet?.name || "Question Bank";


    resultsSetTitle.textContent =
        currentSet?.name ||
        "Question Bank";


    renderQuestionNavigator();

    renderCurrentQuestion();

    startTimer();


    loadingScreen.classList.add(
        "hidden"
    );


    questionApp.classList.remove(
        "hidden"
    );

}


/* ============================================================
   RENDER QUESTION NAVIGATOR
   ============================================================ */

function renderQuestionNavigator() {

    if (!questionNavigator) {
        return;
    }

    questionNavigator.innerHTML =
        "";


    questions.forEach(
        (
            question,
            index
        ) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "question-number-button";


            button.textContent =
                index + 1;


            button.addEventListener(
                "click",
                () => {

                    currentQuestionIndex =
                        index;

                    resetQuestionTimer();

                    renderCurrentQuestion();

                }
            );


            questionNavigator.appendChild(
                button
            );

        }
    );


    updateQuestionNavigator();

}


/* ============================================================
   UPDATE NAVIGATOR
   ============================================================ */

function updateQuestionNavigator() {

    if (!questionNavigator) {
        return;
    }

    const buttons =
        questionNavigator.querySelectorAll(
            ".question-number-button"
        );


    buttons.forEach(
        (
            button,
            index
        ) => {

            button.classList.toggle(
                "current",
                index ===
                    currentQuestionIndex
            );


            const question =
                questions[index];


            const answer =
                answers[
                    question.id
                ];


            const isMarked =
                markedForReview[
                    question.id
                ] === true;


            button.classList.toggle(
                "answered",
                Boolean(answer)
            );


            button.classList.toggle(
                "review",
                isMarked
            );

        }
    );

}


/* ============================================================
   RENDER CURRENT QUESTION
   ============================================================ */

function renderCurrentQuestion() {

    const question =
        questions[
            currentQuestionIndex
        ];


    if (!question) {

        return;

    }


    questionNumber.textContent =
        `Question ${
            currentQuestionIndex + 1
        } of ${
            questions.length
        }`;


    questionText.textContent =
        question.question_text;


    renderChoices(
        question
    );

    renderAnswerFeedback(
        question
    );


    updateReviewButton();

    updateNavigationButtons();

    updateQuestionNavigator();

}


/* ============================================================
   RENDER CHOICES
   ============================================================ */

function renderChoices(
    question
) {

    choicesContainer.innerHTML = "";


    const choices = [
        { letter: "A", text: question.choice_a },
        { letter: "B", text: question.choice_b },
        { letter: "C", text: question.choice_c },
        { letter: "D", text: question.choice_d }
    ];


    choices.forEach(
        choice => {

            const wrapper =
                document.createElement(
                    "div"
                );

            wrapper.className =
                "choice-wrapper";


            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "choice";


            const selected =
                answers[
                    question.id
                ] === choice.letter;


            const checked =
                checkedResults[
                    question.id
                ];


            const eliminated =
                eliminatedChoices[
                    question.id
                ]?.includes(
                    choice.letter
                );


            if (selected) {
                button.classList.add(
                    "selected"
                );
            }

            if (eliminated) {
                button.classList.add(
                    "eliminated"
                );
            }

            if (checked) {

                if (
                    choice.letter ===
                    question.correct_answer
                ) {

                    button.classList.add(
                        "correct-answer"
                    );

                } else if (
                    selected
                ) {

                    button.classList.add(
                        "incorrect-answer"
                    );

                }

                button.disabled = true;

            }


            button.innerHTML = `
                <span class="choice-letter">
                    ${escapeHtml(
                        choice.letter
                    )}
                </span>

                <span class="choice-text">
                    ${escapeHtml(
                        choice.text
                    )}
                </span>
            `;


            button.addEventListener(
                "click",
                () => {

                    selectAnswer(
                        question.id,
                        choice.letter
                    );

                }
            );


            const strikeButton =
                document.createElement(
                    "button"
                );

            strikeButton.type =
                "button";

            strikeButton.className =
                "choice-strike-button";


            const isEliminated =
                eliminatedChoices[
                    question.id
                ]?.includes(
                    choice.letter
                );


            strikeButton.textContent =
                isEliminated
                    ? "×"
                    : "✕";


            strikeButton.setAttribute(
                "aria-label",
                isEliminated
                    ? "Remove cross out"
                    : "Cross out choice"
            );


            strikeButton.setAttribute(
                "title",
                isEliminated
                    ? "Remove cross out"
                    : "Cross out choice"
            );


            if (checked) {
                strikeButton.disabled =
                    true;
            }


            strikeButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    toggleEliminatedChoice(
                        question.id,
                        choice.letter
                    );

                }
            );


            wrapper.appendChild(
                button
            );

            wrapper.appendChild(
                strikeButton
            );


            choicesContainer.appendChild(
                wrapper
            );

        }
    );

}/* ============================================================
   TOGGLE CHOICE CROSS-OUT
   ============================================================ */

function toggleEliminatedChoice(
    questionId,
    choiceLetter
) {

    if (!eliminatedChoices[questionId]) {

        eliminatedChoices[questionId] = [];

    }

    const choices =
        eliminatedChoices[
            questionId
        ];

    const existingIndex =
        choices.indexOf(
            choiceLetter
        );


    if (existingIndex >= 0) {

        choices.splice(
            existingIndex,
            1
        );

    } else {

        choices.push(
            choiceLetter
        );

    }


    renderChoices(
        questions[
            currentQuestionIndex
        ]
    );

}


/* ============================================================
   SELECT ANSWERfunction selectAnswer(
    questionId,
    answer
) {

    if (
        checkedResults[
            questionId
        ]
    ) {
        return;
    }


    answers[
        questionId
    ] = answer;


    renderCurrentQuestion();

}


function renderAnswerFeedback(
    question
) {

    const checked =
        checkedResults[
            question.id
        ];


    if (
        !answerFeedback ||
        !answerFeedbackTitle ||
        !answerFeedbackExplanation
    ) {
        return;
    }


    if (!checked) {

        answerFeedback.classList.add(
            "hidden"
        );

        answerFeedback.classList.remove(
            "correct",
            "incorrect",
            "neutral"
        );

        answerFeedbackTitle.textContent =
            "";

        answerFeedbackExplanation.textContent =
            "";

        if (checkAnswerButton) {
            checkAnswerButton.disabled =
                false;
        }

        return;

    }


    const selected =
        answers[
            question.id
        ] || null;


    const isCorrect =
        selected ===
        question.correct_answer;


    answerFeedback.classList.remove(
        "hidden",
        "neutral"
    );

    answerFeedback.classList.toggle(
        "correct",
        isCorrect
    );

    answerFeedback.classList.toggle(
        "incorrect",
        !isCorrect
    );


    answerFeedbackTitle.textContent =
        isCorrect
            ? "Correct"
            : "Incorrect";


    answerFeedbackExplanation.innerHTML =
        "<strong>Explanation</strong><br>" +
        escapeHtml(
            question.explanation ||
            "Review the question and compare your choice with the correct answer."
        );


    if (checkAnswerButton) {
        checkAnswerButton.disabled =
            true;

        checkAnswerButton.textContent =
            "Answer Checked";
    }

}


async function checkAnswer() {

    const question =
        questions[
            currentQuestionIndex
        ];


    if (!question) {
        return;
    }


    const selected =
        answers[
            question.id
        ];


    if (!selected) {

        if (answerFeedback) {

            answerFeedback.classList.remove(
                "hidden",
                "correct",
                "incorrect"
            );

            answerFeedback.classList.add(
                "neutral"
            );

        }

        if (answerFeedbackTitle) {
            answerFeedbackTitle.textContent =
                "Choose an answer";
        }

        if (answerFeedbackExplanation) {
            answerFeedbackExplanation.textContent =
                "Select one of the four choices before checking your answer.";
        }

        return;
    }


    const isCorrect =
        selected ===
        question.correct_answer;


    checkedResults[
        question.id
    ] = true;


    renderCurrentQuestion();


    await saveQuestionBankAttempt(
        question.id,
        isCorrect
    );

}


async function saveQuestionBankAttempt(
    questionId,
    isCorrect
) {

    if (!currentUser) {
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from(
                    "question_attempts"
                )
                .insert({
                    user_id:
                        currentUser.id,
                    question_id:
                        questionId,
                    is_correct:
                        isCorrect
                });


        if (error) {
            console.error(
                "Could not save question-bank result:",
                error
            );
        }

    } catch (error) {

        console.error(
            "Could not save question-bank result:",
            error
        );

    }

}


/* ============================================================
   CLEAR ANSWER
   ============================================================ */

function clearAnswer() {
    return;
}


/* ============================================================
   MARK FOR REVIEW
   ============================================================ */

async function toggleReview() {

    const question =
        questions[
            currentQuestionIndex
        ];


    if (!question) {

        return;

    }


    const previousMarked =
        markedForReview[
            question.id
        ] === true;


    const nextMarked =
        !previousMarked;


    markedForReview[
        question.id
    ] =
        nextMarked;


    const localIds =
        getLocalReviewIds();

    const nextLocalIds =
        nextMarked
            ? [
                ...localIds,
                String(question.id)
            ]
            : localIds.filter(
                id =>
                    id !==
                    String(question.id)
            );

    saveLocalReviewIds(
        nextLocalIds
    );


    updateReviewButton();

    updateQuestionNavigator();


    if (!currentUser) {

        return;

    }


    try {

        const deleteResult =
            await supabaseClient
                .from(
                    "question_reviews"
                )
                .delete()
                .eq(
                    "user_id",
                    currentUser.id
                )
                .eq(
                    "question_id",
                    question.id
                );


        if (deleteResult.error) {
            throw deleteResult.error;
        }


        if (nextMarked) {

            const insertResult =
                await supabaseClient
                    .from(
                        "question_reviews"
                    )
                    .insert({
                        user_id:
                            currentUser.id,
                        question_id:
                            question.id
                    });


            if (insertResult.error) {
                throw insertResult.error;
            }

        }

    } catch (error) {

        console.error(
            "Could not save review status:",
            error
        );


        markedForReview[
            question.id
        ] =
            previousMarked;


        const rollbackIds =
            getLocalReviewIds();

        const rollbackLocalIds =
            previousMarked
                ? [
                    ...rollbackIds,
                    String(question.id)
                ]
                : rollbackIds.filter(
                    id =>
                        id !==
                        String(question.id)
                );

        saveLocalReviewIds(
            rollbackLocalIds
        );


        updateReviewButton();

        updateQuestionNavigator();

    }

}


/* ============================================================
   UPDATE REVIEW BUTTON
   ============================================================ */

function updateReviewButton() {

    const question =
        questions[
            currentQuestionIndex
        ];


    if (!question) {

        return;

    }


    const marked =
        markedForReview[
            question.id
        ] === true;


    reviewButton.classList.toggle(
        "reviewing",
        marked
    );

    reviewButton.setAttribute(
        "aria-pressed",
        marked ? "true" : "false"
    );


    reviewText.textContent =
        marked
            ? "Marked for Review"
            : "Mark for Review";

}


/* ============================================================
   PREVIOUS
   ============================================================ */

function goPrevious() {

    if (
        currentQuestionIndex <= 0
    ) {

        return;

    }


    currentQuestionIndex--;

    resetQuestionTimer();

    renderCurrentQuestion();

}


/* ============================================================
   NEXT
   ============================================================ */

function goNext() {

    if (
        currentQuestionIndex >=
        questions.length - 1
    ) {

        return;

    }


    currentQuestionIndex++;

    resetQuestionTimer();

    renderCurrentQuestion();

}


/* ============================================================
   NAVIGATION BUTTONS
   ============================================================ */

function updateNavigationButtons() {

    if (!previousButton || !nextButton) {
        return;
    }

    previousButton.disabled =
        currentQuestionIndex === 0;


    if (
        currentQuestionIndex ===
        questions.length - 1
    ) {

        nextButton.textContent =
            "Finish";

    } else {

        nextButton.textContent =
            "Next";

    }

}


/* ============================================================
   TIMER
   ============================================================ */

function startTimer() {

    resetQuestionTimer();

}


function resetQuestionTimer() {

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

    }


    elapsedSeconds = 0;

    updateTimerDisplay();


    timerInterval =
        setInterval(
            () => {

                if (submitted) {

                    return;

                }


                elapsedSeconds++;

                updateTimerDisplay();

            },
            1000
        );

}


/* ============================================================
   TIMER DISPLAY
   ============================================================ */

function updateTimerDisplay() {

    const minutes =
        Math.floor(
            elapsedSeconds / 60
        );


    const seconds =
        elapsedSeconds % 60;


    timerElement.textContent =
        `${String(
            minutes
        ).padStart(
            2,
            "0"
        )}:${String(
            seconds
        ).padStart(
            2,
            "0"
        )}`;


    timerElement.classList.remove(
        "warning",
        "danger"
    );

}


/* ============================================================
   SUBMIT
   ============================================================ */

async function submitTest(
    automatic = false
) {

    if (submitted) {

        return;

    }


    if (!automatic) {

        const unanswered =
            questions.filter(
                question =>
                    !answers[
                        question.id
                    ]
            ).length;


        if (
            unanswered > 0
        ) {

            const shouldSubmit =
                window.confirm(
                    `You have ${
                        unanswered
                    } unanswered question${
                        unanswered === 1
                            ? ""
                            : "s"
                    }. Are you sure you want to submit?`
                );


            if (!shouldSubmit) {

                return;

            }

        } else {

            const shouldSubmit =
                window.confirm(
                    "Are you sure you want to submit this question?"
                );


            if (!shouldSubmit) {

                return;

            }

        }

    }


    submitted = true;


    if (timerInterval) {

        clearInterval(
            timerInterval
        );

    }


    const results =
        calculateResults();


    await saveAttempt(
        results
    );


    showResults(
        results
    );

}


/* ============================================================
   CALCULATE RESULTS
   ============================================================ */

function calculateResults() {

    let correct = 0;

    let incorrect = 0;

    let unanswered = 0;


    const detailedResults =
        questions.map(
            question => {

                const selected =
                    answers[
                        question.id
                    ] || null;


                let status;


                if (!selected) {

                    unanswered++;

                    status =
                        "unanswered";

                } else if (
                    selected ===
                    question.correct_answer
                ) {

                    correct++;

                    status =
                        "correct";

                } else {

                    incorrect++;

                    status =
                        "incorrect";

                }


                return {

                    question,

                    selected,

                    status

                };

            }
        );


    const total =
        questions.length;


    const percentage =
        Math.round(
            (
                correct /
                total
            ) * 100
        );


    return {

        correct,

        incorrect,

        unanswered,

        total,

        percentage,

        detailedResults

    };

}


/* ============================================================
   SAVE ATTEMPT
   ============================================================ */

async function saveAttempt(
    results
) {

    if (!currentUser) {

        return;

    }


    try {

        /*
         * Questions opened directly from the Question Bank
         * do not belong to a question set. Their individual
         * result must be saved in question_attempts so the
         * Question Bank can show a persistent green/red status.
         */

        if (!currentSet) {

            const rows =
                results.detailedResults.map(
                    result => ({
                        user_id:
                            currentUser.id,
                        question_id:
                            result.question.id,
                        is_correct:
                            result.status ===
                            "correct"
                    })
                );


            if (rows.length > 0) {

                const {
                    error
                } =
                    await supabaseClient
                        .from(
                            "question_attempts"
                        )
                        .insert(
                            rows
                        );


                if (error) {

                    console.error(
                        "Could not save question-bank attempts:",
                        error
                    );

                }

            }

            return;

        }


        const {
            data: attempt,
            error: attemptError
        } =
            await supabaseClient
                .from(
                    "question_set_attempts"
                )
                .insert({

                    user_id:
                        currentUser.id,

                    set_id:
                        currentSet.id,

                    score:
                        results.correct,

                    total_questions:
                        results.total,

                    completed_at:
                        new Date().toISOString()

                })
                .select()
                .single();


        if (attemptError) {

            console.error(
                "Could not save attempt:",
                attemptError
            );


            return;

        }


        const answerRows =
            results.detailedResults.map(
                result => ({

                    attempt_id:
                        attempt.id,

                    question_id:
                        result.question.id,

                    selected_answer:
                        result.selected,

                    is_correct:
                        result.status ===
                        "correct"

                })
            );


        if (answerRows.length > 0) {

            const {
                error: answerError
            } =
                await supabaseClient
                    .from(
                        "question_answers"
                    )
                    .insert(
                        answerRows
                    );


            if (answerError) {

                console.error(
                    "Could not save answers:",
                    answerError
                );

            }

        }

    } catch (error) {

        console.error(
            "Error saving attempt:",
            error
        );

    }

}


/* ============================================================
   SHOW RESULTS
   ============================================================ */

function showResults(
    results
) {

    questionApp.classList.add(
        "hidden"
    );


    resultsScreen.classList.remove(
        "hidden"
    );


    scoreNumber.textContent =
        `${results.percentage}%`;


    correctCount.textContent =
        results.correct;


    incorrectCount.textContent =
        results.incorrect;


    unansweredCount.textContent =
        results.unanswered;


    resultsSetTitle.textContent =
        currentSet?.name || "Question Bank";


    if (
        results.percentage >= 90
    ) {

        resultsMessage.textContent =
            "Excellent work. Review any missed questions carefully and focus on why the correct answer is supported.";

    } else if (
        results.percentage >= 70
    ) {

        resultsMessage.textContent =
            "Solid performance. Review the questions you missed and identify the reasoning pattern behind each error.";

    } else {

        resultsMessage.textContent =
            "Keep practicing. Review each missed question carefully and focus on the evidence that supports the correct answer.";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ============================================================
   SHOW QUESTION REVIEW
   ============================================================ */

function showResultsReview() {

    if (
        !resultsReview.classList.contains(
            "hidden"
        )
    ) {

        resultsReview.classList.add(
            "hidden"
        );


        reviewResultsButton.textContent =
            "Review Questions";


        return;

    }


    const results =
        calculateResults();


    resultsReviewList.innerHTML =
        "";


    results.detailedResults.forEach(
        (
            result,
            index
        ) => {

            const question =
                result.question;


            const selectedText =
                result.selected
                    ? `${
                        result.selected
                    }. ${
                        getChoiceText(
                            question,
                            result.selected
                        )
                    }`
                    : "No answer";


            const correctText =
                `${
                    question.correct_answer
                }. ${
                    getChoiceText(
                        question,
                        question.correct_answer
                    )
                }`;


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                `review-result-item ${
                    result.status
                }`;


            item.innerHTML = `

                <div class="review-result-number">
                    QUESTION ${index + 1}
                </div>

                <div class="review-result-question">
                    ${escapeHtml(
                        question.question_text
                    )}
                </div>

                <div class="review-result-answer">
                    <strong>Your answer:</strong>
                    ${escapeHtml(
                        selectedText
                    )}
                </div>

                <div class="review-result-answer">
                    <strong>Correct answer:</strong>
                    ${escapeHtml(
                        correctText
                    )}
                </div>

                <div class="review-result-explanation">
                    <strong>Explanation:</strong><br>
                    ${escapeHtml(
                        question.explanation
                    )}
                </div>

            `;


            resultsReviewList.appendChild(
                item
            );

        }
    );


    resultsReview.classList.remove(
        "hidden"
    );


    reviewResultsButton.textContent =
        "Hide Review";


    resultsReview.scrollIntoView({

        behavior: "smooth"

    });

}


/* ============================================================
   GET CHOICE TEXT
   ============================================================ */

function getChoiceText(
    question,
    letter
) {

    switch (letter) {

        case "A":

            return question.choice_a;


        case "B":

            return question.choice_b;


        case "C":

            return question.choice_c;


        case "D":

            return question.choice_d;


        default:

            return "";

    }

}


/* ============================================================
   ERROR
   ============================================================ */

function showError(
    message
) {

    loadingScreen.innerHTML = `

        <div style="
            max-width: 520px;
            padding: 30px;
            background: #ffffff;
            border: 1px solid #dce4ed;
            border-radius: 14px;
            text-align: center;
        ">

            <h2 style="
                margin: 0 0 10px;
                color: #0f172a;
                font-size: 22px;
            ">
                Something went wrong
            </h2>

            <p style="
                margin: 0 0 20px;
                color: #64748b;
                line-height: 1.6;
                font-size: 14px;
            ">
                ${escapeHtml(
                    message
                )}
            </p>

            <a
                href="/question-bank"
                style="
                    display: inline-block;
                    padding: 10px 17px;
                    background: #0f9f9a;
                    color: #ffffff;
                    border-radius: 8px;
                    text-decoration: none;
                    font-size: 13px;
                    font-weight: 600;
                "
            >
                Back to Question Bank
            </a>

        </div>

    `;

}


/* ============================================================
   EVENT LISTENERS
   ============================================================ */

if (reviewButton) {

    reviewButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            toggleReview();

        }
    );

}


if (checkAnswerButton) {

    checkAnswerButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            checkAnswer();

        }
    );

}


/* ============================================================
   MOBILE MENU
   ============================================================ */

const menuButton =
    document.querySelector(
        ".mobile-menu-button"
    );

const navigation =
    document.querySelector(
        ".navigation"
    );


if (
    menuButton &&
    navigation
) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                navigation.classList.toggle(
                    "mobile-open"
                );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ============================================================
   START
   ============================================================ */

initialize();
