document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await absolutePrepSupabase.auth.getSession();
    if (!data || !data.session) {
        window.location.href = "/login";
        return;
    }

    const resetButton = document.getElementById("dashboard-reset");

    if (resetButton) {
        resetButton.addEventListener("click", async () => {
            const confirmed = window.confirm(
                "Reset all practice data? This will permanently delete your question attempts, review marks, and question-set results. This cannot be undone."
            );

            if (!confirmed) {
                return;
            }

            resetButton.disabled = true;
            resetButton.textContent = "Resetting...";

            const { data: sessionData, error: sessionError } =
                await absolutePrepSupabase.auth.getSession();

            const user = sessionData?.session?.user;

            if (sessionError || !user) {
                resetButton.disabled = false;
                resetButton.textContent = "Reset all practice data";
                console.error("Could not identify current user:", sessionError);
                window.alert("We couldn't identify your account. Please log in again.");
                return;
            }

            try {
                const statusKey =
                    "absoluteprep-question-status:" +
                    user.id;

                const reviewKey =
                    "absoluteprep-question-reviews:" +
                    user.id;

                const resetKey =
                    "absoluteprep-practice-reset:" +
                    user.id;

                /*
                 * Mark the local reset first. This guarantees the
                 * interface stays reset even if an older server row
                 * cannot be deleted because of a database policy.
                 */
                localStorage.setItem(
                    resetKey,
                    new Date().toISOString()
                );

                localStorage.removeItem(statusKey);
                localStorage.removeItem(reviewKey);

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
                            .eq(
                                "user_id",
                                user.id
                            );

                    if (error) {
                        console.warn(
                            "Could not reset " +
                                table +
                                ":",
                            error
                        );

                        serverErrors.push(
                            table
                        );
                    }
                }

                if (serverErrors.length > 0) {
                    window.alert(
                        "Your practice data has been reset on this device. Some older server records could not be deleted."
                    );
                } else {
                    window.alert(
                        "All practice data has been reset."
                    );
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
