document.addEventListener('DOMContentLoaded', () => {
  const toggleDelete = document.getElementById('toggle-delete');
  const statusDelete = document.getElementById('status-delete');

  const toggleHighlight = document.getElementById('toggle-highlight');
  const statusHighlight = document.getElementById('status-highlight');

  chrome.storage.local.get(['deleteEnabled', 'highlightMode'], (result) => {
    const deleteEnabled = Boolean(result.deleteEnabled);
    const highlightMode = Boolean(result.highlightMode);

    toggleDelete.checked = deleteEnabled;
    updateStatus(statusDelete, deleteEnabled);

    toggleHighlight.checked = highlightMode;
    updateStatus(statusHighlight, highlightMode);
  });

  toggleDelete.addEventListener('change', () => {
    const enabled = toggleDelete.checked;
    chrome.storage.local.set({ deleteEnabled: enabled }, () => {
      updateStatus(statusDelete, enabled);
    });
  });

  toggleHighlight.addEventListener('change', () => {
    const enabled = toggleHighlight.checked;
    chrome.storage.local.set({ highlightMode: enabled }, () => {
      updateStatus(statusHighlight, enabled);
      if (!enabled) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
          }
        });
      }
    });
  });

  function updateStatus(element, enabled) {
    element.textContent = enabled ? 'Вкл' : 'Выкл';
  }
});
