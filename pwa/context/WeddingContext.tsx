import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PublicWeddingData } from '@/utils/invitationConfig';

interface WeddingContextType {
    wedding: PublicWeddingData | null;
    setWedding: (wedding: PublicWeddingData | null) => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export function WeddingProvider({ children, initialData }: { children: ReactNode; initialData?: PublicWeddingData | null }) {
    const [wedding, setWedding] = useState<PublicWeddingData | null>(initialData || null);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <WeddingContext.Provider value={{ wedding, setWedding, isLoading, setIsLoading }}>
            {children}
        </WeddingContext.Provider>
    );
}

export function useWedding() {
    const context = useContext(WeddingContext);
    if (context === undefined) {
        throw new Error('useWedding must be used within a WeddingProvider');
    }
    return context;
}
