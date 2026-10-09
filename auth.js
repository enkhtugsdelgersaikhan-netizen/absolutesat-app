/* ============================================================
   ABSOLUTEPREP AUTHENTICATION SYSTEM
   ============================================================ */



/* ============================================================
   SITE THEME
   ============================================================ */

const LEXLOGICA_THEME_KEY =
    "lexlogica-theme";

let lexLogicaThemeObserver =
    null;

function getStoredLexLogicaTheme() {
    try {
        return localStorage.getItem(
            LEXLOGICA_THEME_KEY
        );
    } catch {
        return null;
    }
}

function setStoredLexLogicaTheme(
    value
) {
    try {
        localStorage.setItem(
            LEXLOGICA_THEME_KEY,
            value
        );
    } catch {
        /* Storage can be unavailable in privacy-restricted contexts. */
    }
}

function updateLexLogicaThemeButton() {
    const button =
        document.getElementById(
            "lexlogica-theme-toggle"
        );

    if (!button) {
        return;
    }

    const isDark =
        document.documentElement
            .classList.contains(
                "lexlogica-dark-mode"
            );

    button.setAttribute(
        "aria-pressed",
        isDark
            ? "true"
            : "false"
    );

    button.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );

    const symbol =
        button.querySelector(
            ".theme-toggle-symbol"
        );

    const label =
        button.querySelector(
            ".theme-toggle-label"
        );

    if (symbol) {
        symbol.textContent =
            isDark
                ? "☀"
                : "◐";
    }

    if (label) {
        label.textContent =
            isDark
                ? "Light"
                : "Dark";
    }
}

function applyLexLogicaTheme(
    mode
) {
    const isDark =
        mode === "dark";

    document.documentElement
        .classList.toggle(
            "lexlogica-dark-mode",
            isDark
        );

    document.documentElement
        .style.colorScheme =
        isDark
            ? "dark"
            : "light";

    updateLexLogicaThemeButton();

    observeLexLogicaThemePersistence();
}

function ensureStoredLexLogicaThemeApplied() {
    const stored =
        getStoredLexLogicaTheme();

    const shouldBeDark =
        stored === "dark";

    const isDark =
        document.documentElement
            .classList.contains(
                "lexlogica-dark-mode"
            );

    if (
        shouldBeDark !==
        isDark
    ) {
        applyLexLogicaTheme(
            shouldBeDark
                ? "dark"
                : "light"
        );
    }
}


function observeLexLogicaThemePersistence() {
    if (
        lexLogicaThemeObserver ||
        !document.documentElement
    ) {
        return;
    }

    lexLogicaThemeObserver =
        new MutationObserver(
            () => {
                ensureStoredLexLogicaThemeApplied();
            }
        );

    lexLogicaThemeObserver.observe(
        document.documentElement,
        {
            attributes: true,
            attributeFilter: [
                "class"
            ]
        }
    );

    window.addEventListener(
        "storage",
        event => {
            if (
                event.key ===
                LEXLOGICA_THEME_KEY
            ) {
                ensureStoredLexLogicaThemeApplied();
            }
        }
    );

    window.addEventListener(
        "pageshow",
        () => {
            ensureStoredLexLogicaThemeApplied();
        }
    );
}


function initializeLexLogicaTheme() {
    const stored =
        getStoredLexLogicaTheme();

    applyLexLogicaTheme(
        stored === "dark"
            ? "dark"
            : "light"
    );

    const header =
        document.querySelector(
            ".header-container"
        );

    if (
        !header ||
        document.getElementById(
            "lexlogica-theme-toggle"
        )
    ) {
        updateLexLogicaThemeButton();
        return;
    }

    const button =
        document.createElement(
            "button"
        );

    button.id =
        "lexlogica-theme-toggle";

    button.className =
        "theme-toggle-button";

    button.type =
        "button";

    button.innerHTML =
        '<span class="theme-toggle-symbol" aria-hidden="true">◐</span>' +
        '<span class="theme-toggle-label">Dark</span>';

    const mobileMenu =
        header.querySelector(
            ".mobile-menu-button"
        );

    header.insertBefore(
        button,
        mobileMenu || null
    );

    button.addEventListener(
        "click",
        () => {
            const nextMode =
                document.documentElement
                    .classList.contains(
                        "lexlogica-dark-mode"
                    )
                    ? "light"
                    : "dark";

            setStoredLexLogicaTheme(
                nextMode
            );

            applyLexLogicaTheme(
                nextMode
            );
        }
    );

    updateLexLogicaThemeButton();
}

/* ============================================================
   SUPABASE
   ============================================================ */

const ABSOLUTEPREP_SUPABASE_URL =
    "https://ikvvixdyztyqqxkveois.supabase.co";

const ABSOLUTEPREP_SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";


