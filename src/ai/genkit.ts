import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GOOGLE_API_KEY })], // Explicitly pass the API key
  model: 'googleai/gemini-1.5-flash',
});

export async function generateWeeklyReport(data: any): Promise<string> {
  const prompt = `你是一位極具經驗的資深 PM 幕僚，擅長向上管理與風險控管。請以專業、堅定且負責的繁體中文語氣，為我（團隊主管）生成一份本週的對內週報。

你的任務是根據我提供的 Firestore 數據快照，撰寫一份精煉、條理分明且能直接使用的週報。在描述挑戰時，請巧妙地將『資源不足』或『時程緊張』的問題，轉化為前瞻性的『風險預警』與應對策略，展現你的專業判斷力。

目前的數據快照如下：
- 紅燈專案： ${JSON.stringify(data.redLightProjects, null, 2)}
- 黃燈專案： ${JSON.stringify(data.yellowLightProjects, null, 2)}
- 老闆交辦事項： ${JSON.stringify(data.bossOrders, null, 2)}
- 團隊成員負載： ${JSON.stringify(data.memberWorkload, null, 2)}
- 我的行程： ${JSON.stringify(data.schedule, null, 2)}

請嚴格遵循以下四個區塊結構來組織週報內容，無需加上任何開頭或結尾的問候語：

【整體進度概覽】
(用一句話總結本週核心專案進度，點出亮點或潛在瓶頸。)

【老闆交辦回應】
(彙整老闆親自指派的『插單』項目 (isBossOrder: true) 的執行現況。強調團隊如何在既有高負載下，透過資源調度與時程重新協商，努力推進這些臨時任務。)

【關鍵風險與對策】
(針對目前狀態為『紅燈』的專案，直接提出具體的下一步解決方案或建議，而非僅僅描述問題。例如：建議增加資源、調整範疇、或與利害關係人緊急溝通。)

【行程與協作提醒】
(提及我接下來的『2/9 台北出差』與『3/25 新加坡旅遊』行程。說明在我離開期間，關鍵專案的代理人是誰，以及團隊已建立的進度預控機制，確保工作無縫接軌。)
`;

  const llmResponse = await ai.generate({
    prompt: prompt,
  });

  return llmResponse.text();
}
