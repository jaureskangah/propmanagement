
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How can I start using the platform?",
    answer: "It's very simple! Create a free account, add your properties, and start managing your real estate in minutes. Our intuitive interface will guide you through each step."
  },
  {
    question: "What features are included in the basic subscription?",
    answer: "The basic subscription includes property management, payment tracking, document management, and tenant communication. You have access to all essential features for efficient management."
  },
  {
    question: "Can I manage multiple properties?",
    answer: "Yes, you can manage as many properties as you want. Our platform is designed to adapt to your real estate portfolio, whether you have one or multiple properties."
  },
  {
    question: "How does tenant communication work?",
    answer: "Our integrated messaging system enables direct and efficient communication with your tenants. You can send notifications, respond to requests, and share documents, all from a centralized interface."
  },
  {
    question: "Is my data secure?",
    answer: "Security is our priority. All data is encrypted and securely stored. We use the latest security technologies to protect your information and that of your tenants."
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export your data at any time in different formats (PDF, Excel). This allows you to keep track of your activity and generate customized reports."
  }
];

export default function FAQ() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto">
            Find quick answers to your questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-0 sm:px-4">
          <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white border border-red-100 rounded-lg px-3 md:px-4 hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-3 md:py-4 text-slate-900 font-medium text-sm md:text-base pr-2">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 text-sm md:text-base pb-3 md:pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
