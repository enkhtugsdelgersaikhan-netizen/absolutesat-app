document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await absolutePrepSupabase.auth.getSession();
    if (!data || !data.session) {
        window.location.href = "/login";
        return;
    }

    const user = data.session.user;
    const profileKey = "lexlogica_sat_profile:" + user.id;

    const readingInput = document.getElementById("sat-reading-writing");
    const mathInput = document.getElementById("sat-math");
    const totalPreview = document.getElementById("sat-total-preview");
    const goalReadingInput = document.getElementById("sat-goal-reading-writing");
    const goalMathInput = document.getElementById("sat-goal-math");
    const goalTotalPreview = document.getElementById("sat-goal-total-preview");
    const profileForm = document.getElementById("sat-profile-form");
    const profileSave = document.getElementById("sat-profile-save");
    const profileClear = document.getElementById("sat-profile-clear");
    const profileStatus = document.getElementById("sat-profile-status");
    const satShapeChart = document.getElementById("dashboard-sat-shape");

    const validSectionScore = (value) =>
        Number.isInteger(value) &&
        value >= 200 &&
        value <= 800 &&
        value % 10 === 0;

    const readLocalProfile = () => {
        try {
            const raw = localStorage.getItem(profileKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            const reading = Number(parsed?.readingWriting);
            const math = Number(parsed?.math);
            const goalReading = Number(parsed?.goalReadingWriting);
            const goalMath = Number(parsed?.goalMath);
            if (!validSectionScore(reading) || !validSectionScore(math)) return null;
            return {
                readingWriting: reading,
                math,
                goalReadingWriting: validSectionScore(goalReading) ? goalReading : null,
                goalMath: validSectionScore(goalMath) ? goalMath : null
            };
        } catch {
            return null;
        }
    };

    const metadataReading = Number(user.user_metadata?.sat_reading_writing);
    const metadataMath = Number(user.user_metadata?.sat_math);
    const metadataGoalReading = Number(user.user_metadata?.sat_goal_reading_writing);
    const metadataGoalMath = Number(user.user_metadata?.sat_goal_math);
    const localProfile = readLocalProfile();

    const initialProfile =
        validSectionScore(metadataReading) && validSectionScore(metadataMath)
            ? {
                readingWriting: metadataReading,
                math: metadataMath,
                goalReadingWriting: validSectionScore(metadataGoalReading)
                    ? metadataGoalReading
                    : localProfile?.goalReadingWriting ?? null,
                goalMath: validSectionScore(metadataGoalMath)
                    ? metadataGoalMath
                    : localProfile?.goalMath ?? null
            }
            : localProfile;

    if (initialProfile) {
        readingInput.value = initialProfile.readingWriting;
        mathInput.value = initialProfile.math;
        if (validSectionScore(initialProfile.goalReadingWriting)) {
            goalReadingInput.value = initialProfile.goalReadingWriting;
        }
        if (validSectionScore(initialProfile.goalMath)) {
            goalMathInput.value = initialProfile.goalMath;
        }
        localStorage.setItem(profileKey, JSON.stringify(initialProfile));
    }

    const scoreShapeSvg = (series) => {
        const cx = 160, cy = 142, radius = 100;
        const vertices = [
            [160, 30],
            [63, 198],
            [257, 198]
        ];
        const center = [160, 142];
        const clamp = (v, min, max) => Math.max(0, Math.min(1, (v - min) / (max - min)));
        const point = (vertex, ratio) => [
            center[0] + (vertex[0] - center[0]) * ratio,
            center[1] + (vertex[1] - center[1]) * ratio
        ];
        const polygon = (values) => {
            const ratios = [
                clamp(values.composite, 400, 1600),
                clamp(values.reading, 200, 800),
                clamp(values.math, 200, 800)
            ];
            return vertices.map((v, i) => point(v, ratios[i]).join(",")).join(" ");
        };
        const grid = [0.25,0.5,0.75,1].map(level =>
            '<polygon points="' + vertices.map(v => point(v, level).join(",")).join(" ") + '" class="sat-shape-grid"/>'
        ).join("");
        const shapes = series.filter(x => x.values).map(x =>
            '<polygon points="' + polygon(x.values) + '" class="sat-shape-series ' + x.className + '"/>'
        ).join("");
        return '<svg viewBox="0 0 320 235" role="img" aria-label="SAT score shape">' +
            grid +
            '<line x1="160" y1="142" x2="160" y2="30" class="sat-shape-axis"/>' +
            '<line x1="160" y1="142" x2="63" y2="198" class="sat-shape-axis"/>' +
            '<line x1="160" y1="142" x2="257" y2="198" class="sat-shape-axis"/>' +
            shapes +
            '<text x="160" y="16" text-anchor="middle" class="sat-shape-label">Composite</text>' +
            '<text x="160" y="29" text-anchor="middle" class="sat-shape-value">' + (series[0]?.values?.composite ?? "—") + '</text>' +
            '<text x="42" y="217" text-anchor="middle" class="sat-shape-label">R&W</text>' +
            '<text x="42" y="230" text-anchor="middle" class="sat-shape-value">' + (series[0]?.values?.reading ?? "—") + '</text>' +
            '<text x="278" y="217" text-anchor="middle" class="sat-shape-label">Math</text>' +
            '<text x="278" y="230" text-anchor="middle" class="sat-shape-value">' + (series[0]?.values?.math ?? "—") + '</text>' +
        '</svg>';
    };

    const updateShape = () => {
        if (!satShapeChart) return;
        const reading = Number(readingInput?.value);
        const math = Number(mathInput?.value);
        const goalReading = Number(goalReadingInput?.value);
        const goalMath = Number(goalMathInput?.value);
        const current = validSectionScore(reading) && validSectionScore(math)
            ? { composite: reading + math, reading, math }
            : null;
        const goal = validSectionScore(goalReading) && validSectionScore(goalMath)
            ? { composite: goalReading + goalMath, reading: goalReading, math: goalMath }
            : null;
        satShapeChart.innerHTML = scoreShapeSvg([
            { className: "is-current", values: current },
            { className: "is-goal", values: goal }
        ]);
    };

    const updateTotal = () => {
        const reading = Number(readingInput?.value);
        const math = Number(mathInput?.value);
        const goalReading = Number(goalReadingInput?.value);
        const goalMath = Number(goalMathInput?.value);

        totalPreview.textContent =
            validSectionScore(reading) && validSectionScore(math)
                ? String(reading + math)
                : "—";

        goalTotalPreview.textContent =
            validSectionScore(goalReading) && validSectionScore(goalMath)
                ? String(goalReading + goalMath)
                : "—";
        updateShape();
    };

    [readingInput, mathInput, goalReadingInput, goalMathInput].forEach((input) => {
        input?.addEventListener("input", updateTotal);
    });
    updateTotal();

    profileForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const reading = Number(readingInput.value);
        const math = Number(mathInput.value);
        const goalReadingRaw = goalReadingInput.value.trim();
        const goalMathRaw = goalMathInput.value.trim();
        const goalReading = goalReadingRaw === "" ? null : Number(goalReadingRaw);
        const goalMath = goalMathRaw === "" ? null : Number(goalMathRaw);

        if (!validSectionScore(reading) || !validSectionScore(math)) {
            profileStatus.textContent = "Enter valid current section scores from 200 to 800 in 10-point increments.";
            profileStatus.classList.add("error");
            return;
        }

        const oneGoalMissing = (goalReading === null) !== (goalMath === null);
        const invalidGoal =
            goalReading !== null &&
            (!validSectionScore(goalReading) || !validSectionScore(goalMath));

        if (oneGoalMissing || invalidGoal) {
            profileStatus.textContent = "Enter both goal section scores, or leave both goal fields blank.";
            profileStatus.classList.add("error");
            return;
        }

        const profile = {
            readingWriting: reading,
            math,
            goalReadingWriting: goalReading,
            goalMath
        };
        localStorage.setItem(profileKey, JSON.stringify(profile));

        profileSave.disabled = true;
        profileSave.textContent = "Saving…";
        profileStatus.textContent = "";
        profileStatus.classList.remove("error");

        const { error } = await absolutePrepSupabase.auth.updateUser({
            data: {
                sat_reading_writing: reading,
                sat_math: math,
                sat_goal_reading_writing: goalReading,
                sat_goal_math: goalMath
            }
        });

        profileSave.disabled = false;
        profileSave.textContent = "Save SAT scores";

        if (error) {
            console.warn("SAT profile account sync failed:", error);
            profileStatus.textContent = "Saved on this device. Account sync was unavailable.";
            profileStatus.classList.add("error");
        } else {
            profileStatus.textContent = "Saved. University comparisons will now show your current score, goal, and SAT impact.";
            profileStatus.classList.remove("error");
        }
    });

    profileClear?.addEventListener("click", async () => {
        readingInput.value = "";
        mathInput.value = "";
        goalReadingInput.value = "";
        goalMathInput.value = "";
        updateTotal();
        localStorage.removeItem(profileKey);
        profileStatus.textContent = "Scores cleared.";
        profileStatus.classList.remove("error");

        const { error } = await absolutePrepSupabase.auth.updateUser({
            data: {
                sat_reading_writing: null,
                sat_math: null,
                sat_goal_reading_writing: null,
                sat_goal_math: null
            }
        });

        if (error) {
            console.warn("SAT profile clear sync failed:", error);
            profileStatus.textContent = "Cleared on this device. Account sync was unavailable.";
            profileStatus.classList.add("error");
        }
    });

    const resetButton = document.getElementById("dashboard-reset");

    if (resetButton) {
        resetButton.addEventListener("click", async () => {
            const confirmed = window.confirm(
                "Reset all practice data? This will permanently delete your question attempts, review marks, question-set results, and vocabulary progress. This cannot be undone."
            );

            if (!confirmed) {
                return;
            }

            resetButton.disabled = true;
            resetButton.textContent = "Resetting...";

            const { data: sessionData, error: sessionError } =
                await absolutePrepSupabase.auth.getSession();

            const resetUser = sessionData?.session?.user;

            if (sessionError || !resetUser) {
                resetButton.disabled = false;
                resetButton.textContent = "Reset all practice data";
                console.error("Could not identify current user:", sessionError);
                window.alert("We couldn't identify your account. Please log in again.");
                return;
            }

            try {
                const statusKey = "absoluteprep-question-status:" + resetUser.id;
                const reviewKey = "absoluteprep-question-reviews:" + resetUser.id;
                const resetKey = "absoluteprep-practice-reset:" + resetUser.id;
                const vocabStateKey = "absoluteprep_vocab_state";
                const legacyVocabLearnedKey = "absoluteprep_vocab_learned";

                localStorage.setItem(resetKey, new Date().toISOString());
                localStorage.removeItem(statusKey);
                localStorage.removeItem(reviewKey);
                localStorage.removeItem(vocabStateKey);
                localStorage.removeItem(legacyVocabLearnedKey);

                const tables = [
                    "question_answers",
                    "question_set_attempts",
                    "question_attempts",
                    "question_reviews"
                ];

                const serverErrors = [];

                for (const table of tables) {
                    const { error } =
                        await absolutePrepSupabase
                            .from(table)
                            .delete()
                            .eq("user_id", resetUser.id);

                    if (error) {
                        console.warn("Could not reset " + table + ":", error);
                        serverErrors.push(table);
                    }
                }

                if (serverErrors.length > 0) {
                    window.alert(
                        "Your practice data has been reset on this device. Some older server records could not be deleted."
                    );
                } else {
                    window.alert("All practice data has been reset.");
                }

                window.location.reload();

            } catch (error) {
                console.error("Practice data reset error:", error);
                resetButton.disabled = false;
                resetButton.textContent = "Reset all practice data";
                window.alert(
                    "We couldn't reset all of your practice data. No further changes were made after the error."
                );
            }
        });
    }

    const logoutButton = document.getElementById("dashboard-logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            logoutButton.disabled = true;
            logoutButton.textContent = "Logging out...";
            const { error } = await absolutePrepSupabase.auth.signOut();
            if (error) {
                logoutButton.disabled = false;
                logoutButton.textContent = "Log out";
                console.error("Dashboard logout error:", error);
                return;
            }
            window.location.href = "/";
        });
    }
});