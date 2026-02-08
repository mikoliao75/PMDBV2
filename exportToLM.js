
const fs = require('fs');
const { mockUsers, mockProjects } = require('./src/lib/data.json');

const projectData = {
  summary: "PM 主管決策看板數據摘要",
  stats: {
    ongoing: mockProjects.filter(p => p.status === '進行中').length,
    atRisk: mockProjects.filter(p => p.status === '有風險' || p.status === '已延遲').length,
    bossOrders: mockProjects.filter(p => p.isBossOrder).length,
  },
  risks: mockProjects
    .filter(p => p.status === '有風險' || p.status === '已延遲')
    .map(p => `${p.name} ${p.status}`),
  personalSchedule: [
    "2/9-2/12 台北出差",
    "2/14-2/22 上海探親",
    "3/25-3/29 新加坡旅遊",
    "3/7 下午 2:45 牙醫看診"
  ]
};

const content = `
# 專案管理決策報告 (2026-02-04)
## 核心指標
- 進行中專案：${projectData.stats.ongoing}
- 風險項目：${projectData.stats.atRisk}
- 本週老闆插單：${projectData.stats.bossOrders}

## 風險項目追蹤
${projectData.risks.map(r => `- ${r}`).join('\n')}

## 醫療與行程提醒
- 牙醫看診：3/7 下午 2:45
- 汽車保養：週五上午 9:30

## 主管行程限制 (需避開決策時段)
${projectData.personalSchedule.map(s => `- ${s}`).join('\n')}
- 固定重訓：每週一、四 20:00-21:00 (目標減重至 68kg)
`;

fs.writeFileSync('For_NotebookLM.md', content);
console.log('✅ 檔案已成功生成！請在左側檔案清單找 For_NotebookLM.md');
