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
   PUBLIC ACCESS
   LexLogica's practice tools work without accounts. Progress is
   stored in this browser under a stable, device-local profile.
   Supabase remains available for public question-bank reads only.
   ============================================================ */

const ABSOLUTEPREP_SUPABASE_URL = "https://ikvvixdyztyqqxkveois.supabase.co";
const ABSOLUTEPREP_SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";
const absolutePrepSupabase = window.supabase.createClient(
    ABSOLUTEPREP_SUPABASE_URL,
    ABSOLUTEPREP_SUPABASE_PUBLISHABLE_KEY
);

const lexlogicaLocalUser = Object.freeze({ id: "local" });
window.lexlogicaLocalUser = lexlogicaLocalUser;

function updateAbsolutePrepHeader() {
    // Remove obsolete account calls to action on both desktop and mobile.
    document.querySelectorAll(
        ".auth-buttons, .site-dashboard, .nav-auth-link"
    ).forEach(element => element.remove());

    // Legacy styles previously used this class to gate practice content.
    // It now means the visitor can access the page, not that they signed in.
    document.documentElement.classList.add("authenticated", "public-access");
}

function initializeLexLogicaPublicAccess() {
    initializeLexLogicaTheme();
    updateAbsolutePrepHeader();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLexLogicaPublicAccess);
} else {
    initializeLexLogicaPublicAccess();
}
