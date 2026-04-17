"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchApi, setAuthToken, removeAuthToken, getAuthToken } from "../utils/apiClient";
import { useRouter } from "next/router";

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: "couple" | "vendor" | "admin";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    loginWithToken: (token: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const userData = await fetchApi("/api/me");
                    setUser(userData);
                } catch (error) {
                    removeAuthToken();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: any) => {
        const data = await fetchApi("/auth", {
            method: "POST",
            jsonld: false, // JWT endpoint is standard JSON
            body: JSON.stringify(credentials),
        });

        if (data.token) {
            setAuthToken(data.token);
            const userData = await fetchApi("/api/me");
            setUser(userData);
            router.push("/");
        }
    };

    /** Used by the OAuth callback page — token already issued by Symfony. */
    const loginWithToken = async (token: string) => {
        setAuthToken(token);
        const userData = await fetchApi("/api/me");
        setUser(userData);
        router.push("/");
    };

    const register = async (userData: any) => {
        await fetchApi("/api/users", {
            method: "POST",
            body: JSON.stringify(userData),
        });

        // Automatically login after registration
        await login({ email: userData.email, password: userData.plainPassword });
    };

    const logout = () => {
        removeAuthToken();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, loginWithToken, register, logout }}>
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
