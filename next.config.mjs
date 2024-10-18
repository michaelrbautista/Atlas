/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ltjnvfgpomlatmtqjxrk.supabase.co",
                port: "",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "",
            }
        ]
    }
};

export default nextConfig;
