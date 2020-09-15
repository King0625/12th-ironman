# 2020 it 邦幫忙鐵人賽爬蟲 


## 執行環境
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
1. camp 為好想工作室參賽成員所屬的 camp，若不需要此欄位，則無法使用 slack webhook 提醒的功能
2. slackId 若不需要，則 slack webhook 提醒也無法使用