import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Clock,
  Paperclip,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  typing?: boolean;
}

interface SupportChatProps {
  onBack: () => void;
}

export default function SupportChat({ onBack }: SupportChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Bonjour ! Je suis l'assistant PropManagement. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = [
    "Comment ajouter une propriété ?",
    "Gérer les locataires",
    "Problème de connexion",
    "Questions de facturation"
  ];

  const botResponses: Record<string, string> = {
    "comment ajouter une propriété": "Pour ajouter une propriété, allez dans le menu 'Propriétés' puis cliquez sur 'Ajouter une propriété'. Remplissez les informations requises comme l'adresse, le type de propriété et le nombre d'unités.",
    "gérer les locataires": "Vous pouvez gérer vos locataires depuis la section 'Locataires'. Vous y trouverez toutes les informations sur vos locataires, leurs baux, et vous pourrez ajouter de nouveaux locataires.",
    "problème de connexion": "Si vous avez des problèmes de connexion, vérifiez votre email et mot de passe. Vous pouvez également utiliser 'Mot de passe oublié' sur la page de connexion.",
    "questions de facturation": "Pour toute question de facturation, contactez-nous à contact@propmanagement.app ou appelez le +1 (506) 781-1872. Notre équipe vous assistera avec plaisir.",
    "default": "Je comprends votre question. Pour une assistance plus détaillée, je vous recommande de contacter notre équipe support à contact@propmanagement.app ou d'appeler le +1 (506) 781-1872."
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== "default" && lowerMessage.includes(key)) {
        return response;
      }
    }
    return botResponses.default;
  };

  const handleSendMessage = (content: string = newMessage) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    simulateTyping();

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(content),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-red-100 text-red-600">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Support PropManagement</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  <span>En ligne</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={message.sender === "user" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}>
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-3 ${message.sender === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"}`}>
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 opacity-50" />
                    <span className="text-xs opacity-50">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-red-100 text-red-600">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border shadow-sm rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length === 1 && (
        <div className="p-4 border-t bg-white">
          <p className="text-sm text-gray-600 mb-3">Réponses rapides :</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200 transition-colors"
                onClick={() => handleSendMessage(reply)}
              >
                {reply}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="pr-12"
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!newMessage.trim() || isTyping}
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-red-600 hover:bg-red-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Appuyez sur Entrée pour envoyer
        </p>
      </div>
    </div>
  );
}