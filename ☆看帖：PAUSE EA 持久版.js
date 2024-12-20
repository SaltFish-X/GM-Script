// ==UserScript==
// @name         看帖：PAUSE EA 持久版
// @namespace    https://www.gamemale.com/space-uid-687897.html
// @version      0.7.1
// @description  勋章触发奖励时停+发帖回帖奖励账本查询！
// @author       瓦尼
// @match        https://www.gamemale.com/*
// @match        https://www.gamemale.com/forum.php
// @grant        GM_registerMenuCommand
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @license      GPL
// ==/UserScript==

// 下载地址 https://greasyfork.org/zh-CN/scripts/517953-%E7%9C%8B%E5%B8%96-pause-ea-%E6%8C%81%E4%B9%85%E7%89%88
/**
 * 基于瓦尼开发的 勋章触发记录他来了-本地发回帖账本PAUSE https://www.gamemale.com/thread-136471-1-1.html
 * 基于星之子修改的 勋章触发记录 PAUSE(EA) 账本界面皮肤 https://www.gamemale.com/thread-145044-1-1.html
 * 新增回帖分区统计，避免超出回帖上限
 * 新增【开启提示框暂停】，0为关闭，1为开启
 */

// TODO 重构一下表格生成
(function () {
    'use strict';
    const 开启提示框暂停 = 1
    /////////////////////////快速设置////////////////////////////////

    // 抽卡音乐开关，值为0时关闭，值为1时开启
    //const gachaSound = 0;

    // 抽卡音乐链接
    // 崩铁抽卡音效 网抑云源
    //const gachaMusicUrl = 'https://music.163.com/song/media/outer/url?id=2034614721.mp3';
    //PAUSE EX-AID时停音效 使用Gimhoy音乐盘源 https://music.gimhoy.com/
    //const gachaMusicUrl = 'https://dlink.host/musics/aHR0cHM6Ly9vbmVkcnYtbXkuc2hhcmVwb2ludC5jb20vOnU6L2cvcGVyc29uYWwvc3Rvcl9vbmVkcnZfb25taWNyb3NvZnRfY29tL0VVR1R6WlZJeEhoSnBJNnpPclVRcXNBQkN4ZkkwNlh5M25sZmNkV2ZSVzBqc1E.mp3';

    // Firefox火狐浏览器失效保护设置，默认为0，使用firefox浏览器却无法打开账本，可以尝试将此项值设为1，其他浏览器请勿修改！
    const firefoxBrowser = 0;

    /////////////////////////快速设置部分结束///////////////////////

    // 使用的浏览器检测
    var brwoserType = "";
    const userAgent = navigator.userAgent;
    if ((userAgent.indexOf('Firefox') > -1) || firefoxBrowser) {
        brwoserType = "Firefox";
    } else if (userAgent.indexOf('Chrome') > -1) {
        brwoserType = "Chrome";
    } else {
        brwoserType = "Others";
    }

    // 播放抽卡音效的函数
    // 由于音效的缓存需要时间，触发暂停时可能无法及时播放
    function playSound(sound) {

        sound.addEventListener("canplaythrough", event => {
            console.log("获取成功，开始播放");
            sound.play();
        });

        return 0;
    }


    // 主要负责暂停和记录的主函数
    function pauseAndSave() {
        // 获取内容并暂停
        var creditElement = document.getElementById("creditpromptdiv");

        // 等待提示框加载/抽卡音乐加载
        if (开启提示框暂停) {
            setTimeout(function () {
                alert(creditElement.textContent);
            }, 500);
        }

        // 获取分区元素
        const area = (() => {
            const ele = document.querySelector("#pt > div");
            return ele ? ele.textContent.split('›').map(item => item.trim()).slice(-2, -1)[0] : undefined;
        })();        

        // 保存内容
        extractAndSave(creditElement, area);

        console.log("记录器工作中...");

        return 0;
    }

    // 持续监听页面，当目标节点发生变化时，调用检测函数
    function startObserve() {
        const targetNode = document.getElementById('append_parent');

        // 观察器配置
        const config = { attributes: false, childList: true, subtree: false };

        // 设置计数器，防止出现无限循环
        let changeCount = 0;
        let lastSuccessTime = new Date(0);

        // 当检测到变化时调用的回调函数
        const callback = function () {

            // 提前加载音效
            //if(gachaSound == 1){
            //console.log("正在获取音效....");
            //var sound = new Audio();
            //sound.src = gachaMusicUrl;
            //sound.load();
            //}

            // 如果检测到奖励内容再执行函数
            if (document.getElementById("creditpromptdiv")) {

                // 检查和上一次的间隔毫秒
                let curTime = new Date();
                let timeDiff = curTime.getTime() - lastSuccessTime.getTime();

                // 如果小于一定间隔则不执行
                if (timeDiff >= 10000) {

                    // 播放音效
                    //if(gachaSound == 1){
                    //playSound(sound);
                    //}

                    // 执行主函数
                    pauseAndSave();

                    // 计数器加一并更新最新时间
                    lastSuccessTime = curTime;
                    changeCount++;
                    console.log(`PAUSE账本第 ${changeCount} 次记录完成`);

                    // 如果变化次数达到一定次，断开观察！防止无限循环。
                    if (changeCount >= 10) {
                        console.log('达到设定的变更次数，停止观察。');
                        observer.disconnect();
                    }

                } else {
                    //alert("成功拦截重复记录");
                    console.log("成功拦截重复记录");
                }

            }

        };

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 开始观察目标节点
        observer.observe(targetNode, config);

        console.log("PAUSE账本正在运行中···");

        return 0;
    }

    startObserve();

    function extractAndSave(divElement, area) {
        let curTime = new Date();

        const result = {
            creditType: '',
            badgeActivated: '否',
            area: '',
            lvCheng: 0,
            jinBi: 0,
            xueYe: 0,
            zhuiSui: 0,
            zhouShu: 0,
            zhiShi: 0,
            lingHun: 0,
            duoLuo: 0,
            acquiredAt: curTime
        };

        const keyMap = {
            '旅程': 'lvCheng',
            '金币': 'jinBi',
            '血液': 'xueYe',
            '追随': 'zhuiSui',
            '咒术': 'zhouShu',
            '知识': 'zhiShi',
            '灵魂': 'lingHun',
            '堕落': 'duoLuo'
        };

        // 提取奖励类型
        const creditTypeNode = divElement.querySelector('i');
        console.log(creditTypeNode);
        var parts = creditTypeNode.textContent.trim().split(' ');

        // 出现以下关键词则代表第一个部分不是类型
        var keywords = ['金币', '血液', '咒术', '知识', '灵魂', '堕落', '旅程', '追随'];
        var reason = parts[0];

        // 检查原因是否包含关键词，如果包含则替换为"无"
        if (keywords.some(keyword => reason.includes(keyword))) {
            console.log("无奖励类型")
            reason = '无';
        }

        result.creditType = reason;
        result.area = area

        // 检查是否触发勋章
        if (creditTypeNode.textContent.includes('勋章功能触发')) {
            result.badgeActivated = '是';
        }

        // 提取积分变化
        const spans = divElement.querySelectorAll('span');
        spans.forEach(span => {
            const text = span.textContent;
            let match;
            if ((match = text.match(/(旅程|金币|血液|追随|咒术|知识|灵魂|堕落)\+(\d+)/))) {
                const key = keyMap[match[1]];
                result[key] = parseInt(match[2], 10);
            } else if ((match = text.match(/(旅程|金币|血液|追随|咒术|知识|灵魂|堕落)\-(\d+)/))) {
                const key = keyMap[match[1]];
                result[key] = -parseInt(match[2], 10);
            }
        });

        // 保存记录
        var historyArrayEx;
        if (localStorage.getItem("extractedCreditHistory")) {
            historyArrayEx = JSON.parse(localStorage.getItem("extractedCreditHistory"));
        } else {
            historyArrayEx = new Array();
        }

        historyArrayEx.push(result);
        console.log(result);
        localStorage.setItem('extractedCreditHistory', JSON.stringify(historyArrayEx));

        return 0;
    }

    //////以下是菜单部分/////////


    // 在新窗口通过调整样式来显示消息
    // alert弹窗只会在原窗口弹出，不容易注意到，因此需通过此方法提示
    function showMsg(msgID, pageContent) {
        var targetMsg = pageContent.getElementById(msgID);

        // 确保元素存在
        if (targetMsg) {
            // 显示元素
            targetMsg.style.display = 'block';

            // 设置5秒后隐藏元素
            setTimeout(function () {
                targetMsg.style.display = 'none';
            }, 5000);
        } else {
            console.error('无法找到ID为' + msgID + '的元素');
        }
    }

    // 重新生成右侧表格，并将结果返回
    function generateRightHTML() {
        //重新获取记录
        var creditHistoryStr = localStorage.getItem('extractedCreditHistory');
        var creditHistory = JSON.parse(creditHistoryStr);

        //创建记录表格
        var tableHTML = '';

        // 构建表格的HTML字符串
        tableHTML += '<table border="1"><thead><tr><th>行号</th><th>奖励类型</th><th>是否触发</th><th>分区</th><th>旅程</th><th>金币</th><th>血液</th><th>咒术</th><th>知识</th><th>灵魂</th><th>堕落</th><th>时间</th></tr></thead><tbody>';

        //创建行号
        var rowNumber = 1;
        var tempLvCheng = 0;
        var temmpJinBi = 0;
        var tempXueYe = 0;
        var tempZhouShu = 0;
        var tempZhiShi = 0;
        var tempLingHun = 0;
        var tempDuoLuo = 0;

        const checkCreditHistory = []
        if (creditHistory) {
            creditHistory.forEach(function (item) {
                //检查过滤条件，不满足条件的item，返回true跳过执行
                if (checkItem(item)) {
                    return;
                }
                checkCreditHistory.push(item)

                // 解析ISO 8601时间字符串为UTC时间，然后转为本地时间
                var date = new Date(item.acquiredAt);

                // 格式化日期和时间
                var formattedDateTime = date.getFullYear() + '-' +
                    ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
                    ('0' + date.getDate()).slice(-2) + ' ' +
                    ('0' + date.getHours()).slice(-2) + ':' +
                    ('0' + date.getMinutes()).slice(-2) + ':' +
                    ('0' + date.getSeconds()).slice(-2);

                tableHTML +=
                    `<tr><td>${rowNumber++}</td>
                        <td>${item.creditType}</td>
                        <td>${item.badgeActivated}</td>
                        <td>${item.area || '暂无数据'}</td>
                        <td>${item.lvCheng}</td>
                        <td>${item.jinBi}</td>
                        <td>${item.xueYe}</td>
                        <td>${item.zhouShu}</td>
                        <td>${item.zhiShi}</td>
                        <td>${item.lingHun}</td>
                        <td>${item.duoLuo}</td>
                        <td>${formattedDateTime}</td></tr>`;

                tempLvCheng += item.lvCheng;
                temmpJinBi += item.jinBi;
                tempXueYe += item.xueYe;
                tempZhouShu += item.zhouShu;
                tempZhiShi += item.zhiShi;
                tempLingHun += item.lingHun;
                tempDuoLuo += item.duoLuo;

            });
        }
        tableHTML += '</tbody></table>';

        var summaryTableHTML = ''
        summaryTableHTML += '<table id="summaryTable" border="1"><thead><tr><th>行数</th><th>旅程</th><th>金币</th><th>血液</th><th>咒术</th><th>知识</th><th>灵魂</th><th>堕落</th></thead><tbody>';
        summaryTableHTML +=
            `<tr><td>${--rowNumber}</td>
                        <td>${tempLvCheng}</td>
                        <td>${temmpJinBi}</td>
                        <td>${tempXueYe}</td>
                        <td>${tempZhouShu}</td>
                        <td>${tempZhiShi}</td>
                        <td>${tempLingHun}</td>
                        <td>${tempDuoLuo}</td></tr>`;

        // 计算分区 并 生成回帖数表格
        const areaNum = getAreaNum(checkCreditHistory)
        const areaTable = generateAreaTable(areaNum)
        console.log(areaNum);

        // 整合页面HTML
        var rightHTML = '<h3>当前记录汇总</h3>' + summaryTableHTML + areaTable + tableHTML;

        return rightHTML;
    }

    // 根据设置检查功能
    function checkItem(item) {
        var showItem = false;
        var catCheck = false;
        var daysCheck = false;

        var settings;
        if (localStorage.getItem("filterSettings")) {
            settings = JSON.parse(localStorage.getItem("filterSettings"));
        } else {
            settings = {
                showHuiTie: true,
                showFaTie: true,
                showQiTa: false,
                days: 1
            };
            localStorage.setItem('filterSettings', JSON.stringify(settings));
        }

        //检查类型
        if (settings.showHuiTie) {
            catCheck = ((catCheck) || (item.creditType == "发表回复"));
        }
        if (settings.showFaTie) {
            catCheck = ((catCheck) || (item.creditType == "发表主题"));
        }
        if (settings.showQiTa) {
            catCheck = ((catCheck) || ((item.creditType != "发表主题") && (item.creditType != "发表回复")));
        }

        // 检查时间
        if (settings.days != 0) {
            // 转换格式
            var curDate = new Date();
            curDate.setHours(0, 0, 0, 0);
            //console.log(curDate);
            var recordDate = new Date(item.acquiredAt);
            recordDate.setHours(0, 0, 0, 0);
            //console.log(recordDate);

            // 获取目标日期
            var targetDate = new Date(curDate.setDate(curDate.getDate() - settings.days + 1));
            targetDate.setHours(0, 0, 0, 0);
            //console.log(targetDate);

            // 记录日期大于等于目标日期则显示，小于则返回跳过
            if (recordDate.getTime() >= targetDate.getTime()) {
                daysCheck = true;
            }
        } else {
            daysCheck = true;
        }

        //类型筛选和时间筛选同时满足才显示
        showItem = daysCheck && catCheck;

        return !showItem;
    }

    /////////////////脚本菜单主部分//////////////

    //创建查看数据菜单
    GM_registerMenuCommand('查看账本', () => {
        // 创建一个隐藏的iframe
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        // 读取localStorage中的creditHistory数据
        var creditHistoryStr = localStorage.getItem('extractedCreditHistory');
        try {
            // 解析JSON字符串为对象数组
            var creditHistory = JSON.parse(creditHistoryStr);

            //创建功能区
            var fixedHTML = '<div id="fixedBox"><h3>记录工具箱</h3>';

            //创建记录存档操作区
            var toolHTML = '<div id="toolBox">';

            // 添加导出按钮
            toolHTML += '<button id="exportBtn">导出本地记录为.txt</button>';

            // 添加导入按钮和文件输入框
            toolHTML += '<input type="file" id="importFile" accept=".txt" style="display:none;">';
            toolHTML += '<button id="importBtn">从.txt导入本地记录</button>';

            // 添加删除按钮
            toolHTML += '<button id="deleteBtn">删除所有本地记录</button>';

            //提示信息
            toolHTML += '<p id="exportNull" style="display: none;">没有数据可以导出。</p>'
            toolHTML += '<p id="importSuccess" style="display: none;">导入成功！</p>'
            toolHTML += '<p id="importFail" style="display: none;">导入失败，文件内容不是有效的JSON数组。</p>'
            toolHTML += '<p id="importError" style="display: none;">导入失败，无法解析文件内容,请前往主页面弹窗查看原因。</p>'
            toolHTML += '<div id="customConfirmModal" style="display: none;"><p>确定要删除所有本地积分记录吗？此操作不可逆！</p><div class="buttonContainer"><button id="confirmYes">确定</button><button id="confirmNo">取消</button></div></div>';
            toolHTML += '<p id="deleteSuccess" style="display: none;">已删除所有记录</p>';

            toolHTML += '</div>';

            //创建右侧记录筛选区
            var filterHTML = '<div id="toolBox"><h3>筛选记录</h3>';

            filterHTML += `
                <fieldset>
                <legend>奖励类型</legend>
                  <div>
                  <input type="checkbox" id="showHuiTie" name="showHuiTie" checked />
                  <label for="showHuiTie">回帖奖励</label>
                  </div>
                  <div>
                  <input type="checkbox" id="showFaTie" name="showFaTie" checked />
                  <label for="showFaTie">发帖奖励</label>
                  </div>
                  <div>
                  <input type="checkbox" id="showQiTa" name="showQiTa" checked />
                  <label for="showQiTa">其他奖励</label>
                  </div>
                </fieldset>

                <fieldset>
                <legend>时间范围</legend>
                <input type="radio" id="option1" name="timeRange" value="1">
                    <label for="option1">当天</label><br>

                <input type="radio" id="option2" name="timeRange" value="custom" checked>
                <label for="option2">自定义  <input type="number" min="0" id="customDays" value="0"></label><br>
                <small>(N:过去N天内 1:当天 0:全部)</small>
                </fieldset>

                `;

            filterHTML += '</div>'

            //将左侧的模块都塞进fixed部分
            fixedHTML += toolHTML;
            fixedHTML += filterHTML;

            fixedHTML += '</div>';

            //最后塞入用于显示/隐藏的按钮
            fixedHTML += '<button id="toggleToolBoxBtn"></button>'

            //通过函数生成右侧表格内容（方便后期更新表格）
            var rightHTML = '<div id="tableBox">' + generateRightHTML() + '</div>';

            //总结构
            var overallHTML = '<div class="container">' + fixedHTML + rightHTML + '</div>';

            // 插入到新窗口的文档中
            iframe.contentDocument.body.innerHTML += overallHTML;

            //////////////////// 添加css/////////////////////////
            // 获取IFrame的内容文档对象
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // 创建一个新的<style>元素
            var styleTag = iframeDoc.createElement('style');

            // 定义CSS样式内容
            var styles = `
                #fixedBox {
                    position: fixed;
                    width: auto;
                    height: 96vh;
                    background: #eeeeee;
                    float: left;
                    min-width: 100px;
                    overflow-y: auto;
                    border-radius: 8px;
                    font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
                }

                .container {
                    display: flex;
                }

                #toolBox {
                    padding: 10px;
                }

                #exportBtn,
                #importBtn {
                    margin: 6px auto 20px;
                }

                #deleteBtn {
                    margin: auto;
                }

                #exportBtn,
                #importBtn,
                #deleteBtn {
                    display: block;
                    background-color: transparent;
                    border: 2px solid #1A1A1A;
                    border-radius: 0.6em;
                    color: #3B3B3B;
                    font-weight: 600;
                    font-size: 14.4px;
                    padding: 0.4em 1.2em;
                    text-align: center;
                    text-decoration: none;
                    transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
                    font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
                }

                #exportBtn:hover,
                #importBtn:hover,
                #deleteBtn:hover {
                    color: #fff;
                    background-color: #1A1A1A;
                    box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
                    transform: translateY(-2px);
                }

                #exportBtn:active,
                #importBtn:active,
                #deleteBtn:active {
                    box-shadow: none;
                    transform: translateY(0);
                }

                h3 {
                    display: block;
                    text-align: center;
                    font-size: 2em;
                    margin: 36px auto 12px;
                }

                #customConfirmModal {
                    border-style: solid;
                    border-width: 3px;
                    border-color: red;
                }

                #customConfirmModal p {
                    color: red;
                    margin: 20px;
                }

                #confirmYes {
                    margin: 0 20% 20px 20%;
                }

                #customDays {
                    width: 4em;
                    font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
                    border-radius: 6px;
                    border: 1px solid #333;
                }

                #tableBox {
                    width: 80%;
                    float: right;
                    margin-left: 20%;
                }

                #tableBox table {
                    margin: 20px auto 40px auto;
                    border: 2px solid #333;
                    border-radius: 6px;
                    border-spacing: 0;
                    overflow: hidden;
                }

                th,
                td {
                    padding: 4px 8px;
                    text-align: center;
                    transition: all 0.2s;
                    border: none;
                }

                th {background-color: #f2f2f2;}
                tr:nth-child(even) {background-color: #f2f2f2; transition: all 0.2s;}
                tr:hover {background-color: #d3d3d3; transition: all 0.2s;}

                #toggleToolBoxBtn {
                    position: fixed;
                    width: 16px;
                    height: 16px;
                    margin-top: 8px;
                    margin-left: 8px;
                    z-index: 1000;
                    border: 1px solid #333;
                    padding: 4px;
                    border-radius: 50%;
                }

                fieldset {
                  border: 2px solid #333; /* 设置边框 */
                  padding: 8px 12px 16px 12px; /* 设置内边距 */
                  margin: 20px 10px; /* 设置外边距 */
                  background-color: #f9f9f9; /* 设置背景颜色 */
                  border-radius: 6px; /* 设置圆角 */
                }

                legend {
                  font-weight: bold; /* 设置字体加粗 */
                  color: #000; /* 设置字体颜色 */
                }

                label {
                  font-size:14.4px;
                }
                `;


            // 将样式内容赋值给<style>元素的textContent属性
            styleTag.textContent = styles;

            // 将<style>元素添加到IFrame的<head>中
            var head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0];
            head.appendChild(styleTag);

            //////////////添加网页标题////////////////
            var titleElement = document.createElement('title');
            titleElement.innerText = 'PAUSE账本';

            head.appendChild(titleElement);

            ////////////根据浏览器类型选择是否更改iframe的src属性////////
            if (brwoserType == "Firefox") {
                iframe.src = "PAUSE";
                console.log("检测到使用Firefox浏览器，已为iframe添加src属性");
            }

        } catch (e) {
            console.error('解析localStorage中的creditHistory失败:', e);
            // 如果解析失败，可以在这里处理错误，比如显示一个错误消息
            iframe.contentDocument.body.textContent = '数据加载失败，请检查浏览器的localStorage设置。';
        }

        // 将iframe的内容复制到新窗口
        var newWindow = window.open('', '_blank');
        newWindow.document.replaceChild(
            newWindow.document.importNode(iframe.contentDocument.documentElement, true),
            newWindow.document.documentElement
        );

        //根据存储数据初始化界面
        if (localStorage.getItem('filterSettings')) {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
            newWindow.document.getElementById('showHuiTie').checked = filterSettings.showHuiTie;
            newWindow.document.getElementById('showFaTie').checked = filterSettings.showFaTie;
            newWindow.document.getElementById('showQiTa').checked = filterSettings.showQiTa;
            newWindow.document.getElementById('option2').checked = true;
            newWindow.document.getElementById('customDays').value = filterSettings.days;
            console.log("初始化界面完成！");
        }

        // 显示/隐藏工具箱
        // 名为toolBox 实际上是对外层fixedBox进行操作
        newWindow.document.getElementById('toggleToolBoxBtn').addEventListener('click', function () {
            var toolBox = newWindow.document.getElementById('fixedBox');
            if (toolBox.style.display === 'none') {
                toolBox.style.display = 'block';
            } else {
                toolBox.style.display = 'none';
            }
        });

        // 导出数据
        // 给exportBtn添加点击事件监听器
        newWindow.document.getElementById('exportBtn').addEventListener('click', function () {
            var creditHistoryStr = localStorage.getItem('extractedCreditHistory');
            if (creditHistoryStr) {
                var blob = new Blob([creditHistoryStr], { type: 'text/plain;charset=utf-8' });
                var url = URL.createObjectURL(blob);
                var link = document.createElement('a');
                link.href = url;
                link.download = 'extractedCreditHistory.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                //alert('没有数据可以导出。');
                showMsg("exportNull", newWindow.document);
            }
        });


        // 导入数据
        // 绑定导入按钮的点击事件，触发文件选择对话框
        newWindow.document.getElementById('importBtn').addEventListener('click', function () {
            newWindow.document.getElementById('importFile').click();
        });
        // 绑定文件输入框的change事件，处理文件读取
        newWindow.document.getElementById('importFile').addEventListener('change', function (e) {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function (e) {
                var content = e.target.result;
                try {
                    var parsedData = JSON.parse(content);
                    if (Array.isArray(parsedData)) {
                        localStorage.setItem('extractedCreditHistory', JSON.stringify(parsedData));
                        showMsg("importSuccess", newWindow.document);
                    } else {
                        //alert('导入失败，文件内容不是有效的JSON数组。');
                        showMsg("importFail", newWindow.document);
                    }
                } catch (error) {
                    alert('导入失败，无法解析文件内容: ' + error);
                    showMsg("importError", newWindow.document);
                }
            };
            reader.readAsText(file);
        });

        // 删除数据
        // 绑定删除按钮的点击事件
        newWindow.document.getElementById('deleteBtn').addEventListener('click', function () {
            var customConfirmModal = newWindow.document.getElementById('customConfirmModal');

            // 如果已经显示了，再次点击则隐藏提示框
            if (customConfirmModal.style.display == 'block') {
                customConfirmModal.style.display = 'none';
            } else {
                customConfirmModal.style.display = 'block';
            }

            // 绑定自定义对话框内的确认和取消按钮事件
            newWindow.document.getElementById('confirmYes').addEventListener('click', function () {
                customConfirmModal.style.display = 'none';
                localStorage.removeItem('extractedCreditHistory');
                localStorage.removeItem('filterSettings');
                showMsg("deleteSuccess", newWindow.document);
            });

            newWindow.document.getElementById('confirmNo').addEventListener('click', function () {
                customConfirmModal.style.display = 'none';
            });
        });

        // 奖励类型
        newWindow.document.getElementById('showHuiTie').addEventListener('change', function () {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
            filterSettings.showHuiTie = this.checked;
            localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
            newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
            console.log("已更改奖励类型筛选条件");
        });

        newWindow.document.getElementById('showFaTie').addEventListener('change', function () {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
            filterSettings.showFaTie = this.checked;
            localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
            newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
            console.log("已更改奖励类型筛选条件");
        });

        newWindow.document.getElementById('showQiTa').addEventListener('change', function () {
            var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
            filterSettings.showQiTa = this.checked;
            localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
            newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
            console.log("已更改奖励类型筛选条件");
        });

        // 天数筛选
        newWindow.document.getElementById('option1').addEventListener('click', function () {
            if (this.checked) {
                var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
                filterSettings.days = 1;
                localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
                newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
                console.log("已更改时间范围条件");
            }
        });

        newWindow.document.getElementById('option2').addEventListener('click', function () {
            if (this.checked) {
                var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
                filterSettings.days = newWindow.document.getElementById('customDays').value;
                localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
                newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
                console.log("已更改时间范围条件");
            }
        });

        newWindow.document.getElementById('customDays').addEventListener('change', function () {
            var option2 = newWindow.document.getElementById('option2');
            if (newWindow.document.getElementById('option2').checked) {
                var filterSettings = JSON.parse(localStorage.getItem('filterSettings'));
                filterSettings.days = this.value;
                localStorage.setItem('filterSettings', JSON.stringify(filterSettings));
                newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
                console.log("已更改时间范围条件");
            }
        });

        // 重置筛选
        // newWindow.document.getElementById('showAllBtn').addEventListener('click', function () {
        //     var defaultSettings = {
        //         showHuiTie: true,
        //         showFaTie: true,
        //         showQiTa: true,
        //         days: 0
        //     };
        //     newWindow.document.getElementById('showHuiTie').checked = defaultSettings.showHuiTie;
        //     newWindow.document.getElementById('showFaTie').checked = defaultSettings.showFaTie;
        //     newWindow.document.getElementById('showQiTa').checked = defaultSettings.showQiTa;
        //     newWindow.document.getElementById('option2').checked = true;
        //     newWindow.document.getElementById('customDays').value = defaultSettings.days;
        //     localStorage.setItem('filterSettings', JSON.stringify(defaultSettings));
        //     newWindow.document.getElementById('tableBox').innerHTML = generateRightHTML();
        //     console.log("已重置筛选条件");
        // });

        // 清理创建的iframe
        document.body.removeChild(iframe);
    });

    // 计算分区回帖数
    function getAreaNum(historyArray) {
        let result = { 'C G A I': 0, '生活爆照': 0, '和谐动漫': 0, '汉化游戏': 0, '和谐游戏': 0, }
        historyArray.forEach(e => {
            if (e.area) {
                if (!result[e.area]) {
                    result[e.area] = 1
                } else {
                    result[e.area] += 1
                }

            }
        })
        return result
    }

    function generateAreaTable(data) {
        let tableHTML = '<table>';

        // 添加表头
        tableHTML += '<thead><tr>';
        tableHTML += '<th></th>'; // 空白单元格
        for (const key in data) {
            tableHTML += `<th>${key}</th>`;
        }
        tableHTML += '</tr></thead>';

        // 添加表体
        tableHTML += '<tbody><tr>';
        tableHTML += '<td>回帖数</td>'; // 标签单元格
        for (const key in data) {
            tableHTML += `<td>${data[key]}</td>`;
        }
        tableHTML += '</tr></tbody>';

        tableHTML += '</table>';

        return tableHTML;
    }
})();