/**
 * WechatBot
 *  - https://github.com/gengchen528/wechatBot
 */
const { WechatyBuilder } = require('wechaty');
const schedule = require('./schedule/index');
const config = require('./config/index');
const untils = require('./utils/index');
const superagent = require('./superagent/index');
const { fetchEventStream } = require('./chatgpt');
const { answer } = require("./gpt4o");
const fetchData = require('./fetchData');
const { spawn, fork } = require('child_process');
const path = require("path");
let lastData = null;


const startApplication = () =>  {
  console.log('\x1b[34m%s\x1b[0m', `应用启动 - PID: ${process.pid}, 时间: ${new Date().toLocaleString()}`);

    // 设置未捕获异常处理器
    process.on('uncaughtException', handleUncaughtException);
  

  // 你的主应用代码从这里开始
  runApplication();
}

const handleUncaughtException = (error) => {
  console.error('\x1b[31m%s\x1b[0m', '捕获到未处理的异常:');
  console.error(error);
  console.log('\x1b[33m%s\x1b[0m', '正在重启应用...');

  // 获取当前时间
  const now = new Date();
  console.log('\x1b[36m%s\x1b[0m', `重启时间: ${now.toLocaleString()}`);

    if (process.send) {
        process.send('uncaughtException'); // 向父进程发送消息
    } else {
        startNewProcess(); // 父进程启动新的子进程
    }

//   // 启动新进程
//   const child = spawn(process.argv[0], [path.resolve(__dirname, 'index.js')], {
//     env: { ...process.env, IS_RESTART: 'true' },
//     stdio: 'inherit',
//     detached: false // 改为 false，以便我们可以等待子进程
// });

// console.log('\x1b[32m%s\x1b[0m', `新进程 PID: ${child.pid}`);

// // 等待子进程结束
// child.on('close', (code) => {
//     console.log(`子进程退出，退出码 ${code}`);
//     process.exit(1);
// });
}


