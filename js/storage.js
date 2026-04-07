// Shared localStorage helpers so Photography and Top 5 read the same data shape.
(function () {
  const STORAGE_KEY = "viewTimes";

  function readJson(storageKey, fallbackValue) {
    try {
      const rawValue = localStorage.getItem(storageKey);
      return rawValue ? JSON.parse(rawValue) : fallbackValue;
    } catch (error) {
      console.warn(`[PortfolioStorage] Failed to read "${storageKey}":`, error);
      return fallbackValue;
    }
  }

  function writeJson(storageKey, value) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
      console.warn(`[PortfolioStorage] Failed to write "${storageKey}":`, error);
    }
  }

  function getViewTimes() {
    return readJson(STORAGE_KEY, {});
  }

  function saveViewTimes(viewTimes) {
    writeJson(STORAGE_KEY, viewTimes);
  }

  window.PortfolioStorage = {
    STORAGE_KEY,
    getViewTimes,
    saveViewTimes
  };
})();
