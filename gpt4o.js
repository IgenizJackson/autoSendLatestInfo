const axios = require('axios');
const uuid = require("uuid").v4;
const { analisy } = require("./explain");
 
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
        const newid = uuid();
        const response = await axios({
            method: 'post',
            url: `https://chat.oaichat.cc/api/chat/completions`, // n4%2BxnDRDuDyDKjQDoDlxGhb7YeAKH5wPwe4it4D
            data:{
                "stream": true,
                "model": "gpt-4o",
                "messages": [
                  {
                    "role": "user",
                    "content": msg
                  }
                ],
                "session_id": "fRfRdwYoOWyu8if0ABU9",
                "chat_id": "668069db-96d0-44c1-9c97-34ecbca8797a",
                "id": "47c6610a-0e78-4a7f-99aa-a07e0820d957"
              },
            headers: {
                Accept:"application/json",
                "Accept-Encoding":"gzip, deflate, br, zstd",
                "Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8",
                Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1NDQ4YjliLTZjNWEtNGZkMi1iYjljLTJiMDI3ZTQ2MTQ1OCJ9.3s3cfBHhSa6SOaijZS38BibQapvESks2stGirZXbXr4",
                
                "Content-Type":"application/json",
                Cookie:`token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1NDQ4YjliLTZjNWEtNGZkMi1iYjljLTJiMDI3ZTQ2MTQ1OCJ9.3s3cfBHhSa6SOaijZS38BibQapvESks2stGirZXbXr4; cf_clearance=gGC0sAKJSbPONb1_EEbZFC._HjderNx6hxXzZw7bi98-1722672722-1.0.1.1-rMUo0SYU6Mxk4JUdpDzB6VdGj12cwn8FRoILmpJ.xmohzzlQU9j7gJ6c6gBv5m3DEIoHKtKEAiSBalnbQYJjVA`,
                Origin:"https://chat.oaichat.cc",
                Priority:"u=1, i",
                Referer: "https://chat.oaichat.cc/c/1eccb1db-31d4-45a9-b89a-5d593cda9a06",
                "Sec-Ch-Ua":`"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"`,
                "Sec-Ch-Ua-Mobile":"?0",
                "Sec-Ch-Ua-Platform":"Windows",
                "Sec-Fetch-Dest":"empty",
                "Sec-Fetch-Mode":"cors",
                "Sec-Fetch-Site":"same-origin",
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36}",
            },
            responseType: "stream",
        });
        // return response.data;

        return new Promise((resolve, reject) => {
            let data = '';
            // const arr = [];
            response.data.on('data', (chunk) => {
                        console.info("==========>\n", chunk.toString())
                        data += chunk.toString()
                        // arr.push(chunk.toString());
            
            });

            response.data.on('end', () => {
                resolve(data);
            });

            response.data.on('error', (err) => {
                reject(err); // 在发生错误时拒绝Promise
            });
        });

    } catch (error) {
        throw new Error(`Request failed: ${error.message}`);
    }
}


// 使用示例

const msg = "今天为何人民币美元汇率大跌，这预示着什么";
async function answer(msg) {
return new Promise((resolve, reject) =>{
    
    fetchEventStream(msg)
        .then(async(data) => {
            // console.log('Received data:', data);
            const res = analisy(data);
            console.log("最终回答:--------->", res);
            resolve(res);
        })
        .catch((err) => {
            console.error('Error fetching event stream:', err);
        });
})
}

module.exports = {
     answer
}
