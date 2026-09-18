document.addEventListener("DOMContentLoaded", async () => {
    const { data } = await absoluteSatSupabase.auth.getSession();
    if (!data || !data.session) {
        window.location.href = "/login";
        return;
    }

    const logoutButton = document.getElementById("dashboard-logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            logoutButton.disabled = true;
            logoutButton.textContent = "Logging out...";
            const { error } = await absoluteSatSupabase.auth.signOut();
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
