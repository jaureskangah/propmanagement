import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock, UserCheck } from 'lucide-react';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  isTenant: z.boolean().default(false),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface SignUpFormProps {
  onSuccess: () => void;
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      isTenant: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
            is_tenant_user: values.isTenant,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Please check your email to confirm your account.',
      });
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="John" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <UserCheck className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input placeholder="Doe" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="email" placeholder="john@example.com" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="password" placeholder="••••••" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input type="password" placeholder="••••••" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isTenant"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I am a tenant
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}