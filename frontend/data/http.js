(function initHttp(global) {
  function tryParseJson(text) {
    try {
      return JSON.parse(text);
    } catch (_error) {
      return null;
    }
  }

  async function apiRequest(path, options) {
    const requestOptions = options || {};
    const response = await fetch(`${global.qaStorage.getApiBaseUrl()}${path}`, {
      ...requestOptions,
      headers: {
        "Content-Type": "application/json",
        ...(requestOptions.headers || {}),
      },
    });

    const text = await response.text();
    const json = text ? tryParseJson(text) : null;
    if (!response.ok) {
      const message = json?.message || `Request failed: ${response.status}`;
      throw new Error(Array.isArray(message) ? message.join(", ") : message);
    }

    return json;
  }

  global.qaHttp = {
    tryParseJson,
    apiRequest,
  };
})(window);
