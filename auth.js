/* ============================================================
   ABSOLUTESAT AUTHENTICATION SYSTEM
   ============================================================ */


/* ============================================================
   SUPABASE
   ============================================================ */

const ABSOLUTESAT_SUPABASE_URL =
    "https://ikvvixdyztyqqxkveois.supabase.co";

const ABSOLUTESAT_SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";


const absoluteSatSupabase =
    window.supabase.createClient(
        ABSOLUTESAT_SUPABASE_URL,
        ABSOLUTESAT_SUPABASE_PUBLISHABLE_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            }
        }
    );


/* ============================================================
   UPDATE HEADER
   ============================================================ */

async function updateAbsoluteSATHeader(session = null) {

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

    if (!session) {

        const {
            data,
            error
        } =
            await absoluteSatSupabase.auth.getSession();


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


    /* ========================================================
       LOGGED IN
    ======================================================== */

    if (session) {

        authButtons.classList.add("logged-in");

        authButtons.innerHTML = `

            <a
                href="/dashboard"
                class="dashboard-button"
            >
                Dashboard
            </a>

        `;

        return;

    }


    /* ========================================================
       LOGGED OUT
    ======================================================== */

    authButtons.innerHTML = `

        <a
            href="/register"
            class="register-button"
        >
            Register
        </a>

        <a
            href="/login"
            class="login-button"
        >
            Login
        </a>

    `;

}


/* ============================================================
   AUTH STATE CHANGES
   ============================================================ */

absoluteSatSupabase.auth.onAuthStateChange(
    (
        event,
        session
    ) => {

        console.log(
            "AbsoluteSAT auth event:",
            event
        );


        updateAbsoluteSATHeader(
            session
        );

    }
);


/* ============================================================
   INITIALIZE HEADER
   ============================================================ */

async function initializeAbsoluteSATAuth() {

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
        await absoluteSatSupabase.auth.getSession();


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


    await updateAbsoluteSATHeader(
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
        initializeAbsoluteSATAuth
    );

} else {

    initializeAbsoluteSATAuth();

}
