export {setTheme, setSettingsButton, setSettingsCancelButton}

/**
 * Sets the theme of the application.
 * @param {string} theme - The theme to set ('day' or 'night').
 */
function setTheme(theme) {
    const isDarkMode = theme === 'night';
    document.querySelector('[data-settings-theme]').value = theme;
    document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
}

/**
 * Sets the settings button event listener.
 */
function setSettingsButton() {
    document.querySelector('[data-header-settings]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = true;
    });
}

/**
 * Sets the settings cancel button event listener.
 */
function setSettingsCancelButton() {
    document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
        document.querySelector('[data-settings-overlay]').open = false;
    });
}
