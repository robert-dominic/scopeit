import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import PendoInitializer from "@/components/PendoInitializer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ScopeIt — From chaos to clarity",
  description: "Turn messy product ideas into clear MVP scopes with AI.",
};

// TODO: When the Supabase auth callback handler is implemented, call
// trackUserSignedUp() from "lib/pendo-events" after successful registration
// and trackUserSignedIn() from "lib/pendo-events" after successful login.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full`}
      suppressHydrationWarning
    >
      <Script id="pendo-install" strategy="beforeInteractive">
        {`(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('c3394d38-3ac4-46e4-b46d-436b809ea8d6');`}
      </Script>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <PendoInitializer />
        {children}
      </body>
    </html>
  );
}