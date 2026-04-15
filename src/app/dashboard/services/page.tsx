import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/shared/empty-state";

export default async function MyServicesPage() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "archived":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publiée";
      case "draft":
        return "Brouillon";
      case "pending_review":
        return "En attente";
      case "paused":
        return "En pause";
      case "archived":
        return "Archivée";
      default:
        return status;
    }
  };

  return (
    <main className="min-h-screen bg-neutral-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-neutral-text mb-2">
              Mes annonces
            </h1>
            <p className="text-body text-gray-600">
              Gérez vos services et les visibilités
            </p>
          </div>
          <Link href="/dashboard/services/new">
            <Button size="lg">Créer une annonce</Button>
          </Link>
        </div>

        {!services || services.length === 0 ? (
          <EmptyState
            title="Aucune annonce"
            description="Commencez par créer votre première annonce pour trouver des clients"
            actionLabel="Créer une annonce"
            onAction={() => {}}
          />
        ) : (
          <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header */}
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      SERVICE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      CATÉGORIE
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      PRIX
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      STATUT
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      VUES
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {(services ?? []).map((service: any, idx: number) => (
                    <tr
                      key={service.id}
                      className={`border-b border-gray-200 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      {/* Service name */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-neutral-text text-sm">
                            {service.title}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {service.city}
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {service.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-semibold text-neutral-text">
                            {service.price_amount ? `${service.price_amount}€` : "À négocier"}
                          </p>
                          <p className="text-xs text-gray-600">
                            {service.price_type === "hourly"
                              ? "/heure"
                              : service.price_type === "fixed"
                                ? "Fixe"
                                : ""}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            service.status
                          )}`}
                        >
                          {getStatusLabel(service.status)}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Eye className="w-4 h-4" />
                          {service.views_count}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/dashboard/services/${service.id}/edit`}>
                            <Button
                              size="sm"
                              variant="outline"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            title={service.status === "published" ? "Mettre en pause" : "Publier"}
                          >
                            {service.status === "published" ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
