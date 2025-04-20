
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useLocale } from "../providers/LocaleProvider";

export default function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { name, email, message },
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('contactUs')}
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-[#ea384c]" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('phone')}</h3>
            <p className="text-gray-700 text-center font-medium">{/* Changed text color from text-gray-600 */}
              +1 (506) 781-1872
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-[#ea384c]" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('email')}</h3>
            <p className="text-gray-700 text-center font-medium">{/* Changed text color from text-gray-600 */}
              contact@propmanagement.app
            </p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
            <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-[#ea384c]" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{t('office')}</h3>
            <p className="text-gray-700 text-center font-medium">{/* Changed text color from text-gray-600 */}
              Moncton, New Brunswick
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#ea384c] hover:bg-[#d41f32] text-white px-6 h-11"
                size="lg"
              >
                {t('sendMessage')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('sendMessage')}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">{t('yourName')}</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="mt-1"
                    placeholder={t('yourName')}
                  />
                </div>
                <div>
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                    placeholder={t('yourEmail')}
                  />
                </div>
                <div>
                  <Label htmlFor="message">{t('message')}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    className="mt-1"
                    placeholder={t('message')}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-[#ea384c] hover:bg-[#d41f32] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? t('sending') : t('send')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
