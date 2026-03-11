// Initialize Supabase Client
//const _supabaseUrl = 'https://ovjimwuszbumvbdvvgqa.supabase.co';
//const _supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92amltd3VzemJ1bXZiZHZ2Z3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjg2ODMsImV4cCI6MjA4NzcwNDY4M30.3cyON8YKHiq4m873YV_QxVE-uT4daGfJ7aXnzWfN7Gw';
//const supabase = supabase.createClient(_supabaseUrl, _supabaseKey);

// 1. Clock, Weather, and Date Logic
function updateDashboard() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
    
    // Task 3: Specific Date Format
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateStr = now.toLocaleDateString('en-US', options).toUpperCase();
    
    // Adding the "TH" to the date
    const day = now.getDate();
    let suffix = "TH";
    if (day === 1 || day === 21 || day === 31) suffix = "ST";
    else if (day === 2 || day === 22) suffix = "ND";
    else if (day === 3 || day === 23) suffix = "RD";
    
    dateStr = dateStr.replace(day, day + suffix);
    document.getElementById('date-display').innerText = dateStr;
}
setInterval(updateDashboard, 1000);
updateDashboard();

// 2. Journal Logic (Task 4)
function checkWordCount() {
    const text = document.getElementById('journal-editor').value;
    const words = text.trim().split(/\s+/).filter(item => item).length;
    document.getElementById('word-count').innerText = `${words} / 1000 words`;
    
    if (words > 1000) {
        alert("You have reached the 1000 word limit!");
        // Optional: truncate text here if desired
    }
}

function saveJournal() {
    const content = document.getElementById('journal-editor').value;
    localStorage.setItem('orcOS_journal', content);
    alert("Journal entry etched into storage!");
}

function confirmClose(id) {
    const choice = confirm("Your document will be lost if you do not save. Are you sure you want to close now?");
    if (choice) { // "OK/Yes" means close
        closeApp(id);
    }
    // "Cancel/No" does nothing, allowing user to keep writing
}

function updateJournalStyle() {
    const editor = document.getElementById('journal-editor');
    editor.style.fontSize = document.getElementById('journal-size').value;
    editor.style.fontFamily = document.getElementById('journal-font').value;
}

// 3. Settings Logic (Task 5)
function updateSetting(type, value) {
    const desktop = document.getElementById('desktop');
    const dash = document.getElementById('dashboard');
    
    if (type === 'bg') desktop.style.backgroundColor = value;
    if (type === 'taskbar') document.getElementById('taskbar').style.background = value;
    if (type === 'align') {
        dash.style.left = value === 'left' ? '20px' : (value === 'center' ? '40%' : 'auto');
        dash.style.right = value === 'right' ? '20px' : 'auto';
        dash.style.textAlign = value;
    }
}

function uploadBackground(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('desktop').style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}

function openApp(id) {
    document.getElementById(id).classList.remove('hidden');
    if (id === 'app-journal') {
        const saved = localStorage.getItem('orcOS_journal');
        if (saved) document.getElementById('journal-editor').value = saved;
    }
}

function closeApp(id) { document.getElementById(id).classList.add('hidden'); }

// Mascot Interactivity
document.getElementById('mascot').addEventListener('click', () => {
    alert("Hi! I'm Jemma! Welcome to the horde!");
});
