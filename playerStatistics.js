import { Router } from "express";
import fetch from "node-fetch";

const router = new Router();

const URI = "https://www.dbd-info.com/api/playerStatistics";
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes

/**
 * Converts a number into a string with commas
 * Example: 130456 -> 130,456
 * @param {number} num
 * @returns {string}
 */
function comma(num) {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Stores player statistics
 * @type {{playerId: string, time: number, data: any}[]}
 */
let cache = [];

router.get("/", async (req, res) => {
    const playerId = req?.query?.playerId;
    let statistic = req?.query?.statistic;
    const commaEnabled = req?.query?.comma !== "false";

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
        const dataFetch = await fetch(`${URI}?playerId=${playerId}`);
        if (dataFetch.status === 200) {
            try {
                data = await dataFetch.json();
            } catch(e) {
                console.error(e);
                res.send("Failed to parse result JSON");
                return;
            }
        } else {
            try {
                data = await dataFetch.json();
            } catch(e) {
                console.error(e);
            }
            res.send("Received invalid response: " + dataFetch.status + " " + dataFetch.statusMessage);
            console.error(data);
            return;
        }

        cache.push({
            playerId,
            data,
            time: Date.now(),
        });
    }

    const playerStats = data.data?.playerStats?.playerstats?.stats;

    if (!playerStats) {
        res.send("Invalid JSON response: could not find player stats!");
        return;
    }

    const foundStatistic = playerStats.find(x => x.name === statistic);
    if (!foundStatistic) {
        res.send(`Could not find statistic labeled ${statistic}!`);
        return;
    }

    let value = foundStatistic?.value;
    if (typeof value !== "number") {
        res.send(`Invalid statistic type, expected number!`);
        return;
    }

    if (commaEnabled) {
        value = comma(value);
    }

    res.send("" + value);
});

setInterval(() => {
    cache = cache
        .filter(x => x.time + CACHE_TIME > Date.now());
}, 5000);

export default router;
