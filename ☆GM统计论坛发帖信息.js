// ==UserScript==
// @name         论坛帖子爬虫
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  点击按钮后爬取论坛帖子信息并生成 Excel 文件
// @author       Your Name
// @match        https://www.gamemale.com/search.php?mod=forum&searchid=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js
// ==/UserScript==

(function () {
    'use strict'

    // 创建下载按钮
    const downloadButton = document.createElement('button')
    downloadButton.textContent = '下载 Excel' // 按钮名称改为“下载 Excel”
    downloadButton.style.marginLeft = '10px'
    downloadButton.style.padding = '5px 10px'
    downloadButton.style.backgroundColor = '#4CAF50'
    downloadButton.style.color = 'white'
    downloadButton.style.border = 'none'
    downloadButton.style.borderRadius = '5px'
    downloadButton.style.cursor = 'pointer'

    // 创建“是否统计追随”复选框
    const followCheckbox = document.createElement('input')
    followCheckbox.type = 'checkbox'
    followCheckbox.id = 'followCheckbox'
    followCheckbox.style.marginLeft = '10px'
    followCheckbox.style.cursor = 'pointer'

    const followLabel = document.createElement('label')
    followLabel.textContent = '统计追随'
    followLabel.htmlFor = 'followCheckbox'
    followLabel.style.marginLeft = '5px'
    followLabel.style.cursor = 'pointer'

    // 将按钮和复选框插入到 #scform_form 后面
    const scformForm = document.querySelector("#scform > tbody > tr > td:nth-child(2)")
    if (scformForm) {
        scformForm.insertAdjacentElement('afterend', downloadButton)
        scformForm.insertAdjacentElement('afterend', followLabel)
        scformForm.insertAdjacentElement('afterend', followCheckbox)
    }

    // 绑定点击事件
    downloadButton.addEventListener('click', () => {
        // 禁用按钮，防止重复点击
        downloadButton.disabled = true
        downloadButton.textContent = '爬取中...'


        // 获取总页数
        const pagelist = [...document.querySelectorAll(".pg a")]
        const pageNumber = getPageNumber(document)

        let cleanedUrl = window.location.href.split('&page=')[0] // 默认使用当前页面的 URL

        // 检查是否存在分页链接
        if (pagelist.length > 1) {
            const pageUrl = pagelist[1].href
            cleanedUrl = pageUrl.split('&page=')[0]
        } else {
            console.warn('未找到分页链接，使用当前页面 URL 作为 cleanedUrl')
        }

        let allPosts = [] // 用于存储所有帖子信息

        // 定义一个函数用于爬取单页数据
        const fetchPage = async (page) => {
            try {
                const response = await fetch(`${cleanedUrl}&page=${page}`)
                const text = await response.text()
                const parser = new DOMParser()
                const doc = parser.parseFromString(text, 'text/html')
                const postList = doc.querySelectorAll('#threadlist li')

                for (let i = 0; i < postList.length; i++) {
                    const post = postList[i]
                    const key = `第${page}页-第${i + 1}个`
                    const tid = post.id
                    const link = post.querySelector('h3.xs3 a')?.href
                    const title = post.querySelector('h3.xs3 a')?.textContent
                    const author = post.querySelector('p span a')?.textContent
                    const authorUid = post.querySelector('p span a')?.href.match(/space-uid-(\d+).html/)?.[1]
                    const section = post.querySelector('p span a.xi1')?.textContent
                    const sectionId = post.querySelector('p span a.xi1')?.href.match(/forum-(\d+)-1.html/)?.[1]
                    const postTime = post.querySelector('p span')?.textContent

                    // 如果勾选了“统计追随”，则进入帖子链接获取追随数
                    let followers = 0
                    if (followCheckbox.checked && link) {
                        followers = await getTotalFollowers(link)
                    }

                    allPosts.push({
                        key,
                        追随: followers,
                        title,
                        author,
                        authorUid,
                        section,
                        sectionId,
                        tid,
                        link,
                        postTime
                    })
                }
            } catch (error) {
                console.error(`第 ${page} 页数据爬取失败:`, error)
            }
        }

        // 爬取所有页面数据
        const fetchAllPages = async () => {
            try {
                for (let i = 1; i <= pageNumber; i++) {
                    await fetchPage(i)
                    console.log(`第 ${i} 页数据爬取完成`)
                }

                // 数据爬取完成后生成 Excel 文件
                generateExcel(allPosts)
                console.log(allPosts)
            } catch (error) {
                console.error('爬取数据时出错:', error)
            } finally {
                // 恢复按钮状态
                downloadButton.disabled = false
                downloadButton.textContent = '下载 Excel' // 恢复按钮名称
            }
        }

        // 开始爬取数据
        fetchAllPages()
    })

    // 生成Excel文件
    function generateExcel(data) {
        const ws = XLSX.utils.json_to_sheet(data)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Posts")

        // 设置列宽自适应
        const wscols = [
            { wch: 10 }, // key
            { wch: 5 }, // 追随
            { wch: 40 }, // title
            { wch: 10 }, // author
            { wch: 10 }, // authorUid
            { wch: 10 }, // section
            { wch: 10 }, // sectionId
            { wch: 10 }, // tid
            { wch: 50 }, // link
            { wch: 20 }  // postTime
        ]

        ws['!cols'] = wscols

        // 生成Excel文件并下载
        const name = document.querySelector("#scform_srchtxt").value
        XLSX.writeFile(wb, `${name}.xlsx`)
    }

    // 获取追随数
    async function getTotalFollowers(link) {
        try {
            const response = await fetch(link)
            const text = await response.text()
            const parser = new DOMParser()
            const doc = parser.parseFromString(text, 'text/html')

            // 查找包含“追随”的单元格
            const followerCell = Array.from(doc.querySelectorAll('.rate .xw1')).find(cell =>
                cell.textContent.includes('追随')
            )

            // 提取追随总数
            if (followerCell) {
                const followerValue = followerCell.querySelector('span.xi1')?.textContent
                if (followerValue) {
                    return parseInt(followerValue.replace('+', ''), 10)
                }
            }
        } catch (error) {
            console.error(`获取追随数失败: ${link}`, error)
        }

        // 如果未找到，返回 0
        return 0
    }

    function getPageNumber(document) {
        // 检查是否存在 .pg label 元素
        const pageLabel = document.querySelector('.pg label')
        let pageNumber = 1 // 默认值为 1

        if (pageLabel) {
            const pageText = pageLabel.textContent
            // 提取数字部分，如果提取失败则使用默认值 1
            pageNumber = Number(pageText.match(/\d+/)?.[0]) || 1
        } else {
            console.warn('未找到 .pg label 元素，使用默认值 pageNumber = 1')
        }

        return pageNumber
    }
})()

