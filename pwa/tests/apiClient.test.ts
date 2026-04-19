import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ApiError, fetchApi, getAuthToken, setAuthToken, removeAuthToken, getRefreshToken, setRefreshToken, removeRefreshToken } from "../utils/apiClient";

// ── Helpers ───────────────────────────────────────────────────────────────────

function mockFetch(status: number, body: unknown, ok?: boolean) {
    return vi.fn().mockResolvedValue({
        ok: ok ?? status < 400,
        status,
        json: () => Promise.resolve(body),
    });
}

// ── Token helpers ─────────────────────────────────────────────────────────────

describe("token helpers", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("stores and retrieves auth token", () => {
        setAuthToken("abc");
        expect(getAuthToken()).toBe("abc");
    });

    it("removes auth token", () => {
        setAuthToken("abc");
        removeAuthToken();
        expect(getAuthToken()).toBeNull();
    });

    it("stores and retrieves refresh token", () => {
        setRefreshToken("refresh-xyz");
        expect(getRefreshToken()).toBe("refresh-xyz");
    });

    it("removes refresh token", () => {
        setRefreshToken("refresh-xyz");
        removeRefreshToken();
        expect(getRefreshToken()).toBeNull();
    });
});

// ── ApiError ──────────────────────────────────────────────────────────────────

describe("ApiError", () => {
    it("carries status and data", () => {
        const err = new ApiError("bad request", { detail: "x" }, 400);
        expect(err.status).toBe(400);
        expect(err.data).toEqual({ detail: "x" });
        expect(err.name).toBe("ApiError");
        expect(err instanceof ApiError).toBe(true);
        expect(err instanceof Error).toBe(true);
    });
});

// ── fetchApi ──────────────────────────────────────────────────────────────────

describe("fetchApi", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubGlobal("fetch", undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns parsed JSON on 200", async () => {
        vi.stubGlobal("fetch", mockFetch(200, { id: 1 }));
        const result = await fetchApi("/api/test");
        expect(result).toEqual({ id: 1 });
    });

    it("returns null on 204", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 204, json: () => Promise.resolve(null) }));
        const result = await fetchApi("/api/test");
        expect(result).toBeNull();
    });

    it("throws ApiError with hydra:description on 422", async () => {
        vi.stubGlobal("fetch", mockFetch(422, { "hydra:description": "Validation failed" }));
        await expect(fetchApi("/api/test")).rejects.toThrow("Validation failed");
    });

    it("throws ApiError with status on 404", async () => {
        vi.stubGlobal("fetch", mockFetch(404, { detail: "Not found" }));
        await expect(fetchApi("/api/test")).rejects.toMatchObject({ status: 404, message: "Not found" });
    });

    it("sends Authorization header when token present", async () => {
        setAuthToken("my-jwt");
        const fetchMock = mockFetch(200, {});
        vi.stubGlobal("fetch", fetchMock);
        await fetchApi("/api/me");
        const headers = fetchMock.mock.calls[0][1].headers as Headers;
        expect(headers.get("Authorization")).toBe("Bearer my-jwt");
    });

    it("does not send Authorization header when no token", async () => {
        const fetchMock = mockFetch(200, {});
        vi.stubGlobal("fetch", fetchMock);
        await fetchApi("/api/public");
        const headers = fetchMock.mock.calls[0][1].headers as Headers;
        expect(headers.get("Authorization")).toBeNull();
    });

    it("sends Accept-Language: fr by default", async () => {
        const fetchMock = mockFetch(200, {});
        vi.stubGlobal("fetch", fetchMock);
        await fetchApi("/api/test");
        const headers = fetchMock.mock.calls[0][1].headers as Headers;
        expect(headers.get("Accept-Language")).toBe("fr");
    });

    it("sends Accept-Language from locale option", async () => {
        const fetchMock = mockFetch(200, {});
        vi.stubGlobal("fetch", fetchMock);
        await fetchApi("/api/test", { locale: "ar" });
        const headers = fetchMock.mock.calls[0][1].headers as Headers;
        expect(headers.get("Accept-Language")).toBe("ar");
    });
});

// ── Silent refresh on 401 ─────────────────────────────────────────────────────

describe("silent refresh on 401", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubGlobal("fetch", undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("dispatches auth:logout when no refresh token on 401", async () => {
        const logoutSpy = vi.fn();
        window.addEventListener("auth:logout", logoutSpy);

        vi.stubGlobal("fetch", mockFetch(401, {}));

        await expect(fetchApi("/api/me")).rejects.toMatchObject({ status: 401 });
        expect(logoutSpy).toHaveBeenCalledOnce();

        window.removeEventListener("auth:logout", logoutSpy);
    });

    it("retries with new token after successful refresh", async () => {
        setAuthToken("expired-token");
        setRefreshToken("valid-refresh");

        let callCount = 0;
        vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => {
            if (url.includes("/api/token/refresh")) {
                return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ token: "new-token", refresh_token: "new-refresh" }) });
            }
            callCount++;
            if (callCount === 1) {
                return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
            }
            return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
        }));

        const result = await fetchApi("/api/me");
        expect(result).toEqual({ success: true });
        expect(getAuthToken()).toBe("new-token");
        expect(getRefreshToken()).toBe("new-refresh");
    });

    it("dispatches auth:logout when refresh endpoint returns 401", async () => {
        setRefreshToken("invalid-refresh");
        const logoutSpy = vi.fn();
        window.addEventListener("auth:logout", logoutSpy);

        vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => {
            if (url.includes("/api/token/refresh")) {
                return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
            }
            return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({}) });
        }));

        await expect(fetchApi("/api/me")).rejects.toMatchObject({ status: 401 });
        expect(logoutSpy).toHaveBeenCalledOnce();

        window.removeEventListener("auth:logout", logoutSpy);
    });
});
