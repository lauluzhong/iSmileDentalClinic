import React from 'react';

/**
 * A <style> tag whose CSS survives server rendering.
 *
 * `<style>{css}</style>` looks harmless but renderToString HTML-escapes text
 * children, so on a pre-rendered page the stylesheet ships with `&` written as
 * `&amp;` and `'` as `&#x27;`. <style> is a raw-text element — browsers never
 * decode entities inside it — so `content: ''` arrives as `content: &#x27;&#x27;`
 * and the rule is dropped. That silently killed the hero's gradient overlay.
 * It also made the pre-rendered CSS differ from what the client renders, which
 * failed hydration and threw the whole pre-rendered page away.
 *
 * dangerouslySetInnerHTML writes the CSS verbatim. It is not a risk here: every
 * caller passes a hard-coded template literal, never user input.
 *
 * Use this instead of a bare <style> in ANY component that can be server
 * rendered (see scripts/prerender-home.js).
 */
const Style = ({ children }) => (
  <style dangerouslySetInnerHTML={{ __html: children }} />
);

export default Style;
