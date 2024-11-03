import { Suspense } from "react";

export default function AvailabilityLayout({ children }) {
    return (
        <Suspense fallback={<div>Loading availability...</div>}>
            {children}
        </Suspense>
    );
}   