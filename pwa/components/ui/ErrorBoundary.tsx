import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Catches render-time errors in the child tree.
 * Wrap sections that depend on external data or complex rendering.
 *
 * Usage:
 *   <ErrorBoundary fallback={<p>Something went wrong.</p>}>
 *     <VendorGallery />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo): void {
        if (process.env.NODE_ENV !== "production") {
            console.error("[ErrorBoundary]", error, info.componentStack);
        }
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <div className="rounded-[16px] border border-[#DDDDDD] bg-[#F7F7F7] p-8 text-center text-[14px] text-[#717171]">
                        Une erreur est survenue lors du chargement de cette section.
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
