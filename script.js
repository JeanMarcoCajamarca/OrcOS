// 1. Clock and Weather Logic
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

// Mock Weather (Using a public API in production would be the next step)
document.getElementById('weather').innerText = "Sunny, 72°F | New York";

// 2. App Management
function openApp(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeApp(id) {
    document.getElementById(id).classList.add('hidden');
}

// 3. Data Storage (Fulfills the requirement for saving files)
function saveFile() {
    const content = document.getElementById('doc-editor').value;
    localStorage.setItem('saved_document', content);
    alert('File saved to Local Storage!');
}

// 4. Customization Logic
function toggleSettings() {
    const newBg = prompt("Enter an image URL for your background:");
    if (newBg) {
        document.getElementById('desktop').style.backgroundImage = `url('${newBg}')`;
    }
}

// 5. Handling File Transfers (Drag & Drop placeholder)
window.addEventListener('dragover', (e) => e.preventDefault());
window.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        alert(`Detected ${files[0].name}. This would be uploaded to your OS storage.`);
    }
});
