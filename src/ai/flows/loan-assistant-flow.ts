'use server';
/**
 * @fileOverview An AI assistant flow for handling loan confirmation chat.
 *
 * - chatWithLoanAssistant - A function that handles the loan assistant chat conversation.
 * - ChatWithLoanAssistantInput - The input type for the chatWithLoanAssistant function.
 * - ChatWithLoanAssistantOutput - The return type for the chatWithLoanAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const MessageSchema = z.object({
  role: z.enum(['user', 'bot']),
  content: z.string(),
});

export const ChatWithLoanAssistantInputSchema = z.object({
  messages: z
    .array(MessageSchema)
    .describe('The history of the conversation.'),
  amount: z.string().describe('The loan amount.'),
  installments: z.string().describe('The number of installments.'),
  monthlyPayment: z.string().describe('The monthly payment amount.'),
});
export type ChatWithLoanAssistantInput = z.infer<
  typeof ChatWithLoanAssistantInputSchema
>;

export const ChatWithLoanAssistantOutputSchema = z.object({
  response: z.string().describe("The assistant's response."),
});
export type ChatWithLoanAssistantOutput = z.infer<
  typeof ChatWithLoanAssistantOutputSchema
>;

export async function chatWithLoanAssistant(
  input: ChatWithLoanAssistantInput
): Promise<ChatWithLoanAssistantOutput> {
  return loanAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'loanAssistantPrompt',
  input: { schema: ChatWithLoanAssistantInputSchema },
  output: { schema: ChatWithLoanAssistantOutputSchema },
  prompt: `You are a friendly and professional virtual assistant for Nubank. Your task is to guide a user through the confirmation of a pre-approved loan. All your responses must be in Portuguese.

The loan details are:
- Loan Amount: {{amount}}
- Installments: {{installments}}
- Monthly Payment: {{monthlyPayment}}

The user has started a chat with you. The conversation history is below. Your role is to provide the next single response for the 'bot'.

Conversation History:
{{#each messages}}
- {{role}}: {{content}}
{{/each}}

Your instructions:
1. If the conversation history is empty, your first message *must* be a greeting that confirms the loan details and asks if they are correct. Example: "Olá! Sou o assistente virtual do Nubank. Vi que você tem interesse em um empréstimo no valor de R$10.000,00 em 12x de R$990,54. Correto?"
2. If the user confirms the details (e.g., says "sim", "correto", "isso mesmo"), your next step is to ask them to type "confirmar empréstimo" to finalize.
3. If the user types the exact phrase "confirmar empréstimo", your final message must be a success confirmation. Example: "Tudo certo! O valor de {{amount}} será creditado na sua conta em alguns instantes. Obrigado por usar o Nubank!"
4. If the user denies the details (e.g., says "não", "errado") or wants to change the values, you must respond that you will redirect them to the simulation page so they can adjust the values. Example: "Entendi. Vou te redirecionar para a página de simulação para que você possa ajustar os valores."
5. If the user asks about anything else, politely state that you can only help with this loan confirmation right now.
6. Keep your responses short, friendly, and helpful.`,
});

const loanAssistantFlow = ai.defineFlow(
  {
    name: 'loanAssistantFlow',
    inputSchema: ChatWithLoanAssistantInputSchema,
    outputSchema: ChatWithLoanAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
