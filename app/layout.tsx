import type { Metadata } from "next";
import { Poppins, Montserrat_Alternates } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const montserrat = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "ScopeIt — From chaos to clarity",
  description: "Turn messy product ideas into clear, structured scope documents in minutes. Powered by AI.",
  metadataBase: new URL("https://scopeit.app"),
  openGraph: {
    title: "ScopeIt — From chaos to clarity",
    description: "Turn messy product ideas into clear, structured scope documents in minutes. Powered by AI.",
    url: "https://scopeit.app",
    siteName: "ScopeIt",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "ScopeIt logo" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ScopeIt — From chaos to clarity",
    description: "Turn messy product ideas into clear, structured scope documents in minutes.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <Script id="pendo-install" strategy="afterInteractive">
          {`(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('c3394d38-3ac4-46e4-b46d-436b809ea8d6');`}
        </Script>
        {/* Initialize Novus analytics for anonymous visitors.
            Once Supabase auth is wired up, call pendo.initialize() again
            with the authenticated user's id and email so visitors are identified. */}
        <Script id="pendo-init" strategy="afterInteractive">
          {`pendo.initialize({ visitor: { id: 'ANONYMOUS' } });`}
        </Script>
      </body>
    </html>
  );
}
