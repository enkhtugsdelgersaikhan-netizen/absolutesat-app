const SUPABASE_URL = "https://ikvvixdyztyqqxkveois.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_nO5HUWPidf4U_MMK0-HYEA_vuOR0POg";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
