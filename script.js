// Initialize Supabase Client
const _supabaseUrl = 'https://ovjimwuszbumvbdvvgqa.supabase.co';
const _supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92amltd3VzemJ1bXZiZHZ2Z3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjg2ODMsImV4cCI6MjA4NzcwNDY4M30.3cyON8YKHiq4m873YV_QxVE-uT4daGfJ7aXnzWfN7Gw';
const supabase = supabase.createClient(_supabaseUrl, _supabaseKey);

// 1. Clock and Weather Logic
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// Mock Weather 
document.getElementById('weather').innerText = "Cloudy, 65°F | New York, NY";

// 2. App Management
function openApp(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeApp(id) {
    document.getElementById(id).classList.add('hidden');
}

// 3. Data Storage
function saveFile() {
    const content = document.getElementById('doc-editor').value;
    localStorage.setItem('saved_document', content);
    alert('Journal entry etched into storage!');
}

// 4. Customization Logic (Settings Panel)
function updateSetting(type, value) {
    const welcome = document.getElementById('welcome-msg');
    
    if (type === 'bg') {
        document.getElementById('desktop').style.backgroundColor = value;
    } else if (type === 'fontSize') {
        welcome.style.fontSize = value;
    } else if (type === 'fontFamily') {
        document.body.style.fontFamily = value;
    }
}

// 5. Handling File Transfers (Drag & Drop placeholder)
// Restored this section to ensure orcOS can detect incoming files
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        alert(`Detected ${files[0].name}. This would be uploaded to your orcOS storage.`);
    }
});