const absolutePrepSupabase =
    window.supabase.createClient(
        ABSOLUTEPREP_SUPABASE_URL,
        ABSOLUTEPREP_SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


/* ============================================================
   GOOGLE-ONLY SESSION POLICY
   ============================================================ */

function isAbsolutePrepGoogleSession(session) {
    const user = session && session.user;

    if (!user) {
        return false;
    }

    const primaryProvider =
        user.app_metadata &&
        user.app_metadata.provider;

    const linkedProviders =
        user.app_metadata &&
        Array.isArray(user.app_metadata.providers)
            ? user.app_metadata.providers
            : [];

    const identities =
        Array.isArray(user.identities)
            ? user.identities
            : [];

    return (
        primaryProvider === "google" ||
        linkedProviders.includes("google") ||
        identities.some(
            identity =>
                identity &&
                identity.provider === "google"
        )
    );
}


/* ============================================================
   UPDATE HEADER
   ============================================================ */

function ensureHeaderLogoutButton() {
    let button = document.querySelector(".site-dashboard");
    if (!button) return null;
    // Legacy pages ship a hidden Dashboard link. Replace it with a real,
    // keyboard-accessible button before displaying anything.
    if (button.tagName !== "BUTTON") {
        const replacement = document.createElement("button");
        replacement.type = "button";
        replacement.className = button.className + " site-logout";
        replacement.hidden = true;
        replacement.setAttribute("aria-hidden", "true");
        replacement.textContent = "Log out";
        button.replaceWith(replacement);
        button = replacement;
    }
    if (!button.dataset.logoutBound) {
        button.dataset.logoutBound = "true";
        button.addEventListener("click", async () => {
            if (button.disabled) return;
            button.disabled = true;
            button.textContent = "Logging out…";
            try {
                const { error } = await absolutePrepSupabase.auth.signOut();
                if (error) throw error;
                window.location.assign("/");
            } catch (error) {
                console.error("Sign out failed:", error);
                button.textContent = "Log out";
                button.disabled = false;
                window.alert("Could not log out. Please try again.");
            }
        });
    }
    return button;
}

function syncMobileAuthLink(authenticated) {
    const navigation = document.querySelector(".navigation");
    if (!navigation) return;
    let link = navigation.querySelector(".nav-auth-link");
    if (authenticated) {
        if (link) link.remove();
        return;
    }
    if (!link) {
        link = document.createElement("a");
        link.href = "/login";
        link.className = "nav-button nav-auth-link";
        link.textContent = "Get started";
        navigation.appendChild(link);
    }
}

async function updateAbsolutePrepHeader(session) {

    const authButtons =
        document.querySelector(
            ".auth-buttons"
        );


    if (!authButtons) {
        return;
    }


    /*
     * If a session was not supplied, get the
     * currently stored session.
     */

    if (session === undefined) {

        const {
            data,
            error
        } =
            await absolutePrepSupabase.auth.getSession();


        if (error) {

            console.error(
                "Could not get Supabase session:",
                error
            );

        }


        session =
            data
                ? data.session
                : null;

    }


    const dashboardButton = ensureHeaderLogoutButton();

    if (
        session &&
        !isAbsolutePrepGoogleSession(session)
    ) {
        await absolutePrepSupabase.auth.signOut({
            scope: "local"
        });

        session = null;
    }


    /* ========================================================
       LOGGED IN
    ======================================================== */

    if (session) {

        syncMobileAuthLink(true);
        authButtons.classList.add("logged-in");
        if (dashboardButton) { dashboardButton.hidden = false; dashboardButton.classList.add("is-authenticated"); dashboardButton.removeAttribute("aria-hidden"); }

        authButtons.innerHTML = "";

        return;

    }


    /* ========================================================
       LOGGED OUT
    ======================================================== */

    syncMobileAuthLink(false);
    authButtons.classList.remove("logged-in");
    if (dashboardButton) { dashboardButton.hidden = true; dashboardButton.classList.remove("is-authenticated"); dashboardButton.setAttribute("aria-hidden","true"); }

    authButtons.innerHTML = `

        <a
            href="/login"
            class="login-button get-started-button"
        >
            Get started
        </a>

    `;

}


/* ============================================================
   AUTH STATE CHANGES
   ============================================================ */

absolutePrepSupabase.auth.onAuthStateChange(
    (
        event,
        session
    ) => {

        console.log(
            "AbsolutePrep auth event:",
            event
        );


        updateAbsolutePrepHeader(
            session
        );

    }
);


/* ============================================================
   INITIALIZE HEADER
   ============================================================ */

async function initializeAbsolutePrepAuth() {

    /*
     * Supabase automatically initializes its auth client
     * and restores the stored session.
     *
     * We then explicitly read that session and update
     * the header.
     */

    const {
        data,
        error
    } =
        await absolutePrepSupabase.auth.getSession();


    if (error) {

        console.error(
            "Authentication initialization error:",
            error
        );

    }


    const session =
        data
            ? data.session
            : null;


    await updateAbsolutePrepHeader(
        session
    );

}


/* ============================================================
   START
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        () => {
            initializeLexLogicaTheme();
            initializeAbsolutePrepAuth();
        }
    );

} else {

    initializeLexLogicaTheme();
    initializeAbsolutePrepAuth();

}

