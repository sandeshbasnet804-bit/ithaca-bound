# Local verification

Checked in Google Chrome headless on October 5, 2026.

All 33 browser assertions passed:

- Three navigation menus and current-page markers.
- Images and Lost Cowboy font loaded on all three pages.
- Theme toggles on all pages.
- Quiz opening, required answers, 0/5 and 5/5 scoring, and reset.
- Switching between activity panels.
- Odysseus, Penelope, and Polyphemus matches, tie breaker, and reset.
- Booking validation, envelope opening, seal revealing the letter, closing the dialog, and displaying the summary.
- All three destination query parameters preselect the correct voyage.

A separate static check passed for every HTML link, script and image reference, fragment target, CSS background image, and font path. No broken paths were found. No JavaScript exception interrupted the exercised interactions.

These are local checks. Public deployment and live verification are pending GitHub account and repository setup. Mobile visual inspection, uploaded portrait handling, and exhaustive browser console collection were not performed.
