/* Balanced answer-choice placements for adaptive mock tests.
   Layouts are saved per attempt; student-produced responses are untouched. */
(function () {
"use strict";
const LETTERS = ["A", "B", "C", "D"];

function shuffle(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function quotas(count) {
    const base = Math.floor(count / 4), extra = count % 4, result = [];
    for (let bits = 0; bits < 16; bits++) {
        const chosen = [0, 1, 2, 3].filter(i => bits & (1 << i));
        if (chosen.length === extra) {
            result.push(LETTERS.map((_, i) => base + Number(chosen.includes(i))));
        }
    }
    return result;
}

function usable(entries) {
    const seen = new Set();
    return (entries || []).filter(entry => {
        const q = entry?.question || entry;
        if (!q || q.answerType === "student-response" ||
            q.answer_type === "student-response") return false;
        const id = String(q.id);
        const correct = String(q.correctAnswer || q.correct_answer || "").toUpperCase();
        if (seen.has(id) || !LETTERS.includes(correct)) return false;
        if (!LETTERS.every(letter =>
            q.choices?.[letter] !== undefined ||
            q.choiceGraphs?.[letter] !== undefined ||
            q.choiceTables?.[letter] !== undefined ||
            q.choice_graphs?.[letter] !== undefined ||
            q.choice_tables?.[letter] !== undefined
        )) return false;
        seen.add(id);
        return true;
    });
}

function plan(manifest) {
    const placements = {};
    for (const sectionKey of ["readingWriting", "math"]) {
        const section = manifest?.sections?.[sectionKey];
        if (!section) continue;
        const first = usable(section.module1);
        const low = usable(section.module2Low);
        const high = usable(section.module2High);
        const lowIds = new Set(low.map(e => String((e.question || e).id)));
        const highIds = new Set(high.map(e => String((e.question || e).id)));
        const shared = low.filter(e => highIds.has(String((e.question || e).id)));
        const lowOnly = low.filter(e => !highIds.has(String((e.question || e).id)));
        const highOnly = high.filter(e => !lowIds.has(String((e.question || e).id)));

        // Find quotas balanced both per module and on either full route.
        let optimal = [], bestScore = Infinity;
        for (const q1 of quotas(first.length)) {
            for (const qLow of quotas(low.length)) {
                for (const qHigh of quotas(high.length)) {
                    const capacity = qLow.reduce(
                        (sum, amount, i) => sum + Math.min(amount, qHigh[i]), 0
                    );
                    if (capacity < shared.length) continue;
                    const lowMean = (first.length + low.length) / 4;
                    const highMean = (first.length + high.length) / 4;
                    const score = LETTERS.reduce((sum, _, i) =>
                        sum + (q1[i] + qLow[i] - lowMean) ** 2 +
                              (q1[i] + qHigh[i] - highMean) ** 2, 0);
                    if (score < bestScore) {
                        bestScore = score;
                        optimal = [{q1, qLow, qHigh}];
                    } else if (score === bestScore) {
                        optimal.push({q1, qLow, qHigh});
                    }
                }
            }
        }
        if (!optimal.length) continue;
        const {q1, qLow, qHigh} =
            optimal[Math.floor(Math.random() * optimal.length)];

        function assign(entries, counts) {
            const targets = shuffle(counts.flatMap((count, i) =>
                Array(count).fill(LETTERS[i])
            ));
            shuffle(entries).forEach((entry, index) => {
                const q = entry.question || entry;
                const key = sectionKey + ":" + String(q.id);
                if (placements[key]) return;
                const correct = String(q.correctAnswer || q.correct_answer).toUpperCase();
                const distractors = shuffle(LETTERS.filter(letter => letter !== correct));
                placements[key] = LETTERS.map(letter =>
                    letter === targets[index] ? correct : distractors.shift()
                );
            });
        }

        // Shared questions keep identical placement on easy/hard routes.
        const caps = qLow.map((amount, i) => Math.min(amount, qHigh[i]));
        const used = [0, 0, 0, 0];
        for (let i = 0; i < shared.length; i++) {
            const available = [0, 1, 2, 3].filter(index => used[index] < caps[index]);
            const minimum = Math.min(...available.map(index => used[index]));
            const candidates = available.filter(index => used[index] === minimum);
            used[candidates[Math.floor(Math.random() * candidates.length)]]++;
        }
        assign(first, q1);
        assign(shared, used);
        assign(lowOnly, qLow.map((n, i) => n - used[i]));
        assign(highOnly, qHigh.map((n, i) => n - used[i]));
    }
    return placements;
}

function relabelExplanation(value, oldToNew) {
    if (typeof value !== "string") return value;
    const change = letter => oldToNew[letter.toUpperCase()] || letter;
    // One replacement pass prevents cascading when two letters swap.
    return value.replace(
        /\b((?:choice|option|answer)\s+)([A-D])\b|\b((?:correct\s+answer|answer\s+choice)\s*(?:is|:)\s*)([A-D])\b|\b([A-D])(?=\s+(?:is|was|would\s+be)\s+(?:incorrect|wrong|correct)\b)/gi,
        (match, prefix1, letter1, prefix2, letter2, bareLetter) =>
            letter1 ? prefix1 + change(letter1) :
            letter2 ? prefix2 + change(letter2) :
            change(bareLetter)
    );
}

function apply(question, sectionKey, placements) {
    if (question.answer_type === "student-response") return question;
    const order = placements?.[sectionKey + ":" + String(question.id)];
    if (!Array.isArray(order) || order.length !== 4) return question;

    const oldToNew = {};
    order.forEach((original, i) => {oldToNew[original] = LETTERS[i];});
    const updated = {...question};
    for (let i = 0; i < 4; i++) {
        updated["choice_" + LETTERS[i].toLowerCase()] =
            question["choice_" + order[i].toLowerCase()];
    }
    for (const field of ["choice_graphs", "choice_tables", "choice_explanations"]) {
        if (!question[field]) continue;
        const mapped = {};
        for (let i = 0; i < 4; i++) {
            const original = order[i];
            const value = question[field][original] ??
                question[field][original.toLowerCase()];
            if (value !== undefined) {
                mapped[LETTERS[i]] = field === "choice_explanations"
                    ? relabelExplanation(value, oldToNew)
                    : value;
            }
        }
        updated[field] = mapped;
    }
    updated.correct_answer =
        oldToNew[String(question.correct_answer || "").toUpperCase()] ||
        question.correct_answer;
    updated.explanation = relabelExplanation(question.explanation, oldToNew);
    updated.desmos_method = relabelExplanation(question.desmos_method, oldToNew);
    return updated;
}

window.MockChoiceBalance = {plan, apply};
})();
