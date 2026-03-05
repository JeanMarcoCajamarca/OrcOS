// 1. Clock and Weather and Date Logic - updated march 2, 2:47PM EST
function updateClock() {
    const now = new Date();

    // 1. Format the Time
    document.getElementById('clock').innerText = now.toLocaleTimeString();

    // 2. Format the Date (e.g., Monday, March 2)
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    let dateString = now.toLocaleDateString('en-US', options);

    // 3. Add the Ordinal Suffix (st, nd, rd, th)
    const day = now.getDate();
    const suffix = getOrdinalSuffix(day);
    
    // 4. Add the Year
    const year = now.getFullYear();

    // Combine: "Monday, March 2" + "nd" + ", 2026"
    document.getElementById('date').innerText = `${dateString}${suffix}, ${year}`;
} // or is this line

// Helper function to determine the correct suffix
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

setInterval(updateClock, 1000);
updateClock(); // Run immediately so it doesn't wait 1 second to appear

// previously... function updateClock() {
//    const now = new Date();
//    document.getElementById('clock').innerText = now.toLocaleTimeString();
//}
//setInterval(updateClock, 1000); 

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

function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    menu.classList.toggle('hidden');
}

// Close the menu if the user clicks anywhere else on the desktop, new code march 5th 2:43pm
document.getElementById('desktop').addEventListener('click', function(e) {
    const menu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    
    if (!menu.contains(e.target) && e.target !== startBtn) {
        menu.classList.add('hidden');
    }
});
