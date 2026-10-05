/* =========================================
   ABSOLUTEPREP AUTH GUARD
========================================= */

(async function () {

    const {
        data: {
            session
        },
        error
    } = await supabaseClient.auth.getSession();


    const user =
        session && session.user;

    const isGoogleUser =
        Boolean(
            user &&
            (
                user.app_metadata?.provider === "google" ||
                (
                    Array.isArray(
                        user.app_metadata?.providers
                    ) &&
                    user.app_metadata.providers.includes(
                        "google"
                    )
                ) ||
                (
                    Array.isArray(
                        user.identities
                    ) &&
                    user.identities.some(
                        identity =>
                            identity?.provider ===
                            "google"
                    )
                )
            )
        );


    if (
        error ||
        !session ||
        !isGoogleUser
    ) {

        const currentPath =
            window.location.pathname;


        const loginUrl =
            "/login?redirect=" +
            encodeURIComponent(currentPath);


        window.location.replace(loginUrl);

        return;
    }


    /* User is authenticated */

    document.documentElement.classList.add(
        "authenticated"
    );


})();
