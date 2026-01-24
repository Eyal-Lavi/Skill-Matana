import { useState, useEffect, useCallback } from 'react';
import styles from './AccessibilityWidget.module.scss';

const STORAGE_KEY = 'accessibility_settings';

const defaultSettings = {
  fontSize: 0,
  contrast: 'normal', // normal, high, inverted
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  bigCursor: false,
  readingGuide: false,
  stopAnimations: false,
  textSpacing: false,
  highlightFocus: false,
  largeFocus: false,
};

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [readingGuideY, setReadingGuideY] = useState(0);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (e) {
        console.error('Error loading accessibility settings:', e);
      }
    }
  }, []);

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    root.style.fontSize = `${100 + settings.fontSize * 10}%`;

    // Contrast modes
    body.classList.remove('a11y-high-contrast', 'a11y-inverted');
    if (settings.contrast === 'high') {
      body.classList.add('a11y-high-contrast');
    } else if (settings.contrast === 'inverted') {
      body.classList.add('a11y-inverted');
    }

    // Grayscale
    body.classList.toggle('a11y-grayscale', settings.grayscale);

    // Highlight links
    body.classList.toggle('a11y-highlight-links', settings.highlightLinks);

    // Readable font
    body.classList.toggle('a11y-readable-font', settings.readableFont);

    // Big cursor
    body.classList.toggle('a11y-big-cursor', settings.bigCursor);

    // Stop animations
    body.classList.toggle('a11y-stop-animations', settings.stopAnimations);

    // Text spacing
    body.classList.toggle('a11y-text-spacing', settings.textSpacing);

    // Highlight focus
    body.classList.toggle('a11y-highlight-focus', settings.highlightFocus);

    // Large focus indicator
    body.classList.toggle('a11y-large-focus', settings.largeFocus);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Reading guide mouse tracking
  useEffect(() => {
    if (!settings.readingGuide) return;

    const handleMouseMove = (e) => {
      setReadingGuideY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [settings.readingGuide]);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetAll = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const increaseFontSize = () => {
    if (settings.fontSize < 5) {
      updateSetting('fontSize', settings.fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > -3) {
      updateSetting('fontSize', settings.fontSize - 1);
    }
  };

  const cycleContrast = () => {
    const modes = ['normal', 'high', 'inverted'];
    const currentIndex = modes.indexOf(settings.contrast);
    const nextIndex = (currentIndex + 1) % modes.length;
    updateSetting('contrast', modes[nextIndex]);
  };

  const getContrastLabel = () => {
    switch (settings.contrast) {
      case 'high': return 'High contrast';
      case 'inverted': return 'Inverted colors';
      default: return 'Normal';
    }
  };

  return (
    <>
      {/* Main toggle button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="8" r="2" />
          <path d="M12 10v8" />
          <path d="M8 14l4 4 4-4" />
          <path d="M8 12h8" />
        </svg>
      </button>

      {/* Widget panel */}
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="8" r="2" />
              <path d="M12 10v8" />
              <path d="M8 14l4 4 4-4" />
              <path d="M8 12h8" />
            </svg>
            Accessibility
          </h2>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          {/* Font Size Controls */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Text size</h3>
            <div className={styles.fontSizeControls}>
              <button
                className={styles.fontButton}
                onClick={decreaseFontSize}
                disabled={settings.fontSize <= -3}
                aria-label="Decrease text size"
              >
                A-
              </button>
              <span className={styles.fontSizeValue}>
                {settings.fontSize === 0 ? 'Normal' : `${settings.fontSize > 0 ? '+' : ''}${settings.fontSize * 10}%`}
              </span>
              <button
                className={styles.fontButton}
                onClick={increaseFontSize}
                disabled={settings.fontSize >= 5}
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Toggle Options */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Display</h3>
            <div className={styles.optionsGrid}>
              <button
                className={`${styles.optionButton} ${settings.contrast !== 'normal' ? styles.active : ''}`}
                onClick={cycleContrast}
                aria-pressed={settings.contrast !== 'normal'}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v20" />
                    <path d="M12 2a10 10 0 0 1 0 20" fill="currentColor" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Contrast</span>
                <span className={styles.optionStatus}>{getContrastLabel()}</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.grayscale ? styles.active : ''}`}
                onClick={() => updateSetting('grayscale', !settings.grayscale)}
                aria-pressed={settings.grayscale}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 12h18" />
                    <path d="M12 3v18" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Grayscale</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.highlightLinks ? styles.active : ''}`}
                onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                aria-pressed={settings.highlightLinks}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Highlight links</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.readableFont ? styles.active : ''}`}
                onClick={() => updateSetting('readableFont', !settings.readableFont)}
                aria-pressed={settings.readableFont}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="4 7 4 4 20 4 20 7" />
                    <line x1="9" y1="20" x2="15" y2="20" />
                    <line x1="12" y1="4" x2="12" y2="20" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Readable font</span>
              </button>
            </div>
          </div>

          {/* Navigation Aids */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Navigation aids</h3>
            <div className={styles.optionsGrid}>
              <button
                className={`${styles.optionButton} ${settings.bigCursor ? styles.active : ''}`}
                onClick={() => updateSetting('bigCursor', !settings.bigCursor)}
                aria-pressed={settings.bigCursor}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4l7.07 17 2.51-7.39L21 11.07z" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Large cursor</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.readingGuide ? styles.active : ''}`}
                onClick={() => updateSetting('readingGuide', !settings.readingGuide)}
                aria-pressed={settings.readingGuide}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="10" width="18" height="4" rx="1" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Reading guide</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.highlightFocus ? styles.active : ''}`}
                onClick={() => updateSetting('highlightFocus', !settings.highlightFocus)}
                aria-pressed={settings.highlightFocus}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <rect x="7" y="7" width="10" height="10" rx="1" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Highlight focus</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.largeFocus ? styles.active : ''}`}
                onClick={() => updateSetting('largeFocus', !settings.largeFocus)}
                aria-pressed={settings.largeFocus}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Large focus</span>
              </button>
            </div>
          </div>

          {/* Content Adjustments */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Content</h3>
            <div className={styles.optionsGrid}>
              <button
                className={`${styles.optionButton} ${settings.stopAnimations ? styles.active : ''}`}
                onClick={() => updateSetting('stopAnimations', !settings.stopAnimations)}
                aria-pressed={settings.stopAnimations}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Stop animations</span>
              </button>

              <button
                className={`${styles.optionButton} ${settings.textSpacing ? styles.active : ''}`}
                onClick={() => updateSetting('textSpacing', !settings.textSpacing)}
                aria-pressed={settings.textSpacing}
              >
                <span className={styles.optionIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10H3M21 6H3M21 14H3M21 18H3" />
                  </svg>
                </span>
                <span className={styles.optionLabel}>Text spacing</span>
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button className={styles.resetButton} onClick={resetAll}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset settings
          </button>
        </div>

        {/* Accessibility statement link */}
        <div className={styles.footer}>
          <a href="/terms-privacy" className={styles.statementLink}>
            Accessibility statement
          </a>
        </div>
      </div>

      {/* Reading Guide */}
      {settings.readingGuide && (
        <div 
          className={styles.readingGuide} 
          style={{ top: readingGuideY - 25 }}
          aria-hidden="true"
        />
      )}

      {/* Overlay when panel is open */}
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default AccessibilityWidget;

