"""
orcOS Automated UI, Functional & Accessibility Test Suite
Tests core components from the orcOS prototype (index.html, style.css, script.js)
and validates readiness for the future orcOS desktop environment (File Realm, Quest Log, Mage's Jukebox, etc.).

Requirements:
    pip install pytest playwright
    playwright install chromium
"""

import pytest
from playwright.sync_api import Page, expect
import os

# Update this path or URL to point to your local index.html or hosted GitHub Pages URL
ORCOS_URL = os.getenv("ORCOS_URL", "https://jeanmarcocajamarca.github.io/OrcOS/")


@pytest.fixture(scope="function")
def orcos_page(page: Page):
    """Loads the orcOS desktop environment before each test."""
    page.goto(ORCOS_URL)
    page.wait_for_selector("#desktop")
    return page


class TestDesktopEnvironment:
    """Tests core desktop layout, clock, mascot, and background rendering."""

    def test_desktop_loads_with_welcome_and_mascot(self, orcos_page: Page):
        welcome = orcos_page.locator("#welcome-msg")
        expect(welcome).to_be_visible()
        expect(welcome).to_have_text("Welcome to orcOS")

        mascot = orcos_page.locator("#mascot")
        expect(mascot).to_be_visible()

    def test_live_clock_and_date_format(self, orcos_page: Page):
        clock = orcos_page.locator("#clock")
        date_display = orcos_page.locator("#date-display")

        expect(clock).not_to_have_text("00:00:00")
        expect(date_display).not_to_be_empty()
        # Verify ordinal suffix formatting (ST, ND, RD, TH)
        date_text = date_display.inner_text()
        assert any(suffix in date_text for suffix in ["ST", "ND", "RD", "TH"]), f"Unexpected date format: {date_text}"


class TestRealmLauncher:
    """Tests the 'Enter a realm...' search bar and browser selection."""

    def test_search_bar_visibility_and_input(self, orcos_page: Page):
        search_input = orcos_page.locator("#browser-url")
        expect(search_input).to_be_visible()
        search_input.fill("github.com")
        expect(search_input).to_have_value("github.com")

    def test_explore_opens_new_tab(self, orcos_page: Page):
        search_input = orcos_page.locator("#browser-url")
        search_input.fill("example.com")

        with orcos_page.expect_popup() as popup_info:
            orcos_page.locator("button:has-text('Explore')").click()
        new_page = popup_info.value
        assert "example.com" in new_page.url


class TestJournalAndQuestLog:
    """Tests the Journal / Quest Log application window, persistence, and typography."""

    def test_open_and_save_journal_entry(self, orcos_page: Page):
        # Handle alert dialogs automatically
        orcos_page.on("dialog", lambda dialog: dialog.accept())

        orcos_page.locator("button:has-text('Journal')").click()
        journal_window = orcos_page.locator("#app-journal")
        expect(journal_window).to_be_visible()

        editor = orcos_page.locator("#journal-editor")
        test_note = "Quest Log Entry 1: Forge the orcOS kernel and test File Realm."
        editor.fill(test_note)

        # Verify word count updates accurately
        expect(orcos_page.locator("#word-count")).to_have_text("12 / 1000 words")

        # Save to localStorage and reload page to test persistence
        orcos_page.locator(".save-btn").click()
        orcos_page.reload()
        orcos_page.locator("button:has-text('Journal')").click()
        expect(orcos_page.locator("#journal-editor")).to_have_value(test_note)

    def test_journal_font_customization(self, orcos_page: Page):
        orcos_page.locator("button:has-text('Journal')").click()
        orcos_page.locator("#journal-font-size").select_option("24px")
        orcos_page.locator("#journal-font-family").select_option("sans-serif")

        editor = orcos_page.locator("#journal-editor")
        assert editor.evaluate("el => el.style.fontSize") == "24px"
        assert "sans-serif" in editor.evaluate("el => el.style.fontFamily")


class TestSystemSettings:
    """Tests System Preferences / Settings customization."""

    def test_dashboard_alignment_setting(self, orcos_page: Page):
        orcos_page.locator("button:has-text('Settings')").click()
        settings_win = orcos_page.locator("#app-settings")
        expect(settings_win).to_be_visible()

        align_select = settings_win.locator("select")
        align_select.select_option("left")
        dashboard = orcos_page.locator("#dashboard")
        assert dashboard.evaluate("el => el.style.textAlign") == "left"


class TestAccessibilityCompliance:
    """Tests keyboard navigation, alt attributes, and semantic accessibility."""

    def test_character_icons_have_alt_text(self, orcos_page: Page):
        lara = orcos_page.locator("#lara-barnes")
        justin = orcos_page.locator("#justin-dragon")
        expect(lara).to_have_attribute("alt", "Lara Barnes")
        expect(justin).to_have_attribute("alt", "Justin Dragon")

        # Check mascot alt text (Flags missing alt attribute in current prototype!)
        mascot_alt = orcos_page.locator("#mascot").get_attribute("alt")
        assert mascot_alt is not None and len(mascot_alt.strip()) > 0, (
            "Accessibility Bug: #mascot image is missing a descriptive 'alt' attribute for screen readers!"
        )

    def test_keyboard_tab_navigation(self, orcos_page: Page):
        orcos_page.keyboard.press("Tab")
        focused_id = orcos_page.evaluate("document.activeElement.id")
        assert focused_id == "browser-url", f"Expected focus on #browser-url, got '{focused_id}'"
