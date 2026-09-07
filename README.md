# ☕ Coffee Tracker

A single-page coffee and caffeine tracker for cutting down gently. Open it, tap the
drink you just had, and it keeps count.

No build step, no dependencies, no account. Everything lives in your browser's local
storage — nothing is ever uploaded.

## Use it

Open `index.html` in any browser. That's it.

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
