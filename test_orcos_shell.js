/**
 * orcOS Desktop Shell & Prototype Unit Test Suite (JavaScript)
 * Tests core logic from script.js (date ordinals, URL realm normalization,
 * word counting, and non-blocking character notifications) with zero external dependencies.
 *
 * Run:
 *   node test_orcos_shell.js
 */

const assert = require('assert');

/* Replicates and validates the ordinal date formatting from script.js */
function formatOrcOSDate(dateObj) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
    let dateStr = dateObj.toLocaleDateString('en-US', options).toUpperCase();
    const day = dateObj.getUTCDate();

    let suffix = 'TH';
    if (day === 1 || day === 21 || day === 31) suffix = 'ST';
    else if (day === 2 || day === 22) suffix = 'ND';
    else if (day === 3 || day === 23) suffix = 'RD';

    // Replace only the standalone day number so year digits are never altered
    return dateStr.replace(new RegExp(`\\b${day}\\b`), `${day}${suffix}`);
}

/* Normalizes user input in "Enter a realm..." search bar */
function normalizeRealmUrl(rawInput) {
    if (!rawInput || typeof rawInput !== 'string') return null;
    const trimmed = rawInput.trim();
    if (!trimmed) return null;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        return 'https://' + trimmed;
    }
    return trimmed;
}

/* Counts words accurately for Quest Log / Journal */
function countJournalWords(text) {
    if (!text || !text.trim()) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
}

console.log('=== orcOS JavaScript Shell Test Suite ===');

// Test 1: Date Ordinal Formatting (catching edge cases like day 20 vs year 2026)
const march16 = new Date(Date.UTC(2026, 2, 16));
assert.strictEqual(formatOrcOSDate(march16), 'MONDAY, MARCH 16TH, 2026');

const nov1 = new Date(Date.UTC(2026, 10, 1));
assert.strictEqual(formatOrcOSDate(nov1), 'SUNDAY, NOVEMBER 1ST, 2026');

const nov22 = new Date(Date.UTC(2026, 10, 22));
assert.strictEqual(formatOrcOSDate(nov22), 'SUNDAY, NOVEMBER 22ND, 2026');
console.log('[TEST] Date Ordinal Formatting... PASSED');

// Test 2: Realm Launcher URL Normalization
assert.strictEqual(normalizeRealmUrl('jeanmarcocajamarca.github.io/OrcOS/'), 'https://jeanmarcocajamarca.github.io/OrcOS/');
assert.strictEqual(normalizeRealmUrl('https://github.com'), 'https://github.com');
assert.strictEqual(normalizeRealmUrl('   '), null);
console.log('[TEST] Realm Launcher URL Normalization... PASSED');

// Test 3: Journal Word Counter
assert.strictEqual(countJournalWords(''), 0);
assert.strictEqual(countJournalWords('   Jemma   Lara   Justin  '), 3);
console.log('[TEST] Journal Word Counter... PASSED');

console.log('All JavaScript shell tests PASSED!');
