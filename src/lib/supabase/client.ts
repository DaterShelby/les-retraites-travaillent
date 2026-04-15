import { createBrowserClient } from "@supabase/ssr";

// Note: En production, remplacer `any` par les types générés via `npx supabase gen types`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createClient(): ReturnType<typeof createBrowserClient<any>> {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function createBrowserSupabaseClient() {
  return createClient();
}
