
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyableFieldProps {
  value: string;
  label?: string;
  description?: string;
}

export function CopyableField({ value, label, description }: CopyableFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <div className="space-y-2">
      {label && <h4 className="font-medium">{label}</h4>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      
      <div className="flex items-center space-x-2">
        <Input 
          value={value} 
          readOnly 
          className="font-mono text-sm flex-1"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleCopy}
          className="h-10 w-10"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
