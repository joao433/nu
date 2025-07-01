"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  showButtons?: boolean;
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
  const [isInputDisabled, setIsInputDisabled] = useState(true);

  const addMessage = (text: string, sender: 'user' | 'bot', showButtons = false) => {
    setMessages(prev => {
      const updatedMessages = prev.map(msg => ({ ...msg, showButtons: false }));
      return [...updatedMessages, { id: crypto.randomUUID(), text, sender, showButtons }];
    });
  };
  
  const handleBotResponse = (userResponse?: 'yes' | 'no') => {
    setIsBotTyping(true);
    
    setTimeout(() => {
        setIsBotTyping(false);
        if (userResponse === 'yes') {
            addMessage("Ótimo! Para confirmar e finalizar a contratação, por favor, digite 'confirmar empréstimo'.", 'bot');
            setIsInputDisabled(false);
        } else if (userResponse === 'no') {
            addMessage("Entendi. Vou te redirecionar para a página de simulação para que você possa ajustar os valores.", 'bot');
            setIsInputDisabled(true);
            setTimeout(() => router.back(), 3000);
        }
    }, 1000);
  };

  useEffect(() => {
    if (messages.length === 0) {
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        const greeting = `Olá! Sou o assistente virtual do Nubank. Vi que você tem interesse em um empréstimo no valor de ${formatCurrency(amount)} em ${installments}x de ${formatCurrency(monthlyPayment)}. Correto?`;
        addMessage(greeting, 'bot', true);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isBotTyping]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBotTyping || isInputDisabled) return;

    addMessage(input, 'user');
    const userInput = input.trim().toLowerCase();
    setInput('');
    setIsBotTyping(true);
    
    setTimeout(() => {
        setIsBotTyping(false);
        if (userInput === "confirmar empréstimo") {
            const successMessage = `Tudo certo! O valor de ${formatCurrency(amount)} será creditado na sua conta em alguns instantes. Obrigado por usar o Nubank!`;
            addMessage(successMessage, 'bot');
            setIsInputDisabled(true);
        } else {
            addMessage("Não entendi. Por favor, digite 'confirmar empréstimo' para finalizar.", 'bot');
        }
    }, 1000);
  };
  
  const handleOptionClick = (option: 'yes' | 'no') => {
      const text = option === 'yes' ? 'Sim, correto' : 'Não, quero alterar';
      addMessage(text, 'user');
      handleBotResponse(option);
  }

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
              <div key={msg.id}>
                <div
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
                {msg.showButtons && (
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => handleOptionClick('no')}>Não, quero alterar</Button>
                        <Button size="sm" onClick={() => handleOptionClick('yes')}>Sim, correto</Button>
                    </div>
                )}
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
              disabled={isInputDisabled || isBotTyping}
              className="h-12 text-base"
            />
            <Button type="submit" size="icon" disabled={isInputDisabled || isBotTyping} className="h-12 w-12 shrink-0">
              <Send className="h-6 w-6" />
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
