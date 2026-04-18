"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchApi, setAuthToken, removeAuthToken, getAuthToken } from "../utils/apiClient";
import { useRouter } from "next/router";
import type { NextRouter } from "next/router";

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
    login: (credentials: any) => Promise<void>;
    loginWithToken: (token: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function redirectAfterAuth(userData: User, router: NextRouter) {
    if (userData.userType === "couple") {
        router.push(userData.weddingProfile ? "/mariage" : "/onboarding/couple");
    } else if (userData.userType === "vendor") {
        router.push(userData.vendorProfile ? "/dashboard/vendor" : "/onboarding/vendor");
    } else {
        router.push("/admin");
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchMe = async (): Promise<User> => {
        return fetchApi("/api/me");
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const userData = await fetchMe();
                    setUser(userData);
                } catch {
                    removeAuthToken();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const login = async (credentials: any) => {
        const data = await fetchApi("/auth", {
            method: "POST",
            jsonld: false,
            body: JSON.stringify(credentials),
        });

        if (data.token) {
            setAuthToken(data.token);
            const userData = await fetchMe();
            setUser(userData);
            redirectAfterAuth(userData, router);
        }
    };

    /** Used by the OAuth callback page — token already issued by Symfony. */
    const loginWithToken = async (token: string) => {
        setAuthToken(token);
        const userData = await fetchMe();
        setUser(userData);
        redirectAfterAuth(userData, router);
    };

    const register = async (userData: any) => {
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
        setUser(null);
        router.push("/");
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
