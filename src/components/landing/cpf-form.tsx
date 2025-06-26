"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Expects a string of 11 digits.
function validateCPF(cpf: string): boolean {
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder: number;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cpf.substring(10, 11))) {
    return false;
  }
  
  return true;
}

const formSchema = z.object({
  cpf: z.preprocess(
    (val) => String(val).replace(/\D/g, ''),
    z.string()
      .length(11, { message: "CPF deve ter 11 dígitos." })
      .refine(validateCPF, { message: "CPF inválido." })
  )
});

export function CpfForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push("/emprestimo");
  }

  return (
    <Card className="w-full max-w-sm shadow-lg border-none bg-card rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-medium">
          Consultar empréstimo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu CPF"
                      {...field}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/\D/g, ''); 
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})(\d)/, '$1.$2');
                        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                        field.onChange(value);
                      }}
                      className="h-12 text-lg"
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12">
              Continuar <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
