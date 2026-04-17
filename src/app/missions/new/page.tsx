import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MissionCreateForm } from "@/components/missions/mission-create-form";

export const metadata = {
  title: "Publier une mission | Les Retraités Travaillent",
};

export default async function NewMissionPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/missions/new");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role, company_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "company") {
    redirect("/missions");
  }

  return (
    <main className="min-h-screen bg-neutral-cream pb-20">
      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-900 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm uppercase tracking-wider text-white/60">
            Job board B2B
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
            Publier une mission
          </h1>
          <p className="mt-2 max-w-2xl text-white/70">
            Décrivez votre besoin et accédez à un vivier d&apos;experts seniors
            (anciens dirigeants, consultants, artisans, cadres…).
          </p>
        </div>
      </div>

      <section className="mx-auto -mt-4 max-w-3xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-elevated">
          <MissionCreateForm />
        </div>
      </section>
    </main>
  );
}
