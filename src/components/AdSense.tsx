import { useEffect, useRef } from "react";

interface AdSenseProps {
  adSlot?: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

const AdSense = ({ adSlot = "", adFormat = "auto", className = "" }: AdSenseProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    try {
      // Push ad if adsbygoogle is available
      if (typeof window !== "undefined" && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.log("AdSense not loaded yet");
    }
  }, []);

  return (
    <div ref={adRef} className={`ad-container my-6 flex items-center justify-center ${className}`}>
      <div className="w-full overflow-hidden rounded-lg border border-border/30 bg-muted/20 backdrop-blur-sm">
        <div className="text-center py-1 text-[10px] text-muted-foreground/50 uppercase tracking-wider">
          Advertisement
        </div>
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client="ca-pub-3332518473430238" 
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
        {/* Placeholder shown when no AdSense ID is configured */}
        <div className="min-h-[90px] flex items-center justify-center text-muted-foreground/30 text-sm">
          <span>Ad Space</span>
        </div>
      </div>
    </div>
  );
};

export default AdSense;
