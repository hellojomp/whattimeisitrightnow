let userIP = 'Loading...';

function isNightTime() {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
}

function getUserIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            userIP = data.ip;
            updateCurrentUser();
        })
        .catch(error => {
            console.error('Error fetching IP:', error);
            userIP = 'Unknown';
            updateCurrentUser();
        });
}
function updateTime() {
    const now = new Date();

    document.getElementById('hours').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('seconds').textContent = now.getSeconds().toString().padStart(2, '0');
}

function addHorizontalLine() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');

    let currentPosition = 0;

    function animateLine() {
        if (currentPosition < 50) {
            currentPosition += 50 / (10 * 1000);
        } else if (currentPosition < 75) {
            currentPosition += 25 / (100 * 1000);
        } else if (currentPosition < 87.5) {
            currentPosition += 12.5 / (100 * 1000);
        } else {
            currentPosition += 6.25 / (1000 * 1000);
        }

        const linePosition = canvas.height - (currentPosition / 100 * canvas.height);

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(0, linePosition);
        ctx.lineTo(canvas.width, linePosition);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw the time spent text
        const timeSpent = localStorage.getItem('timeSpent') || '0';
        const formattedTime = formatTime(parseInt(timeSpent));
        if (isNightTime()) {
            ctx.fillStyle = '#fff';
        } else {
            ctx.fillStyle = '#000';
        }
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(formattedTime, canvas.width - 80, linePosition - 8);

        if (currentPosition < 100) {
            requestAnimationFrame(animateLine);
        }
    }

    requestAnimationFrame(animateLine);
}


function createLightBeam() {
    if (!isNightTime()) {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        addHorizontalLine();
        return;
    }

    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';

    const container = document.createElement('div');
    container.className = 'light-beam-container';

    addHorizontalLine();

    for (let i = 0; i < 3; i++) {
        const lightBeam = document.createElement('div');
        lightBeam.className = `light-beam light-beam-${i + 1}`;
        container.appendChild(lightBeam);
    }

    document.querySelector('.time-section').appendChild(container);
}

function updateCurrentUser() {
    const currentUserElement = document.getElementById('current-user');
    const timeSpent = localStorage.getItem('timeSpent') || '0';
    console.log(`Your time: ${formatTime(parseInt(timeSpent))}`);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

// Initialize
updateTime();
setInterval(updateTime, 1000);
createLightBeam();
getUserIP();

function resizeCanvas() {
    const canvas = document.getElementById('backgroundCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);


// Track time spent on page
let startTime = Date.now();

// Update time spent every second
setInterval(() => {
    let timeSpent = Math.floor((Date.now() - startTime) / 1000);
    localStorage.setItem('timeSpent', timeSpent);
    updateCurrentUser();
}, 1000);

// For demonstration purposes, we're not actually sending data to a server.
// In a real application, you would implement this part.
window.addEventListener('beforeunload', () => {
    let timeSpent = localStorage.getItem('timeSpent');
    console.log('Time spent:', timeSpent);
    // Here you would typically send this data to your server
});