/** 
 * 写到一半废弃的代码
// 获取总页码
function getPageNumber(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const pageLabel = doc.querySelector('.pg label');
    let pageNumber = 1; // 默认值为 1

    if (pageLabel) {
        const pageText = pageLabel.textContent;
        // 提取数字部分，如果提取失败则使用默认值 1
        pageNumber = Number(pageText.match(/\d+/)?.[0]) || 1;
    } else {
        console.warn('未找到 .pg label 元素，使用默认值 pageNumber = 1');
    }

    return pageNumber;
}

// 获取回帖奖励金币总数
function getTotalGold(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const goldElements = doc.querySelectorAll('.psth.xs1');
    let totalGold = 0;

    goldElements.forEach(element => {
        const goldText = element.textContent;
        const goldMatch = goldText.match(/回帖奖励 \+(\d+) 枚金币/);
        if (goldMatch) {
            totalGold += Number(goldMatch[1]); // 提取金币数并累加
        }
    });

    return totalGold;
}

// 获取页面内容
async function fetchPage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('获取页面内容失败:', error);
        return null;
    }
}

// 主函数
async function main() {
    const url = 'https://www.gamemale.com/forum.php?mod=viewthread&tid=152106';
    const html = await fetchPage(url);

    if (html) {
        // 获取总页码
        const totalPages = getPageNumber(html);
        console.log('总页码:', totalPages);

        // 获取当前页面的回帖奖励金币总数
        const totalGold = getTotalGold(html);
        console.log('当前页面回帖奖励金币总数:', totalGold);

        // 如果需要循环获取所有页面的回帖奖励金币总数
        let allPagesGold = 0;
        for (let page = 1; page <= totalPages; page++) {
            const pageUrl = `${url}&page=${page}`;
            const pageHtml = await fetchPage(pageUrl);
            if (pageHtml) {
                const pageGold = getTotalGold(pageHtml);
                allPagesGold += pageGold;
                console.log(`第 ${page} 页回帖奖励金币数: ${pageGold}`);
            }
        }
        console.log('所有页面回帖奖励金币总数:', allPagesGold);
    }
}

// 执行主函数
main();
*/