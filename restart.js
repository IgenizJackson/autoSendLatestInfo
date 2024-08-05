const { spawn } = require('child_process');

console.log('正在重新启动应用...', new Date());

// 等待一段时间后重启应用
const child = spawn(process.argv[0], [path.resolve(__dirname, 'index.js')], {
    detached: true,
    stdio: 'inherit'
});

child.unref();

console.log('新进程已启动，进程 ID:', child.pid, new Date());