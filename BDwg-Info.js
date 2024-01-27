let args = getArgs();
let requestUrl = `https://api.64clouds.com/v1/getServiceInfo?veid=${args.veid}&api_key=${args.api_key}`;

$httpClient.get(requestUrl, function(error, response, data){
    // 解析 JSON 数据
    let jsonData = JSON.parse(data);

    // 获取所需的数据
    let ipAddresses = hideLastTwoDigits(jsonData.ip_addresses.join(', ')); // 隐藏IP地址的最后两个数字
    let nodeDatacenter = jsonData.node_datacenter;
    let os = jsonData.os;
    let plan = jsonData.plan;
    let planRam = bytesToSize(jsonData.plan_ram);
    let planDisk = bytesToSize(jsonData.plan_disk);
    let dataCounter = jsonData.data_counter * jsonData.monthly_data_multiplier;
    let dataNextReset = new Date(jsonData.data_next_reset * 1000);
    let planMonthlyData = jsonData.plan_monthly_data * jsonData.monthly_data_multiplier;

    // 格式化内容
    let content = [
        `IP: ${ipAddresses}`,
        `Dosage：${bytesToSize(dataCounter)} | ${bytesToSize(planMonthlyData)}`,
        `Resets：${dataNextReset.getFullYear()}年${dataNextReset.getMonth() + 1}月${dataNextReset.getDate()}日`,
        `Plan: ${plan}`,
        `IDC: ${nodeDatacenter}`,
        `OS: ${os}`,
        `Disk: ${planDisk}`,
        `RAM: ${planRam}`
    ];

    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    hour = hour > 9 ? hour : "0" + hour;
    minutes = minutes > 9 ? minutes : "0" + minutes;

    $done({
        title: `𝗕𝗮𝗻𝗱𝘄𝗮𝗴𝗼𝗻  𝑰𝒏𝒇𝒐  | 运行时间:  ${hour}:${minutes}`,
        content: content.join("\n"),
        icon: "aqi.medium",
        "icon-color": "#228B22",
    });
});

function getArgs() {
    return Object.fromEntries(
        $argument
            .split("&")
            .map((item) => item.split("="))
    );
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function hideLastTwoDigits(ip) {
    // 将IP地址分割成每个数字的数组
    let ipParts = ip.split('.');
    // 替换最后两个数字为"XX"
    ipParts[ipParts.length - 1] = "XX";
    ipParts[ipParts.length - 2] = "XX";
    // 重新组合IP地址
    return ipParts.join('.');
}
