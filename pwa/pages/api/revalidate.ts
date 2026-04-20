import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const secret = process.env.PWA_REVALIDATE_SECRET;

    if (!secret || req.query.secret !== secret) {
        return res.status(401).json({ message: "Invalid revalidation token" });
    }

    const rawPaths = req.query.paths;
    const paths = Array.isArray(rawPaths) ? rawPaths : rawPaths ? [rawPaths] : ["/magazine"];

    try {
        await Promise.all(paths.map((path) => res.revalidate(path)));
        return res.json({ revalidated: true, paths });
    } catch (err) {
        return res.status(500).json({ message: "Revalidation failed", error: String(err) });
    }
}
