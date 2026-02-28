import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, Copy, Volume2, Loader2, Languages, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LanguageSelector from "@/components/LanguageSelector";
import { languages, targetLanguages } from "@/lib/languages";
import { translateText } from "@/lib/translate";
import { useToast } from "@/hooks/use-toast";

const TranslatorApp = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSwap = useCallback(() => {
    if (sourceLang === "auto") return;
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInputText(outputText);
    setOutputText(inputText);
  }, [sourceLang, targetLang, inputText, outputText]);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setOutputText(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(msg);
      setOutputText("");
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceLang, targetLang]);

  const handleCopy = useCallback(() => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  }, [outputText, toast]);

  const handleSpeak = useCallback(() => {
    if (!outputText) return;
    const utterance = new SpeechSynthesisUtterance(outputText);
    utterance.lang = targetLang;
    speechSynthesis.speak(utterance);
  }, [outputText, targetLang]);

  const inputLength = inputText.length;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8 md:py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-10"
      >
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Languages className="w-5 h-5 text-primary-foreground" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Lingua</h1>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-3xl bg-card rounded-2xl shadow-[var(--shadow-elevated)] border border-border overflow-hidden"
      >
        {/* Language Bar */}
        <div className="flex items-end gap-2 p-4 md:p-6 pb-4 border-b border-border bg-secondary/30">
          <div className="flex-1">
            <LanguageSelector languages={languages} value={sourceLang} onChange={setSourceLang} label="From" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            disabled={sourceLang === "auto"}
            className="mb-0 shrink-0 rounded-full border-border hover:bg-accent transition-colors"
            aria-label="Swap languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <LanguageSelector languages={targetLanguages} value={targetLang} onChange={setTargetLang} label="To" />
          </div>
        </div>

        {/* Text Areas */}
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Input */}
          <div className="p-4 md:p-6 flex flex-col gap-2">
            <Textarea
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setError(null);
              }}
              className="min-h-[160px] md:min-h-[200px] resize-none border-0 bg-transparent p-0 text-base focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{inputLength} / 500</span>
              <Button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isLoading || inputLength > 500}
                className="rounded-full px-6 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Translating
                  </>
                ) : (
                  "Translate"
                )}
              </Button>
            </div>
          </div>

          {/* Output */}
          <div className="p-4 md:p-6 flex flex-col gap-2 bg-secondary/20">
            <div className="min-h-[160px] md:min-h-[200px] text-base">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Translating...</span>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2 text-destructive"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                ) : outputText ? (
                  <motion.p
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-pre-wrap"
                  >
                    {outputText}
                  </motion.p>
                ) : (
                  <motion.p
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    className="text-muted-foreground"
                  >
                    Translation will appear here...
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Output Actions */}
            <div className="flex items-center gap-2 justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                disabled={!outputText}
                className="rounded-full"
                aria-label="Copy translation"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                disabled={!outputText}
                className="rounded-full"
                aria-label="Listen to translation"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-xs text-muted-foreground"
      >
        Powered by MyMemory Translation API
      </motion.p>
    </div>
  );
};

export default TranslatorApp;
