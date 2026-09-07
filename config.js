// Optional Supabase settings, for syncing your log between devices.
//
// Leave these blank and the tracker works exactly as before: everything stays
// in this browser, and the Sync section stays hidden.
//
// To turn sync on, copy both values from your Supabase project under
// Settings -> API. They are safe to commit to a public repo: the anon key
// only grants what the row-level security policies in supabase/schema.sql
// allow, which is "your own rows, once signed in".
window.COFFEE_CONFIG = {
  supabaseUrl: "https://iqxwyxsvbqfdzqhblyrl.supabase.co/rest/v1/",
  supabaseAnonKey: "sb_publishable_PO9rQlGz5aVUE-DxBOcKSw_-lNvrMHW"
};
