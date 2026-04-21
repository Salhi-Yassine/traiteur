"use client";

import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: ("client" | "caterer" | "admin")[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login");
        }

        if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.userType as any)) {
            router.push("/"); // Redirect if role not allowed
        }
    }, [user, isLoading, router, allowedRoles]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-sand-50)]">
                <div className="w-12 h-12 border-4 border-[var(--color-teal-700)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
};
