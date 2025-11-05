export function normalizeCat(input) {
      const s = String(input ?? "")
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
      if (!s) return "";
      return s
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-+/g, "-");
    }
    
    export function extractCategoryLabels(product) {
      const out = [];
      const add = (val) => {
        if (!val) return;
        if (Array.isArray(val)) return val.forEach(add);
        if (typeof val === "string") {
          const s = val.trim();
          if (s) out.push(s);
          return;
        }
        if (typeof val === "object") {
          const s =
            val?.categoryName ??
            val?.name ??
            val?.title ??
            val?.label ??
            val?.category ??
            "";
          if (typeof s === "string" && s.trim()) out.push(s.trim());
        }
      };
      add(product?.categoryName);
      add(product?.category);
      add(product?.categories);
      if (Array.isArray(product?.variants)) {
        product.variants.forEach((v) => add(v?.category));
      }
      const seen = new Set();
      return out.filter((s) => {
        const k = s.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }
    
    export function productCategorySlugs(product) {
      return extractCategoryLabels(product).map(normalizeCat).filter(Boolean);
    }
    
    /* ---------------- Token-based matching helpers ---------------- */
    
    const STOP = new Set([
      "and", "or", "the", "for", "to", "of", "a", "an", "kids", "kid", "toy", "toys"
    ]);
    
    export function slugTokens(slug) {
      return String(slug)
        .split("-")
        .map((t) => t.trim())
        .filter((t) => t && !STOP.has(t));
    }
    
    export function matchCategory(selectedSlug, productSlugs) {
      const sel = normalizeCat(selectedSlug);
      if (!sel || sel === "all") return true;
    
      if (productSlugs.includes(sel)) return true;
    
      const selTokens = slugTokens(sel);
      if (!selTokens.length) return false;
    
      for (const ps of productSlugs) {
        if (ps === sel) return true;
        const psTokens = slugTokens(ps);
        if (psTokens.some((t) => selTokens.includes(t))) {
          return true;
        }
      }
      return false;
    }
    