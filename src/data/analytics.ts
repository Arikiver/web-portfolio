// Visitor analytics. Both services are optional and off while their ID is empty.
//
// Microsoft Clarity (free, sign in with a Google or Microsoft account at https://clarity.microsoft.com):
//   New project → name it, URL https://arikiver.github.io/web-portfolio/ → Settings → Overview →
//   copy the "Project ID" (about 10 letters and digits) into `clarity` below.
//   Gives visitor counts, countries, devices, referrers, time on page, scroll depth, heatmaps,
//   session recordings and the custom events/tags sent by src/scripts/analytics.ts.
//
// GoatCounter (free, optional, https://www.goatcounter.com/signup): the "code" you pick there
//   (the xyz in xyz.goatcounter.com) goes in `goatcounter`. A simple, cookie-free page and
//   referrer counter that ad blockers tend to block less.
//
// Your own visits: open the site once with ?me=1 on each of your browsers and devices to stop
// counting yourself (?me=0 undoes it).

export const analytics = {
  clarity: 'zcn48sc0un',
  goatcounter: '',
};
