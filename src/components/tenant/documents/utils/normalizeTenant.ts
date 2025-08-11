import { supabase } from "@/integrations/supabase/client";
import type { Tenant } from "@/types/tenant";

// Extracts property name from various tenant.properties shapes
const extractPropertyName = (tenant: Tenant | null | undefined): string => {
  if (!tenant) return "";
  const props: any = (tenant as any).properties;
  if (props) {
    if (Array.isArray(props) && props.length > 0) {
      const first = props[0];
      if (first && typeof first === "object" && "name" in first) return String(first.name || "");
    } else if (typeof props === "object" && "name" in props) {
      return String((props as any).name || "");
    }
  }
  if ((tenant as any).property_name) return String((tenant as any).property_name || "");
  if ((tenant as any).propertyName) return String((tenant as any).propertyName || "");
  return "";
};

export const normalizeTenantForDocuments = async (
  tenant?: Tenant | null
): Promise<Tenant | null> => {
  if (!tenant) return null;

  // First try to get name from existing structure
  let propertyName = extractPropertyName(tenant);

  // If still empty, try fetching via property_id
  if ((!propertyName || propertyName.trim() === "") && tenant.property_id) {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("name")
        .eq("id", tenant.property_id)
        .maybeSingle();
      if (!error && data?.name) {
        propertyName = String(data.name);
      }
    } catch (e) {
      // Silently ignore; we'll just keep placeholder if missing
      try { console.warn("[normalizeTenant] Failed to fetch property name", e); } catch {}
    }
  }

  const normalized: any = {
    ...tenant,
    properties: { name: propertyName || "" },
    property_name: propertyName || (tenant as any)?.property_name || "",
  };

  try { console.log("[normalizeTenant] normalized tenant:", normalized); } catch {}
  return normalized as Tenant;
};
