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
        ABSOLUTESAT_SUPABASE_PUBLISHABLE_KEY
    );


/* ============================================================
   GET CURRENT USER
   ============================================================ */

async function getAbsoluteSATUser() {

    try {

        const {
            data: {
                user
            },
            error
        } =
            await absoluteSatSupabase.auth.getUser();


        if (error) {

            console.error(
                "Could not get current user:",
                error
            );

            return null;

        }


        return user || null;

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        return null;

    }

}


/* ============================================================
   UPDATE HEADER
   ============================================================ */

async function updateAbsoluteSATHeader() {

    const user =
        await getAbsoluteSATUser();


    const authButtons =
        document.querySelector(
            ".auth-buttons"
        );


    if (!authButtons) {
        return;
    }


    /* =========================================
       USER IS LOGGED IN
    ========================================= */

    if (user) {

        authButtons.innerHTML = `

            <button
                type="button"
                class="logout-button"
                id="absolute-sat-logout"
            >
                Logout
            </button>

        `;


        const logoutButton =
            document.getElementById(
                "absolute-sat-logout"
            );


        if (logoutButton) {

            logoutButton.addEventListener(
                "click",
                async () => {

                    logoutButton.disabled =
                        true;

                    logoutButton.textContent =
                        "Logging out...";


                    const {
                        error
                    } =
                        await absoluteSatSupabase.auth.signOut();


                    if (error) {

                        console.error(
                            "Logout error:",
                            error
                        );

                        logoutButton.disabled =
                            false;

                        logoutButton.textContent =
                            "Logout";

                        return;

                    }


                    window.location.replace(
                        "/"
                    );

                }
            );

        }

    }


    /* =========================================
       USER IS NOT LOGGED IN
    ========================================= */

    else {

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

}


/* ============================================================
   AUTH STATE LISTENER
   ============================================================ */

absoluteSatSupabase.auth.onAuthStateChange(
    (event, session) => {

        updateAbsoluteSATHeader();

    }
);


/* ============================================================
   INITIALIZE
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateAbsoluteSATHeader();

    }
);
