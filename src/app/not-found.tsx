import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F5F2EE] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Large 404 number */}
        <p className="font-serif text-[150px] sm:text-[200px] font-bold text-primary/10 leading-none select-none">
          404
        </p>

        {/* Message */}
        <div className="-mt-10 sm:-mt-14 relative z-10">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Page introuvable
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Oups ! La page que vous cherchez semble avoir pris sa retraite.
            Pas d&apos;inquiétude, nos experts sont toujours là pour vous.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary hover:bg-secondary/90 text-white px-8 py-3 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary px-8 py-3 font-medium transition-all duration-200"
            >
              Explorer les services
            </Link>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="mt-16 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary/40" />
          <div className="w-2 h-2 rounded-full bg-primary/40" />
          <div className="w-2 h-2 rounded-full bg-accent/40" />
        </div>
      </div>
    </main>
  );
}
