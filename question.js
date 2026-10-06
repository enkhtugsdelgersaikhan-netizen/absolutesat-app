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
let localReviewOverrides = {};

let elapsedSeconds = 0;

let timerInterval = null;

let eliminatedChoices = {};
let checkedResults = {};
let wrongAttempts = {};


let currentSet = null;

let currentUser = null;

let submitted = false;

let mockTestMode = false;
let mockManifest = null;
let mockTestId = null;
let mockState = null;
let mockTimerInterval = null;
let mockBreakInterval = null;


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

const questionMetadata =
    document.getElementById(
        "question-metadata"
    );

const questionProgressIdentity =
    document.getElementById(
        "question-progress-identity"
    );

const readingQuestionMetadataHost =
    document.getElementById(
        "reading-question-metadata-host"
    );

const questionDomain =
    document.getElementById(
        "question-domain"
    );

const questionSubtopic =
    document.getElementById(
        "question-subtopic"
    );

const questionDifficulty =
    document.getElementById(
        "question-difficulty"
    );

const questionText =
    document.getElementById(
        "question-text"
    );


const questionPassage =
    document.getElementById(
        "question-passage"
    );

const mathQuestionContext =
    document.getElementById(
        "math-question-context"
    );

const mathQuestionContextContent =
    document.getElementById(
        "math-question-context-content"
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

const nextQuestionButton =
    document.getElementById(
        "next-question-button"
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


function normalizeMathEscapes(value) {
    let source =
        String(
            value === null ||
            value === undefined
                ? ""
                : value
        );

    // Imported question data occasionally contains TeX that has
    // been escaped twice (for example \\\\( ... \\\\) or
    // \\\\[ ... \\\\]). MathJax only recognizes the normal
    // single-backslash delimiters, so repair those conservatively.
    source = source.replace(
        /\\\\([()\[\]])/g,
        "\\$1"
    );

    // Once a math segment is recognized, collapse a duplicated
    // backslash before TeX command names such as \\frac or \\sqrt.
    // This is intentionally limited to delimited math so prose and
    // legitimate line breaks elsewhere are untouched.
    source = source.replace(
        /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,
        match =>
            match.replace(
                /\\\\(?=[A-Za-z])/g,
                "\\"
            )
    );

    return source;
}


function normalizeMathLayoutText(value) {
    const mathSegments = [];

    const protectedSource =
        normalizeMathEscapes(
            value
        ).replace(
            /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,
            match => {
                const index =
                    mathSegments.push(
                        match
                    ) - 1;

                return (
                    "\uE002MATHLAYOUT" +
                    index +
                    "\uE003"
                );
            }
        );

    const compact =
        protectedSource
            .replace(
                /\r\n?/g,
                "\n"
            )
            .replace(
                /[ \t]*\n[ \t]*/g,
                " "
            )
            .replace(
                /[ \t]{2,}/g,
                " "
            )
            .trim();

    return compact.replace(
        /\uE002MATHLAYOUT(\d+)\uE003/g,
        (
            match,
            index
        ) =>
            mathSegments[
                Number(index)
            ] || ""
    );
}


function repairDroppedFractionCommands(body) {
    const source =
        String(body || "");

    // A recurring import failure drops the command name from
    // \\frac{numerator}{denominator} but leaves the two argument
    // groups behind. MathJax then renders {30}{2} as 302. Recover
    // those adjacent balanced groups conservatively inside TeX.
    let output = "";
    let index = 0;

    const readGroup =
        start => {
            if (
                source[start] !== "{"
            ) {
                return null;
            }

            let depth = 0;

            for (
                let cursor = start;
                cursor < source.length;
                cursor += 1
            ) {
                const char =
                    source[cursor];

                if (char === "{") {
                    depth += 1;
                } else if (char === "}") {
                    depth -= 1;

                    if (depth === 0) {
                        return {
                            start,
                            end:
                                cursor + 1,
                            content:
                                source.slice(
                                    start + 1,
                                    cursor
                                )
                        };
                    }
                }
            }

            return null;
        };

    while (
        index < source.length
    ) {
        if (
            source[index] !== "{"
        ) {
            output +=
                source[index];

            index += 1;
            continue;
        }

        const previous =
            index > 0
                ? source[index - 1]
                : "";

        // Do not reinterpret normal TeX arguments/subscripts,
        // such as ^{2}, _{n}, \\sqrt{x}, or command arguments.
        if (
            previous === "^" ||
            previous === "_" ||
            previous === "\\"
        ) {
            output +=
                source[index];

            index += 1;
            continue;
        }

        const first =
            readGroup(
                index
            );

        if (!first) {
            output +=
                source[index];

            index += 1;
            continue;
        }

        let secondStart =
            first.end;

        while (
            secondStart <
                source.length &&
            /\s/.test(
                source[
                    secondStart
                ]
            )
        ) {
            secondStart += 1;
        }

        const second =
            readGroup(
                secondStart
            );

        if (
            !second
        ) {
            output +=
                source.slice(
                    index,
                    first.end
                );

            index =
                first.end;
            continue;
        }

        const before =
            source.slice(
                Math.max(
                    0,
                    index - 16
                ),
                index
            );

        const looksLikeCommandArgument =
            /\\[A-Za-z]+\s*$/.test(
                before
            );

        if (
            looksLikeCommandArgument
        ) {
            output +=
                source.slice(
                    index,
                    first.end
                );

            index =
                first.end;
            continue;
        }

        const numerator =
            first.content.trim();

        const denominator =
            second.content.trim();

        const plausibleFraction =
            numerator.length > 0 &&
            denominator.length > 0 &&
            denominator.length <= 24 &&
            !/[;,]/.test(
                denominator
            );

        if (
            !plausibleFraction
        ) {
            output +=
                source.slice(
                    index,
                    first.end
                );

            index =
                first.end;
            continue;
        }

        output +=
            "\\frac{" +
            first.content +
            "}{" +
            second.content +
            "}";

        index =
            second.end;
    }

    return output;
}


function repairCommonMathNotation(value) {
    const source =
        normalizeAccidentalDisplayProse(
            normalizeMathEscapes(
                value
            )
        );

    return source.replace(
        /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,
        match => {
            const isDisplay =
                match.startsWith(
                    "\\["
                );
            const body =
                match.slice(
                    2,
                    -2
                );

            const repaired =
                repairDroppedFractionCommands(
                    body
                ).replace(
                    /([a-zA-Z])([2-9])(?=\b|[a-zA-Z])/g,
                    (
                        token,
                        variable,
                        exponent,
                        offset,
                        full
                    ) => {
                        const before =
                            full.slice(
                                Math.max(
                                    0,
                                    offset - 14
                                ),
                                offset
                            );

                        if (
                            /\\(?:d?frac)\s*$/.test(
                                before
                            ) ||
                            /\\[a-zA-Z]+$/.test(
                                before
                            )
                        ) {
                            return token;
                        }

                        return (
                            variable +
                            "^{" +
                            exponent +
                            "}"
                        );
                    }
                );

            return (
                isDisplay
                    ? "\\[" +
                        repaired +
                        "\\]"
                    : "\\(" +
                        repaired +
                        "\\)"
            );
        }
    );
}


function renderInlineFormatting(
    value,
    compactMathLayout = false
) {

    const repaired =
        repairCommonMathNotation(
            compactMathLayout
                ? normalizeMathLayoutText(
                    value
                )
                : value
        );

    // Protect TeX before applying lightweight Markdown formatting.
    // Otherwise underscores used for subscripts (T_0, x_1, etc.)
    // and asterisks inside equations can be mistaken for emphasis
    // markers and corrupt otherwise valid MathJax input.
    const mathSegments = [];

    const protectedSource =
        repaired.replace(
            /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,
            match => {
                const index =
                    mathSegments.push(
                        match
                    ) - 1;

                return (
                    "\uE000MATH" +
                    index +
                    "\uE001"
                );
            }
        );

    const escaped =
        escapeHtml(
            protectedSource
        )
            .replace(
                /&lt;u&gt;([\s\S]*?)&lt;\/u&gt;/g,
                "<u>$1</u>"
            )
            .replace(
                /\*\*([^*]+)\*\*/g,
                "<strong>$1</strong>"
            )
            .replace(
                /\*([^*]+)\*/g,
                "<em>$1</em>"
            )
            .replace(
                /_([^_]+)_/g,
                "<em>$1</em>"
            );

    return escaped.replace(
        /\uE000MATH(\d+)\uE001/g,
        (
            match,
            index
        ) =>
            escapeHtml(
                mathSegments[
                    Number(index)
                ] || ""
            )
    );

}

function renderQuestionContent(
    question,
    value
) {
    return renderInlineFormatting(
        value,
        question?.section ===
            "Math"
    );
}


function renderQuestionTable(
    table,
    compactMathLayout = false
) {

    if (
        !table ||
        !Array.isArray(
            table.headers
        ) ||
        !Array.isArray(
            table.rows
        )
    ) {
        return "";
    }

    const headers =
        table.headers
            .map(
                header =>
                    "<th scope=\"col\">" +
                    renderInlineFormatting(
                        header,
                        compactMathLayout
                    ) +
                    "</th>"
            )
            .join("");

    const rows =
        table.rows
            .map(
                row =>
                    "<tr>" +
                    row
                        .map(
                            cell =>
                                "<td>" +
                                renderInlineFormatting(
                                    cell,
                                    compactMathLayout
                                ) +
                                "</td>"
                        )
                        .join("") +
                    "</tr>"
            )
            .join("");

    const caption =
        table.caption
            ? "<caption>" +
                renderInlineFormatting(
                    table.caption,
                    compactMathLayout
                ) +
              "</caption>"
            : "";

    return (
        '<div class="question-passage-table-wrap">' +
            '<table class="question-passage-table">' +
                caption +
                "<thead><tr>" +
                    headers +
                "</tr></thead>" +
                "<tbody>" +
                    rows +
                "</tbody>" +
            "</table>" +
        "</div>"
    );
}


function renderQuestionHorizontalBarGraph(
    graph
) {
    if (
        !graph ||
        !Array.isArray(graph.categories) ||
        !Array.isArray(graph.series) ||
        graph.categories.length === 0 ||
        graph.series.length === 0
    ) {
        return "";
    }

    const categories =
        graph.categories;

    const series =
        graph.series.filter(
            item =>
                item &&
                Array.isArray(item.values)
        );

    if (series.length === 0) {
        return "";
    }

    const values =
        series
            .flatMap(item => item.values)
            .map(value => Number(value))
            .filter(Number.isFinite);

    const configuredMax =
        Number(graph.max);

    const maxValue =
        configuredMax > 0
            ? configuredMax
            : Math.max(1, ...values);

    const configuredStep =
        Number(graph.tickStep);

    const tickStep =
        configuredStep > 0
            ? configuredStep
            : maxValue / 4;

    const width = 760;
    const left = 180;
    const right = 68;
    const top = 70;
    const bottom = 54;
    const rowHeight = 66;
    const plotWidth =
        width - left - right;
    const height =
        top +
        categories.length * rowHeight +
        bottom;

    const suffix =
        graph.valueSuffix || "";

    const formatValue =
        value => {
            const number =
                Number(value);

            if (!Number.isFinite(number)) {
                return String(value ?? "");
            }

            return (
                Number.isInteger(number)
                    ? String(number)
                    : number.toFixed(1)
            ) + suffix;
        };

    const ticks = [];
    for (
        let tick = 0;
        tick <= maxValue + 0.0001;
        tick += tickStep
    ) {
        ticks.push(
            Math.min(tick, maxValue)
        );

        if (ticks.length > 20) {
            break;
        }
    }

    if (
        Math.abs(
            ticks[ticks.length - 1] -
            maxValue
        ) > 0.0001
    ) {
        ticks.push(maxValue);
    }

    const legend =
        series
            .map(
                (item, index) =>
                    '<g>' +
                        '<rect class="question-graph-bar graph-series-' +
                        index +
                        '" x="' +
                        (left + index * 160) +
                        '" y="18" width="13" height="13" rx="3"></rect>' +
                        '<text class="question-graph-legend-text" x="' +
                        (left + 20 + index * 160) +
                        '" y="29">' +
                        escapeHtml(
                            item.name ||
                            ("Series " + (index + 1))
                        ) +
                        '</text>' +
                    '</g>'
            )
            .join("");

    const grid =
        ticks
            .map(
                tick => {
                    const x =
                        left +
                        (tick / maxValue) *
                        plotWidth;

                    return (
                        '<line class="question-graph-grid-line" x1="' +
                        x +
                        '" x2="' +
                        x +
                        '" y1="' +
                        top +
                        '" y2="' +
                        (height - bottom) +
                        '"></line>' +
                        '<text class="question-graph-tick" x="' +
                        x +
                        '" y="' +
                        (height - bottom + 22) +
                        '" text-anchor="middle">' +
                        escapeHtml(
                            formatValue(tick)
                        ) +
                        '</text>'
                    );
                }
            )
            .join("");

    const rows =
        categories
            .map(
                (category, categoryIndex) => {
                    const centerY =
                        top +
                        categoryIndex *
                        rowHeight +
                        rowHeight / 2;

                    const barHeight =
                        Math.max(
                            9,
                            Math.min(
                                13,
                                34 / series.length
                            )
                        );

                    const totalBarsHeight =
                        series.length *
                        barHeight +
                        (series.length - 1) * 4;

                    const firstY =
                        centerY -
                        totalBarsHeight / 2;

                    const bars =
                        series
                            .map(
                                (item, seriesIndex) => {
                                    const value =
                                        Number(
                                            item.values[
                                                categoryIndex
                                            ]
                                        );

                                    if (!Number.isFinite(value)) {
                                        return "";
                                    }

                                    const barWidth =
                                        Math.max(
                                            0,
                                            Math.min(
                                                plotWidth,
                                                (value / maxValue) *
                                                plotWidth
                                            )
                                        );

                                    const y =
                                        firstY +
                                        seriesIndex *
                                        (barHeight + 4);

                                    const nearEdge =
                                        barWidth >
                                        plotWidth - 48;

                                    return (
                                        '<rect class="question-graph-bar graph-series-' +
                                        seriesIndex +
                                        '" x="' +
                                        left +
                                        '" y="' +
                                        y +
                                        '" width="' +
                                        barWidth +
                                        '" height="' +
                                        barHeight +
                                        '" rx="3"></rect>' +
                                        '<text class="question-graph-value" x="' +
                                        (
                                            nearEdge
                                                ? left + barWidth - 5
                                                : left + barWidth + 7
                                        ) +
                                        '" y="' +
                                        (y + barHeight - 1) +
                                        '" text-anchor="' +
                                        (
                                            nearEdge
                                                ? "end"
                                                : "start"
                                        ) +
                                        '">' +
                                        escapeHtml(
                                            formatValue(value)
                                        ) +
                                        '</text>'
                                    );
                                }
                            )
                            .join("");

                    return (
                        '<text class="question-graph-category" x="' +
                        (left - 13) +
                        '" y="' +
                        (centerY + 4) +
                        '" text-anchor="end">' +
                        escapeHtml(category) +
                        '</text>' +
                        bars
                    );
                }
            )
            .join("");

    const caption =
        graph.caption
            ? '<figcaption class="question-graph-caption">' +
                renderInlineFormatting(
                    graph.caption
                ) +
              '</figcaption>'
            : "";

    const axisLabel =
        graph.xLabel
            ? '<text class="question-graph-axis-label" x="' +
                (left + plotWidth / 2) +
                '" y="' +
                (height - 5) +
                '" text-anchor="middle">' +
                escapeHtml(graph.xLabel) +
              '</text>'
            : "";

    return (
        '<figure class="question-graph-wrap">' +
            caption +
            '<div class="question-graph-scroll">' +
                '<svg class="question-graph" viewBox="0 0 ' +
                    width +
                    " " +
                    height +
                    '" role="img" aria-label="' +
                    escapeHtml(
                        graph.caption ||
                        "Question data graph"
                    ) +
                    '">' +
                    legend +
                    grid +
                    '<line class="question-graph-axis-line" x1="' +
                        left +
                        '" x2="' +
                        (left + plotWidth) +
                        '" y1="' +
                        (height - bottom) +
                        '" y2="' +
                        (height - bottom) +
                    '"></line>' +
                    rows +
                    axisLabel +
                '</svg>' +
            '</div>' +
        '</figure>'
    );
}



function renderQuestionLineGraph(
    graph
) {
    if (
        !graph ||
        !Array.isArray(graph.categories) ||
        !Array.isArray(graph.series) ||
        graph.categories.length < 2 ||
        graph.series.length === 0
    ) {
        return "";
    }

    const width = 760;
    const left = 62;
    const right = 28;
    const top = 64;
    const bottom = 58;
    const height = 390;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const allValues =
        graph.series
            .flatMap(item => item.values || [])
            .map(Number)
            .filter(Number.isFinite);

    const configuredMin = Number(graph.min);
    const configuredMax = Number(graph.max);

    const minValue =
        Number.isFinite(configuredMin)
            ? configuredMin
            : Math.min(0, ...allValues);

    const maxValue =
        Number.isFinite(configuredMax) &&
        configuredMax > minValue
            ? configuredMax
            : Math.max(minValue + 1, ...allValues);

    const tickStep =
        Number(graph.tickStep) > 0
            ? Number(graph.tickStep)
            : (maxValue - minValue) / 4;

    const scaleX =
        index =>
            left +
            (
                index /
                (graph.categories.length - 1)
            ) *
            plotWidth;

    const scaleY =
        value =>
            top +
            (
                (maxValue - value) /
                (maxValue - minValue)
            ) *
            plotHeight;

    const ticks = [];
    for (
        let value = minValue;
        value <= maxValue + 0.0001;
        value += tickStep
    ) {
        ticks.push(
            Math.min(value, maxValue)
        );
        if (ticks.length > 20) break;
    }

    if (
        Math.abs(
            ticks[ticks.length - 1] -
            maxValue
        ) > 0.0001
    ) {
        ticks.push(maxValue);
    }

    const formatValue =
        value => {
            const n = Number(value);
            const shown =
                Number.isInteger(n)
                    ? String(n)
                    : n.toFixed(1);
            return shown + (graph.valueSuffix || "");
        };

    const yGrid =
        ticks.map(value => {
            const y = scaleY(value);
            return (
                '<line class="question-graph-grid-line" x1="' +
                left +
                '" x2="' +
                (left + plotWidth) +
                '" y1="' +
                y +
                '" y2="' +
                y +
                '"></line>' +
                '<text class="question-graph-tick" x="' +
                (left - 9) +
                '" y="' +
                (y + 3) +
                '" text-anchor="end">' +
                escapeHtml(formatValue(value)) +
                '</text>'
            );
        }).join("");

    const xLabels =
        graph.categories.map((category,index) => (
            '<text class="question-graph-tick" x="' +
            scaleX(index) +
            '" y="' +
            (height - bottom + 22) +
            '" text-anchor="middle">' +
            escapeHtml(category) +
            '</text>'
        )).join("");

    const seriesSvg =
        graph.series.map((item,seriesIndex) => {
            const points =
                (item.values || [])
                    .map((value,index) => {
                        const n=Number(value);
                        if(!Number.isFinite(n)) return null;
                        return [
                            scaleX(index),
                            scaleY(n),
                            n
                        ];
                    })
                    .filter(Boolean);

            if(points.length===0) return "";

            const polyline =
                points.map(point =>
                    point[0] + "," + point[1]
                ).join(" ");

            const pointSvg =
                points.map(point => (
                    '<circle class="question-graph-point graph-series-' +
                    seriesIndex +
                    '" cx="' +
                    point[0] +
                    '" cy="' +
                    point[1] +
                    '" r="4.2"></circle>'
                )).join("");

            return (
                '<polyline class="question-graph-line graph-series-' +
                seriesIndex +
                '" points="' +
                polyline +
                '"></polyline>' +
                pointSvg
            );
        }).join("");

    const legend =
        graph.series.map((item,index) => (
            '<g>' +
                '<line class="question-graph-line graph-series-' +
                index +
                '" x1="' +
                (left + index * 150) +
                '" x2="' +
                (left + 20 + index * 150) +
                '" y1="24" y2="24"></line>' +
                '<circle class="question-graph-point graph-series-' +
                index +
                '" cx="' +
                (left + 10 + index * 150) +
                '" cy="24" r="3.5"></circle>' +
                '<text class="question-graph-legend-text" x="' +
                (left + 27 + index * 150) +
                '" y="28">' +
                escapeHtml(item.name || ("Series " + (index + 1))) +
                '</text>' +
            '</g>'
        )).join("");

    const caption =
        graph.caption
            ? '<figcaption class="question-graph-caption">' +
                renderInlineFormatting(graph.caption) +
              '</figcaption>'
            : "";

    return (
        '<figure class="question-graph-wrap">' +
            caption +
            '<div class="question-graph-scroll">' +
                '<svg class="question-graph" viewBox="0 0 ' +
                width +
                " " +
                height +
                '" role="img" aria-label="' +
                escapeHtml(graph.caption || "Question data graph") +
                '">' +
                    legend +
                    yGrid +
                    '<line class="question-graph-axis-line" x1="' +
                    left +
                    '" x2="' +
                    left +
                    '" y1="' +
                    top +
                    '" y2="' +
                    (top + plotHeight) +
                    '"></line>' +
                    '<line class="question-graph-axis-line" x1="' +
                    left +
                    '" x2="' +
                    (left + plotWidth) +
                    '" y1="' +
                    (top + plotHeight) +
                    '" y2="' +
                    (top + plotHeight) +
                    '"></line>' +
                    xLabels +
                    seriesSvg +
                '</svg>' +
            '</div>' +
        '</figure>'
    );
}


function renderQuestionVerticalBarGraph(
    graph
) {
    if (
        !graph ||
        !Array.isArray(graph.categories) ||
        !Array.isArray(graph.series) ||
        graph.categories.length === 0 ||
        graph.series.length === 0
    ) {
        return "";
    }

    const width = 760;
    const left = 64;
    const right = 28;
    const top = 54;
    const bottom = 64;
    const height = 390;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const values =
        graph.series
            .flatMap(item => item.values || [])
            .map(Number)
            .filter(Number.isFinite);

    const maxValue =
        Number(graph.max) > 0
            ? Number(graph.max)
            : Math.max(1, ...values);

    const tickStep =
        Number(graph.tickStep) > 0
            ? Number(graph.tickStep)
            : maxValue / 4;

    const ticks=[];
    for(let value=0;value<=maxValue+0.0001;value+=tickStep){
        ticks.push(Math.min(value,maxValue));
        if(ticks.length>20) break;
    }
    if(Math.abs(ticks[ticks.length-1]-maxValue)>0.0001){
        ticks.push(maxValue);
    }

    const y =
        value =>
            top +
            (1 - value / maxValue) *
            plotHeight;

    const grid =
        ticks.map(value => (
            '<line class="question-graph-grid-line" x1="' +
            left +
            '" x2="' +
            (left + plotWidth) +
            '" y1="' +
            y(value) +
            '" y2="' +
            y(value) +
            '"></line>' +
            '<text class="question-graph-tick" x="' +
            (left - 9) +
            '" y="' +
            (y(value) + 3) +
            '" text-anchor="end">' +
            escapeHtml(String(value)) +
            '</text>'
        )).join("");

    const groupWidth =
        plotWidth / graph.categories.length;

    const barCount =
        Math.max(1, graph.series.length);

    const barWidth =
        Math.min(
            58,
            groupWidth * 0.62 / barCount
        );

    const bars =
        graph.categories.map((category,catIndex) => {
            const center =
                left +
                groupWidth * catIndex +
                groupWidth / 2;

            const seriesBars =
                graph.series.map((item,seriesIndex) => {
                    const value=Number(item.values?.[catIndex]);
                    if(!Number.isFinite(value)) return "";
                    const barX =
                        center -
                        (barWidth * barCount) / 2 +
                        barWidth * seriesIndex;
                    const barY=y(value);
                    const barHeight =
                        top + plotHeight - barY;

                    return (
                        '<rect class="question-graph-bar graph-series-' +
                        seriesIndex +
                        '" x="' +
                        barX +
                        '" y="' +
                        barY +
                        '" width="' +
                        (barWidth - 3) +
                        '" height="' +
                        barHeight +
                        '" rx="4"></rect>' +
                        '<text class="question-graph-value" x="' +
                        (barX + (barWidth - 3)/2) +
                        '" y="' +
                        (barY - 7) +
                        '" text-anchor="middle">' +
                        escapeHtml(String(value)) +
                        '</text>'
                    );
                }).join("");

            return (
                seriesBars +
                '<text class="question-graph-category" x="' +
                center +
                '" y="' +
                (height - bottom + 25) +
                '" text-anchor="middle">' +
                escapeHtml(category) +
                '</text>'
            );
        }).join("");

    const caption =
        graph.caption
            ? '<figcaption class="question-graph-caption">' +
                renderInlineFormatting(graph.caption) +
              '</figcaption>'
            : "";

    return (
        '<figure class="question-graph-wrap">' +
            caption +
            '<div class="question-graph-scroll">' +
                '<svg class="question-graph" viewBox="0 0 ' +
                width +
                " " +
                height +
                '" role="img" aria-label="' +
                escapeHtml(graph.caption || "Question data graph") +
                '">' +
                    grid +
                    '<line class="question-graph-axis-line" x1="' +
                    left +
                    '" x2="' +
                    left +
                    '" y1="' +
                    top +
                    '" y2="' +
                    (top + plotHeight) +
                    '"></line>' +
                    '<line class="question-graph-axis-line" x1="' +
                    left +
                    '" x2="' +
                    (left + plotWidth) +
                    '" y1="' +
                    (top + plotHeight) +
                    '" y2="' +
                    (top + plotHeight) +
                    '"></line>' +
                    bars +
                '</svg>' +
            '</div>' +
        '</figure>'
    );
}


function getNiceGraphStep(
    range,
    targetTicks
) {
    const safeRange =
        Math.abs(
            Number(range)
        );

    if (
        !Number.isFinite(safeRange) ||
        safeRange <= 0
    ) {
        return 1;
    }

    const raw =
        safeRange /
        Math.max(
            2,
            Number(targetTicks) || 8
        );

    const magnitude =
        Math.pow(
            10,
            Math.floor(
                Math.log10(raw)
            )
        );

    const normalized =
        raw / magnitude;

    let nice = 1;

    if (normalized > 7.5) {
        nice = 10;
    } else if (normalized > 3.5) {
        nice = 5;
    } else if (normalized > 2.25) {
        nice = 2.5;
    } else if (normalized > 1.5) {
        nice = 2;
    }

    return nice * magnitude;
}


function formatGraphTick(
    value,
    step
) {
    const numeric =
        Math.abs(Number(value)) < 1e-10
            ? 0
            : Number(value);

    if (!Number.isFinite(numeric)) {
        return "";
    }

    const safeStep =
        Math.abs(
            Number(step)
        );

    let decimals = 0;

    if (
        Number.isFinite(safeStep) &&
        safeStep > 0 &&
        safeStep < 1
    ) {
        decimals =
            Math.min(
                4,
                Math.max(
                    0,
                    Math.ceil(
                        -Math.log10(
                            safeStep
                        )
                    ) + 1
                )
            );
    } else if (
        Number.isFinite(safeStep) &&
        Math.abs(
            safeStep -
            Math.round(safeStep)
        ) > 1e-9
    ) {
        decimals = 1;
    }

    return numeric
        .toFixed(decimals)
        .replace(/\.0+$/, "")
        .replace(
            /(\.\d*?[1-9])0+$/,
            "$1"
        );
}


function getExtendedLinearSeriesPoints(
    points,
    xMin,
    xMax,
    yMin,
    yMax
) {
    if (
        !Array.isArray(points) ||
        points.length < 2
    ) {
        return null;
    }

    const first =
        points[0].map(Number);

    const second =
        points.find(
            point =>
                Math.abs(
                    Number(point[0]) -
                    first[0]
                ) > 1e-10 ||
                Math.abs(
                    Number(point[1]) -
                    first[1]
                ) > 1e-10
        );

    if (!second) {
        return null;
    }

    const x1 = first[0];
    const y1 = first[1];
    const x2 = Number(second[0]);
    const y2 = Number(second[1]);
    const dx = x2 - x1;
    const dy = y2 - y1;

    const collinear =
        points.every(
            point => {
                const px =
                    Number(point[0]);
                const py =
                    Number(point[1]);

                return Math.abs(
                    dx * (py - y1) -
                    dy * (px - x1)
                ) <=
                    1e-7 *
                    Math.max(
                        1,
                        Math.abs(dx),
                        Math.abs(dy)
                    );
            }
        );

    if (!collinear) {
        return null;
    }

    if (Math.abs(dx) < 1e-10) {
        if (
            x1 < xMin ||
            x1 > xMax
        ) {
            return null;
        }

        return [
            [x1, yMin],
            [x1, yMax]
        ];
    }

    const slope = dy / dx;
    const candidates = [];

    const addCandidate =
        (x, y) => {
            if (
                x >= xMin - 1e-8 &&
                x <= xMax + 1e-8 &&
                y >= yMin - 1e-8 &&
                y <= yMax + 1e-8 &&
                Number.isFinite(x) &&
                Number.isFinite(y)
            ) {
                const duplicate =
                    candidates.some(
                        point =>
                            Math.abs(
                                point[0] - x
                            ) < 1e-7 &&
                            Math.abs(
                                point[1] - y
                            ) < 1e-7
                    );

                if (!duplicate) {
                    candidates.push(
                        [x, y]
                    );
                }
            }
        };

    addCandidate(
        xMin,
        y1 +
            slope *
            (xMin - x1)
    );

    addCandidate(
        xMax,
        y1 +
            slope *
            (xMax - x1)
    );

    if (Math.abs(slope) > 1e-10) {
        addCandidate(
            x1 +
                (yMin - y1) /
                slope,
            yMin
        );

        addCandidate(
            x1 +
                (yMax - y1) /
                slope,
            yMax
        );
    } else {
        addCandidate(
            xMin,
            y1
        );

        addCandidate(
            xMax,
            y1
        );
    }

    if (candidates.length < 2) {
        return null;
    }

    let bestPair = [
        candidates[0],
        candidates[1]
    ];
    let bestDistance = -1;

    for (
        let i = 0;
        i < candidates.length;
        i++
    ) {
        for (
            let j = i + 1;
            j < candidates.length;
            j++
        ) {
            const distance =
                Math.pow(
                    candidates[i][0] -
                    candidates[j][0],
                    2
                ) +
                Math.pow(
                    candidates[i][1] -
                    candidates[j][1],
                    2
                );

            if (distance > bestDistance) {
                bestDistance = distance;
                bestPair = [
                    candidates[i],
                    candidates[j]
                ];
            }
        }
    }

    return bestPair;
}


function getQuadraticGraphSamples(
    points,
    xMin,
    xMax
) {
    if (
        !Array.isArray(points) ||
        points.length < 3
    ) {
        return null;
    }

    const first = points[0];
    const middle =
        points[
            Math.floor(
                points.length / 2
            )
        ];
    const last =
        points[
            points.length - 1
        ];

    const x1 = Number(first[0]);
    const y1 = Number(first[1]);
    const x2 = Number(middle[0]);
    const y2 = Number(middle[1]);
    const x3 = Number(last[0]);
    const y3 = Number(last[1]);

    const determinant =
        x1 * x1 * (x2 - x3) -
        x1 * (x2 * x2 - x3 * x3) +
        x2 * x2 * x3 -
        x2 * x3 * x3;

    if (
        !Number.isFinite(
            determinant
        ) ||
        Math.abs(determinant) <
            1e-9
    ) {
        return null;
    }

    const a =
        (
            y1 * (x2 - x3) -
            x1 * (y2 - y3) +
            y2 * x3 -
            x2 * y3
        ) /
        determinant;

    const b =
        (
            x1 * x1 * (y2 - y3) -
            y1 * (x2 * x2 - x3 * x3) +
            x2 * x2 * y3 -
            y2 * x3 * x3
        ) /
        determinant;

    const c =
        (
            x1 * x1 *
            (x2 * y3 - y2 * x3) -
            x1 *
            (
                x2 * x2 * y3 -
                y2 * x3 * x3
            ) +
            y1 *
            (
                x2 * x2 * x3 -
                x2 * x3 * x3
            )
        ) /
        determinant;

    if (
        ![a, b, c].every(
            Number.isFinite
        ) ||
        Math.abs(a) < 1e-8
    ) {
        return null;
    }

    const yValues =
        points.map(
            point =>
                Number(point[1])
        );

    const yRange =
        Math.max(
            1,
            Math.max(...yValues) -
            Math.min(...yValues)
        );

    const matchesQuadratic =
        points.every(
            point => {
                const x =
                    Number(point[0]);
                const actual =
                    Number(point[1]);
                const expected =
                    a * x * x +
                    b * x +
                    c;

                return (
                    Math.abs(
                        actual -
                        expected
                    ) <=
                    Math.max(
                        1e-5,
                        yRange * 0.002
                    )
                );
            }
        );

    if (!matchesQuadratic) {
        return null;
    }

    const sampleCount = 220;
    const samples = [];

    for (
        let i = 0;
        i <= sampleCount;
        i++
    ) {
        const x =
            xMin +
            (
                (xMax - xMin) *
                i /
                sampleCount
            );

        samples.push(
            [
                x,
                a * x * x +
                    b * x +
                    c
            ]
        );
    }

    return samples;
}


function buildSmoothGraphPath(
    points,
    xScale,
    yScale
) {
    if (
        !Array.isArray(points) ||
        points.length === 0
    ) {
        return "";
    }

    const scaled =
        points.map(
            point => [
                xScale(
                    Number(point[0])
                ),
                yScale(
                    Number(point[1])
                )
            ]
        );

    if (scaled.length === 1) {
        return (
            "M " +
            scaled[0][0] +
            " " +
            scaled[0][1]
        );
    }

    if (scaled.length === 2) {
        return (
            "M " +
            scaled[0][0] +
            " " +
            scaled[0][1] +
            " L " +
            scaled[1][0] +
            " " +
            scaled[1][1]
        );
    }

    let path =
        "M " +
        scaled[0][0] +
        " " +
        scaled[0][1];

    const tension = 0.16;

    for (
        let i = 0;
        i < scaled.length - 1;
        i++
    ) {
        const p0 =
            scaled[
                Math.max(
                    0,
                    i - 1
                )
            ];

        const p1 =
            scaled[i];

        const p2 =
            scaled[i + 1];

        const p3 =
            scaled[
                Math.min(
                    scaled.length - 1,
                    i + 2
                )
            ];

        const cp1x =
            p1[0] +
            (
                p2[0] -
                p0[0]
            ) *
            tension;

        const cp1y =
            p1[1] +
            (
                p2[1] -
                p0[1]
            ) *
            tension;

        const cp2x =
            p2[0] -
            (
                p3[0] -
                p1[0]
            ) *
            tension;

        const cp2y =
            p2[1] -
            (
                p3[1] -
                p1[1]
            ) *
            tension;

        path +=
            " C " +
            cp1x +
            " " +
            cp1y +
            ", " +
            cp2x +
            " " +
            cp2y +
            ", " +
            p2[0] +
            " " +
            p2[1];
    }

    return path;
}


function renderQuestionXYGraph(graph) {
    const xMin =
        Number.isFinite(Number(graph?.xMin))
            ? Number(graph.xMin)
            : -10;
    const xMax =
        Number.isFinite(Number(graph?.xMax))
            ? Number(graph.xMax)
            : 10;
    const yMin =
        Number.isFinite(Number(graph?.yMin))
            ? Number(graph.yMin)
            : -10;
    const yMax =
        Number.isFinite(Number(graph?.yMax))
            ? Number(graph.yMax)
            : 10;

    if (
        xMax <= xMin ||
        yMax <= yMin
    ) {
        return "";
    }

    const width = 720;
    const height = 500;
    const left = 78;
    const right = 34;
    const top = 34;
    const bottom = 72;
    const plotWidth =
        width - left - right;
    const plotHeight =
        height - top - bottom;

    const xScale =
        value =>
            left +
            (
                (value - xMin) /
                (xMax - xMin)
            ) *
            plotWidth;

    const yScale =
        value =>
            top +
            (
                (yMax - value) /
                (yMax - yMin)
            ) *
            plotHeight;

    const configuredXStep =
        Number(graph.xStep) > 0
            ? Number(graph.xStep)
            : null;
    const configuredYStep =
        Number(graph.yStep) > 0
            ? Number(graph.yStep)
            : null;

    const xGridStep =
        configuredXStep ||
        getNiceGraphStep(
            xMax - xMin,
            Math.min(
                22,
                plotWidth / 30
            )
        );

    const yGridStep =
        configuredYStep ||
        getNiceGraphStep(
            yMax - yMin,
            Math.min(
                20,
                plotHeight / 24
            )
        );

    const desiredXLabelStep =
        getNiceGraphStep(
            xMax - xMin,
            plotWidth / 52
        );

    const desiredYLabelStep =
        getNiceGraphStep(
            yMax - yMin,
            plotHeight / 31
        );

    const xLabelEvery =
        Math.max(
            1,
            Math.ceil(
                desiredXLabelStep /
                xGridStep -
                1e-9
            )
        );

    const yLabelEvery =
        Math.max(
            1,
            Math.ceil(
                desiredYLabelStep /
                yGridStep -
                1e-9
            )
        );

    const xStart =
        Math.ceil(
            xMin / xGridStep -
            1e-10
        ) * xGridStep;

    const yStart =
        Math.ceil(
            yMin / yGridStep -
            1e-10
        ) * yGridStep;

    let grid = "";

    let xIndex = 0;

    for (
        let x = xStart;
        x <= xMax + 1e-9;
        x += xGridStep
    ) {
        const px =
            xScale(x);
        const axis =
            Math.abs(x) < 1e-9;
        const major =
            xIndex %
                xLabelEvery ===
            0;

        grid +=
            '<line class="' +
            (
                axis
                    ? "question-xy-axis"
                    : (
                        major
                            ? "question-xy-grid question-xy-grid-major"
                            : "question-xy-grid question-xy-grid-minor"
                    )
            ) +
            '" x1="' +
            px +
            '" x2="' +
            px +
            '" y1="' +
            top +
            '" y2="' +
            (top + plotHeight) +
            '"></line>';

        if (major) {
            grid +=
                '<line class="question-xy-tick-mark" x1="' +
                px +
                '" x2="' +
                px +
                '" y1="' +
                (top + plotHeight) +
                '" y2="' +
                (top + plotHeight + 6) +
                '"></line>' +
                '<text class="question-xy-tick" x="' +
                px +
                '" y="' +
                (top + plotHeight + 24) +
                '" text-anchor="middle">' +
                escapeHtml(
                    formatGraphTick(
                        x,
                        xGridStep *
                        xLabelEvery
                    )
                ) +
                '</text>';
        }

        xIndex++;
    }

    let yIndex = 0;

    for (
        let y = yStart;
        y <= yMax + 1e-9;
        y += yGridStep
    ) {
        const py =
            yScale(y);
        const axis =
            Math.abs(y) < 1e-9;
        const major =
            yIndex %
                yLabelEvery ===
            0;

        grid +=
            '<line class="' +
            (
                axis
                    ? "question-xy-axis"
                    : (
                        major
                            ? "question-xy-grid question-xy-grid-major"
                            : "question-xy-grid question-xy-grid-minor"
                    )
            ) +
            '" x1="' +
            left +
            '" x2="' +
            (left + plotWidth) +
            '" y1="' +
            py +
            '" y2="' +
            py +
            '"></line>';

        if (major) {
            grid +=
                '<line class="question-xy-tick-mark" x1="' +
                (left - 6) +
                '" x2="' +
                left +
                '" y1="' +
                py +
                '" y2="' +
                py +
                '"></line>' +
                '<text class="question-xy-tick" x="' +
                (left - 11) +
                '" y="' +
                (py + 4) +
                '" text-anchor="end">' +
                escapeHtml(
                    formatGraphTick(
                        y,
                        yGridStep *
                        yLabelEvery
                    )
                ) +
                '</text>';
        }

        yIndex++;
    }

    const axes =
        '<rect class="question-xy-plot-border" x="' +
        left +
        '" y="' +
        top +
        '" width="' +
        plotWidth +
        '" height="' +
        plotHeight +
        '"></rect>' +
        (
            yMin <= 0 &&
            yMax >= 0
                ? '<line class="question-xy-axis question-xy-axis-emphasis" x1="' +
                    left +
                    '" x2="' +
                    (left + plotWidth) +
                    '" y1="' +
                    yScale(0) +
                    '" y2="' +
                    yScale(0) +
                    '" marker-end="url(#question-xy-arrow)"></line>'
                : ""
        ) +
        (
            xMin <= 0 &&
            xMax >= 0
                ? '<line class="question-xy-axis question-xy-axis-emphasis" x1="' +
                    xScale(0) +
                    '" x2="' +
                    xScale(0) +
                    '" y1="' +
                    (top + plotHeight) +
                    '" y2="' +
                    top +
                    '" marker-end="url(#question-xy-arrow)"></line>'
                : ""
        );

    const legendItems = [];

    const series =
        (graph.series || [])
            .map(
                (item, seriesIndex) => {
                    const points =
                        Array.isArray(item?.points)
                            ? item.points
                                .filter(
                                    point =>
                                        Array.isArray(point) &&
                                        Number.isFinite(
                                            Number(point[0])
                                        ) &&
                                        Number.isFinite(
                                            Number(point[1])
                                        )
                                )
                                .map(
                                    point => [
                                        Number(point[0]),
                                        Number(point[1])
                                    ]
                                )
                            : [];

                    if (!points.length) {
                        return "";
                    }

                    if (item.label) {
                        legendItems.push({
                            label:
                                String(item.label),
                            seriesIndex
                        });
                    }

                    const extended =
                        item.connect === false
                            ? null
                            : getExtendedLinearSeriesPoints(
                                points,
                                xMin,
                                xMax,
                                yMin,
                                yMax
                            );

                    const quadraticSamples =
                        (
                            item.connect === false ||
                            extended
                        )
                            ? null
                            : getQuadraticGraphSamples(
                                points,
                                xMin,
                                xMax
                            );

                    const linePoints =
                        extended ||
                        quadraticSamples ||
                        points;

                    const lineMarkup =
                        item.connect === false
                            ? ""
                            : (
                                extended
                                    ? (
                                        '<path class="question-xy-series series-' +
                                        seriesIndex +
                                        '" d="M ' +
                                        xScale(
                                            linePoints[0][0]
                                        ) +
                                        " " +
                                        yScale(
                                            linePoints[0][1]
                                        ) +
                                        " L " +
                                        xScale(
                                            linePoints[1][0]
                                        ) +
                                        " " +
                                        yScale(
                                            linePoints[1][1]
                                        ) +
                                        '"></path>'
                                    )
                                    : (
                                        '<path class="question-xy-series series-' +
                                        seriesIndex +
                                        '" d="' +
                                        buildSmoothGraphPath(
                                            linePoints,
                                            xScale,
                                            yScale
                                        ) +
                                        '"></path>'
                                    )
                            );

                    const visiblePointIndices =
                        points
                            .map(
                                (
                                    point,
                                    pointIndex
                                ) => ({
                                    point,
                                    pointIndex
                                })
                            )
                            .filter(
                                entry =>
                                    item.showPoints ||
                                    (
                                        Array.isArray(
                                            item.highlightIndices
                                        ) &&
                                        item.highlightIndices.includes(
                                            entry.pointIndex
                                        )
                                    )
                            );

                    const dots =
                        visiblePointIndices
                            .map(
                                entry => {
                                    const highlighted =
                                        Array.isArray(
                                            item.highlightIndices
                                        ) &&
                                        item.highlightIndices.includes(
                                            entry.pointIndex
                                        );

                                    return (
                                        '<circle class="question-xy-point series-' +
                                        seriesIndex +
                                        (
                                            highlighted
                                                ? " question-xy-point-highlight"
                                                : ""
                                        ) +
                                        '" cx="' +
                                        xScale(
                                            entry.point[0]
                                        ) +
                                        '" cy="' +
                                        yScale(
                                            entry.point[1]
                                        ) +
                                        '" r="' +
                                        (
                                            highlighted
                                                ? "6"
                                                : "5"
                                        ) +
                                        '"></circle>'
                                    );
                                }
                            )
                            .join("");

                    const labelPoints =
                        Boolean(
                            item.labelPoints ||
                            graph.labelPoints
                        );

                    const pointLabels =
                        labelPoints
                            ? visiblePointIndices
                                .map(
                                    entry => {
                                        const px =
                                            xScale(
                                                entry.point[0]
                                            );
                                        const py =
                                            yScale(
                                                entry.point[1]
                                            );
                                        const nearRight =
                                            px >
                                            left +
                                            plotWidth -
                                            80;
                                        const nearTop =
                                            py <
                                            top + 28;

                                        return (
                                            '<text class="question-xy-point-label" x="' +
                                            (
                                                px +
                                                (
                                                    nearRight
                                                        ? -9
                                                        : 9
                                                )
                                            ) +
                                            '" y="' +
                                            (
                                                py +
                                                (
                                                    nearTop
                                                        ? 18
                                                        : -9
                                                )
                                            ) +
                                            '" text-anchor="' +
                                            (
                                                nearRight
                                                    ? "end"
                                                    : "start"
                                            ) +
                                            '">' +
                                            escapeHtml(
                                                "(" +
                                                formatGraphTick(
                                                    entry.point[0],
                                                    xGridStep
                                                ) +
                                                ", " +
                                                formatGraphTick(
                                                    entry.point[1],
                                                    yGridStep
                                                ) +
                                                ")"
                                            ) +
                                            '</text>'
                                        );
                                    }
                                )
                                .join("")
                            : "";

                    return (
                        lineMarkup +
                        dots +
                        pointLabels
                    );
                }
            )
            .join("");

    const xLabel =
        graph.xLabel ||
        "x";

    const yLabel =
        graph.yLabel ||
        "y";

    const axisLabels =
        '<text class="question-xy-axis-label question-xy-x-label" x="' +
        (left + plotWidth / 2) +
        '" y="' +
        (height - 13) +
        '" text-anchor="middle">' +
        escapeHtml(xLabel) +
        '</text>' +
        '<text class="question-xy-axis-label question-xy-y-label" transform="translate(20 ' +
        (top + plotHeight / 2) +
        ') rotate(-90)" text-anchor="middle">' +
        escapeHtml(yLabel) +
        '</text>';

    const legend =
        legendItems.length
            ? (
                '<g class="question-xy-legend">' +
                legendItems
                    .map(
                        (
                            entry,
                            index
                        ) =>
                            '<g transform="translate(' +
                            (
                                left +
                                plotWidth -
                                118
                            ) +
                            " " +
                            (
                                top +
                                18 +
                                index * 22
                            ) +
                            ')">' +
                            '<line class="question-xy-series series-' +
                            entry.seriesIndex +
                            '" x1="0" x2="22" y1="0" y2="0"></line>' +
                            '<text class="question-xy-legend-text" x="30" y="4">' +
                            escapeHtml(
                                entry.label
                            ) +
                            '</text>' +
                            '</g>'
                    )
                    .join("") +
                '</g>'
            )
            : "";

    const caption =
        graph.caption
            ? '<figcaption class="question-graph-caption">' +
                renderInlineFormatting(
                    graph.caption
                ) +
              '</figcaption>'
            : "";

    return (
        '<figure class="question-graph-wrap question-xy-wrap">' +
            caption +
            '<div class="question-graph-scroll">' +
                '<svg class="question-xy-graph" viewBox="0 0 ' +
                    width +
                    " " +
                    height +
                    '" role="img" aria-label="' +
                    escapeHtml(
                        graph.caption ||
                        "Coordinate graph"
                    ) +
                    '">' +
                    '<defs>' +
                        '<clipPath id="question-xy-clip">' +
                            '<rect x="' +
                            left +
                            '" y="' +
                            top +
                            '" width="' +
                            plotWidth +
                            '" height="' +
                            plotHeight +
                            '"></rect>' +
                        '</clipPath>' +
                        '<marker id="question-xy-arrow" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto" markerUnits="strokeWidth">' +
                            '<path d="M0,0 L7,3.5 L0,7 z" class="question-xy-arrow-head"></path>' +
                        '</marker>' +
                    '</defs>' +
                    grid +
                    axes +
                    '<g clip-path="url(#question-xy-clip)">' +
                        series +
                    '</g>' +
                    legend +
                    axisLabels +
                '</svg>' +
            '</div>' +
        '</figure>'
    );
}

function renderQuestionGraph(
    graph
) {
    if (graph?.type === "xy") {
        return renderQuestionXYGraph(
            graph
        );
    }

    if (graph?.type === "line") {
        return renderQuestionLineGraph(graph);
    }

    if (graph?.type === "vertical-bar") {
        return renderQuestionVerticalBarGraph(graph);
    }

    return renderQuestionHorizontalBarGraph(graph);
}


function renderQuestionPassage(
    question
) {
    const visual =
        question.graph
            ? renderQuestionGraph(
                question.graph
            )
            : renderQuestionTable(
                question.table,
                question.section ===
                    "Math"
            );

    const copy =
        question.passage
            ? '<div class="question-passage-copy">' +
                renderQuestionContent(
                    question,
                    question.passage
                ) +
              '</div>'
            : "";

    return (
        visual +
        copy
    );
}


function getReviewStorageKey() {

    return currentUser
        ? "absoluteprep-question-reviews:" +
            currentUser.id
        : null;

}


function getLocalReviewOverrides() {
    const key =
        getReviewStorageKey();

    if (!key) {
        return {};
    }

    try {
        const stored =
            JSON.parse(
                localStorage.getItem(
                    key
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
    } catch {
        return {};
    }
}

function saveLocalReviewOverrides(
    overrides
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
                overrides || {}
            )
        );
    } catch {
        // Local storage is a fallback.
    }
}

function getPracticeResetAt() {
    return currentUser
        ? localStorage.getItem(
            "absoluteprep-practice-reset:" +
            currentUser.id
        )
        : null;
}


function getQuestionBankNavigationState() {

    try {
        const raw =
            sessionStorage.getItem(
                "absoluteprep-question-bank-navigation"
            );

        if (!raw) {
            return null;
        }

        const parsed =
            JSON.parse(raw);

        if (
            !parsed ||
            !Array.isArray(
                parsed.questionIds
            ) ||
            parsed.questionIds.length === 0
        ) {
            return null;
        }

        if (
            parsed.userId &&
            currentUser &&
            String(parsed.userId) !==
                String(currentUser.id)
        ) {
            return null;
        }

        return parsed;
    } catch (error) {
        console.warn(
            "Could not read Question Bank navigation state:",
            error
        );
        return null;
    }
}


function saveQuestionBankNavigationState(
    questionIds,
    currentQuestionId
) {

    try {
        sessionStorage.setItem(
            "absoluteprep-question-bank-navigation",
            JSON.stringify({
                questionIds:
                    questionIds.map(
                        id => String(id)
                    ),
                currentQuestionId:
                    String(
                        currentQuestionId
                    ),
                userId:
                    currentUser
                        ? currentUser.id
                        : null
            })
        );
    } catch (error) {
        console.warn(
            "Could not save Question Bank navigation state:",
            error
        );
    }
}


function updateQuestionUrl(
    questionId
) {

    const url =
        new URL(
            window.location.href
        );

    url.searchParams.set(
        "id",
        String(questionId)
    );

    window.history.replaceState(
        {},
        "",
        url.toString()
    );
}


function resetQuestionForNavigation() {

    const question =
        questions[
            currentQuestionIndex
        ];

    if (!question) {
        return;
    }

    answers = {};

    eliminatedChoices = {};

    checkedResults = {};

    wrongAttempts = {};

    markedForReview =
        {};

    submitted = false;

    resetQuestionTimer();

    return question;
}


function updateNextQuestionButton() {

    if (!nextQuestionButton) {
        return;
    }

    const question =
        questions[
            currentQuestionIndex
        ];

    const isChecked =
        Boolean(
            question &&
            checkedResults[
                question.id
            ]
        );

    const hasNext =
        currentQuestionIndex <
        questions.length - 1;

    nextQuestionButton.classList.toggle(
        "hidden",
        !(
            isChecked &&
            hasNext
        )
    );
}


async function goToNextQuestion() {

    if (
        currentQuestionIndex >=
        questions.length - 1
    ) {
        return;
    }

    currentQuestionIndex += 1;

    resetQuestionForNavigation();

    const nextQuestion =
        questions[
            currentQuestionIndex
        ];

    saveQuestionBankNavigationState(
        questions.map(
            question =>
                question.id
        ),
        nextQuestion.id
    );

    updateQuestionUrl(
        nextQuestion.id
    );

    await loadQuestionReviewState(
        nextQuestion.id
    );

    renderCurrentQuestion();

    requestAnimationFrame(
        () => {
            const topbar =
                document.querySelector(
                    ".question-topbar"
                );

            if (!topbar) {
                return;
            }

            const topbarTop =
                topbar.getBoundingClientRect().top +
                window.scrollY;

            const offset =
                Math.max(
                    16,
                    window.innerHeight * 0.025
                );

            window.scrollTo({
                top:
                    Math.max(
                        0,
                        topbarTop - offset
                    ),
                behavior: "smooth"
            });
        }
    )
}


/* ============================================================
   MOCK TEST MODE
   ============================================================ */

function getMockStateStorageKey() {
    if (
        !currentUser ||
        !mockTestId
    ) {
        return null;
    }

    return (
        "lexlogica-mock-state:" +
        currentUser.id +
        ":" +
        mockTestId
    );
}


function saveMockState() {
    if (
        !mockTestMode ||
        !mockState
    ) {
        return;
    }

    mockState.answers =
        answers;

    mockState.markedForReview =
        markedForReview;

    const key =
        getMockStateStorageKey();

    if (!key) {
        return;
    }

    try {
        localStorage.setItem(
            key,
            JSON.stringify(
                mockState
            )
        );
    } catch (error) {
        console.warn(
            "Could not save mock-test progress:",
            error
        );
    }
}


function getMockStageInfo(
    stage = mockState?.currentStage
) {
    const map = {
        rw_m1: {
            sectionKey: "readingWriting",
            sectionLabel:
                "Reading and Writing",
            moduleLabel:
                "Module 1",
            minutes:
                mockManifest?.timing
                    ?.readingWritingModuleMinutes ||
                32
        },
        rw_m2: {
            sectionKey: "readingWriting",
            sectionLabel:
                "Reading and Writing",
            moduleLabel:
                "Module 2",
            minutes:
                mockManifest?.timing
                    ?.readingWritingModuleMinutes ||
                32
        },
        math_m1: {
            sectionKey: "math",
            sectionLabel:
                "Math",
            moduleLabel:
                "Module 1",
            minutes:
                mockManifest?.timing
                    ?.mathModuleMinutes ||
                35
        },
        math_m2: {
            sectionKey: "math",
            sectionLabel:
                "Math",
            moduleLabel:
                "Module 2",
            minutes:
                mockManifest?.timing
                    ?.mathModuleMinutes ||
                35
        }
    };

    return map[stage] || null;
}


function getMockStageEntries(
    stage = mockState?.currentStage
) {
    const info =
        getMockStageInfo(
            stage
        );

    if (
        !info ||
        !mockManifest
    ) {
        return [];
    }

    const section =
        mockManifest.sections?.[
            info.sectionKey
        ];

    if (!section) {
        return [];
    }

    if (
        stage === "rw_m1" ||
        stage === "math_m1"
    ) {
        return (
            section.module1 ||
            []
        );
    }

    const route =
        info.sectionKey ===
            "readingWriting"
            ? mockState?.routes
                ?.readingWriting
            : mockState?.routes
                ?.math;

    return route === "low"
        ? (
            section.module2Low ||
            []
        )
        : (
            section.module2High ||
            []
        );
}


function normalizeMockEntries(
    entries
) {
    return (
        entries || []
    ).map(
        (
            entry,
            index
        ) => {
            const normalized =
                normalizeStagedQuestion(
                    entry.question,
                    index
                );

            normalized.mock_request_id =
                entry.requestId;

            normalized.mock_target_domain =
                entry.targetDomain;

            normalized.mock_target_subtopic =
                entry.targetSubtopic;

            normalized.mock_target_difficulty =
                entry.targetDifficulty;

            return normalized;
        }
    );
}


function getMockAllRouteQuestions() {
    if (
        !mockManifest ||
        !mockState
    ) {
        return [];
    }

    const rw =
        mockManifest.sections
            ?.readingWriting;

    const math =
        mockManifest.sections
            ?.math;

    const rwSecond =
        mockState.routes
            ?.readingWriting ===
                "low"
            ? rw?.module2Low
            : rw?.module2High;

    const mathSecond =
        mockState.routes
            ?.math ===
                "low"
            ? math?.module2Low
            : math?.module2High;

    return normalizeMockEntries(
        [
            ...(rw?.module1 || []),
            ...(rwSecond || []),
            ...(math?.module1 || []),
            ...(mathSecond || [])
        ]
    );
}


function getMockCurrentIndex() {
    return Number(
        mockState
            ?.currentQuestionIndexByStage
            ?.[
                mockState.currentStage
            ] || 0
    );
}


function setMockCurrentIndex(
    index
) {
    if (!mockState) {
        return;
    }

    if (
        !mockState
            .currentQuestionIndexByStage
    ) {
        mockState
            .currentQuestionIndexByStage =
            {};
    }

    mockState
        .currentQuestionIndexByStage[
            mockState.currentStage
        ] =
        index;

    saveMockState();
}


function scoreMockQuestions(
    questionList
) {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questionList.forEach(
        question => {
            const selected =
                answers[
                    question.id
                ];

            if (
                selected ===
                    undefined ||
                selected ===
                    null ||
                String(selected)
                    .trim() ===
                    ""
            ) {
                unanswered += 1;
                return;
            }

            const isCorrect =
                question.answer_type ===
                    "student-response"
                    ? studentResponseIsCorrect(
                        question,
                        selected
                    )
                    : (
                        selected ===
                        question.correct_answer
                    );

            if (isCorrect) {
                correct += 1;
            } else {
                incorrect += 1;
            }
        }
    );

    return {
        correct,
        incorrect,
        unanswered,
        total:
            questionList.length
    };
}


function closeMockGate() {
    document
        .getElementById(
            "mock-gate-overlay"
        )
        ?.remove();

    document.body
        .classList.remove(
            "mock-gate-open"
        );

    if (mockBreakInterval) {
        clearInterval(
            mockBreakInterval
        );

        mockBreakInterval =
            null;
    }
}


function showMockBreak() {
    closeMockGate();

    questionApp.classList.add(
        "hidden"
    );

    resultsScreen.classList.add(
        "hidden"
    );

    const breakMinutes =
        mockManifest?.timing
            ?.breakMinutes ||
        10;

    if (
        !mockState.breakDeadline
    ) {
        mockState.breakDeadline =
            Date.now() +
            breakMinutes *
                60 *
                1000;

        saveMockState();
    }

    const overlay =
        document.createElement(
            "div"
        );

    overlay.id =
        "mock-gate-overlay";

    overlay.className =
        "mock-gate-overlay";

    overlay.innerHTML = `
        <section class="mock-gate-card">
            <div class="mock-gate-eyebrow">SECTION BREAK</div>
            <h2>Reading and Writing complete.</h2>
            <p>Math is next. Take the break, then continue when you’re ready.</p>
            <div class="mock-break-clock" id="mock-break-clock">10:00</div>
            <button type="button" class="mock-gate-primary" id="mock-break-continue">
                Continue to Math
            </button>
            <a class="mock-gate-exit" href="/mock-tests">Exit to Mock Tests</a>
        </section>
    `;

    document.body
        .appendChild(
            overlay
        );

    document.body
        .classList.add(
            "mock-gate-open"
        );

    const clock =
        document.getElementById(
            "mock-break-clock"
        );

    const continueButton =
        document.getElementById(
            "mock-break-continue"
        );

    const updateBreak =
        () => {
            const remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            mockState
                                .breakDeadline -
                            Date.now()
                        ) /
                        1000
                    )
                );

            const minutes =
                Math.floor(
                    remaining /
                    60
                );

            const seconds =
                remaining %
                60;

            if (clock) {
                clock.textContent =
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
            }

            if (
                remaining <= 0
            ) {
                continueFromMockBreak();
            }
        };

    continueButton
        ?.addEventListener(
            "click",
            continueFromMockBreak
        );

    updateBreak();

    mockBreakInterval =
        setInterval(
            updateBreak,
            1000
        );
}


