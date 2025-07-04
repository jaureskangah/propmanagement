
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { paymentSchema, PaymentFormValues } from "./schema/paymentSchema";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocale } from "@/components/providers/LocaleProvider";

interface PaymentFormProps {
  tenantId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ tenantId, onSuccess, onCancel }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLocale();
  
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      status: "paid",
      payment_date: new Date(),
    },
  });

  // Get appropriate locale for date-fns
  const dateFnsLocale = language === 'fr' ? fr : enUS;

  const onSubmit = async (values: PaymentFormValues) => {
    console.log("Submitting payment:", values);
    setIsSubmitting(true);
    
    try {
      // Get date components from the selected date
      const selectedDate = values.payment_date;
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      
      // Format date directly as YYYY-MM-DD without timezone conversion
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log("Selected date object:", selectedDate);
      console.log("Formatted date for storage:", formattedDate);
      
      const { error } = await supabase.from("tenant_payments").insert({
        tenant_id: tenantId,
        amount: parseFloat(values.amount),
        status: values.status,
        payment_date: formattedDate,
      });

      if (error) throw error;

      toast({
        title: t('paymentAdded'),
        description: t('paymentAddedSuccess'),
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error adding payment:", error);
      toast({
        title: t('error'),
        description: t('paymentError'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('amount')} ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('paymentStatus')}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectPaymentStatus')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="paid">{t('paid')}</SelectItem>
                  <SelectItem value="pending">{t('pending')}</SelectItem>
                  <SelectItem value="overdue">{t('overdue')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t('paymentDate')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: dateFnsLocale })
                      ) : (
                        <span>{t('pickDate')}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    locale={dateFnsLocale}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#ea384c] hover:bg-[#ea384c]/90"
          >
            {isSubmitting ? t('adding') : t('add')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
