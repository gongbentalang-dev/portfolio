// Shared microCMS helpers for Photography and Top 5 pages.
// On GitHub Pages, the frontend can only use a public read-only key.
// When you move to Vercel / Netlify Functions later, change endpoint to
// something like "/api/portfolio" and keep the page scripts unchanged.
(function () {
  const DEFAULT_CMS_CONFIG = {
    endpoint: "https://vks2e95ehh.microcms.io/api/v1/portfolio?limit=100",
    apiKey: "00noGUhIiZTR7chPxpAvKqzcwsYaPhPpMMGA",
    imageOptimization: {
      enabled: false,
      galleryWidth: 900
    }
  };

  function getCmsConfig() {
    const overrideConfig = window.PORTFOLIO_CMS_CONFIG || {};

    return {
      ...DEFAULT_CMS_CONFIG,
      ...overrideConfig,
      imageOptimization: {
        ...DEFAULT_CMS_CONFIG.imageOptimization,
        ...(overrideConfig.imageOptimization || {})
      }
    };
  }

  function createCmsHeaders(config) {
    const headers = {
      "Content-Type": "application/json"
    };

    if (config.apiKey) {
      headers["X-MICROCMS-API-KEY"] = config.apiKey;
    }

    return headers;
  }

  function normalizeText(value, fallback = "") {
    return typeof value === "string" ? value.trim() || fallback : fallback;
  }

  function normalizeWork(rawWork = {}) {
    return {
      id: rawWork.id || "",
      imageUrl: rawWork.image?.url || "",
      category: normalizeText(rawWork.category),
      camera: normalizeText(rawWork.camera),
      lens: normalizeText(rawWork.lens),
      fNumber: normalizeText(rawWork.fNumber),
      shutterSpeed: normalizeText(rawWork.shutterSpeed),
      iso: normalizeText(rawWork.iso),
      shootingDate: normalizeText(rawWork.shootingDate),
      original: rawWork
    };
  }

  function optimizeImageUrl(imageUrl, mode = "detail") {
    if (!imageUrl) return "";

    const { imageOptimization } = getCmsConfig();

    if (!imageOptimization.enabled || mode !== "gallery") {
      return imageUrl;
    }

    try {
      const url = new URL(imageUrl);
      url.searchParams.set("w", String(imageOptimization.galleryWidth));
      return url.toString();
    } catch (error) {
      console.warn("[PortfolioCMS] Failed to build optimized image URL:", error);
      return imageUrl;
    }
  }

  async function fetchPortfolioWorks() {
    const config = getCmsConfig();

    if (!config.endpoint) {
      throw new Error("CMS endpoint is not configured.");
    }

    const response = await fetch(config.endpoint, {
      headers: createCmsHeaders(config)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const contents = Array.isArray(data.contents) ? data.contents : [];

    return contents.map(normalizeWork);
  }

  window.PortfolioCMS = {
    fetchPortfolioWorks,
    getCmsConfig,
    optimizeImageUrl
  };
})();
