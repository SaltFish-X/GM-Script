// ==UserScript==
// @name         二手市场大宝剑布丁 特效版
// @namespace    https://www.gamemale.com/space-uid-687897.html
// @supportURL   https://www.gamemale.com/thread-136247-1-1.html
// @version      0.28
// @description  删除所有非寄售交易类的记录，并且直接显示页面内勋章的寄售价格和寄售用户！脚本可能会造成卡顿，如需抢购请关闭此脚本！
// @author       瓦尼
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=showjishou
// @icon         https://img.gamemale.com/album/201405/01/175008icuedsbvi0btdc7c.gif
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////快速设置////////////////////////////////

    // 是否逆序显示，值为0时关闭，显示顺序为正序，越新的寄售越靠后，值为1时开启，倒序，越新的寄售越靠前，默认开启。
    const reverseOn = 1;

    // 折扣显示动画，值为0时关闭，值为1时开启，默认开启
    const animationOn = 1;

    // 最低价格提示，值为0时关闭，值为1时开启，默认开启
    const lowPriceReminder = 1;

    // 动画调整设置

    // 动画时长设置（所有折扣力度）,默认为'2s',s为秒即默认时长为2秒
    const animationTime = '2s';

    // 低于最高寄售价的物品动画设置
    // 动画开关，值为0时关闭，值为1时开启，默认开启
    const primaryAnimationOn = 1;
    // 动画颜色，请填写对应颜色的hex代码，默认 '#66ddf7'
    const primaryColor = '#66ddf7';
    // 动画拖尾长度占比，默认'25%'
    const primaryPercentage = '25%';

    // 小于等于原价的物品动画设置
    // 动画开关，值为0时关闭，值为1时开启，默认开启
    const greenAnimationOn = 1;
    // 动画颜色，请填写对应颜色的hex代码，默认'#00ff88'
    const greenColor = '#00ff88';
    // 动画拖尾长度占比，默认'75%'
    const greenPercentage = '75%';


    // 小于等于原价50%的物品动画设置
    // 动画开关，值为0时关闭，值为1时开启，默认开启
    const redAnimationOn = 1;
    // 动画颜色，请填写对应颜色的hex代码，默认 '#fc466b'
    const redColor = '#fc466b';
    // 动画拖尾长度占比，默认'75%'
    const redPercentage = '75%';

    /////////////////////////快速设置部分结束///////////////////////

    // 快速设置赋值
    document.documentElement.style.setProperty('--animation-time', animationTime);

    if( primaryAnimationOn ){
        document.documentElement.style.setProperty('--color', primaryColor);
        document.documentElement.style.setProperty('--shiny-percentage', primaryPercentage);
    }else{
        document.documentElement.style.setProperty('--color', '#fff');
    }

    if( greenAnimationOn ){
        document.documentElement.style.setProperty('--green-color', greenColor);
        document.documentElement.style.setProperty('--green-percentage', greenPercentage);
    }else{
        document.documentElement.style.setProperty('--green-color', '#fff');
    }

    if( redAnimationOn ){
        document.documentElement.style.setProperty('--red-color', redColor);
        document.documentElement.style.setProperty('--red-percentage', redPercentage);
    }else{
        document.documentElement.style.setProperty('--red-color', '#fff');
    }


    // u老师提供的勋章价格数据，特此鸣谢！
    // u老师的空间: https://www.gamemale.com/space-uid-714849.html
    // 已将数据转换为JSON格式
    /* 插入位置 */
    var badgePriceJson = {
        "香蕉特饮": { "currency": "", "amount": 0 },
        "纯真护剑㊕": { "currency": "金币", "amount": 100 },
        "爬行植物Ⓛ": { "currency": "金币", "amount": 10 },
        "爬行植物Ⓡ": { "currency": "金币", "amount": 10 },
        "特殊-家园卫士Ⓛ": { "currency": "金币", "amount": 5 },
        "特殊-家园卫士Ⓡ": { "currency": "金币", "amount": 5 },
        "勋章空位插槽": { "currency": "金币", "amount": 10 },
        "16x43 隐形➀": { "currency": "金币", "amount": 10 },
        "16x43 隐形➁": { "currency": "金币", "amount": 10 },
        "20x43 隐形➀": { "currency": "金币", "amount": 10 },
        "20x43 隐形➁": { "currency": "金币", "amount": 10 },
        "40x43 隐形➀": { "currency": "金币", "amount": 10 },
        "40x43 隐形➁": { "currency": "金币", "amount": 10 },
        "82x43 隐形➀": { "currency": "金币", "amount": 10 },
        "82x43 隐形➁": { "currency": "金币", "amount": 10 },
        "124x43 隐形➀": { "currency": "金币", "amount": 10 },
        "124x43 隐形➁": { "currency": "金币", "amount": 10 },
        "装饰触手Ⓛ": { "currency": "金币", "amount": 10 },
        "装饰触手Ⓡ": { "currency": "金币", "amount": 10 },
        "『活动代币』": { "currency": "金币", "amount": 1 },
        "(人)血球蛋白": { "currency": "金币", "amount": 0 },
        "小型流动血瓶": { "currency": "血液", "amount": 100 },
        "中型储蓄血瓶": { "currency": "血液", "amount": 1000 },
        "大型贮藏血瓶": { "currency": "血液", "amount": 10000 },
        "『酒馆蛋煲』": { "currency": "金币", "amount": 10 },
        "格雷的扑克牌": { "currency": "金币", "amount": 13 },
        "？？？粽子": { "currency": "金币", "amount": 0 },
        "『转生经筒』": { "currency": "旅程", "amount": 1 },
        "『绿茵甘露』": { "currency": "金币", "amount": 1 },
        "GM马年红包": { "currency": "金币", "amount": 1 },
        "粉色大厨": { "currency": "金币", "amount": 0 },
        "超能留声机": { "currency": "金币", "amount": 0 },
        "雾港捞月": { "currency": "金币", "amount": 0 },
        "霉运小精灵[红]": { "currency": "金币", "amount": 0 },
        "游侠职业证书": { "currency": "金币", "amount": 999 },
        "法师职业证书": { "currency": "金币", "amount": 999 },
        "战士职业证书": { "currency": "金币", "amount": 999 },
        "GM夏日霜淇淋": { "currency": "金币", "amount": 25 },
        "炉石传说": { "currency": "金币", "amount": 100 },
        "童年的蛋": { "currency": "金币", "amount": 520 },
        "星莹水晶": { "currency": "金币", "amount": 500 },
        "辉光心相元石": { "currency": "金币", "amount": 500 },
        "捕梦笼": { "currency": "金币", "amount": 345 },
        "暗蚀魔典": { "currency": "血液", "amount": 666 },
        "玄甲金盾": { "currency": "金币", "amount": 300 },
        "腐坏之剑": { "currency": "金币", "amount": 1000 },
        "斯科特·温德尔": { "currency": "金币", "amount": 400 },
        "凯文·沃克": { "currency": "金币", "amount": 400 },
        "荒漠屠夫": { "currency": "金币", "amount": 520 },
        "『领甜甜圈』": { "currency": "旅程", "amount": 0 },
        "紫粹露饮": { "currency": "金币", "amount": 0 },
        "瑰香蜜露": { "currency": "金币", "amount": 0 },
        "全息投影蛋": { "currency": "金币", "amount": 500 },
        "酸涩葡萄": { "currency": "金币", "amount": 450 },
        "破碎方舟": { "currency": "金币", "amount": 500 },
        "一袋粉末": { "currency": "金币", "amount": 1000 },
        "龙衔金戒": { "currency": "金币", "amount": 300 },
        "凤环金佩": { "currency": "金币", "amount": 300 },
        "调香师": { "currency": "金币", "amount": 588 },
        "哈尔辛": { "currency": "金币", "amount": 888 },
        "揄人者冠冕": { "currency": "金币", "amount": 0 },
        "不拘一格": { "currency": "金币", "amount": 0 },
        "『宝莲灯』": { "currency": "堕落", "amount": 1 },
        "火玛瑙": { "currency": "金币", "amount": 0 },
        "飘飘": { "currency": "金币", "amount": 15 },
        "青苹果": { "currency": "金币", "amount": 25 },
        "生命赞歌": { "currency": "金币", "amount": 0 },
        "呓语魔典": { "currency": "金币", "amount": 233 },
        "骷髅项链": { "currency": "金币", "amount": 250 },
        "光辉女郎": { "currency": "血液", "amount": 1350 },
        "琴瑟仙女": { "currency": "金币", "amount": 300 },
        "威尔·格雷厄姆": { "currency": "金币", "amount": 664 },
        "果体蝙蝠侠": { "currency": "血液", "amount": 365 },
        "塞拉斯": { "currency": "金币", "amount": 500 },
        "鲁纳尔": { "currency": "金币", "amount": 600 },
        "爱心的蛋": { "currency": "金币", "amount": 401 },
        "行走的蛋": { "currency": "金币", "amount": 250 },
        "远行藤蔓": { "currency": "金币", "amount": 300 },
        "学徒手册": { "currency": "金币", "amount": 300 },
        "位面引航器": { "currency": "金币", "amount": 300 },
        "跨越边际的旅途": { "currency": "金币", "amount": 1888 },
        "被冰封的靴子": { "currency": "金币", "amount": 500 },
        "被冰封的板甲": { "currency": "金币", "amount": 500 },
        "狮冠龙眸 林烈": { "currency": "金币", "amount": 600 },
        "光明奇幻木偶": { "currency": "金币", "amount": 0 },
        "『天圆地方』": { "currency": "金币", "amount": 0 },
        "未知纸盒": { "currency": "金币", "amount": 0 },
        "『炫目的铁塔』": { "currency": "金币", "amount": 0 },
        "适当显灵": { "currency": "金币", "amount": 0 },
        "救命饮料": { "currency": "金币", "amount": 0 },
        "艾尔登法环": { "currency": "金币", "amount": 100 },
        "图书馆金蛋": { "currency": "金币", "amount": 666 },
        "无限魔典": { "currency": "金币", "amount": 500 },
        "基础维修工具": { "currency": "金币", "amount": 120 },
        "被冰封的头盔": { "currency": "金币", "amount": 400 },
        "大侦探皮卡丘": { "currency": "金币", "amount": 300 },
        "高桥剑痴": { "currency": "金币", "amount": 700 },
        "本・比格": { "currency": "金币", "amount": 666 },
        "傲之追猎者·雷恩加尔": { "currency": "金币", "amount": 680 },
        "河豚寿司": { "currency": "金币", "amount": 0 },
        "荧光水母": { "currency": "金币", "amount": 0 },
        "发条八音盒": { "currency": "金币", "amount": 0 },
        "弗雷迪玩偶": { "currency": "金币", "amount": 0 },
        "桂花米糕": { "currency": "金币", "amount": 0 },
        "双生蛋": { "currency": "金币", "amount": 377 },
        "末影珍珠": { "currency": "金币", "amount": 256 },
        "辉夜姬的五难题": { "currency": "金币", "amount": 500 },
        "千年积木": { "currency": "金币", "amount": 200 },
        "枯木法杖": { "currency": "金币", "amount": 500 },
        "黑暗封印": { "currency": "金币", "amount": 350 },
        "Honey B Lovely": { "currency": "金币", "amount": 520 },
        "琴.葛蕾": { "currency": "金币", "amount": 500 },
        "基努·里维斯": { "currency": "金币", "amount": 666 },
        "炽焰咆哮虎": { "currency": "金币", "amount": 500 },
        "“半狼”布莱泽": { "currency": "金币", "amount": 496 },
        "灯载情绵": { "currency": "金币", "amount": 0 },
        "命运的轮廓": { "currency": "金币", "amount": 0 },
        "检定场": { "currency": "金币", "amount": 0 },
        "传说中的黑龙": { "currency": "金币", "amount": 0 },
        "呆猫": { "currency": "金币", "amount": 0 },
        "鎏彩万幢": { "currency": "金币", "amount": 0 },
        "『狄文卡德的残羽』": { "currency": "堕落", "amount": 1 },
        "女巫之路": { "currency": "金币", "amount": 100 },
        "黑暗之魂系列": { "currency": "金币", "amount": 100 },
        "尼特公仔": { "currency": "金币", "amount": 188 },
        "莉莉娅·考尔德（Lilia Calderu）": { "currency": "金币", "amount": 777 },
        "红夫人": { "currency": "金币", "amount": 688 },
        "亨利.卡维尔": { "currency": "金币", "amount": 500 },
        "牛局长博戈": { "currency": "金币", "amount": 200 },
        "约翰·康斯坦丁": { "currency": "金币", "amount": 450 },
        "巴哈姆特": { "currency": "金币", "amount": 700 },
        "『厢庭望远』": { "currency": "金币", "amount": 0 },
        "『林中过夜』": { "currency": "旅程", "amount": 1 },
        "『凯旋诺书』": { "currency": "金币", "amount": 0 },
        "猫头鹰守卫": { "currency": "金币", "amount": 0 },
        "黑神话:悟空": { "currency": "金币", "amount": 100 },
        "弯钩与连枷": { "currency": "金币", "amount": 330 },
        "圣水瓶": { "currency": "金币", "amount": 999 },
        "阿加莎·哈克尼斯": { "currency": "金币", "amount": 400 },
        "狗狗": { "currency": "金币", "amount": 300 },
        "穿靴子的猫": { "currency": "金币", "amount": 666 },
        "John Reese": { "currency": "金币", "amount": 1000 },
        "灵魂残絮聚合法": { "currency": "金币", "amount": 0 },
        "肉乖乖": { "currency": "金币", "amount": 0 },
        "猫咪点唱机㊊": { "currency": "金币", "amount": 0 },
        "『道具超市』": { "currency": "旅程", "amount": 1 },
        "神奇宝贝图鉴": { "currency": "金币", "amount": 0 },
        "神奇宝贝大师球": { "currency": "金币", "amount": 0 },
        "永亘环": { "currency": "金币", "amount": 0 },
        "『搓粉团珠』": { "currency": "金币", "amount": 15 },
        "小狮欢舞": { "currency": "金币", "amount": 15 },
        "脏兮兮的蛋": { "currency": "金币", "amount": 404 },
        "健忘礼物盒": { "currency": "金币", "amount": 123 },
        "婚姻登记册": { "currency": "金币", "amount": 52 },
        "神秘天球": { "currency": "金币", "amount": 650 },
        "普通羊毛球": { "currency": "金币", "amount": 200 },
        "贝儿(Belle)": { "currency": "金币", "amount": 666 },
        "梅琳娜Melina": { "currency": "血液", "amount": 999 },
        "汉尼拔": { "currency": "金币", "amount": 650 },
        "【新春限定】果体 隆": { "currency": "金币", "amount": 555 },
        "『冰雕马拉橇』": { "currency": "金币", "amount": 0 },
        "银色溜冰鞋": { "currency": "金币", "amount": 0 },
        "都市：天际线2": { "currency": "金币", "amount": 100 },
        "羽毛胸针": { "currency": "金币", "amount": 149 },
        "圣诞有铃": { "currency": "金币", "amount": 100 },
        "阿丽塔": { "currency": "金币", "amount": 700 },
        "托比·马奎尔": { "currency": "金币", "amount": 800 },
        "奇异博士": { "currency": "金币", "amount": 700 },
        "古烈": { "currency": "金币", "amount": 560 },
        "水银日报社特约调查员": { "currency": "金币", "amount": 0 },
        "奎兰": { "currency": "金币", "amount": 0 },
        "梅克军徽": { "currency": "金币", "amount": 0 },
        "『南瓜拿铁』": { "currency": "金币", "amount": 5 },
        "『逆境中的幸运女神』": { "currency": "金币", "amount": 0 },
        "幸运女神的微笑": { "currency": "金币", "amount": 0 },
        "劫掠核芯": { "currency": "金币", "amount": 0 },
        "脉律辐石": { "currency": "金币", "amount": 0 },
        "御医神兔": { "currency": "金币", "amount": 0 },
        "Zootopia": { "currency": "金币", "amount": 100 },
        "半生黄金种": { "currency": "金币", "amount": 120 },
        "肃弓": { "currency": "金币", "amount": 299 },
        "叶卡捷琳娜": { "currency": "金币", "amount": 480 },
        "莱昂纳多·迪卡普里奥": { "currency": "金币", "amount": 666 },
        "『泥潭颂唱者』": { "currency": "咒术", "amount": 1 },
        "金牌矿工": { "currency": "金币", "amount": 0 },
        "小小安全帽": { "currency": "金币", "amount": 0 },
        "『钟楼日暮』": { "currency": "旅程", "amount": 1 },
        "不洁圣子": { "currency": "金币", "amount": 0 },
        "古老金币": { "currency": "金币", "amount": 0 },
        "巨力橡果㊊": { "currency": "金币", "amount": 0 },
        "『分析天平』": { "currency": "金币", "amount": 0 },
        "近地夜航": { "currency": "金币", "amount": 0 },
        "变身器": { "currency": "金币", "amount": 0 },
        "装了衣物的纸盒": { "currency": "金币", "amount": 99 },
        "吸血猫蛋": { "currency": "金币", "amount": 333 },
        "坏掉的月亮提灯": { "currency": "金币", "amount": 380 },
        "神秘挑战书": { "currency": "金币", "amount": 348 },
        "太空列车票": { "currency": "咒术", "amount": 5 },
        "狄翁・勒萨若": { "currency": "金币", "amount": 480 },
        "希德法斯·特拉蒙": { "currency": "金币", "amount": 720 },
        "吉尔·沃瑞克": { "currency": "金币", "amount": 460 },
        "五谷丰年": { "currency": "金币", "amount": 0 },
        "金翼使㊊": { "currency": "金币", "amount": 0 },
        "巴比伦辞典": { "currency": "金币", "amount": 0 },
        "照相机": { "currency": "金币", "amount": 0 },
        "阿怪": { "currency": "金币", "amount": 0 },
        "『流星赶月』": { "currency": "旅程", "amount": 1 },
        "一只陶瓮": { "currency": "金币", "amount": 0 },
        "幽浮起司堡": { "currency": "金币", "amount": 0 },
        "『先知灵药』": { "currency": "金币", "amount": 10 },
        "龙鳞石": { "currency": "金币", "amount": 0 },
        "『不败之花』": { "currency": "血液", "amount": 1 },
        "约书亚・罗兹菲尔德": { "currency": "金币", "amount": 500 },
        "克莱夫・罗兹菲尔德": { "currency": "金币", "amount": 622 },
        "苇名弦一郎": { "currency": "金币", "amount": 666 },
        "里昂（RE4）": { "currency": "金币", "amount": 600 },
        "极客的晚宴": { "currency": "金币", "amount": 100 },
        "雄躯的昇格": { "currency": "金币", "amount": 100 },
        "波纹蓝蛋": { "currency": "金币", "amount": 500 },
        "崩朽龙卵": { "currency": "金币", "amount": 500 },
        "冰海钓竿": { "currency": "金币", "amount": 500 },
        "射手的火枪": { "currency": "金币", "amount": 550 },
        "“米凯拉的锋刃”玛莲妮亚": { "currency": "金币", "amount": 480 },
        "朱迪·霍普斯": { "currency": "金币", "amount": 500 },
        "尼克·王尔德": { "currency": "金币", "amount": 500 },
        "征服之王": { "currency": "金币", "amount": 0 },
        "岛屿探险家": { "currency": "金币", "amount": 0 },
        "『列车长』": { "currency": "金币", "amount": 0 },
        "特供热巧": { "currency": "金币", "amount": 0 },
        "六出冰花": { "currency": "金币", "amount": 0 },
        "『金色车票』": { "currency": "金币", "amount": 0 },
        "最终幻想XVI": { "currency": "金币", "amount": 100 },
        "可疑的肉蛋": { "currency": "金币", "amount": 500 },
        "无垠": { "currency": "金币", "amount": 2000 },
        "黑暗水晶": { "currency": "金币", "amount": 300 },
        "棱镜": { "currency": "金币", "amount": 666 },
        "天使之赐": { "currency": "金币", "amount": 288 },
        "杀意人偶": { "currency": "咒术", "amount": 8 },
        "爱丽丝·盖恩斯巴勒": { "currency": "金币", "amount": 400 },
        "凯特尼斯·伊夫狄恩": { "currency": "金币", "amount": 450 },
        "克劳斯·迈克尔森": { "currency": "金币", "amount": 516 },
        "虎头怪": { "currency": "金币", "amount": 500 },
        "重建熊屋": { "currency": "金币", "amount": 0 },
        "图腾饼干": { "currency": "金币", "amount": 0 },
        "龙之秘宝": { "currency": "金币", "amount": 0 },
        "长花的蛋": { "currency": "金币", "amount": 366 },
        "棕色条纹蛋": { "currency": "金币", "amount": 520 },
        "被尘封之书": { "currency": "金币", "amount": 999 },
        "和谐圣杯": { "currency": "金币", "amount": 300 },
        "露娜弗蕾亚·诺克斯·芙尔雷": { "currency": "金币", "amount": 500 },
        "凯尔": { "currency": "金币", "amount": 300 },
        "莫甘娜": { "currency": "金币", "amount": 300 },
        "阿尔瓦罗·索莱尔": { "currency": "金币", "amount": 500 },
        "纣王·子受": { "currency": "金币", "amount": 500 },
        "阿齐斯": { "currency": "金币", "amount": 480 },
        "百相千面": { "currency": "金币", "amount": 1000 },
        "肉垫手套": { "currency": "金币", "amount": 0 },
        "绿茵宝钻": { "currency": "金币", "amount": 0 },
        "猛虎贴贴": { "currency": "金币", "amount": 0 },
        "白巧克力蛋": { "currency": "金币", "amount": 0 },
        "灵藤蛋": { "currency": "金币", "amount": 350 },
        "令人不安的契约书": { "currency": "金币", "amount": 200 },
        "星籁歌姬": { "currency": "金币", "amount": 500 },
        "维涅斯": { "currency": "金币", "amount": 700 },
        "刀锋女王": { "currency": "金币", "amount": 600 },
        "天照大神": { "currency": "金币", "amount": 500 },
        "桑克瑞德·沃特斯": { "currency": "金币", "amount": 520 },
        "『星河碎片』": { "currency": "知识", "amount": 1 },
        "探险三杰士": { "currency": "金币", "amount": 0 },
        "『迷翳森林回忆录』": { "currency": "金币", "amount": 0 },
        "『迷翳之中』": { "currency": "旅程", "amount": 10 },
        "『灰域来音』": { "currency": "旅程", "amount": 10 },
        "小小舞台": { "currency": "金币", "amount": 0 },
        "风物长宜": { "currency": "金币", "amount": 0 },
        "狱炎蛋": { "currency": "血液", "amount": 266 },
        "散佚的文集": { "currency": "金币", "amount": 250 },
        "女神之泪": { "currency": "金币", "amount": 500 },
        "希尔瓦娜斯·风行者": { "currency": "金币", "amount": 500 },
        "丹妮莉丝·坦格利安": { "currency": "金币", "amount": 400 },
        "九尾妖狐·阿狸": { "currency": "金币", "amount": 350 },
        "死亡": { "currency": "金币", "amount": 444 },
        "弗图博士": { "currency": "金币", "amount": 1024 },
        "不屈之枪·阿特瑞斯": { "currency": "金币", "amount": 450 },
        "【周年限定】克里斯(8)": { "currency": "金币", "amount": 600 },
        "『伊黎丝的祝福』": { "currency": "咒术", "amount": 1 },
        "『 弗霖的琴』": { "currency": "旅程", "amount": 1 },
        "『瓶中信』": { "currency": "金币", "amount": 1 },
        "传送镜": { "currency": "金币", "amount": 0 },
        "双项圣杯": { "currency": "金币", "amount": 100 },
        "破旧打火机": { "currency": "金币", "amount": 25 },
        "山村贞子": { "currency": "金币", "amount": 300 },
        "蒂法·洛克哈特": { "currency": "金币", "amount": 400 },
        "丹·雷诺斯": { "currency": "金币", "amount": 400 },
        "勒维恩·戴维斯": { "currency": "金币", "amount": 400 },
        "艾利克斯": { "currency": "金币", "amount": 600 },
        "追击者": { "currency": "金币", "amount": 0 },
        "黑夜之星": { "currency": "金币", "amount": 0 },
        "牌中小丑": { "currency": "金币", "amount": 0 },
        "『户口本: Lv7+』": { "currency": "金币", "amount": 0 },
        "『居住证: Lv2~6』": { "currency": "金币", "amount": 0 },
        "『新居手册Ⓖ』": { "currency": "金币", "amount": 10000 },
        "『矩阵谜钥Ⓖ』": { "currency": "金币", "amount": 10000 },
        "『圣洁化身』": { "currency": "堕落", "amount": 1 },
        "『召唤好运的角笛』": { "currency": "金币", "amount": 0 },
        "『钜鲸』": { "currency": "金币", "amount": 0 },
        "『私有海域』": { "currency": "金币", "amount": 0 },
        "『还乡歌』": { "currency": "金币", "amount": 0 },
        "『任天堂Switch』灰黑√": { "currency": "金币", "amount": 100 },
        "『任天堂Switch』红蓝√": { "currency": "金币", "amount": 100 },
        "『日心说』": { "currency": "金币", "amount": 0 },
        "红心玉": { "currency": "金币", "amount": 0 },
        "小阿尔的蛋": { "currency": "金币", "amount": 388 },
        "乔治·迈克尔": { "currency": "金币", "amount": 600 },
        "Drover": { "currency": "金币", "amount": 380 },
        "光之战士": { "currency": "金币", "amount": 600 },
        "竹村五郎": { "currency": "金币", "amount": 400 },
        "果体76": { "currency": "金币", "amount": 766 },
        "史蒂文·格兰特": { "currency": "金币", "amount": 500 },
        "马克·史贝特": { "currency": "金币", "amount": 500 },
        "旅行骰子！": { "currency": "金币", "amount": 0 },
        "奇思妙想": { "currency": "金币", "amount": 0 },
        "街头霸王": { "currency": "金币", "amount": 100 },
        "【限定】深渊遗物": { "currency": "金币", "amount": 0 },
        "深渊遗物": { "currency": "金币", "amount": 0 },
        "新手蛋": { "currency": "金币", "amount": 120 },
        "超级幸运无敌辉石": { "currency": "金币", "amount": 1088 },
        "思绪骤聚": { "currency": "咒术", "amount": 15 },
        "雷霆晶球": { "currency": "咒术", "amount": 7 },
        "茉香啤酒": { "currency": "金币", "amount": 25 },
        "闪光糖果盒": { "currency": "金币", "amount": 70 },
        "博伊卡": { "currency": "金币", "amount": 550 },
        "擎天柱（Peterbilt389）": { "currency": "金币", "amount": 400 },
        "大黄蜂（ChevroletCamaro）": { "currency": "金币", "amount": 300 },
        "桐生一马": { "currency": "金币", "amount": 500 },
        "不灭狂雷-沃利贝尔": { "currency": "金币", "amount": 500 },
        "豹王": { "currency": "金币", "amount": 400 },
        "海与天之蛋": { "currency": "金币", "amount": 0 },
        "海的记忆": { "currency": "金币", "amount": 0 },
        "莱托·厄崔迪": { "currency": "金币", "amount": 350 },
        "玄生万物": { "currency": "金币", "amount": 0 },
        "美恐：启程": { "currency": "金币", "amount": 100 },
        "海边的邻居": { "currency": "金币", "amount": 0 },
        "海边的蛋": { "currency": "金币", "amount": 288 },
        "梦中的列车": { "currency": "金币", "amount": 350 },
        "秘密空瓶": { "currency": "金币", "amount": 666 },
        "恩惠护符": { "currency": "金币", "amount": 350 },
        "贤者头盔": { "currency": "金币", "amount": 200 },
        "西弗勒斯·斯内普": { "currency": "金币", "amount": 666 },
        "阿不思·邓布利多": { "currency": "金币", "amount": 250 },
        "诺克提斯·路西斯·伽拉姆": { "currency": "金币", "amount": 666 },
        "普隆普特·阿金塔姆": { "currency": "金币", "amount": 500 },
        "时间变异管理局": { "currency": "金币", "amount": 100 },
        "黑豹": { "currency": "金币", "amount": 320 },
        "神灯": { "currency": "金币", "amount": 300 },
        "莱戈拉斯": { "currency": "金币", "amount": 300 },
        "甘道夫": { "currency": "金币", "amount": 700 },
        "小天狼星·布莱克": { "currency": "金币", "amount": 520 },
        "不起眼的空瓶": { "currency": "咒术", "amount": 10 },
        "生命树叶": { "currency": "金币", "amount": 0 },
        "孔明灯": { "currency": "金币", "amount": 0 },
        "男色诱惑": { "currency": "金币", "amount": 0 },
        "血红色的蛋": { "currency": "金币", "amount": 290 },
        "五彩斑斓的蛋": { "currency": "金币", "amount": 220 },
        "One Ring": { "currency": "金币", "amount": 500 },
        "男用贞操带": { "currency": "金币", "amount": 180 },
        "赫敏·格兰杰": { "currency": "金币", "amount": 300 },
        "威克多尔·克鲁姆": { "currency": "金币", "amount": 300 },
        "异形": { "currency": "金币", "amount": 580 },
        "瑟兰迪尔": { "currency": "金币", "amount": 400 },
        "阿拉贡": { "currency": "金币", "amount": 680 },
        "岛田源氏": { "currency": "金币", "amount": 600 },
        "压箱底的泡面": { "currency": "金币", "amount": 0 },
        "闪耀圣诞球": { "currency": "金币", "amount": 0 },
        "男巫之歌": { "currency": "金币", "amount": 100 },
        "物理学圣剑": { "currency": "金币", "amount": 188 },
        "力量腕带": { "currency": "金币", "amount": 125 },
        "Vergil": { "currency": "金币", "amount": 500 },
        "Dante": { "currency": "金币", "amount": 666 },
        "V (DMC5)": { "currency": "金币", "amount": 500 },
        "Joker": { "currency": "金币", "amount": 400 },
        "英雄联盟": { "currency": "金币", "amount": 100 },
        "巴基 (猎鹰与冬兵)": { "currency": "金币", "amount": 500 },
        "卡洛斯·奥利维拉": { "currency": "金币", "amount": 600 },
        "格拉迪欧拉斯": { "currency": "金币", "amount": 450 },
        "炙热的格拉迪欧拉斯": { "currency": "金币", "amount": 666 },
        "小小行星": { "currency": "金币", "amount": 0 },
        "缘定仙桥": { "currency": "金币", "amount": 0 },
        "GM村蛋糕": { "currency": "金币", "amount": 0 },
        "大古": { "currency": "金币", "amount": 300 },
        "泰比里厄斯": { "currency": "金币", "amount": 555 },
        "绯红女巫": { "currency": "金币", "amount": 400 },
        "索尔·奥丁森": { "currency": "金币", "amount": 500 },
        "波板糖": { "currency": "金币", "amount": 0 },
        "魔法灵药": { "currency": "金币", "amount": 0 },
        "云上之光": { "currency": "金币", "amount": 0 },
        "林中之蛋": { "currency": "金币", "amount": 275 },
        "超级无敌名贵金卡": { "currency": "金币", "amount": 688 },
        "武士之魂": { "currency": "金币", "amount": 999 },
        "Chris Mazdzer": { "currency": "金币", "amount": 300 },
        "艾吉奥": { "currency": "金币", "amount": 500 },
        "加勒特·霍克": { "currency": "金币", "amount": 300 },
        "托尼·史塔克": { "currency": "金币", "amount": 650 },
        "枯黄的种苗": { "currency": "金币", "amount": 0 },
        "士官长": { "currency": "金币", "amount": 450 },
        "克苏鲁": { "currency": "金币", "amount": 666 },
        "金刚狼": { "currency": "金币", "amount": 400 },
        "老旧的书籍": { "currency": "金币", "amount": 0 },
        "恶魔城": { "currency": "金币", "amount": 100 },
        "沙漠羽蛋": { "currency": "金币", "amount": 250 },
        "幽光彩蛋": { "currency": "金币", "amount": 300 },
        "羽毛笔": { "currency": "金币", "amount": 280 },
        "冒险用宝箱": { "currency": "金币", "amount": 200 },
        "琉璃玉坠": { "currency": "金币", "amount": 180 },
        "幻象": { "currency": "金币", "amount": 350 },
        "三角头": { "currency": "金币", "amount": 450 },
        "汉克/Hank": { "currency": "金币", "amount": 500 },
        "神秘的礼物": { "currency": "金币", "amount": 0 },
        "赛博朋克2077": { "currency": "金币", "amount": 100 },
        "风雪之家": { "currency": "金币", "amount": 0 },
        "万圣彩蛋": { "currency": "金币", "amount": 310 },
        "螺旋纹卵": { "currency": "金币", "amount": 270 },
        "社畜专用闹钟": { "currency": "金币", "amount": 150 },
        "GM論壇初心者勛章": { "currency": "金币", "amount": 100 },
        "Scott Ryder": { "currency": "金币", "amount": 400 },
        "鬼王酒吞童子": { "currency": "金币", "amount": 300 },
        "阿尔伯特·威斯克": { "currency": "金币", "amount": 400 },
        "超人": { "currency": "金币", "amount": 450 },
        "汤姆·赫兰德": { "currency": "金币", "amount": 450 },
        "丹·安博尔": { "currency": "金币", "amount": 300 },
        "万圣南瓜": { "currency": "金币", "amount": 0 },
        "猫猫幽灵": { "currency": "金币", "amount": 0 },
        "掌中雪球瓶": { "currency": "金币", "amount": 0 },
        "最终幻想XIV": { "currency": "金币", "amount": 100 },
        "GHOST": { "currency": "金币", "amount": 200 },
        "SCP-s-1889": { "currency": "金币", "amount": 450 },
        "萨菲罗斯": { "currency": "金币", "amount": 440 },
        "【新手友好】昆進": { "currency": "金币", "amount": 250 },
        "疾风剑豪": { "currency": "金币", "amount": 450 },
        "莎伦": { "currency": "金币", "amount": 350 },
        "血石": { "currency": "金币", "amount": 1 },
        "寶可夢 Pokémon": { "currency": "金币", "amount": 100 },
        "软泥怪蛋": { "currency": "金币", "amount": 150 },
        "宝箱内的球": { "currency": "金币", "amount": 350 },
        "冒险用绷带": { "currency": "金币", "amount": 211 },
        "星芒戒指": { "currency": "金币", "amount": 300 },
        "魯杰羅·弗雷迪": { "currency": "金币", "amount": 300 },
        "塞巴斯蒂安·斯坦": { "currency": "金币", "amount": 450 },
        "沃特·沙利文": { "currency": "金币", "amount": 302 },
        "吉姆·霍普": { "currency": "金币", "amount": 300 },
        "月上柳梢": { "currency": "金币", "amount": 0 },
        "血鹫蛋": { "currency": "金币", "amount": 310 },
        "灵鹫蛋": { "currency": "金币", "amount": 310 },
        "月陨戒指": { "currency": "金币", "amount": 300 },
        "日荒戒指": { "currency": "金币", "amount": 300 },
        "陷阱杀手": { "currency": "金币", "amount": 280 },
        "索林·橡木盾": { "currency": "金币", "amount": 520 },
        "杰克·莫里森/士兵 76": { "currency": "金币", "amount": 476 },
        "熔岩蛋": { "currency": "金币", "amount": 350 },
        "郁苍卵": { "currency": "金币", "amount": 350 },
        "神秘的漂流瓶": { "currency": "金币", "amount": 500 },
        "暖心小火柴": { "currency": "金币", "amount": 333 },
        "Doc": { "currency": "金币", "amount": 500 },
        "迈克尔迈尔斯": { "currency": "金币", "amount": 450 },
        "马戏团灰蛋": { "currency": "金币", "amount": 270 },
        "生锈的海盗刀枪": { "currency": "金币", "amount": 310 },
        "海盗弯钩": { "currency": "金币", "amount": 130 },
        "钢铁勇士弯刀": { "currency": "金币", "amount": 140 },
        "莫瑞甘": { "currency": "金币", "amount": 360 },
        "藤田優馬": { "currency": "金币", "amount": 298 },
        "月影蛋": { "currency": "金币", "amount": 310 },
        "珊瑚色礁石蛋": { "currency": "金币", "amount": 260 },
        "冒险用指南针": { "currency": "金币", "amount": 150 },
        "老旧的怀表": { "currency": "金币", "amount": 280 },
        "沙漠神灯": { "currency": "金币", "amount": 250 },
        "狩猎用小刀": { "currency": "金币", "amount": 230 },
        "蔷薇骑士之刃": { "currency": "金币", "amount": 320 },
        "乔纳森·里德": { "currency": "金币", "amount": 360 },
        "尼克斯·乌尔里克": { "currency": "金币", "amount": 520 },
        "迷之天鹅": { "currency": "金币", "amount": 0 },
        "海螺号角": { "currency": "金币", "amount": 277 },
        "冒险用面包": { "currency": "金币", "amount": 150 },
        "莱因哈特·威尔海姆": { "currency": "金币", "amount": 449 },
        "远古石碑": { "currency": "金币", "amount": 140 },
        "魔法石碑": { "currency": "金币", "amount": 130 },
        "龙血之斧": { "currency": "金币", "amount": 210 },
        "十字军护盾": { "currency": "金币", "amount": 190 },
        "【圣诞限定】心心念念小雪人": { "currency": "金币", "amount": 666 },
        "箭术卷轴": { "currency": "金币", "amount": 70 },
        "用过的粪桶": { "currency": "金币", "amount": 111 },
        "四季之歌": { "currency": "金币", "amount": 0 },
        "雾都血医": { "currency": "金币", "amount": 100 },
        "不败之花": { "currency": "金币", "amount": 0 },
        "德拉克的遗物": { "currency": "金币", "amount": 0 },
        "金猪猪储蓄罐": { "currency": "金币", "amount": 10000 },
        "粉猪猪储蓄罐": { "currency": "金币", "amount": 1000 },
        "白猪猪储蓄罐": { "currency": "金币", "amount": 100 },
        "巴啦啦小魔仙棒": { "currency": "金币", "amount": 130 },
        "种植土豆": { "currency": "金币", "amount": 140 },
        "神秘的红茶": { "currency": "金币", "amount": 77 },
        "幽灵竹筒": { "currency": "金币", "amount": 280 },
        "荒野大镖客：救赎 II": { "currency": "金币", "amount": 100 },
        "电磁卵": { "currency": "金币", "amount": 240 },
        "青鸾蛋": { "currency": "金币", "amount": 220 },
        "蓝礼·拜拉席恩": { "currency": "金币", "amount": 520 },
        "阿列克西欧斯（Alexios）": { "currency": "金币", "amount": 400 },
        "赫尔墨斯·看守者之杖": { "currency": "金币", "amount": 288 },
        "莱托文本残页": { "currency": "金币", "amount": 0 },
        "暮色卵": { "currency": "金币", "amount": 260 },
        "结晶卵": { "currency": "金币", "amount": 280 },
        "红石": { "currency": "金币", "amount": 177 },
        "冒险专用绳索": { "currency": "金币", "amount": 220 },
        "羅素·托維": { "currency": "金币", "amount": 240 },
        "安杜因·乌瑞恩": { "currency": "金币", "amount": 480 },
        "圣甲虫秘典": { "currency": "金币", "amount": 350 },
        "德拉克魂匣": { "currency": "血液", "amount": 350 },
        "达拉然": { "currency": "金币", "amount": 100 },
        "麦迪文（Medivh）": { "currency": "金币", "amount": 350 },
        "卡德加（Khadgar）": { "currency": "金币", "amount": 350 },
        "杰西·麦克雷": { "currency": "金币", "amount": 500 },
        "英普瑞斯": { "currency": "金币", "amount": 400 },
        "晃晃悠悠小矿车": { "currency": "金币", "amount": 0 },
        "模擬人生4": { "currency": "金币", "amount": 100 },
        "【年中限定】GM村金蛋": { "currency": "金币", "amount": 618 },
        "贝优妮塔": { "currency": "金币", "amount": 280 },
        "秋水长天": { "currency": "金币", "amount": 0 },
        "石鬼面": { "currency": "金币", "amount": 233 },
        "丹尼爾·紐曼": { "currency": "金币", "amount": 350 },
        "内森·德雷克": { "currency": "金币", "amount": 600 },
        "没有梦想的咸鱼": { "currency": "金币", "amount": 1 },
        "守望者徽章": { "currency": "金币", "amount": 100 },
        "黑墙": { "currency": "金币", "amount": 400 },
        "眼镜蛇图腾": { "currency": "金币", "amount": 88 },
        "猎鹰图腾": { "currency": "金币", "amount": 88 },
        "山猫图腾": { "currency": "金币", "amount": 88 },
        "蛮族战士": { "currency": "金币", "amount": 50 },
        "漆黑的蝎卵": { "currency": "金币", "amount": 200 },
        "恋恋小烹锅": { "currency": "金币", "amount": 0 },
        "魔术师（The Magician，I）": { "currency": "金币", "amount": 0 },
        "恋人(The Lovers，VI)": { "currency": "金币", "amount": 0 },
        "石肤术": { "currency": "咒术", "amount": 4 },
        "迷之瓶": { "currency": "金币", "amount": 0 },
        "康纳/Connor": { "currency": "金币", "amount": 400 },
        "野兽之子": { "currency": "金币", "amount": 0 },
        "【夏日限定】夏日的泰凯斯": { "currency": "金币", "amount": 666 },
        "泰凯斯·芬得利": { "currency": "金币", "amount": 320 },
        "战车(The Chariot , VII)": { "currency": "金币", "amount": 0 },
        "倒吊人(The Hanged Man , XII)": { "currency": "金币", "amount": 0 },
        "红龙秘宝": { "currency": "金币", "amount": 0 },
        "红龙精华": { "currency": "金币", "amount": 0 },
        "龙之魂火": { "currency": "金币", "amount": 0 },
        "腐化龙蛋": { "currency": "金币", "amount": 150 },
        "黑龙蛋": { "currency": "金币", "amount": 150 },
        "红龙蛋": { "currency": "金币", "amount": 150 },
        "网中的皮卡丘": { "currency": "金币", "amount": 100 },
        "变骚喷雾": { "currency": "金币", "amount": 13 },
        "亚瑟·库瑞（海王）": { "currency": "金币", "amount": 450 },
        "亚瑟‧摩根": { "currency": "金币", "amount": 500 },
        "生化危机：复仇": { "currency": "金币", "amount": 100 },
        "浪潮之歌": { "currency": "金币", "amount": 300 },
        "岛田半藏": { "currency": "金币", "amount": 500 },
        "华灯初上": { "currency": "金币", "amount": 0 },
        "章鱼小丸子": { "currency": "金币", "amount": 150 },
        "罗宾·西克": { "currency": "金币", "amount": 300 },
        "安德鲁·库珀": { "currency": "金币", "amount": 400 },
        "克里斯·埃文斯": { "currency": "金币", "amount": 300 },
        "变形软泥": { "currency": "金币", "amount": 66 },
        "新年小猴": { "currency": "金币", "amount": 0 },
        "传承之证": { "currency": "金币", "amount": 0 },
        "骑士遗盔": { "currency": "金币", "amount": 275 },
        "月亮的蛋": { "currency": "金币", "amount": 200 },
        "天涯.此时": { "currency": "金币", "amount": 0 },
        "维克多‧天火": { "currency": "金币", "amount": 460 },
        "阿尔萨斯‧米奈希尔": { "currency": "金币", "amount": 350 },
        "心之水晶": { "currency": "金币", "amount": 0 },
        "史莱姆蛋": { "currency": "血液", "amount": 220 },
        "神秘商店贵宾卡": { "currency": "金币", "amount": 50 },
        "库伦 (审判)": { "currency": "金币", "amount": 450 },
        "詹米·多南": { "currency": "金币", "amount": 320 },
        "BIG BOSS": { "currency": "金币", "amount": 600 },
        "Frank (LBF)": { "currency": "金币", "amount": 270 },
        "勇者与龙之书": { "currency": "金币", "amount": 300 },
        "萨赫的蛋糕": { "currency": "金币", "amount": 40 },
        "雪王的心脏": { "currency": "金币", "amount": 180 },
        "婴儿泪之瓶": { "currency": "金币", "amount": 200 },
        "戴尔‧芭芭拉": { "currency": "金币", "amount": 280 },
        "秘密森林": { "currency": "金币", "amount": 0 },
        "种植菊花": { "currency": "金币", "amount": 110 },
        "这是一片丛林": { "currency": "金币", "amount": 120 },
        "史莱姆养殖证书": { "currency": "金币", "amount": 60 },
        "盖拉斯‧瓦卡瑞安": { "currency": "金币", "amount": 450 },
        "艾德尔": { "currency": "金币", "amount": 280 },
        "发芽的种子": { "currency": "金币", "amount": 77 },
        "新月护符": { "currency": "金币", "amount": 200 },
        "哈尔‧乔丹": { "currency": "金币", "amount": 550 },
        "神圣十字章": { "currency": "金币", "amount": 300 },
        "重新充能的神圣十字章": { "currency": "金币", "amount": 300 },
        "杰森·斯坦森": { "currency": "金币", "amount": 490 },
        "艾尔尤因": { "currency": "金币", "amount": 290 },
        "预知水晶球": { "currency": "金币", "amount": 150 },
        "奇怪的紫水晶": { "currency": "金币", "amount": 299 },
        "巴特‧贝克": { "currency": "金币", "amount": 180 },
        "锻造卷轴": { "currency": "金币", "amount": 99 },
        "布衣": { "currency": "金币", "amount": 45 },
        "尤利西斯": { "currency": "金币", "amount": 250 },
        "尼克·贝特曼": { "currency": "金币", "amount": 500 },
        "康纳‧沃什": { "currency": "金币", "amount": 400 },
        "铁牛": { "currency": "金币", "amount": 400 },
        "泡沫浮髅(Squirt)": { "currency": "金币", "amount": 0 },
        "铁杆影迷": { "currency": "金币", "amount": 0 },
        "霍格沃茨五日游": { "currency": "咒术", "amount": 8 },
        "海上明月": { "currency": "金币", "amount": 0 },
        "奥兹大陆": { "currency": "金币", "amount": 100 },
        "禽兽扒手": { "currency": "金币", "amount": 0 },
        "圣英灵秘银甲": { "currency": "金币", "amount": 1350 },
        "安德森‧戴维斯": { "currency": "金币", "amount": 500 },
        "库伦 (起源)": { "currency": "金币", "amount": 480 },
        "戴蒙‧萨尔瓦托": { "currency": "金币", "amount": 450 },
        "TRPG纪念章": { "currency": "金币", "amount": 0 },
        "堕落飨宴": { "currency": "金币", "amount": 9999 },
        "龙腾世纪：审判": { "currency": "金币", "amount": 100 },
        "迷のDoge": { "currency": "金币", "amount": 100 },
        "神秘的邀请函": { "currency": "金币", "amount": 100 },
        "暗红矿土": { "currency": "金币", "amount": 40 },
        "木柴堆": { "currency": "金币", "amount": 90 },
        "充满魔力的种子": { "currency": "金币", "amount": 250 },
        "咆哮诅咒": { "currency": "咒术", "amount": 8 },
        "遗忘之水": { "currency": "金币", "amount": 180 },
        "史蒂夫‧金克斯": { "currency": "金币", "amount": 230 },
        "卢西亚诺‧科斯塔": { "currency": "金币", "amount": 380 },
        "虎克船长": { "currency": "金币", "amount": 320 },
        "卡斯迪奥": { "currency": "金币", "amount": 520 },
        "魔术师奥斯卡": { "currency": "金币", "amount": 490 },
        "山姆·温彻斯特": { "currency": "金币", "amount": 400 },
        "迪恩·温彻斯特": { "currency": "金币", "amount": 400 },
        "布莱恩‧欧康纳": { "currency": "金币", "amount": 400 },
        "謎の男": { "currency": "金币", "amount": 0 },
        "猫眼": { "currency": "金币", "amount": 0 },
        "一只可爱的小猫": { "currency": "金币", "amount": 0 },
        "上古卷轴V：天际": { "currency": "金币", "amount": 100 },
        "TRPG版塊": { "currency": "金币", "amount": 100 },
        "辐射：新维加斯": { "currency": "金币", "amount": 100 },
        "五花八门版块": { "currency": "金币", "amount": 100 },
        "质量效应三部曲": { "currency": "金币", "amount": 100 },
        "骑兽之子": { "currency": "金币", "amount": 0 },
        "黄色就是俏皮": { "currency": "金币", "amount": 0 },
        "堕落之舞": { "currency": "金币", "amount": 0 },
        "诺曼底号": { "currency": "金币", "amount": 8700 },
        "夜灯": { "currency": "金币", "amount": 40 },
        "洞窟魔蛋": { "currency": "金币", "amount": 1 },
        "种植菠菜": { "currency": "金币", "amount": 30 },
        "漂洋小船": { "currency": "金币", "amount": 75 },
        "流失之椅": { "currency": "金币", "amount": 320 },
        "念念往日士官盔": { "currency": "金币", "amount": 125 },
        "超级名贵无用宝剑": { "currency": "金币", "amount": 1299 },
        "吞食魂魄": { "currency": "灵魂", "amount": 1 },
        "猫化弩哥": { "currency": "金币", "amount": 200 },
        "亚当‧简森": { "currency": "金币", "amount": 350 },
        "罗伯‧史塔克": { "currency": "金币", "amount": 500 },
        "亚力斯塔尔": { "currency": "金币", "amount": 450 },
        "重磅手环": { "currency": "金币", "amount": 250 },
        "里昂‧S‧甘乃迪": { "currency": "金币", "amount": 450 },
        "梅格": { "currency": "金币", "amount": 300 },
        "版主: 一国之主": { "currency": "金币", "amount": 0 },
        "见习版主: 神的重量": { "currency": "金币", "amount": 0 },
        "站员: 保卫领土": { "currency": "金币", "amount": 0 },
        "Chris Redfield in Uroboros": { "currency": "金币", "amount": 0 },
        "神之匠工": { "currency": "金币", "amount": 0 },
        "另一个身份": { "currency": "金币", "amount": 0 },
        "被祝福的新旅程": { "currency": "金币", "amount": 0 },
        "森林羊男": { "currency": "金币", "amount": 0 },
        "牧羊人": { "currency": "金币", "amount": 0 },
        "金钱马车": { "currency": "金币", "amount": 200 },
        "聚魔花盆": { "currency": "金币", "amount": 500 },
        "种植小草": { "currency": "金币", "amount": 15 },
        "微笑的面具": { "currency": "金币", "amount": 100 },
        "知识大典": { "currency": "金币", "amount": 50 },
        "药剂背袋": { "currency": "金币", "amount": 180 },
        "刺杀者匕首": { "currency": "金币", "amount": 80 },
        "十字叶章": { "currency": "金币", "amount": 277 },
        "净化手杖": { "currency": "金币", "amount": 400 },
        "符文披风": { "currency": "金币", "amount": 280 },
        "嗜血斩首斧": { "currency": "金币", "amount": 100 },
        "祈祷术": { "currency": "咒术", "amount": 8 },
        "召唤古代战士": { "currency": "咒术", "amount": 8 },
        "水泡术": { "currency": "咒术", "amount": 3 },
        "黑暗交易": { "currency": "咒术", "amount": 8 },
        "炼金之心": { "currency": "咒术", "amount": 4 },
        "贞洁内裤": { "currency": "金币", "amount": 110 },
        "灵光补脑剂": { "currency": "金币", "amount": 22 },
        "千杯不醉": { "currency": "金币", "amount": 12 },
        "丢肥皂": { "currency": "金币", "amount": 10 },
        "送情书": { "currency": "金币", "amount": 18 },
        "奥利弗‧奎恩": { "currency": "金币", "amount": 680 },
        "肥皂": { "currency": "金币", "amount": 400 },
        "凯登‧阿兰科": { "currency": "金币", "amount": 550 },
        "裸体克里斯": { "currency": "金币", "amount": 888 },
        "克里斯‧雷德菲尔德": { "currency": "金币", "amount": 550 },
        "威尔卡斯": { "currency": "金币", "amount": 400 },
        "杰夫‧莫罗": { "currency": "金币", "amount": 400 },
        "盖里": { "currency": "金币", "amount": 420 },
        "但丁": { "currency": "金币", "amount": 450 },
        "巴尔弗雷亚": { "currency": "金币", "amount": 350 },
        "文森特‧瓦伦丁": { "currency": "金币", "amount": 350 },
        "皮尔斯‧尼凡斯": { "currency": "金币", "amount": 400 },
        "维吉尔": { "currency": "金币", "amount": 400 },
        "法卡斯": { "currency": "金币", "amount": 300 },
        "吉姆‧雷诺": { "currency": "金币", "amount": 350 },
        "希德‧海温特": { "currency": "金币", "amount": 450 },
        "奧倫": { "currency": "金币", "amount": 300 },
        "詹姆斯‧维加": { "currency": "金币", "amount": 450 }
    };



    // 添加模板：
    // "勋章名":{"currency":"金币","amount":0},

    // 最大寄售价格为115%
    const maxPriceRate = 1.15;

    // 回收价格为65%
    const huiShouPriceRate = 0.65;

    // 删除非寄售相关的交易记录
    function removeNotJishou(){
        // 选中与ID为'medalid_f'的<form>元素同级的，类名为 'el pbw mbw' 的<ul>元素
        let targetUl = document.querySelector('form#medalid_f ~ ul.el.pbw.mbw');

        if (targetUl) {
            // 获取该<ul>下的所有<li>
            let lisInTargetUl = targetUl.getElementsByTagName('li');

            // 遍历这些<li>，并根据条件决定是否删除
            for (let i = lisInTargetUl.length - 1; i >= 0; i--) {
                // 如果<li>文本不包含'寄售'则 删除该<li>
                if (!lisInTargetUl[i].textContent.includes('寄售')) {
                    targetUl.removeChild(lisInTargetUl[i]);
                }
            }
        } else {
            console.error("未找到与<form id='medalid_f'>同级的类名为 'el pbw mbw' 的<ul>元素");
        }
    }

    function showUserAndPrice(){

        // 如果开启逆序，则越新的寄售显示越靠前
        if( reverseOn ){
            let container = document.querySelector('.myfldiv');
            let myblokArray = Array.from(document.getElementsByClassName("myblok"));

            myblokArray = myblokArray.reverse();

            container.innerHTML = '';
            myblokArray.forEach(item => container.appendChild(item));
        }

        let myblok = document.getElementsByClassName("myblok")

        // 用于记录每种勋章对应的最低价格和对应的 blok
        const minPriceMap = {};

        for (var blok of myblok) {
            blok.style.height = "auto";

            // 获取勋章名称
            // ？可以在空值是防止错误
            let badgeName = blok.querySelector('.myimg p b')?.textContent;
            if(!badgeName){
                console.log("未找到页面信息：勋章名")
                continue;
            }

            // 获取jiage类的p元素
            let jiageP = blok.querySelectorAll('.mytip .jiage');
            if(!jiageP){
                console.log("未找到页面信息：价格");
                continue;
            }

            // 寄售用户
            let userContent = jiageP[0].querySelector('b')?.textContent;

            // 寄售价格
            let priceContent = jiageP[1].querySelector('b')?.textContent;

            if((!userContent) || (!priceContent)){
                console.log("未找到页面信息：用户或寄售价格");
                continue;
            }

            // 获取价格金币数字
            const regex = /\d+/;
            let priceMatch = priceContent.match(regex);
            if(!priceMatch){
                console.log("价格信息提取错误");
                continue;
            }
            let priceNumber = parseInt(priceMatch[0], 10);


            // 记录每个 badgeName 最低价及对应的 blok
            if (!minPriceMap[badgeName] || priceNumber < minPriceMap[badgeName].minPrice) {
                minPriceMap[badgeName] = {
                    minPrice: priceNumber,
                    blok: blok
                };
            }

            // 0.24修复： 勋章数据库没有数据时
            // 如果数据库中没有数据则将Flag置0
            let hasDataFlag = 1;
            // 根据寄售的原价对对应勋章进行变色
            let oriBadgePrice;
            if(!(badgePriceJson[badgeName])){
                console.log("未在勋章数据库中找到对应勋章：" + badgeName);
                hasDataFlag = 0;
                oriBadgePrice = "未收录"
            }else{
                oriBadgePrice = badgePriceJson[badgeName].amount;
            }

            //如果有价格则改变样式
            if(hasDataFlag){
                let maxJishouPrice = Math.floor(oriBadgePrice * maxPriceRate);
                let huiShouPrice = Math.floor(oriBadgePrice * huiShouPriceRate);

                // 如果小于最大寄售价，变成蓝色
                if( priceNumber < maxJishouPrice){
                    blok.classList.add("shinyBlok");
                }

                // 如果小于等于勋章回收价格，变成红色
                // 如果小于等于原价，变成绿色
                if( priceNumber <= huiShouPrice ){
                    blok.classList.add("redBlok");
                }else if( priceNumber <= oriBadgePrice){
                    blok.classList.add("greenBlok");
                }

            }

            // 添加元素
            if (userContent && priceContent) {
                var newP = document.createElement("p");
                newP.classList.add("pudding");
                var newContent = document.createTextNode( priceNumber + "/" + oriBadgePrice + " " + userContent );
                newP.appendChild(newContent);

                // 设置样式，使其紧贴标题
                newP.style.marginTop = "-10px";
                newP.style.whiteSpace = "nowrap";

                var badgeTitleP = blok.querySelector('.myimg p');
                blok.querySelector('.myimg').insertBefore(newP, badgeTitleP.nextElementSibling);
            }
        }

        // 为每种勋章的最低价 改变名称样式
        for (var badgeName in minPriceMap) {
            let targetBlok = minPriceMap[badgeName].blok;

            //修改对应勋章名称样式
            targetBlok.querySelector('.myimg p')?.classList.add("colorfulText");
        }

    }

    removeNotJishou();
    showUserAndPrice();

    // 如果设置中开启动画则修改样式
    if( animationOn ){

        // 流水灯边框样式
        // 来源：ckjdygc - 创客界的一根葱
        // gitee仓库：https://gitee.com/laoheiwan/ckjdygc/tree/main
        // 此处需要用:not(button.pn)排除对button元素的样式影响 （否则可能会和其他脚本冲突，如勋章辅助二手防滑的fadeTo动画）
        GM_addStyle(`
       .shinyBlok:not(button.pn){
            overflow: hidden;
            z-index: 0;
        }
        .shinyBlok:not(button.pn)::before {
            content: "";
            width: 200%;
            height: 200%;
            background-image: conic-gradient(transparent, var(--color, #66ddf7), transparent var(--shiny-percentage, 25%));
            position: absolute;
            left: -50%;
            top: -50%;
            z-index: -2;
            animation: rotate var(--animation-time, 2s) linear infinite;
        }
        .greenBlok:not(button.pn)::before {
            background-image: conic-gradient(transparent, var(--green-color, #00ff88), transparent var(--green-percentage, 75%));
        }
        .redBlok:not(button.pn)::before {
            background-image: conic-gradient(transparent, var(--red-color, #fc466b), transparent var(--red-percentage, 75%));
        }
       @keyframes rotate {
           100% {
               transform: rotate(360deg);
           }
       }
       .shinyBlok:not(button.pn)::after {
           content: "";
           inset: 0.7vmin;
           background: #fff;
           position: absolute;
           z-index: -1;
       }
    `);
    }

    // 如果开启最低售价功能，则载入动画
    // https://www.bilibili.com/video/BV1xr4y1n7hx/
    if(lowPriceReminder){
        GM_addStyle(`
            :root {
            --color-1: #186cb8;
            --color-2: #2a9a9f;
            --color-3: #f1b211;
            --color-4: #e83611;
            --color-5: #f9002f;
            }

    .colorfulText {
        color: #fff;
        background: linear-gradient(225deg,
            var(--color-1) 0%, var(--color-1) 9%,
            transparent 9%, transparent 10%,
            var(--color-2) 10%, var(--color-2) 19%,
            transparent 19%, transparent 20%,
            var(--color-3) 20%, var(--color-3) 29%,
            transparent 29%, transparent 30%,
            var(--color-4) 30%,var(--color-4) 39%,
            transparent 39%, transparent 40%,
            var(--color-5) 40%,var(--color-5) 49%,
            transparent 49%, transparent 50%,
            var(--color-1) 50%, var(--color-1) 59%,
            transparent 59%, transparent 60%,
            var(--color-2) 60%, var(--color-2) 69%,
            transparent 69%, transparent 70%,
            var(--color-3) 70%, var(--color-3) 79%,
            transparent 79%, transparent 80%,
            var(--color-4) 80%,var(--color-4) 89%,
            transparent 89%, transparent 90%,
             var(--color-5) 90%,var(--color-5) 99%,
            transparent 99%
        );
        background-size: 200% 200%;
        color: transparent;
        background-clip: text;
        -webkit-background-clip: text;
        animation: move 4s linear infinite;
    }

    @keyframes move{
        0%{
            background-position:0px 100%;
        }
        100%{
            background-position: 100% 0px;
        }
    }

         `);
    };

})();