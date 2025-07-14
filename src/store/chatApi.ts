import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface NewChatResponse {
  chatId: string;
  success: boolean;
}

export interface PdfUploadResponse {
  success: boolean;
  message: string;
  fileName?: string;
}

export interface SendMessageRequest {
  chatId: string;
  message: string;
}

export interface SendMessageResponse {
  response: string;
  success: boolean;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/',
  }),
  tagTypes: ['Chat', 'PDF'],
  endpoints: (builder) => ({
    createNewChat: builder.mutation<NewChatResponse, void>({
      query: () => ({
        url: 'new-chat',
        method: 'POST',
      }),
      invalidatesTags: ['Chat'],
    }),
    uploadPdf: builder.mutation<PdfUploadResponse, { chatId: string; file: File }>({
      query: ({ chatId, file }) => {
        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('chatId', chatId);
        
        return {
          url: 'pdf-upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['PDF'],
    }),
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: ({ chatId, message }) => ({
        url: 'send-message',
        method: 'POST',
        body: { chatId, message },
      }),
    }),
  }),
});

export const {
  useCreateNewChatMutation,
  useUploadPdfMutation,
  useSendMessageMutation,
} = chatApi;