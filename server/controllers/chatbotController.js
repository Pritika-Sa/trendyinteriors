const axios = require('axios');
const pdfParse = require('pdf-parse');
const { sendAdminEmail } = require('../utils/mail');

// Company information with pricing
const companyContext = {
  name: 'TrendyInterios',
  phone: '+91 99652 99777',
  whatsapp: '+91 90803 98889',
  email: ['trendyadmin123@gmail.com', 'info@trendyinterios.com'],
  location: '138, Muthugoundampalayam, Sathy-Erode Road, Opp. TNK School, Kavindapadi, Erode, Tamilnadu - 638 455',
  workingHours: '09:00 AM - 07:00 PM',
  services: [
    'Home Interior',
    'Office Interior',
    'Modular Kitchen',
    'Renovation',
    'Custom Design'
  ],
  // Approximate pricing per square foot (in INR)
  pricingRanges: {
    'basic': { min: 500, max: 1000, description: 'Basic Interior Design (consultation + space planning)' },
    'standard': { min: 1000, max: 2000, description: 'Standard Interior Design (includes materials & execution)' },
    'premium': { min: 2000, max: 5000, description: 'Premium Interior Design (luxury materials & custom designs)' },
    'modularKitchen': { min: 1500, max: 3000, description: 'Modular Kitchen (per running foot)' },
    'renovation': { min: 800, max: 2500, description: 'Renovation Service (depends on scope)' }
  }
};

// System prompt for the chatbot
const systemPrompt = `You are a helpful customer service chatbot for TrendyInterios, a premium interior design company in Erode, India.

Company Information:
- Name: ${companyContext.name}
- Phone: ${companyContext.phone}
- WhatsApp: ${companyContext.whatsapp}
- Email: ${companyContext.email.join(', ')}
- Location: ${companyContext.location}
- Working Hours: ${companyContext.workingHours}
- Services: ${companyContext.services.join(', ')}

Approximate Pricing Ranges (Per Sq.ft in INR):
- Basic Interior Design: ₹500 - ₹1,000/sq.ft (consultation + space planning)
- Standard Interior Design: ₹1,000 - ₹2,000/sq.ft (includes materials & execution)
- Premium Interior Design: ₹2,000 - ₹5,000/sq.ft (luxury materials & custom designs)
- Modular Kitchen: ₹1,500 - ₹3,000/running foot
- Renovation Service: ₹800 - ₹2,500/sq.ft (depends on scope)

Important Notes on Pricing:
- These are approximate ranges and can vary based on:
  * Project scope and complexity
  * Materials and finishes selected
  * Design customization level
  * Current market rates
  * Location and accessibility
- Final quotation will be provided after site visit and detailed requirement discussion
- Offer site visit/inspection for accurate quotation

Your responsibilities:
1. Answer questions about services, pricing, and quotations
2. When asked for quotation, ask about:
   * Type of space (apartment, house, office, etc.)
   * Total area in sq ft
   * Type of service (basic, standard, premium)
   * Specific requirements (kitchen, bedroom, living area, etc.)
3. Based on their requirements, provide approximate quotation using the pricing ranges
4. Always mention that final quote depends on site visit
5. Provide contact information ONLY when:
   * Customer explicitly asks "how to contact?" or "contact details?"
   * Customer wants to book a consultation
   * Customer requests a site visit
6. Be friendly, professional, and informative
7. Do NOT mention contact details in every response

Guidelines:
- When providing quote, show calculations clearly (e.g., area × rate)
- Always disclaimer: "This is an approximate estimate. Final quotation will be provided after site inspection"
- Keep responses concise but informative
- Only use contact details when explicitly requested
- Be warm and welcoming to potential customers
- Encourage them to ask specific questions about services, pricing, or design options`;

const QUOTE_DISCLAIMER = 'This is an approximate estimate. Final quotation will be provided after site inspection.';
const MEETING_EMAIL_TO = 'trendyinteriors123@gmail.com';

const MEETING_FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'email', label: 'Email Address' },
  { key: 'preferredDate', label: 'Preferred Meeting Date' },
  { key: 'preferredTime', label: 'Preferred Time Slot' },
  { key: 'projectType', label: 'Project Type (home/office/etc.)' },
  { key: 'propertyLocation', label: 'Property Location / Site Address' },
];

const safeJsonParse = (value, fallback) => {
  try {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value || fallback;
  } catch (_err) {
    return fallback;
  }
};

const extractAreaFromText = (text = '') => {
  const normalized = text.replace(/,/g, '').toLowerCase();

  const sqFtMatch = normalized.match(/(\d{3,6}(?:\.\d+)?)\s*(sq\.?\s*ft|sqft|sft|ft2|ft\^2|square\s*feet)/i);
  if (sqFtMatch) {
    return Math.round(Number(sqFtMatch[1]));
  }

  const sqMMatch = normalized.match(/(\d{2,5}(?:\.\d+)?)\s*(sq\.?\s*m|sqm|m2|m\^2|square\s*meter)/i);
  if (sqMMatch) {
    return Math.round(Number(sqMMatch[1]) * 10.7639);
  }

  return null;
};

