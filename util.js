import fetch from "node-fetch";

export const get = url => {
    return new Promise(async (resolve, reject) => {
        const dataFetch = await fetch(url);
        if (dataFetch.status === 200) {
            try {
                resolve(await dataFetch.json());
            } catch(e) {
                console.error(e);
                reject("Failed to parse result JSON");
            }
        } else {
            try {
                reject((await dataFetch.json()).error);
            } catch(e) {
                console.error(e);
                reject(`Failed to parse error JSON: ${dataFetch.status}`);
            }
        }
    });
}
