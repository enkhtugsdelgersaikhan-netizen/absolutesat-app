// Audit ONLY the length of answer choices, never their sophistication or correctness.
// Usage: node rw-length-bias-audit.mjs [--details] [--json] [--strict]
import { readFileSync } from "node:fs";
const bank = JSON.parse(readFileSync(new URL("./question-bank.json", import.meta.url), "utf8"));
const letters = ["A", "B", "C", "D"];
const strip = (input) => String(input ?? "")
  .replace(/<[^>]*>/g, " ")
  .replace(/\$\$([\s\S]*?)\$\$/g, "$1")
  .replace(/\\\((.*?)\\\)/g, "$1")
  .replace(/\\\[(.*?)\\\]/g, "$1")
  .replace(/(?:\*\*|__|(?<!\w)[*_]|[*_](?!\w)|`)/g, "")
  .replace(/&(?:nbsp|amp|lt|gt|quot);/g, " ");
const countWords = value => (strip(value).match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) ?? []).length;
const countChars = value => strip(value).length;
const measures = { words: countWords, characters: countChars };
const empty = () => ({ total: 0, uniqueLongest: 0, longestCorrect: 0, uniqueShortest: 0, shortestCorrect: 0, longestTies: 0, shortestTies: 0 });
const summarize = v => ({
  ...v,
  longestGuessAccuracy: v.uniqueLongest ? +(100 * v.longestCorrect / v.uniqueLongest).toFixed(1) : null,
  shortestGuessAccuracy: v.uniqueShortest ? +(100 * v.shortestCorrect / v.uniqueShortest).toFixed(1) : null,
});
const aggregate = () => ({ all: empty(), bySkill: {}, byDifficulty: {}, flagged: [] });
const data = { words: aggregate(), characters: aggregate() };
for (const question of bank.questions) {
  const options = letters.map(letter => question.choices?.[letter]);
  if (options.some(x => typeof x !== "string") || !letters.includes(question.correctAnswer)) {
    throw Error(`Invalid choices or correctAnswer at ${question.id}`);
  }
  for (const [unit, measure] of Object.entries(measures)) {
    const sizes = options.map(measure);
    const max = Math.max(...sizes), min = Math.min(...sizes);
    const winners = sizes.map((size, i) => size === max ? letters[i] : null).filter(Boolean);
    const losers = sizes.map((size, i) => size === min ? letters[i] : null).filter(Boolean);
    const skill = question.subtopic || question.skill || "Unclassified";
    const diff = question.difficulty || "Unclassified";
    const group = data[unit];
    const stats = [group.all, group.bySkill[skill] ??= empty(), group.byDifficulty[diff] ??= empty()];
    for (const s of stats) {
      s.total++;
      if (winners.length === 1) {
        s.uniqueLongest++;
        if (winners[0] === question.correctAnswer) s.longestCorrect++;
      } else s.longestTies++;
      if (losers.length === 1) {
        s.uniqueShortest++;
        if (losers[0] === question.correctAnswer) s.shortestCorrect++;
      } else s.shortestTies++;
    }
    if (winners.length === 1 && winners[0] === question.correctAnswer) {
      group.flagged.push({ id: question.id, skill, difficulty: diff, longestLength: max, nextLongest: [...sizes].sort((a, b) => b - a)[1], choiceLengths: Object.fromEntries(letters.map((letter, i) => [letter, sizes[i]])), correctAnswer: question.correctAnswer });
    }
  }
}
for (const unit of Object.keys(data)) {
  const group = data[unit];
  group.all = summarize(group.all);
  for (const type of ["bySkill", "byDifficulty"]) {
    for (const [k, v] of Object.entries(group[type])) group[type][k] = summarize(v);
  }
}
if (process.argv.includes("--json")) {
  const output = process.argv.includes("--details") ? data : Object.fromEntries(Object.entries(data).map(([k,v])=>[k,{ all:v.all, bySkill:v.bySkill, byDifficulty:v.byDifficulty }]));
  console.log(JSON.stringify(output, null, 2));
} else {
  for (const [unit, group] of Object.entries(data)) {
    const s = group.all;
    console.log(`\n${unit}: ${s.total} questions; unique longest ${s.uniqueLongest}; longest-choice correct ${s.longestCorrect} (${s.longestGuessAccuracy}%); unique shortest ${s.uniqueShortest}; shortest-choice correct ${s.shortestCorrect} (${s.shortestGuessAccuracy}%)`);
    for (const [skill, v] of Object.entries(group.bySkill).sort((a,b)=>b[1].total-a[1].total)) {
      console.log(`  ${skill}: n=${v.total}, unique-longest=${v.uniqueLongest}, correct-longest=${v.longestCorrect}, longest-guess=${v.longestGuessAccuracy ?? "n/a"}%`);
    }
    if (process.argv.includes("--details")) {
      for (const q of group.flagged) console.log(`  FLAG ${q.id} [${q.skill}] ${q.correctAnswer}: ${JSON.stringify(q.choiceLengths)}`);
    }
  }
}
if (process.argv.includes("--strict") && Object.values(data).some(g => g.all.uniqueLongest >= 40 && Math.abs(g.all.longestCorrect / g.all.uniqueLongest - .25) > .10)) {
  process.exitCode = 1;
}