const callGroq = async ({ messages, model = 'llama-3.1-8b-instant', maxTokens = 512, temperature = 0.3 }) => {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      }
    }
  );

  return response.data?.choices?.[0]?.message?.content;
};

const parseAnalysisJson = (rawContent) => {
  if (!rawContent) return null;

  const direct = safeJsonParse(rawContent, null);
  if (direct) return direct;

  const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  return safeJsonParse(jsonMatch[0], null);
};

const analyzePdfFloorPlan = async (pdfBuffer) => {
  const parsed = await pdfParse(pdfBuffer);
  const text = (parsed?.text || '').slice(0, 10000);
  const regexArea = extractAreaFromText(text);

  const analysisPrompt = `Extract floor-plan details from the text and return ONLY valid JSON with this schema:
{
  "detectedAreaSqFt": number | null,
  "serviceTier": "basic" | "standard" | "premium" | null,
  "spaceBreakdown": [{"name": string, "areaSqFt": number | null}],
  "assumptions": string[],
  "confidence": "low" | "medium" | "high"
}

PDF text content:
${text || 'No readable text extracted from PDF.'}`;

  let aiAnalysis = null;
  try {
    const content = await callGroq({
      messages: [{ role: 'user', content: analysisPrompt }],
      maxTokens: 450,
      temperature: 0.1,
    });
    aiAnalysis = parseAnalysisJson(content);
  } catch (_err) {
    aiAnalysis = null;
  }

  return {
    source: 'pdf',
    extractedTextAvailable: Boolean(text),
    detectedAreaSqFt: aiAnalysis?.detectedAreaSqFt || regexArea || null,
    serviceTier: aiAnalysis?.serviceTier || null,
    spaceBreakdown: Array.isArray(aiAnalysis?.spaceBreakdown) ? aiAnalysis.spaceBreakdown : [],
    assumptions: Array.isArray(aiAnalysis?.assumptions) ? aiAnalysis.assumptions : [],
    confidence: aiAnalysis?.confidence || (text ? 'medium' : 'low')
  };
};

const analyzeImageFloorPlan = async (file) => {
  const base64Image = file.buffer.toString('base64');
  const mimeType = file.mimetype || 'image/jpeg';

  const imagePrompt = `Analyze this interior floor-plan image and return ONLY valid JSON with this schema:
{
  "detectedAreaSqFt": number | null,
  "serviceTier": "basic" | "standard" | "premium" | null,
  "spaceBreakdown": [{"name": string, "areaSqFt": number | null}],
  "assumptions": string[],
  "confidence": "low" | "medium" | "high"
}

If exact area is not visible, infer a practical approximate area and mention assumptions.`;

  let aiAnalysis = null;

  try {
    const content = await callGroq({
      model: 'llama-3.2-11b-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: imagePrompt },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ],
      maxTokens: 450,
      temperature: 0.1,
    });
    aiAnalysis = parseAnalysisJson(content);
  } catch (_err) {
    aiAnalysis = null;
  }

  return {
    source: 'image',
    detectedAreaSqFt: aiAnalysis?.detectedAreaSqFt || null,
    serviceTier: aiAnalysis?.serviceTier || null,
    spaceBreakdown: Array.isArray(aiAnalysis?.spaceBreakdown) ? aiAnalysis.spaceBreakdown : [],
    assumptions: Array.isArray(aiAnalysis?.assumptions) ? aiAnalysis.assumptions : ['Area inferred from visual floor-plan proportions.'],
    confidence: aiAnalysis?.confidence || 'low'
  };
};

