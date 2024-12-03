function updateTime() {
    const now = new Date();
    
    document.getElementById('hours').textContent = now.getHours().toString().padStart(2, '0');
    document.getElementById('minutes').textContent = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('seconds').textContent = now.getSeconds().toString().padStart(2, '0');
}

// Update time immediately and then every second
updateTime();
setInterval(updateTime, 1000);