// Mock API service for development - replace with real API endpoints in production

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  async createNewChat(): Promise<{ chatId: string; success: boolean }> {
    await delay(500);
    const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    return { chatId, success: true };
  },

  async uploadPdf(file: File, chatId: string): Promise<{ success: boolean; message: string; fileName?: string }> {
    await delay(2000); // Simulate upload time
    
    // Simulate random success/failure for demo
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      return {
        success: true,
        message: 'PDF uploaded successfully',
        fileName: file.name
      };
    } else {
      return {
        success: false,
        message: 'Upload failed. Please try again.'
      };
    }
  },

  async sendMessage(chatId: string, message: string): Promise<{ response: string; success: boolean }> {
    await delay(1000 + Math.random() * 2000); // Simulate processing time
    
    // Mock intelligent responses based on common PDF chat scenarios
    const responses = [
      "Based on the document you've uploaded, I can see that this relates to your question about " + message.toLowerCase() + ". Let me provide you with a detailed analysis...",
      "Great question! Looking at the PDF content, I found several relevant sections that address your inquiry. Here's what I discovered...",
      "That's an interesting point you've raised. From my analysis of the document, I can provide the following insights...",
      "I've searched through the uploaded document and found information that directly relates to your question. Here's a comprehensive answer...",
      "Based on the content in your PDF, I can help clarify this topic. The document mentions several key points about " + message.toLowerCase() + "...",
      "Thank you for that question! I've analyzed the relevant sections in your document and here's what I found...",
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      response: randomResponse,
      success: true
    };
  }
};

// Override fetch for API endpoints in development
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = async (url: RequestInfo | URL, options?: RequestInit) => {
    const urlString = url.toString();
    
    if (urlString.includes('/api/new-chat')) {
      const result = await mockApiService.createNewChat();
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (urlString.includes('/api/pdf-upload')) {
      const formData = options?.body as FormData;
      const file = formData?.get('pdf') as File;
      const chatId = formData?.get('chatId') as string;
      
      if (file && chatId) {
        const result = await mockApiService.uploadPdf(file, chatId);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (urlString.includes('/api/send-message')) {
      const body = JSON.parse(options?.body as string);
      const result = await mockApiService.sendMessage(body.chatId, body.message);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Fall back to original fetch for other requests
    return originalFetch(url, options);
  };
}