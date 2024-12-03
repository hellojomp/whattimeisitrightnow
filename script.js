let userIP = 'Loading...';

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

function updateCurrentUser() {
    const currentUserElement = document.getElementById('current-user');
    const timeSpent = localStorage.getItem('timeSpent') || '0';
    currentUserElement.innerHTML = `Your IP: ${userIP} | Time spent: ${formatTime(parseInt(timeSpent))}`;
}function updateTime() {
    const now = new Date();

    document.getElementById('hours').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('seconds').textContent = now.getSeconds().toString().padStart(2, '0');
}

function createLightBeam() {
    const container = document.createElement('div');
    container.className = 'light-beam-container';

    for (let i = 0; i < 3; i++) {
        const lightBeam = document.createElement('div');
        lightBeam.className = `light-beam light-beam-${i + 1}`;
        container.appendChild(lightBeam);

        if (i === 1) {
            const blackSquare = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            blackSquare.classList.add('black-square');
            blackSquare.innerHTML = '<use href="#black-square" />';
            lightBeam.appendChild(blackSquare);

            animateSquare(blackSquare, lightBeam);
        }
    }

    document.querySelector('.time-section').appendChild(container);
}

function animateSquare(square, container) {
    let bottom = 10;
    let size = 50;
    let lastLineTime = Date.now();

    function step() {
        bottom += 0.1;
        size = Math.max(5, 50 * (1 - bottom / 100));

        square.style.bottom = `${bottom}%`;
        square.style.width = `${size}px`;
        square.style.height = `${size}px`;

        const currentTime = Date.now();
        if (currentTime - lastLineTime >= 10000) {
            addHorizontalLine(container, bottom);
            lastLineTime = currentTime;
        }

        if (bottom < 100) {
            requestAnimationFrame(step);
        } else {
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

    setTimeout(() => {
        container.removeChild(line);
    }, 10000);
}

function updateLeaderboard() {
    // This is a mock function. In a real application, you would fetch data from a server.
    const mockData = [
        { ip: '192.168.1.1', timeSpent: 3600 },
        { ip: '192.168.1.2', timeSpent: 1800 },
        { ip: '192.168.1.3', timeSpent: 7200 },
    ];

    const leaderboardBody = document.querySelector('#leaderboard-table tbody');
    leaderboardBody.innerHTML = '';
    mockData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.ip}</td>
            <td>${formatTime(entry.timeSpent)}</td>
        `;
        leaderboardBody.appendChild(row);
    });

    updateCurrentUser();
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
updateLeaderboard();
setInterval(updateLeaderboard, 10000);

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