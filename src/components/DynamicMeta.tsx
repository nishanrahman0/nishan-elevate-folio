import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DynamicMeta = () => {
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (applied) return;
    const apply = async () => {
      try {
        const { data } = await supabase
          .from("hero_content")
          .select("site_title, logo_url")
          .maybeSingle();
        if (!data) return;

        // Update document title
        if (data.site_title) {
          document.title = data.site_title;
        }

        // Update favicon dynamically
        if (data.logo_url) {
          let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = data.logo_url;
          link.type = "image/png";
        }

        setApplied(true);
      } catch (e) {
        console.error("Failed to load site meta:", e);
      }
    };
    apply();
  }, [applied]);

  return null;
};

export default DynamicMeta;