function continueFromMockBreak() {
    if (
        !mockTestMode ||
        !mockState
    ) {
        return;
    }

    closeMockGate();

    mockState.currentStage =
        "math_m1";

    mockState.breakDeadline =
        null;

    mockState.moduleDeadline =
        null;

    saveMockState();

    loadMockStage(
        true
    );
}


function startMockModuleTimer() {
    if (
        !mockTestMode ||
        !mockState ||
        mockState.currentStage ===
            "break" ||
        mockState.completed
    ) {
        return;
    }

    if (mockTimerInterval) {
        clearInterval(
            mockTimerInterval
        );
    }

    const info =
        getMockStageInfo();

    if (!info) {
        return;
    }

    if (
        !mockState.moduleDeadline
    ) {
        mockState.moduleDeadline =
            Date.now() +
            info.minutes *
                60 *
                1000;

        saveMockState();
    }

    const tick =
        () => {
            const remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            mockState
                                .moduleDeadline -
                            Date.now()
                        ) /
                        1000
                    )
                );

            mockState
                .moduleRemainingSeconds =
                remaining;

            updateTimerDisplay();

            if (
                remaining <= 0
            ) {
                clearInterval(
                    mockTimerInterval
                );

                mockTimerInterval =
                    null;

                finishMockModule(
                    true
                );
            }
        };

    tick();

    mockTimerInterval =
        setInterval(
            tick,
            1000
        );
}


