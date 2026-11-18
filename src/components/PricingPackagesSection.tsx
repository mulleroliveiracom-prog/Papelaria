import { Check, CheckCircle2, ExternalLink, Lock, RefreshCw } from 'lucide-react';
import { PACKAGES, type OrderPublicView, type PackageId, type SessionPublicView } from '../types/studio';

interface PricingPackagesSectionProps {
  session: SessionPublicView | null;
  creatingOrderPackageId: PackageId | null;
  checkingOrder: boolean;
  onSelectPackage: (packageId: PackageId) => Promise<void>;
  onRefreshOrderStatus: (orderId: string) => Promise<void>;
  onDemoConfirmOrder: (orderId: string) => Promise<void>;
}

export function PricingPackagesSection({
  session,
  creatingOrderPackageId,
  checkingOrder,
  onSelectPackage,
  onRefreshOrderStatus,
  onDemoConfirmOrder,
}: PricingPackagesSectionProps) {
  const hasGeneratedPreviews = Boolean(session && session.generatedPhotos.length > 0);
  const activeOrder: OrderPublicView | null = session?.activeOrder ?? null;
  const isPaid = activeOrder?.status === 'paid';

  // Conforme especificação: "Somente depois da criação das imagens, apresentar os pacotes de compra."
  if (!hasGeneratedPreviews && !activeOrder) {
    return (
      <section id="pacotes" className="py-12 bg-[#F5EFE8] border-t border-[#8C7165]/12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-[#8C7165] mb-1.5">
            Transparência desde o primeiro clique
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#51433E] mb-2">
            Experimente gratuitamente antes de escolher qualquer pacote
          </h2>
          <p className="text-sm sm:text-base text-[#6B584F] max-w-xl mx-auto">
            Primeiro você cria as prévias do seu bebê sem custo. Os pacotes opcionais para
            desbloquear as fotos em alta resolução e sem marca-d&apos;água são exibidos logo após
            suas prévias ficarem prontas.
          </p>
        </div>
      </section>
    );
  }

  if (isPaid) {
    return null;
  }

  return (
    <section id="pacotes" className="py-14 sm:py-20 bg-[#F5EFE8] border-t border-[#8C7165]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs sm:text-sm font-medium text-[#8C7165] mb-2">
            Desbloqueio opcional · Prévia gratuita já garantida
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#51433E] mb-2.5">
            Escolha como quer guardar esse momento
          </h2>
          <p className="text-sm sm:text-base text-[#6B584F]">
            Desbloqueie suas fotos favoritas em alta qualidade e sem marca-d&apos;água.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PACKAGES.map((pkg) => {
            const isLoading = creatingOrderPackageId === pkg.id;
            return (
              <article
                key={pkg.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-transform ${
                  pkg.recommended
                    ? 'bg-white border-2 border-[#C6A477] shadow-md'
                    : 'bg-white border border-[#8C7165]/15 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#8C7165] mb-2">
                    <span className="font-medium uppercase tracking-wider">{pkg.codeLabel}</span>
                    {pkg.recommended && (
                      <span className="font-semibold text-[#8C6839]">Recomendado</span>
                    )}
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-[#51433E] mb-2">
                    {pkg.name}
                  </h3>

                  <p className="font-serif text-4xl font-semibold text-[#51433E] tabular-nums mb-5">
                    {pkg.priceFormatted}
                  </p>

                  <ul className="space-y-2.5 mb-7 border-t border-[#8C7165]/12 pt-5">
                    {pkg.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-[#51433E]">
                        <Check className="w-4 h-4 text-[#8C7165] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  disabled={isLoading || creatingOrderPackageId !== null}
                  onClick={() => onSelectPackage(pkg.id)}
                  className={`w-full py-4 px-5 text-sm font-semibold rounded-2xl transition-colors cursor-pointer min-h-[50px] ${
                    pkg.recommended
                      ? 'bg-[#51433E] hover:bg-[#3F332F] text-white'
                      : 'bg-[#EBCFD1]/65 hover:bg-[#EBCFD1] text-[#51433E]'
                  } disabled:opacity-60`}
                >
                  {isLoading ? 'Criando pedido...' : pkg.buttonLabel}
                </button>
              </article>
            );
          })}
        </div>

        {/* Status verdadeiro do pedido / Checkout / Webhook */}
        {activeOrder && activeOrder.status !== 'paid' && (
          <div className="mt-10 max-w-2xl mx-auto rounded-3xl bg-white border border-[#C6A477]/50 p-6 sm:p-7 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-mono text-[#8C7165] tabular-nums">
                  Pedido {activeOrder.orderId.slice(0, 8)} · Cota: {activeOrder.quota} fotos
                </p>
                <h3 className="font-serif text-2xl font-semibold text-[#51433E]">
                  {activeOrder.packageName} — R${' '}
                  {(activeOrder.amountCents / 100).toFixed(2).replace('.', ',')}
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6839]">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Aguardando pagamento</span>
              </span>
            </div>

            {activeOrder.providerConfigured && activeOrder.checkoutUrl ? (
              <div className="space-y-4">
                <p className="text-sm text-[#6B584F]">
                  Seu pedido foi criado com segurança via <strong>{activeOrder.paymentProvider}</strong>.
                  Conclua o pagamento (PIX ou cartão) no checkout oficial. O desbloqueio ocorre
                  automaticamente somente após confirmação pelo webhook do provedor.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={activeOrder.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl transition-colors"
                  >
                    <span>Ir para pagamento seguro</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <button
                    type="button"
                    disabled={checkingOrder}
                    onClick={() => onRefreshOrderStatus(activeOrder.orderId)}
                    className="inline-flex items-center justify-center gap-2 py-3.5 px-5 text-sm font-medium text-[#51433E] bg-[#F5EFE8] hover:bg-[#EDE4DA] rounded-xl cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${checkingOrder ? 'animate-spin' : ''}`} />
                    <span>Verificar confirmação</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-[#6B584F]">
                <p>
                  Seu pedido foi registrado no banco de dados com status{' '}
                  <strong>pendente</strong> ({activeOrder.quota} fotos vinculadas).
                </p>
                <p className="text-xs sm:text-sm bg-[#F5EFE8] p-4 rounded-xl border border-[#8C7165]/15 text-[#51433E]">
                  {activeOrder.failureReason
                    ? activeOrder.failureReason
                    : 'Modo demonstrativo de pagamento: nenhum gateway externo (PAYMENT_PROVIDER / PAYMENT_API_KEY) está conectado ainda. Para testar a experiência completa da Página de Sucesso e o download em alta resolução sem serviços pagos, você pode acionar abaixo a confirmação demonstrativa do servidor.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    disabled={checkingOrder}
                    onClick={() => onDemoConfirmOrder(activeOrder.orderId)}
                    className="inline-flex items-center justify-center gap-2 py-3 px-5 text-xs sm:text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span>Testar confirmação de pagamento (Modo Demo)</span>
                  </button>

                  <button
                    type="button"
                    disabled={checkingOrder}
                    onClick={() => onRefreshOrderStatus(activeOrder.orderId)}
                    className="inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium text-[#51433E] bg-[#F5EFE8] hover:bg-[#EDE4DA] rounded-xl cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingOrder ? 'animate-spin' : ''}`} />
                    <span>Atualizar status</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
