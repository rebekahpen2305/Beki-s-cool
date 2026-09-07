# ☕ Coffee Tracker

A single-page coffee and caffeine tracker for cutting down gently. Open it, tap the
drink you just had, and it keeps count.

No build step, no dependencies, no account. Everything lives in your browser's local
storage — nothing is ever uploaded.

## Use it

Open `index.html` in any browser. That's it. To sync between devices, see
[Syncing between devices](#syncing-between-devices-optional) below.

To have it on your phone, publish it with GitHub Pages (**Settings → Pages → Deploy from
branch → `main` / root**) and add the URL to your home screen. Note that the data is tied
to the browser you log it in, so pick one and stick to it — or move it across with
Export/Import.

## What it does

- **One-tap logging** — 11 preset drinks with typical caffeine amounts, plus a custom
  option for anything else.
- **Today at a glance** — cups against your daily limit, total caffeine, and how long ago
  the last one was.
- **Still in your system** — estimates the caffeine left in you right now, and how much
  will still be there at bedtime, using a 5-hour half-life. Useful for spotting the
  afternoon cup that's costing you sleep.
- **14-day chart** — bars turn red on days you went over, with a dashed line at your limit.
- **Trend** — 7-day average, the change against the week before, and a streak count of
  days at or under your limit.
- **Your own limits** — set the cup limit, caffeine limit, and bedtime in Settings.
- **Export / import** — your whole history as JSON, so you can back it up or move browsers.

## Syncing between devices (optional)

Out of the box there is no server: your log lives in one browser. If you want it on
your phone *and* your laptop, connect a free [Supabase](https://supabase.com) project.

1. **Create a project** at [supabase.com](https://supabase.com) — the free tier is far
   more than this needs.
2. **Create the table.** Open the project's **SQL Editor**, paste in
   [`supabase/schema.sql`](supabase/schema.sql), and run it.
3. **Allow your site to sign in.** Under **Authentication → URL Configuration**, add your
   site's address (e.g. `https://<username>.github.io/<repo>/`) to **Redirect URLs**.
4. **Paste your keys.** From **Settings → API**, copy the Project URL and the `anon`
   public key into `config.js`.
5. Reload the tracker, open **Settings & data**, and sign in with your email. A one-time
   link arrives in your inbox — no password to remember.

Do the same on your other device and the two keep themselves in step.

### Is it safe to commit those keys?

Yes. The `anon` key is designed to be public — it is in the page source of every Supabase
site. What protects your data is the **row-level security** policy in `schema.sql`, which
restricts every query to rows whose `user_id` matches the signed-in user. Without a valid
session that key can read nothing at all.

Do **not** commit the `service_role` key. That one bypasses row-level security entirely,
and this app never needs it.

### How syncing behaves

- **Offline first.** Drinks are written to this browser immediately and uploaded
  afterwards, so logging works with no signal and catches up later.
- **Last write wins.** Each drink carries a timestamp; when two devices disagree about
  the same drink, the more recent edit is kept.
- **Deletes stick.** A deleted drink is kept as a tombstone rather than simply removed,
  so a deletion on your phone doesn't reappear from your laptop on the next sync.
- Sync runs on sign-in, shortly after each change, when the tab regains focus, when the
  network returns, and every five minutes.

## Cutting down

The tracker defaults to a 3-cup / 300 mg daily limit. For most healthy adults, 400 mg a
day is the usual upper guideline.

The gentler way down is to lower your limit by one cup every week or two rather than
stopping abruptly — a sudden drop tends to bring headaches and a few rough days. Swapping
one cup for decaf, or moving your last coffee earlier in the day, both count as progress
even when the cup count doesn't move.

## Caffeine estimates

Preset values are typical figures for a standard serving. Real amounts vary a lot with
bean, roast, grind, and cup size, so treat the milligrams as a good guide rather than a
measurement. You can always log a custom drink with your own number.
