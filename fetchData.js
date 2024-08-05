const axios = require('axios');
// const { Wechaty } = require('wechaty');

let lastData = null; // 用于存储上次爬取的数据

// 爬取数据的函数
async function fetchData() {
  try {
    const config = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Sec-Fetch-Site': 'same-origin',
        Cookie: 'HWWAFSESID=f7047971d1c19f7ea5; HWWAFSESTIME=1718333412680; gdp_user_id=gioenc-g95e8875%2C9gc4%2C5g10%2Cc5b1%2C572777914849; tgbuser=8746673; tgbpwd=0c257a4d4069f9c001eb3b4f7fdcbe547a834dd3e1b460d5ccbe222a8d2e5c76lk5idmnmhd5627q; 893eedf422617c96_gdp_gio_id=gioenc-9657762; 893eedf422617c96_gdp_cs1=gioenc-9657762; Actionshow2=true; dvNgbOperaTime=1719642513906; HMACCOUNT=121B8F73D3246B41; Hm_lvt_cc6a63a887a7d811c92b7cc41c441837=1720425813; creatorStatus8746673=true; JSESSIONID=MWE0ODUxNGYtMTM3OC00MDYwLWJlMjYtN2I3OTQ4MWYyZmE3; 893eedf422617c96_gdp_session_id=a358fc75-4845-4fd5-a6e7-ce32e4376b67; showStatus8746673=true; tfstk=fOZip56PZPu1wfJAskm1lhqeYYbpfCijnSKxMmhV8XlB6CKT3xo0T7TOhNwqiSVK9l3xbAh2m-cQ6PhYCS04wky9XjQZixPTOqF0hOMqgSPmMPQd2Rwscm5JmgI8C7r7icZi0IeeWTfFV_IR2Rkn6NJ1wtTl5Wlx3mkwbFJFKAMmQmuZ_DWn3xdwuhP4L9DjTn8qgfJETxDmIiTZwozzY1YVVh6sv_uEIVcDDX-0yk--SbRITn-qsA0grRlH0nrURZBitf7Wpjit1uDgGgtsbq47HxVGjhP0FkNnL7SD2fyQez3_bgTjrclIklydr3ma1x0r02v20Jms_7ZE4gRndyyTulNMnnk_Xu3mN2X2cqnU24zzsK67Lck4G4ZANhGa38Z7y0jp70y3u74c4N8ezsgpcvWYYETj7vMnNujHffSLDxvdK9Y8hVkIFbBhKE_t7vM7q9XHPH3ZdYmV.; 893eedf422617c96_gdp_sequence_ids=%7B%22globalKey%22%3A95%2C%22VISIT%22%3A22%2C%22PAGE%22%3A53%2C%22CUSTOM%22%3A22%7D; 893eedf422617c96_gdp_session_id_a358fc75-4845-4fd5-a6e7-ce32e4376b67=true; Hm_lpvt_cc6a63a887a7d811c92b7cc41c441837=1721371200' // 替换为实际的cookie
     }, timeout: 3000 };
    const response = await axios.get('https://www.taoguba.com.cn/super/spefocus/friendActions?perPageNum=20&actionID=0&type=A', config); // 替换为实际的爬取网址
    // console.log("=====================>",response.data.dto.record[0]); // 打印爬取的数据
    return response.data.dto.record[0];
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
}

// 发送微信消息的函数
async function sendMessage(bot, contact, message) {
  try {
    await contact.say(message);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// 主函数
async function main() {
  // 初始化微信机器人
//   const bot = new Wechaty();

//   bot.on('scan', (qrcode, status) => {
//     console.log(`Scan QR Code to login: ${status}`);
//     console.log(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`);
//   });

//   bot.on('login', async (user) => {
//     console.log(`User ${user} logged in`);

    // 定时任务，每30秒执行一次
    // setInterval(async () => {
      const data = await fetchData();
      if (data) {
        if (JSON.stringify(lastData) !== JSON.stringify(data)) {
          lastData = data;

          // 获取联系人
        //   const contact = await bot.Contact.find({ name: 'YourContactName' }); // 替换为实际的联系人名称
        //   if (contact) {
            // 发送消息
            // await sendMessage(bot, contact, `爬取到的新数据: ${JSON.stringify(data)}`);
            // console.log(`爬取到的新数据: ${JSON.stringify(data)}`);
            return data;
        //   } else {
        //     console.log('Contact not found');
        //   }
        } else {
          console.log('Data has not changed.');
        }
      }
    // }, 30000); // 每30秒执行一次
//   });

//   bot.on('error', (error) => {
//     console.error('Bot error:', error);
//   });

//   // 启动微信机器人
//   await bot.start();
}

// main();
module.exports = { fetchData };