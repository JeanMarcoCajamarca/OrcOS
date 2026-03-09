// 1. Dashboard Logic
function updateDashboard() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();

    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    let dateString = now.toLocaleDateString('en-US', options);
    const day = now.getDate();
    document.getElementById('date').innerText = `${dateString}, ${now.getFullYear()}`;

    // Weather display
    const hours = now.getHours();
    let temp = hours > 18 || hours < 6 ? "62°F" : "72°F";
    document.getElementById('weather').innerText = `Clear, ${temp} | New York`;
}

// 2. Requirement 3: Desktop File Rendering
function renderFiles() {
    const grid = document.getElementById('file-grid');
    grid.innerHTML = '';
    const saved = localStorage.getItem('saved_document');
    
    if (saved) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file-icon';
        fileDiv.innerHTML = `<div class="file-paper"></div><span>Journal.txt</span>`;
        fileDiv.onclick = () => {
            document.getElementById('doc-editor').value = saved;
            openApp('app-writer');
        };
        grid.appendChild(fileDiv);
    }
}

function saveFile() {
    const content = document.getElementById('doc-editor').value;
    localStorage.setItem('saved_document', content);
    renderFiles(); // Update desktop icons immediately
    alert('The document has been stored in your vault.');
}

// 3. Requirement 4: Settings Ritual
function applySettings() {
    const font = document.getElementById('set-font').value;
    const size = document.getElementById('set-size').value;
    const color = document.getElementById('set-color').value;
    const loc = document.getElementById('set-loc').value;

    // Apply styles to the body
    document.body.style.fontFamily = font;
    document.body.style.fontSize = size + "px";
    document.documentElement.style.setProperty('--accent-color', color);
    
    if (loc) {
        document.getElementById('weather').innerText = `Cloudy, 68°F | ${loc}`;
    }
    
    closeApp('app-settings');
}

// 4. App & Menu Management
function openApp(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeApp(id) {
    document.getElementById(id).classList.add('hidden');
}

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('hidden');
}

function toggleBackground() {
    const newBg = prompt("Enter an image URL for your background:");
    if (newBg) {
        document.getElementById('desktop').style.backgroundImage = `url('${newBg}')`;
    }
}

// Initialize
setInterval(updateDashboard, 1000);
window.onload = () => {
    updateDashboard();
    renderFiles();
};

// Close menu on desktop click
document.getElementById('desktop').addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    if (menu && !menu.classList.contains('hidden')) {
        if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
            menu.classList.add('hidden');
        }
    }
});

