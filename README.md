# 2020 it 邦幫忙鐵人賽爬蟲
## 專案說明 
1. 透過爬蟲的方式一次監控所有[好想工作室參賽者](https://ithelp.ithome.com.tw/2020-12th-ironman/signup/team/138)的發文狀況，並且為了避免爬爆 [it 邦幫忙網站](https://ithelp.ithome.com.tw/)與優化爬蟲 API，透過 redis 引入 server-side cache

2. 透過 slack webhook，以 node-cron 的方式定時定點提醒尚未發文的成員 -- [/tasks/warning.js](https://github.com/King0625/12th-ironman/blob/master/tasks/warning.js)

    --> 目前設計是[好想工作室](https://www.facebook.com/GoodideasStudio/)專用，請斟酌使用 (參照[前置設定](#running-environment))

<h2 id="running-environment">執行環境</h2>

- node: 12.18.3
- npm: 6.14.6
- redis: 4.0.9

## 前置設定
### 下載套件
`npm install`
### 環境變數
`cp .env.example .env`

備註：
1. REDIS_PASSWORD 視個人需求添加
2. 若不需要 SLACK_WEBHOOK 提醒，於 index.js 刪除此行：`require('./tasks/warning');`

### 參賽成員
`cp members.example.js members.js`

備註：
1. camp 為好想工作室參賽成員所屬的 camp，若不用此欄位，則無法使用 slack webhook 提醒的功能
2. slackId 用途為透過 slack 提醒尚未發文的成員，若不需要此欄位，則 slack webhook 提醒也無法使用

## 執行
`node index.js`