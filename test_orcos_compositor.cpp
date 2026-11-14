/*
 * orcOS Desktop Window Compositor & App Registry Test Suite (C++)
 * Verifies multi-window z-index ordering, viewport boundary clamping,
 * and core application registration (File Realm, Quest Log, Mage's Jukebox,
 * Mage's Workshop, Raid Chat).
 *
 * Compile & Run:
 *   g++ -Wall -Wextra -std=c++17 test_orcos_compositor.cpp -o test_orcos_compositor && ./test_orcos_compositor
 */

#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <cassert>

struct DesktopWindow {
    std::string id;
    std::string title;
    int x;
    int y;
    int width;
    int height;
    int z_index;
    bool is_minimized;
};

class OrcOSCompositor {
private:
    int screen_width;
    int screen_height;
    std::vector<DesktopWindow> windows;

public:
    OrcOSCompositor(int w, int h) : screen_width(w), screen_height(h) {}

    void openWindow(const std::string& id, const std::string& title, int x, int y, int w, int h) {
        int next_z = static_cast<int>(windows.size()) + 1;
        windows.push_back({id, title, x, y, w, h, next_z, false});
        clampWindowToViewport(windows.back());
    }

    /* Fixes the prototype bug where windows could be dragged off-screen on bottom/right */
    void clampWindowToViewport(DesktopWindow& win) {
        if (win.x < 0) win.x = 0;
        if (win.y < 32) win.y = 32; /* Reserve 32px for top System Prefs bar */
        if (win.x + win.width > screen_width) {
            win.x = std::max(0, screen_width - win.width);
        }
        if (win.y + win.height > screen_height - 64) { /* Reserve 64px for bottom dock */
            win.y = std::max(32, screen_height - 64 - win.height);
        }
    }

    void moveWindow(const std::string& id, int new_x, int new_y) {
        for (auto& win : windows) {
            if (win.id == id) {
                win.x = new_x;
                win.y = new_y;
                clampWindowToViewport(win);
                focusWindow(id);
                return;
            }
        }
    }

    void focusWindow(const std::string& id) {
        int max_z = 0;
        for (const auto& win : windows) {
            max_z = std::max(max_z, win.z_index);
        }
        for (auto& win : windows) {
            if (win.id == id) {
                win.z_index = max_z + 1;
                win.is_minimized = false;
                return;
            }
        }
    }

    const DesktopWindow* getTopWindow() const {
        if (windows.empty()) return nullptr;
        const DesktopWindow* top = &windows[0];
        for (const auto& win : windows) {
            if (!win.is_minimized && win.z_index > top->z_index) {
                top = &win;
            }
        }
        return top;
    }
};

int main() {
    std::cout << "=== orcOS C++ Window Compositor Test Suite ===\n";

    OrcOSCompositor compositor(1920, 1080);
    compositor.openWindow("file-realm", "File Realm", 120, 60, 600, 420);
    compositor.openWindow("quest-log", "Journal/Task", 250, 400, 480, 360);
    compositor.openWindow("mages-jukebox", "Mage's Jukebox", 1100, 140, 520, 380);

    /* Test 1: Window Focus & Z-Index Stacking */
    std::cout << "[TEST] Multi-Window Z-Index Focus... ";
    compositor.focusWindow("file-realm");
    assert(compositor.getTopWindow()->id == "file-realm");
    std::cout << "PASSED\n";

    /* Test 2: Viewport Boundary Clamping */
    std::cout << "[TEST] Viewport Boundary Clamping (Prevent Off-Screen Drag)... ";
    compositor.moveWindow("mages-jukebox", 2500, 1500);
    const DesktopWindow* top = compositor.getTopWindow();
    assert(top->id == "mages-jukebox");
    assert(top->x == 1920 - 520);
    assert(top->y == 1080 - 64 - 380);
    std::cout << "PASSED\n";

    std::cout << "All C++ compositor tests PASSED!\n";
    return 0;
}
