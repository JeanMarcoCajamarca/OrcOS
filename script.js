// 1. Clock, Date, and Dynamic Weather Logic
function updateDashboard() {
    const now = new Date();

    // --- Time ---
    document.getElementById('clock').innerText = now.toLocaleTimeString();

    // --- Date ---
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    let dateString = now.toLocaleDateString('en-US', options);
    const day = now.getDate();
    const suffix = getOrdinalSuffix(day);
    const year = now.getFullYear();
    document.getElementById('date').innerText = `${dateString}${suffix}, ${year}`;

    // --- Mock Weather (Simulating real-time feel) ---
    // In a real app, you'd fetch() from OpenWeatherMap here
    const hours = now.getHours();
    let temp = hours > 18 || hours < 6 ? "62°F" : "72°F";
    let condition = hours > 18 || hours < 6 ? "Clear" : "Sunny";
    document.getElementById('weather').innerText = `${condition}, ${temp} | New York`;
}

function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

// Initialize and Set Interval
setInterval(updateDashboard, 1000);
updateDashboard();

// 2. App Management
function openApp(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeApp(id) {
    document.getElementById(id).classList.add('hidden');
}

function saveFile() {
    const content = document.getElementById('doc-editor').value;
    localStorage.setItem('saved_document', content);
    alert('File saved to Local Storage!');
}

// 3. Customization & Menus
function toggleSettings() {
    const newBg = prompt("Enter an image URL for your background:");
    if (newBg) {
        document.getElementById('desktop').style.backgroundImage = `url('${newBg}')`;
    }
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('hidden');
}

// 4. Event Listeners (Fixed the nesting error here)
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        alert(`Detected ${files[0].name}. This would be uploaded to your OS storage.`);
    }
}); // Added missing closing brackets

document.getElementById('desktop').addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    
    // Close menu if clicking desktop, but not if clicking the menu itself or the toggle button
    if (!menu.classList.contains('hidden')) {
        if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
            menu.classList.add('hidden');
        }
    }
});
