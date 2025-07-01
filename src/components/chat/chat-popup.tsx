"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  showButtons?: boolean;
}

interface ChatPopupProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    amount: number;
    installments: number;
    monthlyPayment: number;
}

const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function ChatPopup({ isOpen, setIsOpen, amount, installments, monthlyPayment }: ChatPopupProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
            addMessage("Entendi. Sem problemas. Você pode ajustar os valores na tela anterior.", 'bot');
            setIsInputDisabled(true);
            setTimeout(() => setIsOpen(false), 3000);
        }
    }, 1000);
  };

  useEffect(() => {
    // Reset and start conversation when dialog opens
    if (isOpen) {
      setMessages([]);
      setInput('');
      setIsBotTyping(true);
      setIsInputDisabled(true);

      setTimeout(() => {
        setIsBotTyping(false);
        const greeting = `Olá! Sou o assistente virtual do Nubank. Vi que você tem interesse em um empréstimo no valor de ${formatCurrency(amount)} em ${installments}x de ${formatCurrency(monthlyPayment)}. Correto?`;
        addMessage(greeting, 'bot', true);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, amount, installments, monthlyPayment]);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] p-0 gap-0 grid-rows-[auto_1fr_auto] h-[80vh] max-h-[700px] flex flex-col">
        <DialogHeader className="p-4 border-b flex-row items-center gap-4 space-y-0">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40/FFFFFF/820ad1.png?text=N" data-ai-hint="logo" />
            <AvatarFallback>NU</AvatarFallback>
          </Avatar>
          <div>
             <DialogTitle className="font-bold text-base">Assistente Nubank</DialogTitle>
             <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <p className="text-xs text-muted-foreground">Online</p>
             </div>
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="space-y-4 p-4">
            {messages.map((msg) => (
              <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div
                  className={`flex items-end gap-2 w-full ${
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-muted rounded-br-lg'
                        : 'bg-primary text-primary-foreground rounded-bl-lg'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
                {msg.showButtons && (
                    <div className="flex justify-start gap-2 mt-2 ml-10">
                        <Button variant="outline" size="sm" onClick={() => handleOptionClick('no')}>Não, quero alterar</Button>
                        <Button size="sm" onClick={() => handleOptionClick('yes')}>Sim, correto</Button>
                    </div>
                )}
              </div>
            ))}
            {isBotTyping && (
                <div className="flex items-end gap-2 w-full justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <Avatar className="h-8 w-8 self-start">
                        <AvatarImage src="https://placehold.co/40x40/FFFFFF/820ad1.png?text=N" data-ai-hint="logo" />
                        <AvatarFallback>NU</AvatarFallback>
                    </Avatar>
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-primary text-primary-foreground rounded-bl-lg">
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
        <div className="p-4 border-t bg-background shrink-0">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              autoComplete="off"
              disabled={isInputDisabled || isBotTyping}
              className="h-10 text-base"
            />
            <Button type="submit" size="icon" disabled={isInputDisabled || isBotTyping} className="h-10 w-10 shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
