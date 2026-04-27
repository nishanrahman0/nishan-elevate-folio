import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { generatePortfolioPdf } from "@/lib/portfolioPdf";
import { toast } from "sonner";

interface Props {
  variant?: "outline" | "hero" | "default";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const DownloadPortfolioButton = ({ variant = "outline", size = "lg", className }: Props) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleDownload = async () => {
    setLoading(true);
    try {
      await generatePortfolioPdf((msg) => setStatus(msg));
      toast.success("Portfolio downloaded!");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to generate PDF: " + (e?.message || "unknown error"));
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{status || "Generating..."}</>
      ) : (
        <><FileDown className="mr-2 h-5 w-5" />Download Portfolio</>
      )}
    </Button>
  );
};

export default DownloadPortfolioButton;
