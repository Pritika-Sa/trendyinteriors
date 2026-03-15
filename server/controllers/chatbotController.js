const axios = require('axios');

// Company information with pricing
const companyContext = {
  name: 'TrendyInterios',
  phone: '+91 99652 99777',
  whatsapp: '+91 90803 98889',
  email: ['trendyinterios@gmail.com', 'info@trendyinterios.com'],
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

exports.sendMessage = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    // Prepare messages for Groq API
    const messages = [
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 256,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const aiResponse = response.data.choices[0]?.message?.content;

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
