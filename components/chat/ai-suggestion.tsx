// components/chat/ai-suggestion.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface AiSuggestionProps {
  suggestion: string;
  onUseSuggestion: (text: string) => void;
  isLoading: boolean;
}

export const AiSuggestion = ({
  suggestion,
  onUseSuggestion,
  isLoading,
}: AiSuggestionProps) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-2 border-t"
      >
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span>AI is thinking...</span>
        </div>
      </motion.div>
    );
  }

  if (!suggestion) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-2 border-t"
    >
      <div className="flex items-start gap-2">
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          <Sparkles className="h-3 w-3 mr-1" />
          AI Suggestion
        </Badge>
      </div>
      <div className="mt-2 p-2 bg-gray-50 rounded-md text-sm text-gray-700">
        {suggestion}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 h-8 text-xs"
        onClick={() => onUseSuggestion(suggestion)}
      >
        <Send className="h-3 w-3 mr-1" />
        Use Suggestion
      </Button>
    </motion.div>
  );
};
