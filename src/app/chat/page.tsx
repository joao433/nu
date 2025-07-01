"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatWithLoanAssistant, ChatWithLoanAssistantInput } from '@/ai/flows/loan-assistant-flow';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const amount = Number(searchParams.get('amount') || 0);
  const installments = Number(searchParams.get('installments') || 0);
  const monthlyPayment = Number(searchParams.get('monthlyPayment') || 0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isChatFinished, setIsChatFinished] = useState(false);

  const getBotResponse = useCallback(async (currentMessages: Message[]) => {
    setIsBotTyping(true);

    const flowInput: ChatWithLoanAssistantInput = {
      messages: currentMessages.map(msg => ({
          role: msg.sender,
          content: msg.text,
      })),
      amount: formatCurrency(amount),
      installments: installments.toString(),
      monthlyPayment: formatCurrency(monthlyPayment),
    };

    try {
      const result = await chatWithLoanAssistant(flowInput);
      const botResponse = result.response;
      
      setMessages(prev => [...prev, { id: crypto.randomUUID(), text: botResponse, sender: 'bot' }]);

      if (botResponse.toLowerCase().includes('redirecionar')) {
        setIsChatFinished(true);
        setTimeout(() => router.back(), 3000);
      }
      if (botResponse.toLowerCase().includes('tudo certo!')) {
        setIsChatFinished(true);
      }

    } catch (error) {
      console.error("Error calling AI flow:", error);
      setMessages(prev => [...prev, { id: crypto.randomUUID(), text: "Desculpe, estou com um problema no momento. Tente novamente mais tarde.", sender: 'bot' }]);
    } finally {
      setIsBotTyping(false);
    }
  }, [amount, installments, monthlyPayment, router]);


  useEffect(() => {
    // Initial greeting from bot
    if (messages.length === 0) {
      getBotResponse([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array is intentional to run only once.

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isBotTyping]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping || isChatFinished) return;

    const userMessage: Message = { id: crypto.randomUUID(), text: input, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    
    await getBotResponse(newMessages);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-card">
      <header className="p-4 border-b border-primary/50 flex items-center gap-4 bg-primary text-primary-foreground sticky top-0 z-10 shrink-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/20" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
        </Button>
        <Avatar>
          <AvatarImage src="https://placehold.co/40x40/FFFFFF/820ad1.png?text=N" data-ai-hint="logo" />
          <AvatarFallback>NU</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">Assistente Nubank</p>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <p className="text-xs text-primary-foreground/80">Online</p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-4 p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end gap-3 w-full ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src="https://placehold.co/40x40/FFFFFF/820ad1.png?text=N" data-ai-hint="logo" />
                    <AvatarFallback>NU</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-muted rounded-br-lg'
                      : 'bg-primary text-primary-foreground rounded-bl-lg'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            {isBotTyping && (
                <div className="flex items-end gap-3 w-full justify-start">
                    <Avatar className="h-8 w-8 self-start">
                        <AvatarImage src="https://placehold.co/40x40/FFFFFF/820ad1.png?text=N" data-ai-hint="logo" />
                        <AvatarFallback>NU</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-2xl px-4 py-3 text-sm md:text-base bg-primary text-primary-foreground rounded-bl-lg">
                        <div className="flex items-center justify-center gap-1.5 h-5">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground/70"></span>
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground/70 [animation-delay:0.15s]"></span>
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary-foreground/70 [animation-delay:0.3s]"></span>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-card shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              autoComplete="off"
              disabled={isChatFinished || isBotTyping}
              className="h-12 text-base"
            />
            <Button type="submit" size="icon" disabled={isChatFinished || isBotTyping} className="h-12 w-12 shrink-0">
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