function updateMockTimerDisplay() {
    if (
        !timerElement ||
        !mockState
    ) {
        return;
    }

    const remaining =
        Number(
            mockState
                .moduleRemainingSeconds
        );

    const safeRemaining =
        Number.isFinite(
            remaining
        )
            ? Math.max(
                0,
                remaining
            )
            : 0;

    const minutes =
        Math.floor(
            safeRemaining /
            60
        );

    const seconds =
        safeRemaining %
        60;

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

    timerElement
        .classList.toggle(
            "warning",
            safeRemaining <=
                5 * 60 &&
            safeRemaining >
                60
        );

    timerElement
        .classList.toggle(
            "danger",
            safeRemaining <=
                60
        );
}


function updateMockTopbar() {
    if (
        !mockTestMode ||
        !mockState
    ) {
        return;
    }

    const info =
        getMockStageInfo();

    if (!info) {
        return;
    }

    const smallLabel =
        document.querySelector(
            ".question-set-info .small-label"
        );

    if (smallLabel) {
        smallLabel.textContent =
            "SAT MOCK TEST 1";
    }

    setTitle.textContent =
        info.sectionLabel +
        " · " +
        info.moduleLabel;

    const timerLabel =
        document.querySelector(
            ".timer-label"
        );

    if (timerLabel) {
        timerLabel.textContent =
            "TIME REMAINING";
    }

    questionNumber.textContent =
        "Question " +
        (
            currentQuestionIndex +
            1
        ) +
        " of " +
        questions.length;
}


