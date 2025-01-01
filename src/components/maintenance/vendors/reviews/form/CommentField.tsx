import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface CommentFieldProps {
  form: UseFormReturn<any>;
}

export const CommentField = ({ form }: CommentFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="comment"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Detailed Comment</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Share your experience with this vendor..."
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};