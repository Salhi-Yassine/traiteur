/**
 * Helpers for reading API Platform / Hydra collection responses.
 *
 * API Platform 4 emits collections with un-prefixed keys (`member`,
 * `totalItems`), while older code and mock fixtures use the Hydra-prefixed
 * form (`hydra:member`, `hydra:totalItems`). These helpers read either shape,
 * so the frontend keeps working across the prefix change (API Platform 5 drops
 * the prefix entirely).
 *
 * Always unwrap collections through these — never index `["hydra:member"]`
 * directly, or the read silently returns undefined and the caller falls back
 * to mock data.
 */

interface HydraCollectionLike<T> {
    member?: T[];
    "hydra:member"?: T[];
    totalItems?: number;
    "hydra:totalItems"?: number;
}

/**
 * Returns the collection items, or `[]` when the payload is missing/empty.
 *
 * Accepts `unknown` because call sites pass a mix of typed collections, `any`,
 * and the default `unknown` from `apiClient.get`. Specify the element type at
 * the call site: `unwrapCollection<Vendor>(data)`.
 */
export function unwrapCollection<T>(data: unknown): T[] {
    const c = data as HydraCollectionLike<T> | null | undefined;
    if (!c) return [];
    return c.member ?? c["hydra:member"] ?? [];
}

/** Returns the total item count (for pagination), or `0` when absent. */
export function getTotalItems(data: unknown): number {
    const c = data as HydraCollectionLike<unknown> | null | undefined;
    if (!c) return 0;
    return c.totalItems ?? c["hydra:totalItems"] ?? 0;
}