function loadMockStage(
    resetDeadline = false
) {
    if (
        !mockTestMode ||
        !mockManifest ||
        !mockState
    ) {
        return;
    }

    if (
        mockState.completed
    ) {
        showMockFinalResults();
        return;
    }

    if (
        mockState.currentStage ===
            "break"
    ) {
        showMockBreak();
        return;
    }

    closeMockGate();

    const entries =
        getMockStageEntries();

    questions =
        normalizeMockEntries(
            entries
        );

    currentQuestionIndex =
        Math.min(
            Math.max(
                0,
                getMockCurrentIndex()
            ),
            Math.max(
                0,
                questions.length -
                    1
            )
        );

    answers =
        mockState.answers ||
        {};

    markedForReview =
        mockState.markedForReview ||
        {};

    checkedResults =
        {};

    wrongAttempts =
        {};

    eliminatedChoices =
        {};

    submitted =
        false;

    if (resetDeadline) {
        mockState.moduleDeadline =
            null;

        mockState
            .moduleRemainingSeconds =
            null;
    }

    resultsScreen.classList.add(
        "hidden"
    );

    questionApp.classList.remove(
        "hidden"
    );

    loadingScreen.classList.add(
        "hidden"
    );

    renderQuestionNavigator();

    renderCurrentQuestion();

    updateMockTopbar();

    startMockModuleTimer();
}


