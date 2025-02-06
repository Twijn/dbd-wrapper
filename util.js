import fetch from "node-fetch";

export const get = url => {
    return new Promise(async (resolve, reject) => {
        const dataFetch = await fetch(url);
        try {
            const data = await dataFetch.json();
            console.log(data);
            if (dataFetch.status === 200) {
                resolve(data);
            } else {
                reject(data.error);
            }
        } catch(e) {
            console.error(e);
            reject("Failed to parse result JSON");
        }
    });
}
