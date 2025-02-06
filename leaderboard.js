import { Router } from "express";

const router = new Router();

import { get } from "./util.js";

const URI = "https://www.dbd-info.com/api/leaderboard";
const CACHE_TIME = 60 * 60 * 1000; // 1 hour

/**
 * Stores player statistics
 * @type {{playerId: string, time: number, data: any}[]}
 */
let cache = [];

router.get("/", async (req, res) => {
    const playerId = req?.query?.playerId;
    let statistic = req?.query?.statistic;

    if (!playerId) {
        res.send("playerId is invalid!");
        return;
    }

    if (!statistic) {
        res.send("statistic is invalid!");
        return;
    }

    let data = null;

    const cacheFind = cache.find(x => x.playerId === playerId);
    if (cacheFind) {
        data = cacheFind.data;
    }

    if (!data) {
        try {
            data = await get(`${URI}?steamId=${playerId}&sort=${statistic}`)
        } catch(e) {
            res.send(e);
            return;
        }

        cache.push({
            playerId,
            data,
            time: Date.now(),
        });
    }

    const value = data.data?.position;

    if (typeof value !== "number") {
        res.send(`Invalid leaderboard position type, expected number!`);
        return;
    }

    res.send(String(value));
});

setInterval(() => {
    cache = cache
        .filter(x => x.time + CACHE_TIME > Date.now());
}, 5000);

export default router;
