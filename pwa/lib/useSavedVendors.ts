import { useCallback } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
import apiClient, { ApiError } from "@/utils/apiClient";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/constants/paths";
import type { SavedVendor } from "@/types/api";

/** API Platform 4 returns `member`; older config returned `hydra:member`. */
interface SavedVendorCollection {
    member?: SavedVendor[];
    "hydra:member"?: SavedVendor[];
}

export const SAVED_VENDORS_QUERY_KEY = ["saved_vendors"] as const;

const unwrap = (data: SavedVendorCollection): SavedVendor[] =>
    data.member ?? data["hydra:member"] ?? [];

/** Temporary negative id for optimistic entries until the server responds. */
let optimisticId = -1;

/**
 * Server-persisted vendor moodboard (issue #33).
 *
 * - `isSaved(vendorProfileId)` — heart state for a vendor
 * - `toggleSave(vendorProfileId)` — optimistic save/unsave; redirects
 *   logged-out users to the login page
 */
export function useSavedVendors() {
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { t } = useTranslation("common");

    const { data: savedVendors = [], isLoading } = useQuery({
        queryKey: SAVED_VENDORS_QUERY_KEY,
        queryFn: () =>
            apiClient.get<SavedVendorCollection>("/api/saved_vendors", {
                locale: router.locale,
            }),
        select: unwrap,
        enabled: !!user,
    });

    const saveMutation = useMutation({
        mutationFn: (vendorProfileId: number) =>
            apiClient.post<SavedVendor>("/api/saved_vendors", {
                vendorProfile: `/api/vendor_profiles/${vendorProfileId}`,
            }),
        onMutate: async (vendorProfileId) => {
            await queryClient.cancelQueries({ queryKey: SAVED_VENDORS_QUERY_KEY });
            const previous =
                queryClient.getQueryData<SavedVendorCollection>(SAVED_VENDORS_QUERY_KEY);

            const placeholder = {
                "@id": `optimistic-${optimisticId}`,
                "@type": "SavedVendor",
                id: optimisticId--,
                vendorProfile: { id: vendorProfileId },
                createdAt: new Date().toISOString(),
            } as SavedVendor;

            queryClient.setQueryData<SavedVendorCollection>(
                SAVED_VENDORS_QUERY_KEY,
                (old) => ({ member: [placeholder, ...unwrap(old ?? {})] }),
            );

            return { previous };
        },
        onError: (err: ApiError, _vendorProfileId, context) => {
            queryClient.setQueryData(SAVED_VENDORS_QUERY_KEY, context?.previous);
            toast.error(err.message);
        },
        onSuccess: () => toast.success(t("saved_vendors.saved_toast")),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: SAVED_VENDORS_QUERY_KEY }),
    });

    const unsaveMutation = useMutation({
        mutationFn: (saved: SavedVendor) =>
            apiClient.delete(`/api/saved_vendors/${saved.id}`),
        onMutate: async (saved) => {
            await queryClient.cancelQueries({ queryKey: SAVED_VENDORS_QUERY_KEY });
            const previous =
                queryClient.getQueryData<SavedVendorCollection>(SAVED_VENDORS_QUERY_KEY);

            queryClient.setQueryData<SavedVendorCollection>(
                SAVED_VENDORS_QUERY_KEY,
                (old) => ({
                    member: unwrap(old ?? {}).filter((s) => s.id !== saved.id),
                }),
            );

            return { previous };
        },
        onError: (err: ApiError, _saved, context) => {
            queryClient.setQueryData(SAVED_VENDORS_QUERY_KEY, context?.previous);
            toast.error(err.message);
        },
        onSuccess: () => toast.success(t("saved_vendors.removed_toast")),
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: SAVED_VENDORS_QUERY_KEY }),
    });

    const findByVendorId = useCallback(
        (vendorProfileId: number) =>
            savedVendors.find((s) => s.vendorProfile?.id === vendorProfileId),
        [savedVendors],
    );

    const isSaved = useCallback(
        (vendorProfileId: number) => !!findByVendorId(vendorProfileId),
        [findByVendorId],
    );

    const toggleSave = useCallback(
        (vendorProfileId: number) => {
            if (!user) {
                toast.info(t("saved_vendors.login_required"));
                router.push(PATHS.AUTH_LOGIN);
                return;
            }

            const existing = findByVendorId(vendorProfileId);
            if (!existing) {
                saveMutation.mutate(vendorProfileId);
            } else if (existing.id > 0) {
                // Negative id = optimistic placeholder still in flight — ignore
                // the click; the entry becomes deletable once the POST settles.
                unsaveMutation.mutate(existing);
            }
        },
        [user, router, t, findByVendorId, saveMutation, unsaveMutation],
    );

    return { savedVendors, isLoading, isSaved, toggleSave };
}
