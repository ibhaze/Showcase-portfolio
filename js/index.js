  let loadPercent = 0;
        const loader = document.getElementById('loader');
        const landingPage = document.getElementById('landingPage');

        function incrementLoader() {
            if (loadPercent < 100) {
                loadPercent++;
                loader.textContent = loadPercent;
                setTimeout(incrementLoader, 8); // Increment every 8 ms
            } else {
                // Trigger drag-down animation
                landingPage.classList.add("drag-down");

                // Redirect after the animation (1.2 seconds to match CSS duration)
                setTimeout(() => {
                    window.location.href = 'homepage.html';
                }, 700); // Adjust time to match animation
            }
        }

        // Start the loader
        incrementLoader();
        