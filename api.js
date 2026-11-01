
(() => {
    const API_BASE_URL = "https://psy-loophs-zynora-proxy.hf.space/proxy".replace(/\/+$/, "");

    async function request(endpoint, options = {}) {
        if (!API_BASE_URL) {
            throw new Error("The API URL has not been configured.");
        }

        const path = endpoint.startsWith("/")
            ? endpoint
            : `/${endpoint}`;

        const method = options.method || "GET";
        const headers = {};
        let body;

        if (options.body !== undefined) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(options.body);
        }

        let response;

        try {
            response = await fetch(`${API_BASE_URL}${path}`, {
                method,
                headers,
                body
            });
        } catch (error) {
            throw new Error(`Network request failed: ${error.message}`);
        }

        const responseText = await response.text();

        let data = {};

        try {
            data = responseText ? JSON.parse(responseText) : {};
        } catch {
            data = {
                detail: responseText || "The server returned an invalid response."
            };
        }

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.error ||
                `Request failed (${response.status})`
            );
        }

        return data;
    }

    window.ZynoraAPI = Object.freeze({
        get(endpoint) {
            return request(endpoint);
        },

        post(endpoint, data) {
            return request(endpoint, {
                method: "POST",
                body: data
            });
        }
    });
})();
