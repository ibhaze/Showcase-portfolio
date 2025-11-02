// Select the outer follower and inner circle elements
const follower = document.querySelector('.follower');
const innerCircle = document.querySelector('.inner-circle');

// Define target positions for smooth animations
let targetX = 0;
let targetY = 0;
let followerX = 0;
let followerY = 0;
let innerX = 0;
let innerY = 0;

// Define the maximum offset to keep the inner circle inside the outer circle
const outerDiameter = follower.offsetWidth;
const innerDiameter = innerCircle.offsetWidth;
const maxOffset = (outerDiameter - innerDiameter) / 2;

// Define default and enlarged sizes
const defaultFollowerSize = 30;
const enlargedFollowerSize = 100;  // Only the outer circle will increase in size
const defaultInnerCircleSize = 6;  // Inner circle size stays the same

// Utilities — color parsing & luminance
function parseRGB(rgbStr) {
  // Supports "rgb(r, g, b)" or "rgba(r, g, b, a)"
  const m = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3] };
}

function relativeLuminance({ r, g, b }) {
  // sRGB to linear
  const srgb = [r, g, b].map(v => v / 255).map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

// Walk up the DOM to find an actual background color (not transparent)
function getEffectiveBackgroundColor(node) {
  let el = node;
  while (el && el !== document.documentElement) {
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    if (bg && bg !== 'transparent' && !bg.startsWith('rgba(0, 0, 0, 0)')) {
      return bg;
    }
    el = el.parentElement;
  }
  // Fallback to document/body background
  const docBg = getComputedStyle(document.documentElement).backgroundColor;
  if (docBg && docBg !== 'transparent') return docBg;
  const bodyBg = getComputedStyle(document.body).backgroundColor;
  return bodyBg && bodyBg !== 'transparent' ? bodyBg : 'rgb(255, 255, 255)';
}

// Color decision logic:
// - If background is roughly #dbdbd1 (tolerant match), use black cursor
// - Else if background is "dark" (luminance < threshold), use #dbdbd1 cursor
// - Else use black cursor for better contrast
const DBDBD1_HEX = '#dbdbd1';
const DBDBD1_RGB = { r: 219, g: 219, b: 209 };
const COLOR_LIGHT = DBDBD1_HEX; // cursor color on dark bg
const COLOR_DARK = '#000000';   // cursor color on light bg

function isCloseToDbdbd1(rgb, tolerance = 10) {
  return Math.abs(rgb.r - DBDBD1_RGB.r) <= tolerance &&
         Math.abs(rgb.g - DBDBD1_RGB.g) <= tolerance &&
         Math.abs(rgb.b - DBDBD1_RGB.b) <= tolerance;
}

function updateCursorColorAtPoint(x, y) {
  // Because .follower has pointer-events: none, elementFromPoint sees what's beneath it
  const el = document.elementFromPoint(x, y) || document.body;
  const bgStr = getEffectiveBackgroundColor(el);
  const rgb = parseRGB(bgStr);

  let cursorColor = COLOR_DARK; // default to black
  if (rgb) {
    if (isCloseToDbdbd1(rgb)) {
      cursorColor = COLOR_DARK; // if bg ≈ #dbdbd1 → black cursor
    } else {
      const L = relativeLuminance(rgb);
      const isDark = L < 0.5; // threshold works well in practice
      cursorColor = isDark ? COLOR_LIGHT : COLOR_DARK;
    }
  }

  follower.style.borderColor = cursorColor;
  innerCircle.style.backgroundColor = cursorColor;
}

// Update target position on mouse move + update cursor color for contrast
document.addEventListener('mousemove', (event) => {
  targetX = event.pageX;
  targetY = event.pageY;
  updateCursorColorAtPoint(event.clientX, event.clientY);
});

// Function to animate both circles smoothly
function animate() {
  // Faster easing for the outer circle to follow more closely
  followerX += (targetX - followerX) * 0.2;
  followerY += (targetY - followerY) * 0.2;
  follower.style.left = `${followerX}px`;
  follower.style.top = `${followerY}px`;

  // Faster response for inner circle to follow even more snappily
  innerX += (targetX - innerX) * 0.35;
  innerY += (targetY - innerY) * 0.35;

  // Calculate the relative position of the inner circle to the outer circle
  let offsetX = innerX - followerX;
  let offsetY = innerY - followerY;

  // Clamp the inner circle’s position within the max offset boundaries
  const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);
  if (distance > maxOffset) {
    const angle = Math.atan2(offsetY, offsetX);
    offsetX = maxOffset * Math.cos(angle);
    offsetY = maxOffset * Math.sin(angle);
  }

  // Apply the clamped position to the inner circle
  innerCircle.style.left = `${offsetX + outerDiameter / 2 - innerDiameter / 2}px`;
  innerCircle.style.top = `${offsetY + outerDiameter / 2 - innerDiameter / 2}px`;

  requestAnimationFrame(animate); // Repeat the animation loop
}

// Start the animation
animate();

// Add hover effect on links to enlarge only the outer circle
const links = document.querySelectorAll('a');
links.forEach(link => {
  link.addEventListener('mouseenter', () => {
    // Enlarge only the outer circle when hovering over a link
    follower.style.width = `${enlargedFollowerSize}px`;
    follower.style.height = `${enlargedFollowerSize}px`;

    // Hide the inner circle
    innerCircle.style.display = 'none';
  });

  link.addEventListener('mouseleave', () => {
    // Reset to original size when mouse leaves the link
    follower.style.width = `${defaultFollowerSize}px`;
    follower.style.height = `${defaultFollowerSize}px`;

    // Show the inner circle
    innerCircle.style.display = 'block';
  });
});
