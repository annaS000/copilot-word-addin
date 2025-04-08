export interface ResearchResult {
  summary: string;
  sources: {
    title: string;
    url?: string;
    description: string;
    relevance: string;
  }[];
}

export interface LLMResponse {
  text: string;
  model: string;
}

// Get the base URL for the Flask backend
const getBaseUrl = () => {
  // Check if we're in development by looking at the hostname
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    return 'http://localhost:5000';  // Default Flask development port
  }
  
  // In production, this should point to your deployed Flask backend
  // You can configure this through your deployment process
  const apiUrl = process.env.VITE_API_URL;
  return apiUrl || window.location.origin;
};

export async function researchTopic(topic: string, model: string): Promise<ResearchResult> {
  try {
    const response = await fetch(`${getBaseUrl()}/llm/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        model,
      }),
      credentials: 'include', // Important for session handling
    });

    if (!response.ok) {
      throw new Error('Research request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Research API error:', error);
    throw error;
  }
}

export async function generateResponse(prompt: string, model: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/llm/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Generation request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Generation API error:', error);
    throw error;
  }
}

export async function improveWriting(text: string, model: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/llm/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Writing improvement request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Improvement API error:', error);
    throw error;
  }
}

export async function summarizeText(text: string, model: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/llm/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Summarization request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Summarization API error:', error);
    throw error;
  }
}

export async function checkGrammar(text: string, model: string): Promise<LLMResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/llm/grammar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Grammar check request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Grammar check API error:', error);
    throw error;
  }
} 