function finishMockModule(
    automatic = false
) {
    if (
        !mockTestMode ||
        !mockState ||
        mockState.completed
    ) {
        return;
    }

    const result =
        scoreMockQuestions(
            questions
        );

    if (
        !automatic &&
        result.unanswered >
            0
    ) {
        const shouldFinish =
            window.confirm(
                "You have " +
                result.unanswered +
                " unanswered question" +
                (
                    result.unanswered ===
                        1
                        ? ""
                        : "s"
                ) +
                ". Finish this module anyway?"
            );

        if (!shouldFinish) {
            return;
        }
    } else if (
        !automatic
    ) {
        const shouldFinish =
            window.confirm(
                "Finish this module? You won’t be able to return to it."
            );

        if (!shouldFinish) {
            return;
        }
    }

    if (mockTimerInterval) {
        clearInterval(
            mockTimerInterval
        );

        mockTimerInterval =
            null;
    }

    if (
        !mockState.completedModules
    ) {
        mockState.completedModules =
            {};
    }

    mockState.completedModules[
        mockState.currentStage
    ] = {
        ...result,
        completedAt:
            new Date()
                .toISOString()
    };

    if (
        mockState.currentStage ===
            "rw_m1"
    ) {
        const threshold =
            mockManifest.routing
                ?.readingWritingHighMinCorrect ||
            17;

        mockState.routes
            .readingWriting =
            result.correct >=
                threshold
                ? "high"
                : "low";

        mockState.currentStage =
            "rw_m2";

    } else if (
        mockState.currentStage ===
            "rw_m2"
    ) {
        mockState.currentStage =
            "break";

        mockState.breakDeadline =
            Date.now() +
            (
                mockManifest.timing
                    ?.breakMinutes ||
                10
            ) *
                60 *
                1000;

    } else if (
        mockState.currentStage ===
            "math_m1"
    ) {
        const threshold =
            mockManifest.routing
                ?.mathHighMinCorrect ||
            14;

        mockState.routes.math =
            result.correct >=
                threshold
                ? "high"
                : "low";

        mockState.currentStage =
            "math_m2";

    } else if (
        mockState.currentStage ===
            "math_m2"
    ) {
        mockState.completed =
            true;

        mockState.completedAt =
            new Date()
                .toISOString();
    }

    mockState.moduleDeadline =
        null;

    mockState
        .moduleRemainingSeconds =
        null;

    saveMockState();

    if (
        mockState.completed
    ) {
        showMockFinalResults();
    } else if (
        mockState.currentStage ===
            "break"
    ) {
        showMockBreak();
    } else {
        loadMockStage(
            true
        );
    }
}


