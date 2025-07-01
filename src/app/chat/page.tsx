"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
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
  const [step, setStep] = useState(0);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const addBotMessageWithTyping = (text: string, delay: number, onComplete?: () => void) => {
    setTimeout(() => {
      setIsBotTyping(true);
      setTimeout(() => {
        addBotMessage(text);
        setIsBotTyping(false);
        if (onComplete) onComplete();
      }, 1000 + Math.random() * 500); // Simulate typing
    }, delay);
  };

  useEffect(() => {
    if (step === 0 && amount > 0) {
      addBotMessageWithTyping(`Olá! Sou o assistente virtual do Nubank.`, 500);
      addBotMessageWithTyping(`Vi que você tem interesse em um empréstimo no valor de ${formatCurrency(amount)} em ${installments}x de ${formatCurrency(monthlyPayment)}. Correto?`, 2000, () => setStep(1));
    }
  }, [step, amount, installments, monthlyPayment]);
  
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isBotTyping]);

  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { id: prev.length, text, sender: 'bot' }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: prev.length, text, sender: 'user' }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping) return;

    addUserMessage(input);
    const userInput = input.toLowerCase();
    setInput('');

    if (step === 1) {
      if (userInput.includes('sim') || userInput.includes('correto')) {
        addBotMessageWithTyping(`Ótimo! Para confirmar a contratação, por favor, digite "confirmar empréstimo".`, 500, () => setStep(2));
      } else {
        addBotMessageWithTyping(`Entendi. Vou te redirecionar para a página de simulação para que você possa ajustar os valores.`, 500);
        setTimeout(() => {
          router.back();
        }, 3000);
      }
    } else if (step === 2) {
       if (userInput.includes('confirmar empréstimo')) {
         addBotMessageWithTyping(`Perfeito! Processando sua solicitação...`, 500);
         addBotMessageWithTyping(`Tudo certo! O valor de ${formatCurrency(amount)} será creditado na sua conta em alguns instantes.`, 2500);
         addBotMessageWithTyping(`Obrigado por usar o Nubank! Se precisar de algo mais, é só chamar.`, 4000, () => setStep(3));
       } else {
         addBotMessageWithTyping(`Não entendi. Para prosseguir, por favor, digite "confirmar empréstimo". Se quiser alterar os valores, digite "voltar".`, 500);
       }
    } else {
        addBotMessageWithTyping(`No momento, só consigo te ajudar com a contratação do empréstimo. Para outros assuntos, acesse nosso app ou site.`, 500);
    }
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
              disabled={step === 3 || isBotTyping}
              className="h-12 text-base"
            />
            <Button type="submit" size="icon" disabled={step === 3 || isBotTyping} className="h-12 w-12 shrink-0">
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}