// 延时函数，防止检测出类似机器人行为操作
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runApplication = () => {

// 二维码生成
function onScan(qrcode, status) {
  require('qrcode-terminal').generate(qrcode); // 在console端显示二维码
  const qrcodeImageUrl = [
    'https://api.qrserver.com/v1/create-qr-code/?data=',
    encodeURIComponent(qrcode),
  ].join('');

  console.log(qrcodeImageUrl);
}

// 登录
async function onLogin(user) {
  console.log(`贴心小助理${user}登录了`);
  const date = new Date()
  console.log(`当前容器时间:${date}`);
  if (config.AUTOREPLY) {
    console.log(`已开启机器人自动聊天模式`);
  }

  // 登陆后创建定时任务
  // await initDay();

  // 监听到新消息 每隔5.5秒执行一次
  // setInterval(async ()=>{
  //   fetchData.fetchData().then(async data => {
  //     if (data) {
  //         if (JSON.stringify(lastData) !== JSON.stringify(data)) {
  //           lastData = data;
  //              console.log(`爬取到的新数据: ${JSON.stringify(data)}`);
  //              //发送消息
  //               // 获取联系人
  //              //  const contact = await bot.Contact.find({ name: 'Rocky' }); // 替换为实际的联系人名称
  //              const contact = await bot.Room.find({ topic: '永不空军-2024' }); // 替换为实际的群聊名称
  //               if (contact) {
  //                 // 发送消息
  //                 const info = JSON.stringify({postDate: data.postDate, body: data.body, userName:data.userName, quoteContent: data.quoteContent, quoteUserName: data.quoteUserName});
  //                 console.log('发送消息内容', info);
  //                 try {
  //                   await contact.say(info); 
  //                 } catch (error) {
  //                   console.log('发送消息失败', error);
  //                 }
  //               }
  //         }
  //     }
  //   })
  // }, 5500);

}

// 登出
function onLogout(user) {
  console.log(`小助手${user} 已经登出`);
}

// 监听对话
async function onMessage(msg) {
  const contact = msg.talker(); // 发消息人
  const content = msg.text().trim(); // 消息内容
  const room = msg.room(); // 是否是群消息
  const alias = await contact.alias() || await contact.name(); // 发消息人备注
  const isText = msg.type() === bot.Message.Type.Text;
  if (msg.self()) {
    return;
  }

  if (room && isText) {
    // 如果是群消息 目前只处理文字消息
    const topic = await room.topic();
    // console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${content}`);
    if (topic == 'S+1') {
      if (content.substr(0, 2) == '儿子' || content.substr(0, 4) == '小度小度' || content.substr(0, 3) == '大孙子') {
        let contactContent = content.replace('儿子', '').replace('小度小度', '').replace('大孙子','');
        if (contactContent) {
          // let res = await fetchEventStream(contactContent)
          let res = await answer(contactContent);
          await delay(500);
          await room.say(res);
        }
      }
     }
    if (topic == '吃喝玩乐') {
      if (content.substr(0, 2) == '铁子' || content.substr(0, 3) == '铁子!') {
        let contactContent = content.replace('铁子!', '').replace('铁子', '');
        if (contactContent) {
          let res = await fetchEventStream(contactContent)
          await delay(500);
          await room.say(res);
        }
      }
     }
    if (topic == '永不空军-2024') {
      // 如果是群聊且是群名为永不空军-2024
      // console.log(`群名: ${topic} 发消息人: ${await contact.name()} 内容: ${content}`);
      if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
        let contactContent = content.replace('?', '').replace('？', '');
        if (contactContent) {
          let res = await superagent.getReply(contactContent);
          await delay(2000);
          await room.say(res);
        }
     }
     if (content.substr(0, 1) == '!' || content.substr(0, 1) == '！') {
      let contactContent = content.replace('!', '').replace('！', '');
      if (contactContent) {
        let res = await superagent.getRubbishType(contactContent);
        await delay(2000);
        await room.say(res);
      }
    }
    if (content.substr(0, 2) == '铁子' || content.substr(0, 3) == '铁子!') {
      let contactContent = content.replace('铁子!', '').replace('铁子', '');
      if (contactContent) {
        let res = await fetchEventStream(contactContent)
        await delay(500);
        await room.say(res);
      }
    }
    
  } else if (isText) {
    // 如果非群消息 目前只处理文字消息
    // console.log(`发消息人: ${alias} 消息内容: ${content}`);
    // if (content.substr(0, 1) == '?' || content.substr(0, 1) == '？') {
    //   let contactContent = content.replace('?', '').replace('？', '');
    //   if (contactContent) {
    //     let res = await superagent.getRubbishType(contactContent);
    //     await delay(2000);
    //     await contact.say(res);
      // }
    } else if (config.AUTOREPLY && config.AUTOREPLYPERSON.indexOf(alias) > -1) {
      // 如果开启自动聊天且已经指定了智能聊天的对象才开启机器人聊天\
      if (content) {
        let reply;
        if (config.DEFAULTBOT == '0') {
          // 天行聊天机器人逻辑
          reply = await superagent.getReply(content);
          console.log('天行机器人回复：', reply);
        } else if (config.DEFAULTBOT == '1') {
          // 图灵聊天机器人
          reply = await superagent.getTuLingReply(content);
          console.log('图灵机器人回复：', reply);
        } else if (config.DEFAULTBOT == '2') {
          // 天行对接的图灵聊
          reply = await superagent.getTXTLReply(content);
          console.log('天行对接的图灵机器人回复：', reply);
        }
        try {
          await delay(2000);
          await contact.say(reply);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}

// 间隔30s检查数据更新
async function initUpdateData(sec) {
  return new Promise((resolve, reject) => {
    // setTimeout(async () => {
      fetchData.fetchData().then(data =>{
        if (data) {
          if (JSON.stringify(lastData) !== JSON.stringify(data)) {
            lastData = data;
              // 发送消息
               console.log(`爬取到的新数据: ${JSON.stringify(data)}`);
               resolve(data);
          }
        }
      }).catch(e =>{
        console.error("爬取数据失败:",e);
        resolve(null);
      })
    // }, sec);
  })
}

// 创建微信每日说定时任务
// async function initDay() {
//   console.log(`已经设定每日说任务`);

//   schedule.setSchedule(config.SENDDATE, async () => {
//     console.log('你的贴心小助理开始工作啦！');
//     let logMsg;
//     let contact =
//       (await bot.Contact.find({ name: config.NICKNAME })) ||
//       (await bot.Contact.find({ alias: config.NAME })); // 获取你要发送的联系人
//     let one = await superagent.getOne(); //获取每日一句
//     let weather = await superagent.getTXweather(); //获取天气信息
//     let today = await untils.formatDate(new Date()); //获取今天的日期
//     let memorialDay = untils.getDay(config.MEMORIAL_DAY); //获取纪念日天数
//     let sweetWord = await superagent.getSweetWord();

//     // 你可以修改下面的 str 来自定义每日说的内容和格式
//     // PS: 如果需要插入 emoji(表情), 可访问 "https://getemoji.com/" 复制插入
//     let str = `${today}\n我们在一起的第${memorialDay}天\n\n元气满满的一天开始啦,要开心噢^_^\n\n今日天气\n${weather.weatherTips}\n${weather.todayWeather}\n每日一句:\n${one}\n\n每日土味情话：\n${sweetWord}\n\n————————最爱你的我`;
//     try {
//       logMsg = str;
//       await delay(2000);
//       await contact.say(str); // 发送消息
//     } catch (e) {
//       logMsg = e.message;
//     }
//     console.log(logMsg);
//   });
// }

const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  puppet: 'wechaty-puppet-wechat4u', // 如果有token，记得更换对应的puppet
})

bot.on('scan', onScan);
bot.on('login', onLogin);
bot.on('logout', onLogout);
bot.on('message', onMessage);

bot
  .start()
  .then(() => console.log('开始登陆微信'))
  .catch((e) => console.error(e));


   // 模拟一个错误
//  setTimeout(() => {
//   throw new Error('模拟的错误');
// }, 10000);

}

// 启动新的子进程
function startNewProcess() {
  const newProcess = fork(__filename, ['child']);

  newProcess.on('message', (msg) => {
      if (msg === 'uncaughtException') {
          setTimeout(() => {
            newProcess.kill();
        }, 5000);
          startNewProcess();
      }
  });

  newProcess.on('exit', (code, signal) => {
      console.log(`Process exited with code ${code} and signal ${signal}`);
  });

  return newProcess;
}



startApplication()
