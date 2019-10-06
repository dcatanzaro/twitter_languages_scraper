const Twitter = require("twitter");
const fs = require("fs");
const arLanguages = require("./languages.json");

let arResults = [{}, {}, {}, {}, {}, {}];

const client = new Twitter({
    consumer_key: "",
    consumer_secret: "",
    access_token_key: "",
    access_token_secret: ""
});

function getAllTweets(maxId = "") {
    let params = {
        q: "First language For beginners",
        count: 100,
        tweet_mode: "extended",
        result_type: "recent"
    };

    if (maxId) params.max_id = maxId;

    client.get("search/tweets", params, (error, tweets, response) => {
        let lastId = "";

        tweets.statuses.map(tweet => {
            if (tweet.id != maxId) {
                const tweetSplit = tweet.full_text.split("\n");

                let tweetSanitized = [];

                tweetSplit.map((tw, index) => {
                    tw = tw.toLowerCase();
                    let split = tw ? tw.split(":")[1] : "";

                    if (split) {
                        split = split.split(/,|\//);

                        if (tw.includes(["first language"])) {
                            tweetSanitized[0] = split;
                        } else if (tw.includes(["had difficulties"])) {
                            tweetSanitized[1] = split;
                        } else if (tw.includes(["most used"])) {
                            tweetSanitized[2] = split;
                        } else if (tw.includes(["totally hate"])) {
                            tweetSanitized[3] = split;
                        } else if (tw.includes(["most loved"])) {
                            tweetSanitized[4] = split;
                        } else if (tw.includes(["for beginners"])) {
                            tweetSanitized[5] = split;
                        }
                    }
                });

                tweetSanitized.map((language, index) => {
                    language.map(tmpLng => {
                        tmpLng = tmpLng.trim();

                        const indexLanguage = arLanguages.indexOf(tmpLng);
                        const sanitizedLanguage =
                            indexLanguage > -1
                                ? arLanguages[indexLanguage]
                                : null;

                        if (sanitizedLanguage && index < 6) {
                            if (
                                typeof arResults[index][tmpLng] !== "undefined"
                            ) {
                                arResults[index][tmpLng]++;
                            } else {
                                arResults[index][tmpLng] = 1;
                            }
                        }
                    });
                });

                lastId = tweet.id;
            }
        });

        fs.writeFile(
            "./results.json",
            JSON.stringify(arResults),
            "utf8",
            () => {}
        );

        getAllTweets(lastId);
    });
}

getAllTweets();

// const results = arResults.map(result => {
//     return orderObj(result);
// });
// console.log("First language", results[0]);
// console.log("Had difficulties", results[1]);
// console.log("Most used", results[2]);
// console.log("Totally hate", results[3]);
// console.log("Most loved", results[4]);
// console.log("For beginners", results[5]);

function orderObj(obj) {
    const keys = Object.keys(obj).sort((a, b) => (obj[a] < obj[b] ? 1 : -1));

    const values = Object.keys(obj)
        .sort((a, b) => (obj[a] < obj[b] ? 1 : -1))
        .map(key => obj[key]);

    return keys.map((key, index) => {
        return { [key]: values[index] };
    });
}
