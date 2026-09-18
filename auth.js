/* ============================================================
   ABSOLUTEPREP AUTHENTICATION SYSTEM
   ============================================================ */


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
   UPDATE HEADER
   ============================================================ */

async function updateAbsolutePrepHeader(session = null) {

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
        initializeAbsolutePrepAuth
    );

} else {

    initializeAbsolutePrepAuth();

}
