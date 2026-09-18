/* =========================================
   ABSOLUTESAT AUTH GUARD
========================================= */

(async function () {

    const {
        data: {
            session
        },
        error
    } = await supabaseClient.auth.getSession();


    if (error || !session) {

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
