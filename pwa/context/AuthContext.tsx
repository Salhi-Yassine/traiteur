"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
    fetchApi,
    setAuthToken,
    removeAuthToken,
    getAuthToken,
    setRefreshToken,
    removeRefreshToken,
} from "../utils/apiClient";
import type { LoginCredentials, LoginResponse, RegisterPayload } from "../types/api";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";
import { PATHS } from "../constants/paths";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: "couple" | "vendor" | "admin";
    weddingProfile: { id: number } | null;
    vendorProfile: { id: number; slug?: string } | null;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    loginWithToken: (token: string, refreshToken?: string) => Promise<void>;
    register: (data: RegisterPayload) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function redirectAfterAuth(userData: User, router: NextRouter) {
    if (userData.userType === "couple") {
        router.push(userData.weddingProfile ? PATHS.DASHBOARD_COUPLE : PATHS.ONBOARDING_COUPLE);
    } else if (userData.userType === "vendor") {
        router.push(userData.vendorProfile ? PATHS.DASHBOARD_VENDOR : PATHS.ONBOARDING_VENDOR);
    } else {
        router.push(PATHS.ADMIN);
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchMe = async (): Promise<User> => {
        return fetchApi("/api/me");
    };

    // Initialise auth state from stored token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const userData = await fetchMe();
                    setUser(userData);
                } catch {
                    // fetchApi already attempted a silent refresh internally.
                    // If we reach here the refresh also failed → clean slate.
                    removeAuthToken();
                    removeRefreshToken();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Listen for forced logout events dispatched by apiClient when a refresh fails
    useEffect(() => {
        const handleForcedLogout = () => {
            setUser(null);
            router.push(PATHS.AUTH_LOGIN);
        };

        window.addEventListener("auth:logout", handleForcedLogout);
        return () => window.removeEventListener("auth:logout", handleForcedLogout);
    }, [router]);

    const login = async (credentials: LoginCredentials) => {
        const data = await fetchApi<LoginResponse>("/auth", {
            method: "POST",
            jsonld: false,
            body: JSON.stringify(credentials),
        });

        if (data.token) {
            setAuthToken(data.token);
            // gesdinet AttachRefreshTokenOnSuccessListener appends refresh_token
            if (data.refresh_token) {
                setRefreshToken(data.refresh_token);
            }
            const userData = await fetchMe();
            setUser(userData);
            redirectAfterAuth(userData, router);
        }
    };

    /** Used by the OAuth callback page — access token already issued by Symfony. */
    const loginWithToken = async (token: string, refreshToken?: string) => {
        setAuthToken(token);
        if (refreshToken) {
            setRefreshToken(refreshToken);
        }
        const userData = await fetchMe();
        setUser(userData);
        redirectAfterAuth(userData, router);
    };

    const register = async (userData: RegisterPayload) => {
        await fetchApi("/api/users", {
            method: "POST",
            body: JSON.stringify(userData),
        });
        await login({ email: userData.email, password: userData.plainPassword });
    };

    const refreshUser = async () => {
        const userData = await fetchMe();
        setUser(userData);
    };

    const logout = () => {
        removeAuthToken();
        removeRefreshToken();
        setUser(null);
        router.push(PATHS.HOME);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, loginWithToken, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
