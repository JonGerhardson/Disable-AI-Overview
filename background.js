// This script runs in the background and manages the extension's state.

// The ID of the ruleset to enable/disable.
const RULESET_ID = 'ruleset_1';

// Function to update the extension's icon based on its state.
const updateIcon = async (isEnabled) => {
  const iconPath = isEnabled ? 'icon.png' : 'icon_off.png';
  // In Manifest V3, chrome.action is the standard API for toolbar icons.
  await chrome.action.setIcon({ path: iconPath });
};

// Function to set the initial state of the extension on startup.
const initialize = async () => {
  // Retrieve the saved state from storage, defaulting to 'true' (enabled).
  const { isEnabled = true } = await chrome.storage.local.get('isEnabled');

  // Update the ruleset and icon based on the saved state.
  if (isEnabled) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID]
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULESET_ID]
    });
  }
  await updateIcon(isEnabled);
};

// Listen for clicks on the extension's toolbar icon.
chrome.action.onClicked.addListener(async (tab) => {
  // Get the current state.
  const { isEnabled = true } = await chrome.storage.local.get('isEnabled');
  const newState = !isEnabled;

  // Enable or disable the ruleset based on the new state.
  if (newState) {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [RULESET_ID]
    });
  } else {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      disableRulesetIds: [RULESET_ID]
    });
  }

  // Save the new state and update the icon.
  await chrome.storage.local.set({ isEnabled: newState });
  await updateIcon(newState);
});

// Run the initialization function when the extension starts.
initialize();

