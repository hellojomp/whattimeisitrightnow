function updateTime() {
    const now = new Date();

    document.getElementById('hours').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('seconds').textContent = now.getSeconds().toString().padStart(2, '0');
}

// Update time immediately and then every second
updateTime();
setInterval(updateTime, 1000);

function createLightBeam() {
    const container = document.createElement('div');
    container.className = 'light-beam-container';

    for (let i = 0; i < 3; i++) {
        const lightBeam = document.createElement('div');
        lightBeam.className = `light-beam light-beam-${i + 1}`;
        container.appendChild(lightBeam);

        // Add black square to the middle light beam
        if (i === 1) {
            const blackSquare = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            blackSquare.classList.add('black-square');
            blackSquare.innerHTML = '<use href="#black-square" />';
            lightBeam.appendChild(blackSquare);

            // Start the animation
            animateSquare(blackSquare, lightBeam);
        }
    }

    document.body.appendChild(container);
}

function animateSquare(square, container) {
    let bottom = 10;
    let size = 50;
    let lastLineTime = Date.now();

    function step() {
        bottom += 0.01; // Move 1px per second (0.1px per 100ms)
        size = Math.max(5, 50 * (1 - bottom / 100)); // Decrease size as it goes up, minimum 5px

        square.style.bottom = `${bottom}%`;
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        // Add horizontal line every 10 seconds
        const currentTime = Date.now();
        if (currentTime - lastLineTime >= 5000) {
            addHorizontalLine(container, bottom);
            lastLineTime = currentTime;
        }

        if (bottom < 100) {
            requestAnimationFrame(step);
        } else {
            // Reset the animation when it reaches the top
            bottom = 10;
            size = 50;
            square.style.bottom = `${bottom}%`;
            square.style.width = `${size}px`;
            square.style.height = `${size}px`;
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

function addHorizontalLine(container, position) {
    const line = document.createElement('div');
    line.className = 'horizontal-line';
    line.style.bottom = `${position}%`;
    container.appendChild(line);

    // Remove the line after it's no longer visible
    setTimeout(() => {
        container.removeChild(line);
    }, 10000); // Remove after 10 seconds
}
// Call createLightBeam after the page loads
window.addEventListener('load', createLightBeam);