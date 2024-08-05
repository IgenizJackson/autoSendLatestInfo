const axios = require('axios');
const uuid = require("uuid").v4;

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz%0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function fetchEventStream(msg) {
    try {
        const response = await axios({
            method: 'post',
            url: `https://api.binjie.fun/api/generateStream?refer__1360=${generateRandomCode(40)}`, // n4%2BxnDRDuDyDKjQDoDlxGhb7YeAKH5wPwe4it4D
            data:{
                "prompt": msg,
                "userId": "#/chat/1719402020420",
                "network": true,
                "system": "",
                "withoutContext": false,
                "stream": false
            },
            headers: {
                "content-type":"application/json",
                Accept: "application/json, text/plain, */*",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                "Origin":"https://chat18.aichatos8.com",
                "Referer":"https://chat18.aichatos8.com/",
                "Sec-Ch-Ua":'"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                "Sec-Ch-Ua-Mobile":"?0",
                "Sec-Ch-Ua-Platform":"Windows",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site":"cross-site",
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
            },
            // responseType: 'stream'
        });
        return response.data;

        // return new Promise((resolve, reject) => {
        //     let data = '';
        //     // const arr = [];
        //     response.data.on('data', (chunk) => {
        //             if (chunk.toString().indexOf('"status": "finished_successfully"') > -1) {
        //                 data += chunk.toString()
        //                 // arr.push(chunk.toString());
        //             }
        //     });

        //     response.data.on('end', () => {
        //         resolve(data);
        //     });

        //     response.data.on('error', (err) => {
        //         reject(err); // 在发生错误时拒绝Promise
        //     });
        // });

    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
}

function extractFinishedParts(str) {
    substr1 = '"]}, "status": "finished_successfully"';
    substr2 = '"parts": ["';
    // 找到第一个子串的索引位置
    let index1 = str.indexOf(substr1);
    if (index1 === -1) {
        console.log(`未找到子串 ${substr1}`);
        return;
    }

    // 找到第二个子串的第一个索引位置
    let index2First = str.indexOf(substr2);
    if (index2First === -1) {
        console.log(`未找到子串 ${substr2}`);
        return;
    }

    if (index1 < index2First) {
        console.log("继续找第一个字符串的第二个索引位置")
        let index1Second = str.indexOf(substr1, index2First);
        let data = str.substring(index2First + 11, index1Second)
        return data;
    } else {
        return str.substring(index1 + 11, index2First)
    }
}

// 使用示例

// const msg = "三国演义讲述的什么故事";

// fetchEventStream(msg)
//     .then((data) => {
//         console.log('Received data:', data);
//         // const res = extractFinishedParts(data);
//         // console.log("最终回答:--------->", res);
//     })
//     .catch((err) => {
//         console.error('Error fetching event stream:', err);
//     });

module.exports = {
    fetchEventStream
}
