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
    const profileForm = document.getElementById("sat-profile-form");
    const profileSave = document.getElementById("sat-profile-save");
    const profileClear = document.getElementById("sat-profile-clear");
    const profileStatus = document.getElementById("sat-profile-status");

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
            return validSectionScore(reading) && validSectionScore(math)
                ? { readingWriting: reading, math }
                : null;
        } catch {
            return null;
        }
    };

    const metadataReading = Number(user.user_metadata?.sat_reading_writing);
    const metadataMath = Number(user.user_metadata?.sat_math);

    const initialProfile =
        validSectionScore(metadataReading) && validSectionScore(metadataMath)
            ? { readingWriting: metadataReading, math: metadataMath }
            : readLocalProfile();

    if (initialProfile) {
        readingInput.value = initialProfile.readingWriting;
        mathInput.value = initialProfile.math;
        localStorage.setItem(profileKey, JSON.stringify(initialProfile));
    }

    const updateTotal = () => {
        const reading = Number(readingInput?.value);
        const math = Number(mathInput?.value);
        if (validSectionScore(reading) && validSectionScore(math)) {
            totalPreview.textContent = String(reading + math);
        } else {
            totalPreview.textContent = "—";
        }
    };

    readingInput?.addEventListener("input", updateTotal);
    mathInput?.addEventListener("input", updateTotal);
    updateTotal();

    profileForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const reading = Number(readingInput.value);
        const math = Number(mathInput.value);

        if (!validSectionScore(reading) || !validSectionScore(math)) {
            profileStatus.textContent = "Enter valid section scores from 200 to 800 in 10-point increments.";
            profileStatus.classList.add("error");
            return;
        }

        const profile = { readingWriting: reading, math };
        localStorage.setItem(profileKey, JSON.stringify(profile));

        profileSave.disabled = true;
        profileSave.textContent = "Saving…";
        profileStatus.textContent = "";
        profileStatus.classList.remove("error");

        const { error } = await absolutePrepSupabase.auth.updateUser({
            data: {
                sat_reading_writing: reading,
                sat_math: math
            }
        });

        profileSave.disabled = false;
        profileSave.textContent = "Save SAT scores";

        if (error) {
            console.warn("SAT profile account sync failed:", error);
            profileStatus.textContent = "Saved on this device. Account sync was unavailable.";
            profileStatus.classList.add("error");
        } else {
            profileStatus.textContent = "Saved. Your university comparisons will now show your position.";
            profileStatus.classList.remove("error");
        }
    });

    profileClear?.addEventListener("click", async () => {
        readingInput.value = "";
        mathInput.value = "";
        updateTotal();
        localStorage.removeItem(profileKey);
        profileStatus.textContent = "Scores cleared.";
        profileStatus.classList.remove("error");

        const { error } = await absolutePrepSupabase.auth.updateUser({
            data: {
                sat_reading_writing: null,
                sat_math: null
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