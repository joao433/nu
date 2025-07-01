"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
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

  useEffect(() => {
    if (step === 0 && amount > 0) {
      setTimeout(() => {
        addBotMessage(`Olá! Sou o assistente virtual do Nubank.`);
      }, 500);
      setTimeout(() => {
        addBotMessage(`Vi que você tem interesse em um empréstimo no valor de ${formatCurrency(amount)} em ${installments}x de ${formatCurrency(monthlyPayment)}. Correto?`);
        setStep(1);
      }, 1500);
    }
  }, [step, amount, installments, monthlyPayment]);
  
  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);


  const addBotMessage = (text: string) => {
    setMessages(prev => [...prev, { id: prev.length, text, sender: 'bot' }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: prev.length, text, sender: 'user' }]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    const userInput = input.toLowerCase();
    setInput('');

    if (step === 1) {
      if (userInput.includes('sim') || userInput.includes('correto')) {
        setTimeout(() => {
          addBotMessage(`Ótimo! Para confirmar a contratação, por favor, digite "confirmar empréstimo".`);
          setStep(2);
        }, 1000);
      } else {
        setTimeout(() => {
          addBotMessage(`Entendi. Vou te redirecionar para a página de simulação para que você possa ajustar os valores.`);
        }, 1000);
        setTimeout(() => {
          router.back();
        }, 3000);
      }
    } else if (step === 2) {
       if (userInput.includes('confirmar empréstimo')) {
         setTimeout(() => {
            addBotMessage(`Perfeito! Processando sua solicitação...`);
         }, 1000);
         setTimeout(() => {
            addBotMessage(`Tudo certo! O valor de ${formatCurrency(amount)} será creditado na sua conta em alguns instantes.`);
         }, 3000);
         setTimeout(() => {
            addBotMessage(`Obrigado por usar o Nubank! Se precisar de algo mais, é só chamar.`);
            setStep(3);
         }, 4500);
       } else {
         setTimeout(() => {
            addBotMessage(`Não entendi. Para prosseguir, por favor, digite "confirmar empréstimo". Se quiser alterar os valores, digite "voltar".`);
         }, 1000);
       }
    } else {
         setTimeout(() => {
            addBotMessage(`No momento, só consigo te ajudar com a contratação do empréstimo. Para outros assuntos, acesse nosso app ou site.`);
         }, 1000);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 container mx-auto max-w-2xl w-full py-8 flex flex-col">
           <div className="bg-card border rounded-2xl flex flex-col h-[70vh] shadow-lg">
                <div className="p-4 border-b flex items-center gap-4">
                     <Avatar>
                        <AvatarImage src="https://placehold.co/40x40/820ad1/FFFFFF.png?text=N" data-ai-hint="logo" />
                        <AvatarFallback>NU</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold">Assistente Nubank</p>
                        <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                </div>
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-2 ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                             {msg.sender === 'bot' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://placehold.co/40x40/820ad1/FFFFFF.png?text=N" data-ai-hint="logo" />
                                    <AvatarFallback>NU</AvatarFallback>
                                </Avatar>
                            )}
                            <div
                            className={`max-w-xs md:max-w-md rounded-2xl px-4 py-2 ${
                                msg.sender === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-muted rounded-bl-none'
                            }`}
                            >
                            <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            autoComplete="off"
                            disabled={step === 3}
                        />
                        <Button type="submit" size="icon" disabled={step === 3}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
           </div>
        </div>
      </main>
    </div>
  );
}
