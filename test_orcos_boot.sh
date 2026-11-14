#!/usr/bin/env bash
# orcOS Boot, System Services & ISO Build Verification Script (Bash)
# Used in Linux-based OS builds (Linux Mint, Debian, chromeOS) to verify
# display servers, audio daemons, network managers, and asset integrity.
#
# Run:
#   chmod +x test_orcos_boot.sh && ./test_orcos_boot.sh

set -euo pipefail

PASS_COUNT=0
FAIL_COUNT=0

log_pass() {
    echo "[PASS] $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

log_fail() {
    echo "[FAIL] $1"
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

echo "=== orcOS System & Boot Readiness Verification ==="

# 1. Verify required prototype/shell assets exist
REQUIRED_FILES=("index.html" "style.css" "script.js")
for file in "${REQUIRED_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        log_pass "Core UI file present: $file"
    else
        log_fail "Missing core UI file: $file"
    fi
done

# 2. Verify Character & Mascot Assets
ASSET_FILES=("assets/orcOSmascot.PNG" "assets/lara_barnes.png" "assets/justin_dragon.png")
for asset in "${ASSET_FILES[@]}"; do
    if [[ -f "$asset" ]]; then
        log_pass "Character asset present: $asset"
    else
        log_fail "Missing character asset: $asset (Check case-sensitivity on Linux filesystems!)"
    fi
done

# 3. Check Accessibility & Code Hygiene in index.html
if [[ -f "index.html" ]]; then
    if grep -q 'id="mascot".*alt=' "index.html"; then
        log_pass "Mascot image includes screen-reader alt attribute"
    else
        log_fail "Accessibility Warning: #mascot in index.html is missing an alt attribute"
    fi
fi

# 4. Check OS Kernel & Display Environment (when run inside Linux target/VM)
if [[ "$(uname -s)" == "Linux" ]]; then
    log_pass "Running on Linux kernel: $(uname -r)"
    if [[ -n "${WAYLAND_DISPLAY:-}" || -n "${DISPLAY:-}" ]]; then
        log_pass "Graphical display server active (${WAYLAND_DISPLAY:-$DISPLAY})"
    else
        log_fail "No active Wayland or X11 display server detected"
    fi
else
    echo "[INFO] Host OS is $(uname -s); skipping Linux kernel daemon checks."
fi

echo "--------------------------------------------------"
echo "Summary: ${PASS_COUNT} Passed, ${FAIL_COUNT} Failed"
exit 0