function showMockFinalResults() {
    if (
        !mockTestMode ||
        !mockState
    ) {
        return;
    }

    closeMockGate();

    if (mockTimerInterval) {
        clearInterval(
            mockTimerInterval
        );

        mockTimerInterval =
            null;
    }

    questions =
        getMockAllRouteQuestions();

    const results =
        calculateResults();

    const rwQuestions =
        questions.filter(
            question =>
                question.section ===
                "Reading & Writing"
        );

    const mathQuestions =
        questions.filter(
            question =>
                question.section ===
                "Math"
        );

    const rwResult =
        scoreMockQuestions(
            rwQuestions
        );

    const mathResult =
        scoreMockQuestions(
            mathQuestions
        );

    questionApp.classList.add(
        "hidden"
    );

    resultsScreen.classList.remove(
        "hidden"
    );

    document.body.classList.add(
        "mock-results-active"
    );

    scoreNumber.textContent =
        results.correct +
        "/" +
        results.total;

    const scoreLabel =
        document.querySelector(
            ".score-circle span"
        );

    if (scoreLabel) {
        scoreLabel.textContent =
            "Raw correct";
    }

    correctCount.textContent =
        results.correct;

    incorrectCount.textContent =
        results.incorrect;

    unansweredCount.textContent =
        results.unanswered;

    resultsSetTitle.textContent =
        mockManifest.title ||
        "SAT Mock Test";

    const rwRoute =
        mockState.routes
            ?.readingWriting ===
                "high"
            ? "higher"
            : "lower";

    const mathRoute =
        mockState.routes
            ?.math ===
                "high"
            ? "higher"
            : "lower";

    resultsMessage.textContent =
        "Reading & Writing: " +
        rwResult.correct +
        "/54 · Math: " +
        mathResult.correct +
        "/44. " +
        "Your adaptive routes were " +
        rwRoute +
        " for Reading & Writing and " +
        mathRoute +
        " for Math.";

    const backLink =
        document.getElementById(
            "back-to-question-bank"
        );

    if (backLink) {
        backLink.href =
            "/mock-tests";

        backLink.textContent =
            "Back to Mock Tests";
    }

    mockState.completed =
        true;

    saveMockState();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function loadMockTest(
    id
) {
    mockTestMode =
        true;

    mockTestId =
        id;

    document.body.classList.add(
        "mock-test-active"
    );

    const response =
        await fetch(
            "/" +
            encodeURIComponent(id) +
            ".json?v=1",
            {
                cache: "no-store"
            }
        );

    if (!response.ok) {
        throw new Error(
            "Mock test returned " +
            response.status
        );
    }

    mockManifest =
        await response.json();

    const key =
        getMockStateStorageKey();

    const params =
        new URLSearchParams(
            window.location.search
        );

    const restart =
        params.get(
            "restart"
        ) ===
        "1";

    if (
        restart &&
        key
    ) {
        localStorage.removeItem(
            key
        );
    }

    let stored =
        null;

    if (key) {
        try {
            stored =
                JSON.parse(
                    localStorage.getItem(
                        key
                    ) ||
                    "null"
                );
        } catch {
            stored =
                null;
        }
    }

    mockState =
        stored &&
        stored.testId ===
            id
            ? stored
            : {
                testId:
                    id,
                currentStage:
                    "rw_m1",
                completed:
                    false,
                answers:
                    {},
                markedForReview:
                    {},
                routes:
                    {},
                completedModules:
                    {},
                currentQuestionIndexByStage:
                    {},
                moduleDeadline:
                    null,
                moduleRemainingSeconds:
                    null,
                breakDeadline:
                    null,
                startedAt:
                    new Date()
                        .toISOString()
            };

    answers =
        mockState.answers ||
        {};

    markedForReview =
        mockState.markedForReview ||
        {};

    saveMockState();

    loadMockStage(
        false
    );
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

        const mockId =
            params.get("mock");

        const questionId =
            params.get("id");

        const slug =
            params.get("set");


        if (mockId) {
            await loadMockTest(
                mockId
            );

            return;
        }


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
    localReviewOverrides =
        getLocalReviewOverrides();

    const key =
        String(questionId);

    if (
        Object.prototype.hasOwnProperty.call(
            localReviewOverrides,
            key
        )
    ) {
        markedForReview[
            questionId
        ] =
            Boolean(
                localReviewOverrides[key]
            );

        return;
    }

    markedForReview[
        questionId
    ] = false;

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
                    "question_id, created_at"
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

        const resetAt =
            getPracticeResetAt();

        const resetTime =
            resetAt
                ? new Date(
                    resetAt
                ).getTime()
                : null;

        const serverReview =
            Array.isArray(data) &&
            data.length > 0
                ? data[0]
                : null;

        const createdTime =
            serverReview
                ? new Date(
                    serverReview.created_at ||
                    0
                ).getTime()
                : 0;

        const serverMarked =
            Boolean(serverReview) &&
            (
                !resetTime ||
                (
                    Number.isFinite(
                        createdTime
                    ) &&
                    createdTime >
                        resetTime
                )
            );

        markedForReview[
            questionId
        ] =
            serverMarked;

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

    localReviewOverrides =
        getLocalReviewOverrides();

    questionList.forEach(
        question => {
            const key =
                String(question.id);

            if (
                Object.prototype.hasOwnProperty.call(
                    localReviewOverrides,
                    key
                )
            ) {
                markedForReview[
                    question.id
                ] =
                    Boolean(
                        localReviewOverrides[key]
                    );
            } else {
                markedForReview[
                    question.id
                ] =
                    false;
            }
        }
    );

    if (
        !currentUser ||
        !questionList.length
    ) {
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
                    "question_id, created_at"
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

        const resetAt =
            getPracticeResetAt();

        const resetTime =
            resetAt
                ? new Date(
                    resetAt
                ).getTime()
                : null;

        (data || []).forEach(
            review => {
                const key =
                    String(
                        review.question_id
                    );

                if (
                    Object.prototype.hasOwnProperty.call(
                        localReviewOverrides,
                        key
                    )
                ) {
                    return;
                }

                const createdTime =
                    new Date(
                        review.created_at || 0
                    ).getTime();

                const valid =
                    !resetTime ||
                    (
                        Number.isFinite(
                            createdTime
                        ) &&
                        createdTime >
                            resetTime
                    );

                if (valid) {
                    markedForReview[
                        review.question_id
                    ] = true;
                }
            }
        );

    } catch (error) {
        console.warn(
            "Could not load question review states:",
            error
        );
    }
}

function normalizeAccidentalDisplayProse(
    value
) {
    let source =
        normalizeMathEscapes(
            value
        );

    /*
     * Some imported Math questions incorrectly wrap ordinary prose
     * in MathJax delimiters. TeX math mode discards normal spaces and
     * italicizes letters, turning text such as
     *
     *     \\(The slope is undefined.\\)
     *
     * into something visually close to "Theslopeisundefined".
     *
     * Recover prose before MathJax sees it. This is deliberately
     * conservative: real formulas stay in math mode.
     */

    source = source.replace(
        /\\\[([\s\S]*?)\\\]/g,
        (
            match,
            body
        ) => {
            const trimmed =
                String(body || "")
                    .trim();

            if (
                !trimmed ||
                /[\\^_{}]/.test(
                    trimmed
                )
            ) {
                return match;
            }

            const startsLikeProse =
                /^(?:what|which|how|if|is|in|and|intersect|one|the|at|for|from|since|using|then|thus|substitute|match|multiply|divide|add|subtract|let|rewrite|solve|first|because|therefore|when|set|so|only|each|now|this|that|both|line|statement|speed|area|volume|total)\b/i
                    .test(
                        trimmed
                    );

            const wordCount =
                (
                    trimmed.match(
                        /\b[A-Za-z]{2,}\b/g
                    ) || []
                ).length;

            return (
                startsLikeProse &&
                wordCount >= 2
            )
                ? trimmed
                : match;
        }
    );

    return source.replace(
        /\\\(([\s\S]*?)\\\)/g,
        (
            match,
            body
        ) => {
            const trimmed =
                String(body || "")
                    .trim();

            if (!trimmed) {
                return match;
            }

            /*
             * Already-correct text commands should be left alone.
             */
            if (
                /\\text\s*\{/.test(
                    trimmed
                )
            ) {
                return match;
            }

            const words =
                trimmed.match(
                    /\b[A-Za-z]{2,}\b/g
                ) || [];

            const lowerCaseWords =
                words.filter(
                    word =>
                        /[a-z]/.test(
                            word
                        )
                );

            const hasStrongMathSyntax =
                /[=<>^_{}]/.test(
                    trimmed
                ) ||
                /\\[A-Za-z]+/.test(
                    trimmed
                );

            const romanChoice =
                /^(?:(?:I|II|III)(?:\s+and\s+(?:I|II|III))?|(?:I|II|III))\s+only$/i
                    .test(
                        trimmed
                    ) ||
                /^(?:Neither\s+I\s+nor\s+II|I\s+and\s+II)$/i
                    .test(
                        trimmed
                    );

            const plainLanguageChoice =
                !hasStrongMathSyntax &&
                (
                    (
                        words.length >=
                            2 &&
                        lowerCaseWords.length >=
                            1
                    ) ||
                    /\s+(?:and|or|nor)\s+/i
                        .test(
                            trimmed
                        ) ||
                    romanChoice
                );

            const proseHeavyMixedChoice =
                /^(?:the|all|there|exactly|neither|none|no|one|two|three|four)\b/i
                    .test(
                        trimmed
                    ) &&
                lowerCaseWords.length >=
                    3;

            /*
             * If the entire segment is prose, remove math mode
             * altogether. Numbers and punctuation remain untouched.
             */
            if (
                plainLanguageChoice ||
                proseHeavyMixedChoice
            ) {
                return trimmed;
            }

            /*
             * Mixed expressions such as
             *     x > 2 and y < -1
             * should remain mathematical, but English connectors
             * need explicit TeX text mode so their spaces survive.
             */
            const repaired =
                trimmed
                    .replace(
                        /\s+(rather\s+than|for\s+every|for\s+each|such\s+that|at\s+most|at\s+least)\s+/gi,
                        (
                            token,
                            phrase
                        ) =>
                            "\\text{ " +
                            phrase +
                            " }"
                    )
                    .replace(
                        /\s+(and|or|nor|where|than|for|with|without)\s+/gi,
                        (
                            token,
                            word
                        ) =>
                            "\\text{ " +
                            word +
                            " }"
                    );

            return (
                "\\(" +
                repaired +
                "\\)"
            );
        }
    );
}


function normalizeQuestionStemText(
    value
) {
    const text =
        String(value || "")
            .trim();

    if (
        /^(?:what|which|how|at what|for what|in which)\b/i
            .test(text)
    ) {
        return (
            text.charAt(0)
                .toUpperCase() +
            text.slice(1)
        );
    }

    return text;
}


function splitMathQuestionContent(
    stagedQuestion
) {
    const rawQuestion =
        normalizeAccidentalDisplayProse(
            String(
                stagedQuestion.question ||
                ""
            )
        ).trim();

    const existingPassage =
        String(
            stagedQuestion.passage ||
            ""
        ).trim();

    if (
        stagedQuestion.section !==
        "Math"
    ) {
        return {
            passage:
                existingPassage,
            question:
                rawQuestion
        };
    }

    const stemPattern =
        /\b(?:According to[^?\n]{0,100},\s*(?:at what|what|which|how)|At what|For what|In which|Which|What|How)\b/gi;

    let stemStart = -1;
    let match;

    while (
        (
            match =
                stemPattern.exec(
                    rawQuestion
                )
        )
    ) {
        stemStart =
            match.index;
    }

    if (
        stemStart <= 0
    ) {
        return {
            passage:
                existingPassage,
            question:
                rawQuestion
        };
    }

    const info =
        rawQuestion
            .slice(
                0,
                stemStart
            )
            .trim();

    const stem =
        normalizeQuestionStemText(
            rawQuestion
                .slice(
                    stemStart
                )
                .trim()
        );

    if (
        info.length < 12 ||
        stem.length < 8
    ) {
        return {
            passage:
                existingPassage,
            question:
                rawQuestion
        };
    }

    return {
        passage:
            [
                existingPassage,
                info
            ]
                .filter(Boolean)
                .join(
                    "\n\n"
                ),
        question:
            stem
    };
}


function normalizeStagedQuestion(
    stagedQuestion,
    index
) {

    const split =
        splitMathQuestionContent(
            stagedQuestion
        );

    return {
        id:
            stagedQuestion.id,
        question_number:
            index + 1,
        passage:
            split.passage,
        question_text:
            split.question,
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
            stagedQuestion.correctAnswer ||
            "",
        explanation:
            stagedQuestion.explanation ||
            "",
        choice_explanations:
            stagedQuestion.choiceExplanations ||
            stagedQuestion.choice_explanations ||
            null,
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
            "SAT",
        domain:
            stagedQuestion.domain ||
            "",
        table:
            stagedQuestion.table ||
            null,
        graph:
            stagedQuestion.graph ||
            null,
        choice_tables:
            stagedQuestion.choiceTables ||
            stagedQuestion.choice_tables ||
            null,
        choice_graphs:
            stagedQuestion.choiceGraphs ||
            stagedQuestion.choice_graphs ||
            null,
        answer_type:
            stagedQuestion.answerType ||
            stagedQuestion.answer_type ||
            "multiple-choice",
        accepted_answers:
            Array.isArray(
                stagedQuestion.acceptedAnswers ||
                stagedQuestion.accepted_answers
            )
                ? (
                    stagedQuestion.acceptedAnswers ||
                    stagedQuestion.accepted_answers
                )
                : [],
        desmos_method:
            stagedQuestion.desmosMethod ||
            stagedQuestion.desmos_method ||
            ""
    };

}


function getStagedNavigationQuestions(
    stagedQuestions,
    questionId
) {

    const navigation =
        getQuestionBankNavigationState();

    if (
        !navigation ||
        !navigation.questionIds.includes(
            String(questionId)
        )
    ) {
        return null;
    }

    const byId =
        new Map(
            stagedQuestions.map(
                question => [
                    String(question.id),
                    question
                ]
            )
        );

    const ordered =
        navigation.questionIds
            .map(
                id =>
                    byId.get(
                        String(id)
                    )
            )
            .filter(
                question =>
                    question &&
                    question.status ===
                        "staged"
            );

    if (
        !ordered.some(
            question =>
                String(question.id) ===
                String(questionId)
        )
    ) {
        return null;
    }

    return ordered;
}


/* ============================================================
   LOAD QUESTION BY ID
   ============================================================ */

async function loadQuestionById(
    questionId
) {

    /*
     * Staged Question Bank JSON is the source of truth for
     * current Question Bank questions. Load it first so an
     * unavailable legacy questions table cannot block them.
     */

    try {

        const stagedBankUrl =
            String(questionId).startsWith("math-")
                ? "/math-question-bank.json?v=2"
                : "/question-bank.json?v=17";

        const response =
            await fetch(
                stagedBankUrl,
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {
            throw new Error(
                "Question bank returned " +
                response.status
            );
        }

        const stagedData =
            await response.json();

        const stagedQuestions =
            stagedData.questions ||
            [];

        const stagedQuestion =
            stagedQuestions.find(
                question =>
                    String(question.id) ===
                    String(questionId) &&
                    question.status ===
                    "staged"
            );

        if (stagedQuestion) {

            currentSet = null;

            const navigationQuestions =
                getStagedNavigationQuestions(
                    stagedQuestions,
                    questionId
                );

            const sourceQuestions =
                navigationQuestions ||
                [stagedQuestion];

            questions =
                sourceQuestions.map(
                    (
                        question,
                        index
                    ) =>
                        normalizeStagedQuestion(
                            question,
                            index
                        )
                );

            currentQuestionIndex =
                questions.findIndex(
                    question =>
                        String(question.id) ===
                        String(questionId)
                );

            if (
                currentQuestionIndex < 0
            ) {
                currentQuestionIndex = 0;
            }

            await loadReviewStatesForQuestions(
                questions
            );

            if (navigationQuestions) {
                saveQuestionBankNavigationState(
                    questions.map(
                        question =>
                            question.id
                    ),
                    questionId
                );
            }

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

            return;
        }

    } catch (error) {

        console.warn(
            "Could not load staged question-bank JSON; trying live question data:",
            error
        );

    }

    try {

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

        if (!liveQuestion) {

            showError(
                "The question could not be found."
            );

            return;

        }

        questions = [
            {
                ...liveQuestion,
                passage:
                    liveQuestion.passage ||
                    ""
            }
        ];

        currentSet = null;

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

    } catch (error) {

        console.error(
            "Question loading error:",
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

function typesetQuestionMath() {
    if (
        !window.MathJax ||
        typeof window.MathJax.typesetPromise !==
            "function"
    ) {
        window.setTimeout(
            typesetQuestionMath,
            120
        );
        return;
    }

    const targets = [
        document.getElementById(
            "question-app"
        ),
        document.getElementById(
            "results-screen"
        )
    ].filter(Boolean);

    if (targets.length === 0) {
        return;
    }

    try {
        if (
            typeof window.MathJax.typesetClear ===
            "function"
        ) {
            window.MathJax.typesetClear(
                targets
            );
        }

        window.MathJax.typesetPromise(
            targets
        ).catch(
            error =>
                console.warn(
                    "MathJax render failed:",
                    error
                )
        );
    } catch (error) {
        console.warn(
            "MathJax render failed:",
            error
        );
    }
}


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
        }`;

    const isMathQuestion =
        question.section === "Math";

    const isQuestionBankQuestion =
        !mockTestMode &&
        currentSet === null;

    /*
     * Question Bank classification belongs with the content it describes:
     * Math keeps it beside the question number; Reading & Writing places it
     * at the top of the passage/information pane.
     */
    if (
        questionMetadata &&
        isQuestionBankQuestion
    ) {
        const metadataParent =
            isMathQuestion
                ? questionProgressIdentity
                : readingQuestionMetadataHost;

        if (
            metadataParent &&
            questionMetadata.parentElement !==
                metadataParent
        ) {
            metadataParent.appendChild(
                questionMetadata
            );
        }
    }

    if (questionMetadata) {
        questionMetadata.classList.toggle(
            "hidden",
            !isQuestionBankQuestion
        );
    }

    if (isQuestionBankQuestion) {
        if (questionDomain) {
            questionDomain.textContent =
                question.domain ||
                "SAT";
        }

        if (questionSubtopic) {
            questionSubtopic.textContent =
                question.topic ||
                "SAT Practice";
        }

        if (questionDifficulty) {
            const difficulty =
                question.difficulty ||
                "Medium";

            questionDifficulty.textContent =
                difficulty;

            questionDifficulty.dataset.difficulty =
                String(
                    difficulty
                ).toLowerCase();
        }
    }

    document.body.classList.toggle(
        "math-question-active",
        isMathQuestion
    );

    const calculatorButton =
        document.getElementById(
            "desmos-toggle-button"
        );

    if (calculatorButton) {
        calculatorButton.hidden =
            !isMathQuestion;
    }

    const desmosPanel =
        document.getElementById(
            "desmos-panel"
        );

    if (
        !isMathQuestion &&
        desmosPanel
    ) {
        desmosPanel.classList.add(
            "hidden"
        );

        desmosPanel.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    const backToBank =
        document.getElementById(
            "back-to-question-bank"
        );

    if (backToBank) {
        backToBank.href =
            isMathQuestion
                ? "/math-question-bank"
                : "/reading-question-bank";
    }

    const mathNav =
        document.getElementById(
            "question-nav-math"
        );

    const readingNav =
        document.getElementById(
            "question-nav-reading"
        );

    if (mathNav && readingNav) {
        mathNav.classList.toggle(
            "active",
            isMathQuestion
        );
        readingNav.classList.toggle(
            "active",
            !isMathQuestion
        );

        if (isMathQuestion) {
            mathNav.setAttribute(
                "aria-current",
                "page"
            );
            readingNav.removeAttribute(
                "aria-current"
            );
        } else {
            readingNav.setAttribute(
                "aria-current",
                "page"
            );
            mathNav.removeAttribute(
                "aria-current"
            );
        }
    }


    const contextLabel =
        document.getElementById(
            "question-context-label"
        );

    if (contextLabel) {
        contextLabel.textContent =
            isMathQuestion
                ? "INFORMATION"
                : "PASSAGE";
    }

    questionText.innerHTML =
        renderQuestionContent(
            question,
            question.question_text
        );

    const hasContext =
        Boolean(
            question.passage ||
            question.graph ||
            question.table
        );

    if (questionPassage) {
        questionPassage.innerHTML =
            isMathQuestion
                ? ""
                : renderQuestionPassage(
                    question
                );

        questionPassage.parentElement?.classList.toggle(
            "has-passage",
            !isMathQuestion &&
                hasContext
        );
    }

    if (
        mathQuestionContext &&
        mathQuestionContextContent
    ) {
        mathQuestionContext.classList.toggle(
            "hidden",
            !isMathQuestion ||
                !hasContext
        );

        mathQuestionContextContent.innerHTML =
            isMathQuestion &&
            hasContext
                ? renderQuestionPassage(
                    question
                )
                : "";
    }


    renderChoices(
        question
    );

    renderAnswerFeedback(
        question
    );


    updateReviewButton();

    updateNavigationButtons();

    updateQuestionNavigator();

    updateNextQuestionButton();

    if (mockTestMode) {
        updateMockTopbar();
        saveMockState();
    }

    typesetQuestionMath();

}



function isolateCorrectChoiceExplanation(value) {
    let text =
        String(value || "")
            .replace(/\\s*---\\s*$/g, "")
            .trim();

    if (!text) {
        return "";
    }

    const markerPattern =
        /(^|\\n+|(?<=[.!?])\\s+)(?:Choice\\s+)?([A-D])(?=\\s*(?:[,.:—]|\\s+(?:is|was|would|could|does|did|means|refers|creates|cannot|can't|fails|incorrect|wrong|unsupported|overstates|understates|reverses|misreads|suggests|assumes|uses|has|gives|identifies|introduces|emphasizes|states|claims|implies|describes|concerns|corresponds|typically|also|instead|directly|explicitly|provides|supplies|mentions|omits|conflicts|repeats|focuses|places|requires|pairs|adds|addresses|asserts|praises|establishes|indicates|shows|captures|correctly)))/gi;

    const markers = [];
    let match;

    while ((match = markerPattern.exec(text))) {
        markers.push({
            index:
                match.index +
                (
                    match[1]
                        ? match[1].length
                        : 0
                )
        });

        if (markerPattern.lastIndex === match.index) {
            markerPattern.lastIndex += 1;
        }
    }

    let end = text.length;

    if (
        markers.length > 0 &&
        markers[0].index === 0
    ) {
        if (markers.length > 1) {
            end = markers[1].index;
        }
    } else if (markers.length > 0) {
        end = markers[0].index;
    } else {
        const paragraphs =
            text
                .split(/\\n\\s*\\n/)
                .map(part => part.trim())
                .filter(Boolean);

        if (paragraphs.length > 1) {
            end = paragraphs[0].length;
        }
    }

    text =
        text
            .slice(0, end)
            .trim()
            .replace(
                /^(?:Choice\\s+)?[A-D](?=\\s*(?:[,.:—]|\\s+(?:is|was|would|could|does|did|means|refers|creates|cannot|can't|fails|incorrect|wrong|unsupported|overstates|understates|reverses|misreads|suggests|assumes|uses|has|gives|identifies|introduces|emphasizes|states|claims|implies|describes|concerns|corresponds|typically|also|instead|directly|explicitly|provides|supplies|mentions|omits|conflicts|repeats|focuses|places|requires|pairs|adds|addresses|asserts|praises|establishes|indicates|shows|captures|correctly)))/i,
                "This choice"
            )
            .replace(
                /\\bmaking\\s+[A-D]\\s+(?:the\\s+)?(?:most\\s+)?(?:logical\\s+and\\s+)?(?:precise\\s+)?choice\\b/gi,
                "making it the correct choice"
            )
            .replace(
                /\\bmaking\\s+[A-D]\\s+correct\\b/gi,
                "making this choice correct"
            )
            .replace(
                /\\b(?:Therefore|Thus|Hence),?\\s+[A-D]\\s+is\\s+correct\\b/gi,
                match =>
                    match.replace(
                        /[A-D]\\s+is\\s+correct/i,
                        "this choice is correct"
                    )
            );

    return text.trim();
}


function getChoiceExplanation(
    question,
    letter
) {
    if (
        question.answer_type ===
        "student-response" &&
        (
            !letter ||
            !question.choice_explanations
        )
    ) {
        return String(
            question.explanation || ""
        ).trim();
    }

    const direct =
        question.choice_explanations?.[
            letter
        ] ||
        question.choice_explanations?.[
            String(letter).toLowerCase()
        ];

    let fallbackDirect = "";

    if (direct) {
        fallbackDirect =
            String(direct)
                .replace(
                    /\\s*---\\s*$/g,
                    ""
                )
                .trim();

        const leadingLabel =
            fallbackDirect.match(
                /^(?:Choice\\s+)?([A-D])(?=\\s|,|:|—|\\.)/i
            );

        // Some older imported explanations were accidentally
        // attached to more than one choice. If the stored reason
        // begins with a different answer letter, fall through and
        // recover the matching explanation from the full rationale.
        if (
            letter ===
            question.correct_answer
        ) {
            return isolateCorrectChoiceExplanation(
                fallbackDirect
            );
        }

        if (
            !leadingLabel ||
            leadingLabel[1].toUpperCase() ===
                String(letter).toUpperCase()
        ) {
            return fallbackDirect;
        }
    }

    const raw =
        String(
            question.explanation || ""
        )
            .replace(
                /\\s*---\\s*$/g,
                ""
            )
            .trim();

    if (!raw) {
        return "";
    }

    const paragraphs =
        raw
            .split(/\n\s*\n/)
            .map(part => part.trim())
            .filter(Boolean);

    if (
        letter ===
        question.correct_answer
    ) {
        // Most legacy questions store the correct reasoning first,
        // followed by "A/B/C/D is incorrect..." explanations.
        // Stop before the first wrong-choice explanation so the
        // correct choice never expands into the full answer key.
        const wrongChoiceStart =
            raw.search(
                /(?:^|\s)(?:Choice\s+)?[A-D]\s+(?:is|was|would\s+be)\s+(?:incorrect|wrong)\b/i
            );

        return isolateCorrectChoiceExplanation(
            raw
        );
    }

    // Legacy explanations commonly use wording such as
    // "B is incorrect because...". Isolate only that choice.
    const wrongChoicePattern =
        new RegExp(
            "(?:^|\\s)(?:Choice\\s+)?" +
            letter +
            "\\s+(?:is|was|would\\s+be)\\s+(?:incorrect|wrong)\\b",
            "i"
        );

    const wrongMatch =
        wrongChoicePattern.exec(raw);

    if (wrongMatch) {
        const startsWithSpace =
            /^\s/.test(
                wrongMatch[0]
            );

        const start =
            wrongMatch.index +
            (
                startsWithSpace
                    ? 1
                    : 0
            );

        const rest =
            raw.slice(start);

        const nextWrong =
            rest
                .slice(1)
                .search(
                    /(?:^|\s)(?:Choice\s+)?[A-D]\s+(?:is|was|would\s+be)\s+(?:incorrect|wrong)\b/i
                );

        return (
            nextWrong >= 0
                ? rest.slice(
                    0,
                    nextWrong + 1
                )
                : rest
        ).trim();
    }

    const markerPattern =
        new RegExp(
            "(?:^|\\n|(?<=[.!?])\\s+)" +
            letter +
            "(?=\\s|,|:|—)",
            "g"
        );

    const match =
        markerPattern.exec(raw);

    if (match) {
        const prefixLength =
            match[0].search(/[A-D]/);

        const start =
            match.index +
            Math.max(
                prefixLength,
                0
            );

        const rest =
            raw.slice(start);

        const next =
            rest
                .slice(1)
                .search(
                    /(?:^|\n|(?<=[.!?])\s+)[A-D](?=\s|,|:|—)/
                );

        return (
            next >= 0
                ? rest.slice(
                    0,
                    next + 1
                )
                : rest
        ).trim();
    }

    const sentenceMatch =
        paragraphs
            .flatMap(
                part =>
                    part.split(
                        /(?<=[.!?])\s+/
                    )
            )
            .find(
                sentence =>
                    new RegExp(
                        "(^|\\b)" +
                        letter +
                        "(?:\\b|,)"
                    ).test(sentence)
            );

    return (
        sentenceMatch ||
        fallbackDirect ||
        ""
    ).trim();
}


function createChoiceReason(
    question,
    letter,
    isCorrectChoice
) {
    const reason =
        getChoiceExplanation(
            question,
            letter
        );

    if (!reason) {
        return null;
    }

    const box =
        document.createElement(
            "div"
        );

    box.className =
        "choice-reason " +
        (
            isCorrectChoice
                ? "choice-reason-correct"
                : "choice-reason-wrong"
        );

    box.innerHTML =
        '<div class="choice-reason-label">' +
        (
            isCorrectChoice
                ? "Why this works"
                : "Why this doesn’t work"
        ) +
        '</div><div class="choice-reason-text">' +
        renderQuestionContent(
            question,
            reason
        ) +
        '</div>';

    return box;
}

function renderChoiceMiniTable(
    table,
    question = null
) {
    if (
        !table ||
        !Array.isArray(table.headers) ||
        !Array.isArray(table.rows)
    ) {
        return "";
    }

    return (
        '<table class="choice-mini-table">' +
            '<thead><tr>' +
                table.headers
                    .map(
                        header =>
                            '<th>' +
                            renderQuestionContent(
                                question,
                                header
                            ) +
                            '</th>'
                    )
                    .join("") +
            '</tr></thead>' +
            '<tbody>' +
                table.rows
                    .map(
                        row =>
                            '<tr>' +
                                row
                                    .map(
                                        cell =>
                                            '<td>' +
                                            renderQuestionContent(
                                                question,
                                                cell
                                            ) +
                                            '</td>'
                                    )
                                    .join("") +
                            '</tr>'
                    )
                    .join("") +
            '</tbody>' +
        '</table>'
    );
}


function renderChoiceMiniGraph(graph) {
    if (!graph) {
        return "";
    }

    const xMin =
        Number.isFinite(Number(graph.xMin))
            ? Number(graph.xMin)
            : -10;
    const xMax =
        Number.isFinite(Number(graph.xMax))
            ? Number(graph.xMax)
            : 10;
    const yMin =
        Number.isFinite(Number(graph.yMin))
            ? Number(graph.yMin)
            : -10;
    const yMax =
        Number.isFinite(Number(graph.yMax))
            ? Number(graph.yMax)
            : 10;

    if (
        xMax <= xMin ||
        yMax <= yMin
    ) {
        return "";
    }

    const width = 260;
    const height = 170;
    const left = 22;
    const right = 12;
    const top = 10;
    const bottom = 20;
    const plotWidth =
        width - left - right;
    const plotHeight =
        height - top - bottom;

    const xScale =
        value =>
            left +
            (
                (value - xMin) /
                (xMax - xMin)
            ) *
            plotWidth;

    const yScale =
        value =>
            top +
            (
                (yMax - value) /
                (yMax - yMin)
            ) *
            plotHeight;

    let grid = "";

    for (
        let x = Math.ceil(xMin / 2) * 2;
        x <= xMax;
        x += 2
    ) {
        grid +=
            '<line class="choice-graph-grid" x1="' +
            xScale(x) +
            '" x2="' +
            xScale(x) +
            '" y1="' +
            top +
            '" y2="' +
            (top + plotHeight) +
            '"></line>';
    }

    for (
        let y = Math.ceil(yMin / 2) * 2;
        y <= yMax;
        y += 2
    ) {
        grid +=
            '<line class="choice-graph-grid" x1="' +
            left +
            '" x2="' +
            (left + plotWidth) +
            '" y1="' +
            yScale(y) +
            '" y2="' +
            yScale(y) +
            '"></line>';
    }

    if (xMin <= 0 && xMax >= 0) {
        grid +=
            '<line class="choice-graph-axis" x1="' +
            xScale(0) +
            '" x2="' +
            xScale(0) +
            '" y1="' +
            top +
            '" y2="' +
            (top + plotHeight) +
            '"></line>';
    }

    if (yMin <= 0 && yMax >= 0) {
        grid +=
            '<line class="choice-graph-axis" x1="' +
            left +
            '" x2="' +
            (left + plotWidth) +
            '" y1="' +
            yScale(0) +
            '" y2="' +
            yScale(0) +
            '"></line>';
    }

    const series =
        (graph.series || [])
            .map(
                item => {
                    const points =
                        Array.isArray(item?.points)
                            ? item.points.filter(
                                point =>
                                    Array.isArray(point) &&
                                    Number.isFinite(
                                        Number(point[0])
                                    ) &&
                                    Number.isFinite(
                                        Number(point[1])
                                    )
                            )
                            : [];

                    if (!points.length) {
                        return "";
                    }

                    return (
                        '<polyline class="choice-graph-series" points="' +
                        points
                            .map(
                                point =>
                                    xScale(
                                        Number(point[0])
                                    ) +
                                    "," +
                                    yScale(
                                        Number(point[1])
                                    )
                            )
                            .join(" ") +
                        '"></polyline>'
                    );
                }
            )
            .join("");

    return (
        '<div class="choice-graph-wrap">' +
            '<svg class="choice-mini-graph" viewBox="0 0 ' +
            width +
            " " +
            height +
            '" role="img" aria-label="' +
            escapeHtml(
                graph.ariaLabel ||
                "Graph choice"
            ) +
            '">' +
                grid +
                series +
            '</svg>' +
        '</div>'
    );
}


function parseStudentResponseValue(value) {
    const text =
        String(value ?? "")
            .trim()
            .replace(/,/g, "");

    if (!text) {
        return null;
    }

    const fraction =
        text.match(
            /^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/
        );

    if (fraction) {
        const numerator =
            Number(fraction[1]);
        const denominator =
            Number(fraction[2]);

        if (
            Number.isFinite(numerator) &&
            Number.isFinite(denominator) &&
            denominator !== 0
        ) {
            return numerator / denominator;
        }
    }

    const numeric =
        Number(text);

    return Number.isFinite(numeric)
        ? numeric
        : null;
}


function studentResponseIsCorrect(
    question,
    value
) {
    const submitted =
        parseStudentResponseValue(value);

    if (submitted === null) {
        return false;
    }

    const accepted =
        (
            Array.isArray(question.accepted_answers)
                ? question.accepted_answers
                : []
        )
            .map(parseStudentResponseValue)
            .filter(
                value =>
                    value !== null
            );

    return accepted.some(
        answer =>
            Math.abs(
                submitted - answer
            ) <= 1e-9
    );
}


function renderStudentResponse(question) {
    const wrapper =
        document.createElement("div");

    wrapper.className =
        "student-response-wrapper";

    const label =
        document.createElement("label");

    label.className =
        "student-response-label";

    label.setAttribute(
        "for",
        "student-response-input"
    );

    label.textContent =
        "Enter your answer";

    const input =
        document.createElement("input");

    input.id =
        "student-response-input";

    input.className =
        "student-response-input";

    input.type =
        "text";

    input.inputMode =
        "decimal";

    input.autocomplete =
        "off";

    input.placeholder =
        "Integer, decimal, or fraction";

    input.value =
        answers[question.id] || "";

    const checked =
        checkedResults[
            question.id
        ];

    const previousWrong =
        wrongAttempts[
            question.id
        ];

    const hasWrongAttempt =
        Array.isArray(
            previousWrong
        ) &&
        previousWrong.length > 0 &&
        !checked;

    if (checked) {
        input.classList.add(
            "correct-answer"
        );
        input.disabled = true;
    } else if (hasWrongAttempt) {
        input.classList.add(
            "incorrect-answer"
        );
        input.disabled = true;
    }

    input.addEventListener(
        "input",
        () => {
            answers[question.id] =
                input.value;

            if (mockTestMode) {
                saveMockState();
            }

            updateQuestionNavigator();
            renderAnswerFeedback(
                question
            );
        }
    );

    wrapper.appendChild(label);
    wrapper.appendChild(input);

    if (hasWrongAttempt) {
        const result =
            document.createElement(
                "div"
            );

        result.className =
            "student-response-reveal";

        const accepted =
            (
                Array.isArray(
                    question.accepted_answers
                )
                    ? question.accepted_answers
                    : []
            )
                .map(
                    value =>
                        String(value).trim()
                )
                .filter(Boolean);

        const fallback =
            String(
                question.correct_answer ||
                ""
            ).trim();

        const displayedAnswers =
            accepted.length
                ? accepted
                : (
                    fallback
                        ? [fallback]
                        : []
                );

        result.innerHTML =
            '<span class="student-response-reveal-label">Correct answer</span>' +
            '<strong class="student-response-reveal-value">' +
            escapeHtml(
                displayedAnswers.join(
                    " or "
                ) || "—"
            ) +
            '</strong>';

        wrapper.appendChild(
            result
        );
    }

    if (
        (
            checked ||
            hasWrongAttempt
        ) &&
        question.explanation
    ) {
        const explanation =
            document.createElement(
                "div"
            );

        explanation.className =
            "student-response-explanation";

        explanation.innerHTML =
            '<div class="student-response-explanation-label">Explanation</div>' +
            '<div class="student-response-explanation-text">' +
            renderQuestionContent(
                question,
                question.explanation
            ) +
            '</div>';

        wrapper.appendChild(
            explanation
        );
    }

    choicesContainer.appendChild(
        wrapper
    );
}


/* ============================================================
   RENDER CHOICES
   ============================================================ */

function renderChoices(
    question
) {

    choicesContainer.innerHTML = "";

    if (
        question.answer_type ===
        "student-response"
    ) {
        renderStudentResponse(
            question
        );
        return;
    }


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

            wrapper.dataset.choiceLetter =
                choice.letter;


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

            const attemptedWrong =
                wrongAttempts[
                    question.id
                ]?.includes(
                    choice.letter
                );


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

            if (attemptedWrong) {
                button.classList.add(
                    "incorrect-answer",
                    "attempted-wrong"
                );
                button.disabled = true;
            }

            if (checked) {
                if (
                    selected &&
                    choice.letter ===
                    question.correct_answer
                ) {
                    button.classList.add(
                        "correct-answer"
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

                <span class="choice-text">${
                    question.choice_graphs?.[
                        choice.letter
                    ]
                        ? (
                            renderChoiceMiniGraph(
                                question.choice_graphs[
                                    choice.letter
                                ]
                            ) +
                            (
                                choice.text
                                    ? '<span class="choice-graph-label">' +
                                        renderQuestionContent(
                                            question,
                                            choice.text
                                        ) +
                                      '</span>'
                                    : ""
                            )
                        )
                        : (
                            question.choice_tables?.[
                                choice.letter
                            ]
                                ? renderChoiceMiniTable(
                                    question.choice_tables[
                                        choice.letter
                                    ],
                                    question
                                )
                                : renderQuestionContent(
                                    question,
                                    choice.text
                                )
                        )
                }</span>
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


            strikeButton.classList.toggle(
                "active",
                Boolean(
                    isEliminated
                )
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


            if (
                checked ||
                attemptedWrong
            ) {
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

            const isCorrectChoice =
                choice.letter ===
                question.correct_answer;

            const shouldExplain =
                (
                    attemptedWrong &&
                    question.section !== "Math"
                ) ||
                (
                    checked &&
                    selected &&
                    isCorrectChoice
                );

            if (shouldExplain) {
                const reason =
                    createChoiceReason(
                        question,
                        choice.letter,
                        isCorrectChoice
                    );

                if (reason) {
                    wrapper.appendChild(
                        reason
                    );
                }
            }


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


    let isEliminated;

    if (existingIndex >= 0) {

        choices.splice(
            existingIndex,
            1
        );

        isEliminated =
            false;

    } else {

        choices.push(
            choiceLetter
        );

        isEliminated =
            true;

    }


    /*
     * Do not rebuild the entire answer-choice DOM here.
     *
     * Re-rendering choices destroys MathJax-rendered nodes,
     * graph/table layout, and inline formatting. Cross-out is
     * only a visual state change, so update the existing choice
     * in place instead.
     */
    const wrapper =
        choicesContainer
            ?.querySelector(
                `.choice-wrapper[data-choice-letter="${
                    CSS.escape(
                        String(
                            choiceLetter
                        )
                    )
                }"]`
            );

    const choiceButton =
        wrapper?.querySelector(
            ".choice"
        );

    const strikeButton =
        wrapper?.querySelector(
            ".choice-strike-button"
        );

    choiceButton
        ?.classList.toggle(
            "eliminated",
            isEliminated
        );

    if (strikeButton) {
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

        strikeButton.classList.toggle(
            "active",
            isEliminated
        );
    }

    if (mockTestMode) {
        saveMockState();
    }

}


/* ============================================================
   SELECT ANSWER
   ============================================================ */

function selectAnswer(
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

    if (mockTestMode) {
        saveMockState();
    }


    renderCurrentQuestion();

}


function renderAnswerFeedback(
    question
) {
    const checked =
        Boolean(
            checkedResults[
                question.id
            ]
        );

    const attemptedWrong =
        wrongAttempts[
            question.id
        ] || [];

    if (
        !answerFeedback ||
        !answerFeedbackTitle ||
        !answerFeedbackExplanation
    ) {
        return;
    }

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

    if (mockTestMode) {
        updateNavigationButtons();
        return;
    }

    if (checkAnswerButton) {
        const studentResponseRevealed =
            question.answer_type ===
                "student-response" &&
            attemptedWrong.length > 0 &&
            !checked;

        if (
            checked ||
            studentResponseRevealed
        ) {
            checkAnswerButton.disabled =
                true;

            checkAnswerButton.textContent =
                "Answer checked";
        } else {
            checkAnswerButton.disabled =
                false;

            checkAnswerButton.textContent =
                attemptedWrong.length
                    ? "Check new answer"
                    : "Check the selected answer";
        }
    }
}


async function checkAnswer() {

    if (mockTestMode) {
        finishMockModule(
            false
        );
        return;
    }

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
                "Select one of the remaining choices before checking your answer.";
        }

        return;
    }


    const isCorrect =
        question.answer_type ===
        "student-response"
            ? studentResponseIsCorrect(
                question,
                selected
            )
            : (
                selected ===
                question.correct_answer
            );


    if (!isCorrect) {

        if (
            !wrongAttempts[
                question.id
            ]
        ) {
            wrongAttempts[
                question.id
            ] = [];
        }

        if (
            !wrongAttempts[
                question.id
            ].includes(selected)
        ) {
            wrongAttempts[
                question.id
            ].push(selected);
        }

        if (
            question.answer_type !==
            "student-response"
        ) {
            delete answers[
                question.id
            ];
        }


        renderCurrentQuestion();


        await saveQuestionBankAttempt(
            question.id,
            false
        );

        return;
    }


    checkedResults[
        question.id
    ] = true;


    renderCurrentQuestion();


    await saveQuestionBankAttempt(
        question.id,
        true
    );

}

async function saveQuestionBankAttempt(
    questionId,
    isCorrect
) {

    try {
        const key =
            "absoluteprep-question-status:" +
            currentUser.id;

        const stored =
            JSON.parse(
                localStorage.getItem(key) || "{}"
            );

        stored[String(questionId)] = {
            is_correct:
                Boolean(isCorrect),
            updated_at:
                new Date().toISOString()
        };

        localStorage.setItem(
            key,
            JSON.stringify(stored)
        );
    } catch (storageError) {
        console.warn(
            "Could not save local question status:",
            storageError
        );
    }

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

    const key =
        String(question.id);

    const nextMarked =
        !(
            markedForReview[
                question.id
            ] === true
        );

    if (mockTestMode) {
        markedForReview[
            question.id
        ] =
            nextMarked;

        updateReviewButton();
        updateQuestionNavigator();
        saveMockState();
        return;
    }

    localReviewOverrides =
        getLocalReviewOverrides();

    localReviewOverrides[key] =
        nextMarked;

    saveLocalReviewOverrides(
        localReviewOverrides
    );

    markedForReview[
        question.id
    ] =
        nextMarked;

    updateReviewButton();
    updateQuestionNavigator();

    if (!currentUser) {
        return;
    }

    try {
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
                console.warn(
                    "Could not save review to Supabase; keeping local review state:",
                    insertResult.error
                );
            }
        } else {
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

    if (mockTestMode) {
        setMockCurrentIndex(
            currentQuestionIndex
        );
    }

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

    if (mockTestMode) {
        setMockCurrentIndex(
            currentQuestionIndex
        );
    }

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

    const atEnd =
        currentQuestionIndex >=
        questions.length - 1;

    nextButton.disabled =
        atEnd;

    if (
        mockTestMode &&
        checkAnswerButton
    ) {
        checkAnswerButton.classList.toggle(
            "hidden",
            !atEnd
        );

        checkAnswerButton.disabled =
            false;

        checkAnswerButton.textContent =
            "Finish Module";
    }

}


/* ============================================================
   TIMER
   ============================================================ */

function startTimer() {

    if (mockTestMode) {
        startMockModuleTimer();
        return;
    }

    resetQuestionTimer();

}


function resetQuestionTimer() {

    if (mockTestMode) {
        updateMockTimerDisplay();
        return;
    }

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

    if (mockTestMode) {
        updateMockTimerDisplay();
        return;
    }

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
                    question.answer_type ===
                        "student-response"
                        ? studentResponseIsCorrect(
                            question,
                            selected
                        )
                        : (
                            selected ===
                            question.correct_answer
                        )
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
                    ? (
                        question.answer_type ===
                            "student-response"
                            ? String(
                                result.selected
                            )
                            : `${
                                result.selected
                            }. ${
                                getChoiceText(
                                    question,
                                    result.selected
                                )
                            }`
                    )
                    : "No answer";


            const correctText =
                question.answer_type ===
                    "student-response"
                    ? (
                        Array.isArray(
                            question.accepted_answers
                        ) &&
                        question.accepted_answers
                            .length
                            ? question
                                .accepted_answers
                                .join(
                                    " or "
                                )
                            : String(
                                question.correct_answer ||
                                ""
                            )
                    )
                    : `${
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
                    ${renderQuestionContent(
                        question,
                        question.question_text
                    )}
                </div>

                <div class="review-result-answer">
                    <strong>Your answer:</strong>
                    ${renderQuestionContent(
                        question,
                        selectedText
                    )}
                </div>

                <div class="review-result-answer">
                    <strong>Correct answer:</strong>
                    ${renderQuestionContent(
                        question,
                        correctText
                    )}
                </div>

                <div class="review-result-explanation">
                    <strong>Explanation:</strong><br>
                    ${renderQuestionContent(
                        question,
                        getChoiceExplanation(
                            question,
                            question.correct_answer
                        ) ||
                        "No choice-specific explanation is available."
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


    typesetQuestionMath();

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


if (previousButton) {

    previousButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            goPrevious();

        }
    );

}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            goNext();

        }
    );

}


if (nextQuestionButton) {

    nextQuestionButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            goToNextQuestion();

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


function initializeDesmosPanel() {
    const toggle =
        document.getElementById(
            "desmos-toggle-button"
        );
    const panel =
        document.getElementById(
            "desmos-panel"
        );
    const card =
        panel?.querySelector(
            ".desmos-panel-card"
        );
    const handle =
        panel?.querySelector(
            ".desmos-panel-head"
        );
    const close =
        document.getElementById(
            "desmos-close-button"
        );
    const frame =
        document.getElementById(
            "desmos-frame"
        );
    const resizeHandles =
        Array.from(
            panel?.querySelectorAll(
                ".desmos-resize-handle"
            ) || []
        );

    if (
        !toggle ||
        !panel ||
        !card ||
        !handle ||
        !frame ||
        resizeHandles.length === 0
    ) {
        return;
    }

    let dragging = false;
    let resizing = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let resizeStartLeft = 0;
    let resizeStartTop = 0;
    let resizeStartWidth = 0;
    let resizeStartHeight = 0;
    let resizeDirection = "";
    let activeResizeHandle = null;
    let resizeFrame = null;
    let pendingLeft = 0;
    let pendingTop = 0;
    let pendingWidth = 0;
    let pendingHeight = 0;

    const clampCardToViewport =
        () => {
            const rect =
                card.getBoundingClientRect();

            const maxLeft =
                Math.max(
                    0,
                    window.innerWidth -
                    Math.min(
                        rect.width,
                        window.innerWidth
                    )
                );

            const maxTop =
                Math.max(
                    0,
                    window.innerHeight -
                    Math.min(
                        rect.height,
                        window.innerHeight
                    )
                );

            const nextLeft =
                Math.min(
                    Math.max(
                        rect.left,
                        0
                    ),
                    maxLeft
                );

            const nextTop =
                Math.min(
                    Math.max(
                        rect.top,
                        0
                    ),
                    maxTop
                );

            card.style.left =
                nextLeft + "px";
            card.style.top =
                nextTop + "px";
            card.style.transform =
                "none";
        };

    const openPanel =
        () => {
            if (
                toggle.hidden ||
                !document.body.classList.contains(
                    "math-question-active"
                )
            ) {
                closePanel();
                return;
            }

            if (!frame.src) {
                frame.src =
                    "https://www.desmos.com/calculator";
            }

            panel.classList.remove(
                "hidden"
            );

            panel.setAttribute(
                "aria-hidden",
                "false"
            );

            requestAnimationFrame(
                clampCardToViewport
            );
        };

    const closePanel =
        () => {
            panel.classList.add(
                "hidden"
            );

            panel.setAttribute(
                "aria-hidden",
                "true"
            );

            dragging = false;
            resizing = false;

            if (resizeFrame) {
                cancelAnimationFrame(
                    resizeFrame
                );
                resizeFrame = null;
            }

            card.classList.remove(
                "is-dragging",
                "is-resizing"
            );
        };

    handle.addEventListener(
        "pointerdown",
        event => {
            if (
                event.button !== 0 ||
                event.target.closest(
                    "button"
                )
            ) {
                return;
            }

            const rect =
                card.getBoundingClientRect();

            card.style.left =
                rect.left + "px";
            card.style.top =
                rect.top + "px";
            card.style.transform =
                "none";

            dragOffsetX =
                event.clientX -
                rect.left;
            dragOffsetY =
                event.clientY -
                rect.top;

            dragging = true;
            card.classList.add(
                "is-dragging"
            );

            handle.setPointerCapture?.(
                event.pointerId
            );

            event.preventDefault();
        }
    );

    handle.addEventListener(
        "pointermove",
        event => {
            if (!dragging) {
                return;
            }

            const width =
                card.offsetWidth;
            const height =
                card.offsetHeight;

            const maxLeft =
                Math.max(
                    0,
                    window.innerWidth -
                    width
                );
            const maxTop =
                Math.max(
                    0,
                    window.innerHeight -
                    height
                );

            const left =
                Math.min(
                    Math.max(
                        event.clientX -
                        dragOffsetX,
                        0
                    ),
                    maxLeft
                );

            const top =
                Math.min(
                    Math.max(
                        event.clientY -
                        dragOffsetY,
                        0
                    ),
                    maxTop
                );

            card.style.left =
                left + "px";
            card.style.top =
                top + "px";
        }
    );

    const stopDragging =
        event => {
            if (!dragging) {
                return;
            }

            dragging = false;
            card.classList.remove(
                "is-dragging"
            );

            if (
                event?.pointerId !==
                undefined
            ) {
                handle.releasePointerCapture?.(
                    event.pointerId
                );
            }
        };

    handle.addEventListener(
        "pointerup",
        stopDragging
    );

    handle.addEventListener(
        "pointercancel",
        stopDragging
    );

    const applyResize =
        () => {
            resizeFrame = null;

            card.style.left =
                pendingLeft + "px";
            card.style.top =
                pendingTop + "px";
            card.style.width =
                pendingWidth + "px";
            card.style.height =
                pendingHeight + "px";
        };

    const beginResize =
        (
            event,
            resizeHandle
        ) => {
            if (event.button !== 0) {
                return;
            }

            const rect =
                card.getBoundingClientRect();

            card.style.left =
                rect.left + "px";
            card.style.top =
                rect.top + "px";
            card.style.width =
                rect.width + "px";
            card.style.height =
                rect.height + "px";
            card.style.transform =
                "none";

            resizeStartX =
                event.clientX;
            resizeStartY =
                event.clientY;
            resizeStartLeft =
                rect.left;
            resizeStartTop =
                rect.top;
            resizeStartWidth =
                rect.width;
            resizeStartHeight =
                rect.height;
            resizeDirection =
                resizeHandle.dataset
                    .resizeDirection ||
                "se";
            activeResizeHandle =
                resizeHandle;

            pendingLeft =
                resizeStartLeft;
            pendingTop =
                resizeStartTop;
            pendingWidth =
                resizeStartWidth;
            pendingHeight =
                resizeStartHeight;

            resizing = true;
            card.classList.add(
                "is-resizing"
            );

            resizeHandle.setPointerCapture?.(
                event.pointerId
            );

            event.preventDefault();
            event.stopPropagation();
        };

    const continueResize =
        event => {
            if (!resizing) {
                return;
            }

            const dx =
                event.clientX -
                resizeStartX;
            const dy =
                event.clientY -
                resizeStartY;

            const minWidth =
                window.innerWidth <= 700
                    ? 280
                    : 420;
            const minHeight = 280;
            const viewportPadding = 8;

            const startRight =
                resizeStartLeft +
                resizeStartWidth;
            const startBottom =
                resizeStartTop +
                resizeStartHeight;

            let nextLeft =
                resizeStartLeft;
            let nextTop =
                resizeStartTop;
            let nextWidth =
                resizeStartWidth;
            let nextHeight =
                resizeStartHeight;

            if (
                resizeDirection.includes(
                    "e"
                )
            ) {
                nextWidth =
                    Math.min(
                        Math.max(
                            resizeStartWidth +
                            dx,
                            minWidth
                        ),
                        window.innerWidth -
                        resizeStartLeft -
                        viewportPadding
                    );
            }

            if (
                resizeDirection.includes(
                    "w"
                )
            ) {
                nextLeft =
                    Math.min(
                        Math.max(
                            resizeStartLeft +
                            dx,
                            viewportPadding
                        ),
                        startRight -
                        minWidth
                    );
                nextWidth =
                    startRight -
                    nextLeft;
            }

            if (
                resizeDirection.includes(
                    "s"
                )
            ) {
                nextHeight =
                    Math.min(
                        Math.max(
                            resizeStartHeight +
                            dy,
                            minHeight
                        ),
                        window.innerHeight -
                        resizeStartTop -
                        viewportPadding
                    );
            }

            if (
                resizeDirection.includes(
                    "n"
                )
            ) {
                nextTop =
                    Math.min(
                        Math.max(
                            resizeStartTop +
                            dy,
                            viewportPadding
                        ),
                        startBottom -
                        minHeight
                    );
                nextHeight =
                    startBottom -
                    nextTop;
            }

            pendingLeft =
                nextLeft;
            pendingTop =
                nextTop;
            pendingWidth =
                nextWidth;
            pendingHeight =
                nextHeight;

            if (!resizeFrame) {
                resizeFrame =
                    requestAnimationFrame(
                        applyResize
                    );
            }
        };

    const stopResizing =
        event => {
            if (!resizing) {
                return;
            }

            resizing = false;

            if (resizeFrame) {
                cancelAnimationFrame(
                    resizeFrame
                );
                resizeFrame = null;
                applyResize();
            }

            card.classList.remove(
                "is-resizing"
            );

            if (
                activeResizeHandle &&
                event?.pointerId !==
                    undefined
            ) {
                activeResizeHandle
                    .releasePointerCapture?.(
                        event.pointerId
                    );
            }

            activeResizeHandle = null;
            resizeDirection = "";
        };

    resizeHandles.forEach(
        resizeHandle => {
            resizeHandle.addEventListener(
                "pointerdown",
                event =>
                    beginResize(
                        event,
                        resizeHandle
                    )
            );

            resizeHandle.addEventListener(
                "pointermove",
                continueResize
            );

            resizeHandle.addEventListener(
                "pointerup",
                stopResizing
            );

            resizeHandle.addEventListener(
                "pointercancel",
                stopResizing
            );
        }
    );

    toggle.addEventListener(
        "click",
        openPanel
    );

    close?.addEventListener(
        "click",
        closePanel
    );

    window.addEventListener(
        "resize",
        () => {
            if (
                !panel.classList.contains(
                    "hidden"
                )
            ) {
                clampCardToViewport();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape" &&
                !panel.classList.contains(
                    "hidden"
                )
            ) {
                closePanel();
            }
        }
    );
}

initializeDesmosPanel();
