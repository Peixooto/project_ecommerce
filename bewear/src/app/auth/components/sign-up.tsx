"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {useForm} from "react-hook-form"
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter,CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth.client";

const formSchema = z.object({
    email: z.email("E-mail inválido."),
    password: z.string("Senha inválida.").min(8,"Senha inválida."),
    name:z.string("Nome inválido.").trim().min(1,"Nome é obrigatório."),
    passwordConfirmation: z.string("Senha inválida.").min(8,"senha inválida.")
}).refine((data)=>{
    return data.password === data.passwordConfirmation
},{
    error: "As senhas não coincidem.",
    path: ["passwordConfirmation"]
});

type FormValues = z.infer<typeof formSchema>;

const SignUpForm =()=>{
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            email: '',
            password:'',
            name:'',
            passwordConfirmation:''
        },
    });

    async function onSubmit(value: FormValues){
       try{
        await authClient.signUp.email({
          email:value.email,
          password:value.password,
          name:value.name,
          fetchOptions:{
            onSuccess:()=>{
                router.push("/");
            },
            onError:(error)=>{
                if (error.error.code== "USER_ALREADY_EXISTS"){
                  toast.error("E-mail ou senha inválidos");
                  return form.setError("email",{
                    message:"E-mail já cadastrado.",
                });
              }
              toast.error(error.error.message);
            }
          }
        });
       } catch (error){
        console.log(error)
       }
    }

    return (
    <>
    <Card>
      <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Crie uma conta para continuar.</CardDescription>
      </CardHeader>

      <Form {...form}>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardContent className="grid gap-6">          
        <FormField control={form.control} name="name" render={({ field }) => (
         <FormItem>
          <FormLabel>Nome</FormLabel>
          <FormControl>
           <Input placeholder="Digite seu nome" {...field} />
          </FormControl>
          <FormMessage />
         </FormItem>
     )}
 /> 
    
       <FormField control={form.control} name="email" render={({ field }) => (
       <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl > 
         <Input placeholder="Digite seu email" type="email" {...field} />
        </FormControl>
        <FormMessage className="top-1" />
       </FormItem>
     )}
 />
 

 

      <FormField control={form.control} name="password" render={({ field }) => (
       <FormItem>
        <FormLabel>Senha</FormLabel>
        <FormControl>
         <Input placeholder="Digite sua senha" type="password" {...field} />
        </FormControl>
        <FormMessage />
       </FormItem>
     )}
 />
      <FormField control={form.control} name="passwordConfirmation" render={({ field }) => (
       <FormItem>
        <FormLabel>Confirmar senha</FormLabel>
        <FormControl>
         <Input placeholder="Digite sua senha novamente" type="password" {...field} />
        </FormControl>
        <FormMessage />
       </FormItem>
     )}
 />
       </CardContent>
       <CardFooter>
         <Button type="submit">Criar conta</Button>
       </CardFooter>
      </form>
     </Form>
    </Card>
    </>
    );
};

export default SignUpForm