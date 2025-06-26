"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { ArrowRight } from "lucide-react";

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

const formSchema = z.object({
  cpf: z.string()
    .min(1, { message: "CPF é obrigatório." })
    .transform(value => value.replace(/\D/g, ''))
    .refine(value => value.length === 11, { message: "CPF deve conter 11 dígitos." })
});

export function CpfForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cpf: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    alert("CPF enviado");
    form.reset();
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    value = value.replace(/\D/g, ''); 
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    form.setValue("cpf", value, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-sm shadow-lg border-none bg-card rounded-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-medium">
          Abra sua Conta do Nubank
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
                      onChange={handleCpfChange}
                      className="h-12 text-lg"
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 text-lg font-semibold">
              Continuar <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