const buildQuotation = (analysis) => {
  const normalizedTier = ['basic', 'standard', 'premium'].includes(analysis?.serviceTier)
    ? analysis.serviceTier
    : 'standard';

  const areaSqFt = Number(analysis?.detectedAreaSqFt) > 0 ? Math.round(Number(analysis.detectedAreaSqFt)) : null;

  if (!areaSqFt) {
    return {
      tier: normalizedTier,
      areaSqFt: null,
      minAmount: null,
      maxAmount: null,
      rateMin: companyContext.pricingRanges[normalizedTier].min,
      rateMax: companyContext.pricingRanges[normalizedTier].max,
    };
  }

  const rate = companyContext.pricingRanges[normalizedTier];

  return {
    tier: normalizedTier,
    areaSqFt,
    minAmount: areaSqFt * rate.min,
    maxAmount: areaSqFt * rate.max,
    rateMin: rate.min,
    rateMax: rate.max,
  };
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const buildMeetingEmailHtml = (meeting) => {
  const safe = (value) => (value ? String(value) : 'Not provided');

  return `
    <div style="font-family:Segoe UI,Tahoma,sans-serif;max-width:680px;margin:0 auto;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden;">
      <div style="background:#1f1f1f;color:#d4af37;padding:18px 20px;font-size:20px;font-weight:700;">TrendyInterios - Meeting Request</div>
      <div style="padding:20px;background:#fff;">
        <p style="margin:0 0 14px;color:#333;">A user requested a meeting through chatbot. Details are below:</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Name</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.name)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Phone</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.phone)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Email</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.email)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Preferred Date</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.preferredDate)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Preferred Time</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.preferredTime)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Project Type</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.projectType)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Property Location</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.propertyLocation)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #eee;font-weight:600;">Additional Notes</td><td style="padding:8px;border:1px solid #eee;">${safe(meeting.notes)}</td></tr>
        </table>
      </div>
    </div>
  `;
};

const isLikelyMeetingIntent = (text = '') => /schedule|book|meeting|consultation|site\s*visit|appointment|call\s*back/i.test(text);

const parseMeetingJson = (rawContent) => {
  const parsed = parseAnalysisJson(rawContent);
  if (!parsed || typeof parsed !== 'object') return null;
  return parsed;
};

const extractMeetingRequestData = async ({ conversationHistory, userMessage }) => {
  const historyText = (conversationHistory || [])
    .slice(-8)
    .map((item) => `${item.role}: ${item.content}`)
    .join('\n');

  const prompt = `Identify whether the user is requesting to schedule a meeting/consultation/site visit, then extract details.
Return ONLY valid JSON with this exact schema:
{
  "wantsMeeting": boolean,
  "submitRequest": boolean,
  "name": string | null,
  "phone": string | null,
  "email": string | null,
  "preferredDate": string | null,
  "preferredTime": string | null,
  "projectType": string | null,
  "propertyLocation": string | null,
  "notes": string | null
}

Rules:
- wantsMeeting=true only when user intent is to schedule/arrange a meeting.
- submitRequest=true only if user wants meeting and all required details are already available from chat history + latest message.
- Keep unknown values as null.

Conversation:
${historyText || 'No previous history'}

Latest user message:
${userMessage}`;

  const content = await callGroq({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    maxTokens: 300,
    temperature: 0.1,
  });

  return parseMeetingJson(content);
};

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
const isValidPhone = (value = '') => /^(\+?\d[\d\s-]{8,15})$/.test(String(value).trim());

const getMissingMeetingFields = (meetingData) => {
  const missing = [];

  MEETING_FIELDS.forEach((field) => {
    const value = meetingData?.[field.key];
    if (!value || !String(value).trim()) {
      missing.push(field.label);
    }
  });

  if (meetingData?.email && !isValidEmail(meetingData.email)) {
    missing.push('Valid Email Address');
  }

  if (meetingData?.phone && !isValidPhone(meetingData.phone)) {
    missing.push('Valid Phone Number with country code');
  }

  return [...new Set(missing)];
};

const buildMeetingMissingInfoResponse = (missingFields) => {
  const askList = missingFields.slice(0, 5).map((field) => `- ${field}`).join('\n');
  return `Sure, I can schedule a meeting for you. Please share the following details:\n${askList}\n\nOnce you provide these, I will confirm and submit your meeting request.`;
};

const sendMeetingRequestEmail = async (meetingData) => {
  await sendAdminEmail({
    to: MEETING_EMAIL_TO,
    subject: `📅 Chatbot Meeting Request - ${meetingData.name} (${meetingData.projectType})`,
    html: buildMeetingEmailHtml(meetingData),
    text: `Meeting Request\nName: ${meetingData.name}\nPhone: ${meetingData.phone}\nEmail: ${meetingData.email}\nDate: ${meetingData.preferredDate}\nTime: ${meetingData.preferredTime}\nProject Type: ${meetingData.projectType}\nLocation: ${meetingData.propertyLocation}\nNotes: ${meetingData.notes || 'N/A'}`,
  });
};

const buildAttachmentQuoteResponse = ({ fileName, analysis, quotation, userMessage }) => {
  const tierLabel = quotation.tier.charAt(0).toUpperCase() + quotation.tier.slice(1);
  const breakdown = analysis.spaceBreakdown
    .filter((space) => space?.name)
    .slice(0, 6)
    .map((space) => `- ${space.name}${space.areaSqFt ? `: ${space.areaSqFt} sq.ft` : ''}`)
    .join('\n');

  if (!quotation.areaSqFt) {
    return `I reviewed your attached file (${fileName}), but I could not confidently detect the total floor area from it.

To provide an approximate quotation, please share:
- Total area in sq.ft
- Preferred package (Basic / Standard / Premium)
- Required spaces (kitchen, bedroom, living, etc.)

Current suggested rate (${tierLabel}): ${formatCurrency(quotation.rateMin)} - ${formatCurrency(quotation.rateMax)} per sq.ft.

${QUOTE_DISCLAIMER}`;
  }

  return `I analyzed your attached floor plan (${fileName}) and generated an approximate quotation.

Estimated floor area: ${quotation.areaSqFt} sq.ft
Selected package: ${tierLabel}
Rate considered: ${formatCurrency(quotation.rateMin)} - ${formatCurrency(quotation.rateMax)} per sq.ft
Approx quotation: ${formatCurrency(quotation.minAmount)} - ${formatCurrency(quotation.maxAmount)}

${breakdown ? `Detected spaces:\n${breakdown}\n\n` : ''}${analysis.assumptions?.length ? `Assumptions:\n${analysis.assumptions.slice(0, 3).map((assumption) => `- ${assumption}`).join('\n')}\n\n` : ''}${userMessage ? `You also asked: "${userMessage}"\n\n` : ''}${QUOTE_DISCLAIMER}`;
};

exports.sendMessage = async (req, res) => {
  try {
    const { message = '' } = req.body;
    const conversationHistory = safeJsonParse(req.body.conversationHistory, []);
    const attachedFile = req.file;
    const normalizedMessage = typeof message === 'string' ? message.trim() : '';

    if (!normalizedMessage && !attachedFile) {
      return res.status(400).json({ error: 'Message or attachment is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const shouldCheckMeetingIntent = isLikelyMeetingIntent(normalizedMessage) || conversationHistory.some((entry) =>
      entry?.role === 'assistant' && /schedule a meeting|meeting request|share the following details/i.test(entry?.content || '')
    );

    if (shouldCheckMeetingIntent && normalizedMessage) {
      let meetingData = null;

      try {
        meetingData = await extractMeetingRequestData({
          conversationHistory,
          userMessage: normalizedMessage,
        });
      } catch (_err) {
        meetingData = null;
      }

      if (meetingData?.wantsMeeting) {
        const missingFields = getMissingMeetingFields(meetingData);

        if (missingFields.length > 0 || !meetingData.submitRequest) {
          return res.status(200).json({
            success: true,
            message: buildMeetingMissingInfoResponse(missingFields.length ? missingFields : MEETING_FIELDS.map((field) => field.label)),
            timestamp: new Date(),
            meetingFlow: {
              status: 'collecting-info',
              missingFields
            }
          });
        }

        await sendMeetingRequestEmail(meetingData);

        return res.status(200).json({
          success: true,
          message: `Great! Your meeting request has been scheduled and sent to our team.\n\nDetails received:\n- Name: ${meetingData.name}\n- Date: ${meetingData.preferredDate}\n- Time: ${meetingData.preferredTime}\n- Project: ${meetingData.projectType}\n\nOur team will contact you shortly on ${meetingData.phone} or ${meetingData.email}.`,
          timestamp: new Date(),
          meetingFlow: {
            status: 'scheduled'
          }
        });
      }
    }

    if (attachedFile) {
      let analysis = null;

      if (attachedFile.mimetype === 'application/pdf') {
        analysis = await analyzePdfFloorPlan(attachedFile.buffer);
      } else if (attachedFile.mimetype?.startsWith('image/')) {
        analysis = await analyzeImageFloorPlan(attachedFile);
      } else {
        return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or image file.' });
      }

      const quotation = buildQuotation(analysis);
      const responseMessage = buildAttachmentQuoteResponse({
        fileName: attachedFile.originalname,
        analysis,
        quotation,
        userMessage: normalizedMessage
      });

      return res.status(200).json({
        success: true,
        message: responseMessage,
        timestamp: new Date(),
        quotation: {
          areaSqFt: quotation.areaSqFt,
          tier: quotation.tier,
          minAmount: quotation.minAmount,
          maxAmount: quotation.maxAmount,
          confidence: analysis.confidence
        }
      });
    }

    const messages = [
      ...conversationHistory,
      { role: 'user', content: normalizedMessage }
    ];

    const aiResponse = await callGroq({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      model: 'llama-3.1-8b-instant',
      maxTokens: 256,
      temperature: 0.7,
    });

    if (!aiResponse) {
      return res.status(500).json({ error: 'No response from AI' });
    }

    res.status(200).json({
      success: true,
      message: aiResponse,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Chatbot error:', error.message);
    console.error('Error response data:', error.response?.data);
    
    let errorMessage = 'Unable to process your message. Please try again later.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Authentication error with AI service. Please check your API key configuration.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Invalid request to AI service. Please check your configuration.';
      console.error('Bad Request details:', error.response?.data);
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    }

    res.status(error.response?.status || 500).json({
      success: false,
      error: errorMessage
    });
  }
};
