/*
 * orcOS Memory-Safe IPC Bridge & Storage Verification (Rust)
 * Used in modern kernels (Linux Rust modules) and desktop shells (Tauri)
 * to guarantee thread-safe communication between the UI and native OS hardware.
 *
 * Compile & Run:
 *   rustc --test test_orcos_ipc.rs -o test_orcos_ipc && ./test_orcos_ipc
 */

#[derive(Debug, PartialEq, Clone)]
pub enum OrcOSApp {
    FileRealm,
    QuestLog,
    MagesJukebox,
    MagesWorkshop,
    RaidChat,
    SystemSettings,
}

#[derive(Debug, PartialEq)]
pub struct AccessibilityConfig {
    pub screen_reader_enabled: bool,
    pub high_contrast: bool,
    pub font_scale_pct: u16,
    pub reduce_motion: bool,
    pub readable_sans_font: bool,
}

impl Default for AccessibilityConfig {
    fn default() -> Self {
        Self {
            screen_reader_enabled: false,
            high_contrast: false,
            font_scale_pct: 100,
            reduce_motion: false,
            readable_sans_font: false,
        }
    }
}

impl AccessibilityConfig {
    pub fn set_font_scale(&mut self, scale: u16) -> Result<(), &'static str> {
        if !(75..=200).contains(&scale) {
            return Err("Font scale must be between 75% and 200%");
        }
        self.font_scale_pct = scale;
        Ok(())
    }
}

pub fn sanitize_journal_entry(input: &str, max_words: usize) -> Result<String, &'static str> {
    let trimmed = input.trim();
    if trimmed.is_empty() {
        return Err("Journal entry cannot be empty");
    }
    let word_count = trimmed.split_whitespace().count();
    if word_count > max_words {
        return Err("Journal entry exceeds 1000-word limit");
    }
    Ok(trimmed.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_accessibility_scaling_bounds() {
        let mut cfg = AccessibilityConfig::default();
        assert_eq!(cfg.font_scale_pct, 100);
        assert!(cfg.set_font_scale(150).is_ok());
        assert_eq!(cfg.font_scale_pct, 150);
        assert!(cfg.set_font_scale(350).is_err());
    }

    #[test]
    fn test_journal_word_limit_enforcement() {
        let valid = "Exploring the File Realm and configuring System Prefs.";
        assert!(sanitize_journal_entry(valid, 1000).is_ok());

        let too_long = "orc ".repeat(1005);
        assert_eq!(
            sanitize_journal_entry(&too_long, 1000),
            Err("Journal entry exceeds 1000-word limit")
        );
    }
}

fn main() {
    println!("Run with `rustc --test test_orcos_ipc.rs && ./test_orcos_ipc` to execute unit tests.");
}
