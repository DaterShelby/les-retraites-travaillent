import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MarketplaceClient } from "@/components/marketplace/marketplace-client";

export const metadata: Metadata = {
  title: "Marketplace — Trouvez un expert | Les Retraités Travaillent",
  description:
    "Parcourez les services proposés par des retraités experts près de chez vous : bricolage, conseil, garde, jardinage, accompagnement…",
};

interface SearchParams {
  q?: string;
  category?: string;
  city?: string;
  priceMax?: string;
  sort?: "recent" | "rating" | "price_asc" | "price_desc";
  page?: string;
}

const PAGE_SIZE = 24;

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createServerSupabaseClient();
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("services")
    .select(
      `
        id, title, description, category, subcategory,
        price_type, price_amount, city, department, photos, created_at,
        provider:user_profiles!services_provider_id_fkey (
          id, first_name, avatar_url, average_rating, total_reviews,
          is_verified, is_super_pro
        )
      `,
      { count: "exact" }
    )
    .eq("status", "published");

  if (searchParams.q) {
    query = query.textSearch("search_vector", searchParams.q, {
      type: "websearch",
      config: "french",
    });
  }
  if (searchParams.category) query = query.eq("category", searchParams.category);
  if (searchParams.city) query = query.ilike("city", `%${searchParams.city}%`);
  if (searchParams.priceMax) {
    const max = Number(searchParams.priceMax);
    if (!Number.isNaN(max)) query = query.lte("price_amount", max);
  }

  switch (searchParams.sort) {
    case "rating":
      query = query.order("provider(average_rating)", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price_amount", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price_amount", { ascending: false, nullsFirst: false });
      break;
    case "recent":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count } = await query.range(offset, offset + PAGE_SIZE - 1);

  // Categories used as filter chips
  const { data: catRows } = await supabase
    .from("services")
    .select("category")
    .eq("status", "published")
    .not("category", "is", null);

  const categories = Array.from(
    new Set((catRows ?? []).map((r) => r.category as string))
  )
    .filter(Boolean)
    .sort();

  // Supabase types nested fk objects as arrays; flatten + drop nulls.
  const services = (data ?? []).map((row: Record<string, unknown>) => {
    const provider = Array.isArray(row.provider)
      ? (row.provider[0] as Record<string, unknown> | undefined)
      : (row.provider as Record<string, unknown> | undefined);
    return { ...row, provider: provider ?? undefined };
  });

  return (
    <MarketplaceClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      services={services as any}
      total={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      categories={categories}
      searchParams={searchParams}
    />
  );
}
