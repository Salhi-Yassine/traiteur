import { describe, it, expect } from "vitest";
import { unwrapCollection, getTotalItems } from "./hydra";

describe("unwrapCollection", () => {
    it("reads the un-prefixed API Platform 4 `member` key", () => {
        expect(unwrapCollection({ member: [1, 2, 3] })).toEqual([1, 2, 3]);
    });

    it("reads the legacy `hydra:member` key", () => {
        expect(unwrapCollection({ "hydra:member": ["a", "b"] })).toEqual(["a", "b"]);
    });

    it("prefers `member` when both are present", () => {
        expect(
            unwrapCollection({ member: [1], "hydra:member": [2] }),
        ).toEqual([1]);
    });

    it("returns [] for null, undefined, or an empty object", () => {
        expect(unwrapCollection(null)).toEqual([]);
        expect(unwrapCollection(undefined)).toEqual([]);
        expect(unwrapCollection({})).toEqual([]);
    });
});

describe("getTotalItems", () => {
    it("reads the un-prefixed `totalItems` key", () => {
        expect(getTotalItems({ totalItems: 62 })).toBe(62);
    });

    it("reads the legacy `hydra:totalItems` key", () => {
        expect(getTotalItems({ "hydra:totalItems": 7 })).toBe(7);
    });

    it("prefers `totalItems` when both are present", () => {
        expect(getTotalItems({ totalItems: 5, "hydra:totalItems": 9 })).toBe(5);
    });

    it("returns 0 for null, undefined, or an empty object", () => {
        expect(getTotalItems(null)).toBe(0);
        expect(getTotalItems(undefined)).toBe(0);
        expect(getTotalItems({})).toBe(0);
    });

    it("preserves an explicit zero", () => {
        expect(getTotalItems({ totalItems: 0 })).toBe(0);
    });
});
