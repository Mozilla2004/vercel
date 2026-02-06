// Vercel Serverless Function for Reply-Decision Engine
// Handles /api/analyze endpoint

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mail } = req.body;

    if (!mail) {
      return res.status(400).json({ error: 'Missing mail content' });
    }

    // Get Qwen API key from environment variables
    const API_KEY = process.env.QWEN_API_KEY;
    if (!API_KEY) {
      console.error('QWEN_API_KEY not configured in environment');
      return res.status(500).json({
        error: 'Server configuration error',
        details: 'QWEN_API_KEY not configured. Please contact administrator.'
      });
    }

    const prompt = `你是"AI-Native 通信判断系统 v1.0"，站在收件人侧，判断邮件是否必须回复。

输出必须是纯 JSON 格式（不要有其他文字）：
{
  "reply_required": "yes" | "no" | "later" | "auto",
  "value_scores": {
    "IV": 0.0~1.0,
    "AV": 0.0~1.0,
    "TV": 0.0~1.0,
    "RV": 0.0~1.0,
    "OV": 0.0~1.0
  },
  "predicted_risk": "不回复可能带来的后果（1-2句话）",
  "recommended_action": "建议动作（1-2句话）",
  "MEA": "最小有效回复草稿（简洁、专业、有礼貌）",
  "SRPsi": {
    "S_structure": "Structure层分析（1-2句话）",
    "R_rhythm": "Rhythm层分析（1-2句话）",
    "Psi_phase": "Phase层分析（1-2句话）"
  }
}

分析下方邮件内容：
${mail}`;

    // Call Qwen API
    const qwenResponse = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!qwenResponse.ok) {
      const errorText = await qwenResponse.text();
      console.error('Qwen API error:', qwenResponse.status, errorText);
      return res.status(500).json({
        error: 'Qwen API request failed',
        status: qwenResponse.status,
        details: errorText
      });
    }

    const qwenData = await qwenResponse.json();
    const result = qwenData.choices?.[0]?.message?.content;

    if (!result) {
      console.error('Invalid Qwen response:', qwenData);
      return res.status(500).json({
        error: 'Invalid response from Qwen API',
        details: 'No content in response'
      });
    }

    // Return the result
    return res.status(200).json({ result });

  } catch (error) {
    console.error('Error in analyze function:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}
