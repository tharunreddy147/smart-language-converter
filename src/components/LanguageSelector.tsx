import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "@/lib/languages";

interface LanguageSelectorProps {
  languages: Language[];
  value: string;
  onChange: (value: string) => void;
  label: string;
}

const LanguageSelector = ({ languages, value, onChange, label }: LanguageSelectorProps) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full bg-card border-border shadow-[var(--shadow-soft)] font-medium">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default LanguageSelector;
