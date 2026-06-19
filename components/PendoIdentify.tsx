"use client";

import { useEffect } from "react";

interface Props {
    userId: string;
    email: string;
}

export default function PendoIdentify({ userId, email }: Props) {
    useEffect(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).pendo?.identify({ visitor: { id: userId, email } });
        } catch { }
    }, [userId, email]);

    return null;
}
