const express = require("express");
const { auth } = require("./auth");
const axios = require("axios").default;
const router = express.Router();
const dayjs = require("dayjs");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Stockker API" });
});

/* GET company profile. */
router.get("/profile/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/stock/profile2";

    try {
        const resp = await axios.get(url, {
            params: { symbol: req.params.symbol, token: auth.token },
        });

        if (Object.keys(resp.data).length === 0) {
            throw "Ticker Not Found";
        }
        res.send(resp.data);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        } else {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET company history. */
router.get("/stock/history/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/stock/candle";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                resolution: req.query.resolution,
                from: req.query.from,
                to: req.query.to,
                token: auth.token,
            },
        });


        res.send(resp.data);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET stock price. */
router.get("/stock/price/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/quote";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                token: auth.token,
            },
        });


        res.send(resp.data);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET token search. */
router.get("/search/:query", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/search";

    try {
        const resp = await axios.get(url, {
            params: {
                q: req.params.query,
                token: auth.token,
            },
        });
        res.send(resp.data);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        } else {
            console.error(err);
        }
    }
});

/* GET Company News. */
router.get("/news/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/company-news";

    const days = 7;
    const to = dayjs();
    const from = to.subtract(days, "day");
    const formatStr = "YYYY-MM-DD";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                from: from.format(formatStr),
                to: to.format(formatStr),
                token: auth.token,
            },
        });


        let count = 0;
        let response = [];
        for (let index = 0; index < resp.data.length; index++) {
            const element = resp.data[index];
            if (element["image"] && element["headline"]) {
                response.push(element);
                count += 1;
            }
            if (count == 20) {
                break;
            }
        }

        res.send({ length: response.length, result: response });
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET Company Recommendation Trends. */
router.get("/trends/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/stock/recommendation";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                token: auth.token,
            },
        });


        let response = {
            ticker: req.params.symbol,
            strongBuy: [],
            buy: [],
            hold: [],
            sell: [],
            strongSell: [],
            xcateg: [],
        };

        for (let i = 0; i < resp.data.length; i++) {
            response.strongBuy.push(resp.data[i].strongBuy);
            response.buy.push(resp.data[i].buy);
            response.hold.push(resp.data[i].hold);
            response.sell.push(resp.data[i].sell);
            response.strongSell.push(resp.data[i].strongSell);
            response.xcateg.push(resp.data[i].period.slice(0, 7));
        }

        res.send(response);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET Company Sentiment. */
router.get("/sentiment/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/stock/social-sentiment";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                from: "2022-01-01",
                token: auth.token,
            },
        });
        let response = {
            redditPositiveMention: 0,
            redditNegativeMention: 0,
            redditMention: 0,
            twitterPositiveMention: 0,
            twitterNegativeMention: 0,
            twitterMention: 0,
        };
        let medias = ["reddit", "twitter"];
        medias.forEach((media) => {
            for (let index = 0; index < resp.data[media].length; index++) {
                const sentiment = resp.data[media][index];
                response[media + "PositiveMention"] += sentiment["positiveMention"];
                response[media + "NegativeMention"] += sentiment["negativeMention"];
                response[media + "Mention"] += sentiment["mention"];
            }
        });


        res.send(response);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET Company Peers. */
router.get("/peers/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/stock/peers";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                token: auth.token,
            },
        });


        res.send(resp.data);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

/* GET Company Earnings. */
router.get("/earnings/:symbol", async function (req, res, next) {
    const url = "https://finnhub.io/api/v1/stock/earnings";

    try {
        const resp = await axios.get(url, {
            params: {
                symbol: req.params.symbol,
                token: auth.token,
            },
        });


        let response = {
            actual: [],
            estimate: [],
            xcateg: [],
        };

        for (let i = 0; i < resp.data.length; i++) {
            if (resp.data[i].surprise == null) {
                let temp = 0;
                response.xcateg.push(resp.data[i].period + "<br>Surprise: " + temp.toString());
            } else {
                response.xcateg.push(resp.data[i].period + "<br>Surprise: " + resp.data[i].surprise.toString());
            }

            if (resp.data[i].actual == null) {
                response.actual.push([i, 0]);
            } else {
                response.actual.push([i, resp.data[i].actual]);
            }

            if (resp.data[i].estimate == null) {
                response.estimate.push([i, 0]);
            } else {
                response.estimate.push([i, resp.data[i].estimate]);
            }
        }

        res.send(response);
    } catch (err) {
        if (typeof err == "object" && err.response.status == 429) {
            res.writeHead(429, { "Content-Type": "text/plain" });
            res.write(JSON.stringify(err));
            res.end();
        }
    }
});

module.exports = router;
