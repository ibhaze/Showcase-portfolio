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

// Update target position on mouse move
document.addEventListener('mousemove', (event) => {
  targetX = event.pageX;
  targetY = event.pageY;
});

// Function to animate both circles smoothly
function animate() {
  // Increase easing factor to reduce delay
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
