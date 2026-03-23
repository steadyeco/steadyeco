// Land Regeneration gate — redirects to Coming Soon when flag is false
// This file is loaded by all land-regen pages via <script> tag
// When LAND_REGEN_LIVE flips to true, this does nothing.
if (typeof LAND_REGEN_LIVE !== 'undefined' && !LAND_REGEN_LIVE) {
  window.location.replace('/land-regeneration/coming-soon');
}
