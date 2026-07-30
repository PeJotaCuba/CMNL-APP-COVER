/**
 * Utility to sanitize object keys for Convex compatibility.
 * Removes accents and spaces from keys.
 */

export function sanitizeKeys(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeKeys);
  }
  
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      // Remove accents and replace spaces/hyphens with underscores
      let safeKey = key
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/\s+/g, "_")            // Replace spaces with underscores
        .replace(/-/g, "_")              // Replace hyphens with underscores
        .replace(/[^a-zA-Z0-9_]/g, "");  // Remove any other non-alphanumeric chars
      
      // If the key becomes empty, fallback to original or generic string
      if (!safeKey) safeKey = "key";

      res[safeKey] = sanitizeKeys(obj[key]);
    }
    return res;
  }
  
  return obj;
}

export function desanitizeKeys(obj: any): any {
  // Since we are irreversibly modifying keys now (removing accents and spaces),
  // we just return the object as is. If we wanted reversible keys, we'd need a mapping.
  // The user explicitly requested to "clean the field names by removing accents and spaces".
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(desanitizeKeys);
  }
  
  if (typeof obj === 'object') {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = desanitizeKeys(obj[key]);
    }
    return res;
  }
  
  return obj;
}
