export const PATHS = {
    HOME: "/",

    // Auth
    AUTH_LOGIN:          "/auth/login",
    AUTH_REGISTER:       "/auth/register",
    AUTH_FORGOT:         "/auth/forgot-password",
    AUTH_CALLBACK:       "/auth/callback",

    // Onboarding
    ONBOARDING_COUPLE:   "/onboarding/couple",
    ONBOARDING_VENDOR:   "/onboarding/vendor",

    // Couple dashboard
    DASHBOARD_COUPLE:    "/mariage",

    // Vendor dashboard
    DASHBOARD_VENDOR:    "/dashboard/vendor",

    // Public
    VENDORS:             "/vendors",
    CATEGORIES:          "/categories",
    INSPIRATION:         "/inspiration",
    REAL_WEDDINGS:       "/real-weddings",

    // Admin
    ADMIN:               "/admin",
} as const;

export type AppPath = typeof PATHS[keyof typeof PATHS];
