// Initialize Supabase Client
// Ensure you have <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> in your HTML
const _supabaseUrl = 'https://ovjimwuszbumvbdvvgqa.supabase.co';
const _supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92amltd3VzemJ1bXZiZHZ2Z3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjg2ODMsImV4cCI6MjA4NzcwNDY4M30.3cyON8YKHiq4m873YV_QxVE-uT4daGfJ7aXnzWfN7Gw';
const supabase = supabase.createClient(_supabaseUrl, _supabaseKey);

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
async function renderFiles() {
    const grid = document.getElementById('file-grid');
    grid.innerHTML = 'Loading...'; // Visual feedback for async action --> added March 9th 2026

    try {
        // Fetch the most recent journal entry
        const { data, error } = await supabase
            .from('entries')
            .select('content')
            .eq('id', 1) // Using ID 1 as a single-user "slot" for now
            .single();

        grid.innerHTML = ''; // Clear loading state

        if (data) {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'file-icon';
            fileDiv.innerHTML = `<div class="file-paper"></div><span>Journal.txt</span>`;
            fileDiv.onclick = () => {
                document.getElementById('doc-editor').value = data.content;
                openApp('app-writer');
            };
            grid.appendChild(fileDiv);
        }
    } catch (err) {
        console.error("Error fetching data:", err);
        grid.innerHTML = 'Error loading files.';
    }
}

async function saveFile() {
    const content = document.getElementById('doc-editor').value;
    
    try {
        // Use 'upsert' to either insert a new row or update existing row 1
        const { error } = await supabase
            .from('entries')
            .upsert({ id: 1, content: content, updated_at: new Date() });

        if (error) throw error;

        await renderFiles(); // Update desktop icons only after success
        alert('The document has been synced to the cloud.');
    } catch (err) {
        alert('Failed to save: ' + err.message);
    }
}

// 3. Settings (REFACTORED for Persistence, March 9th 2026)
async function applySettings() {
    const settings = {
        id: 1, // Single user profile slot
        font: document.getElementById('set-font').value,
        size: document.getElementById('set-size').value,
        color: document.getElementById('set-color').value,
        location: document.getElementById('set-loc').value
    };

    try {
        const { error } = await supabase.from('settings').upsert(settings);
        if (error) throw error;

        // Apply visual changes
        document.body.style.fontFamily = settings.font;
        document.body.style.fontSize = settings.size + "px";
        document.documentElement.style.setProperty('--accent-color', settings.color);
        
        if (settings.location) {
            document.getElementById('weather').innerText = `Cloudy, 68°F | ${settings.location}`;
        }
        
        closeApp('app-settings');
    } catch (err) {
        console.error("Settings failed to save:", err);
    }
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
    menu.classList.toggle('show'); // This triggers the CSS transition - March 9th 2026
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

document.getElementById('desktop').addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    
    if (menu && !menu.classList.contains('show')) {
        if (!menu.contains(e.target) && !startBtn.contains(e.target)) {
            menu.classList.add('show');
        }
    }
});

