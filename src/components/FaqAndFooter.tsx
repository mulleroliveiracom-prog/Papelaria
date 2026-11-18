import { useState } from 'react';
import { ChevronDown, Lock, Shield, Trash2, X } from 'lucide-react';

interface FaqAndFooterProps {
  hasSessionMedia: boolean;
  retentionHours: number;
  onDeleteMedia: () => Promise<void>;
  onOpenAdmin: () => void;
}

const FAQ_ITEMS = [
  {
    q: 'Preciso pagar para criar minhas prévias?',
    a: 'Não. Você pode experimentar a criação gratuitamente. O pagamento é necessário somente para desbloquear as imagens em alta qualidade.',
  },
  {
    q: 'Como recebo minhas fotos?',
    a: 'Após a confirmação do pagamento, elas ficam disponíveis na sua galeria para download.',
  },
  {
    q: 'Posso escolher minhas fotos favoritas?',
    a: 'Sim. Você escolhe quais imagens deseja desbloquear dentro da quantidade do seu pacote.',
  },
  {
    q: 'As fotos são reais?',
    a: 'São imagens criadas ou editadas por inteligência artificial, utilizando a fotografia enviada como referência. O resultado pode apresentar diferenças em relação ao bebê original.',
  },
  {
    q: 'Minhas fotografias ficam armazenadas?',
    a: 'Armazenamos os arquivos de forma privada e temporária apenas para processar seu ensaio e permitir o download após a compra (prazo padrão de até 7 dias, expiração automática). Você também pode clicar em "Excluir fotos" a qualquer momento para apagar imediatamente todas as imagens do servidor.',
  },
];

type PolicyDocType = 'privacidade' | 'termos' | 'reembolso' | 'contato' | null;

export function FaqAndFooter({
  hasSessionMedia,
  retentionHours,
  onDeleteMedia,
  onOpenAdmin,
}: FaqAndFooterProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeDoc, setActiveDoc] = useState<PolicyDocType>(null);
  const [deleting, setDeleting] = useState(false);

  const handleImmediateDelete = async () => {
    setDeleting(true);
    await onDeleteMedia();
    setDeleting(false);
  };

  return (
    <>
      <section id="duvidas" className="py-14 sm:py-20 bg-[#F5EFE8] border-t border-[#8C7165]/15">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs sm:text-sm font-medium text-[#8C7165] mb-2">
              Dúvidas e proteção infantil
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#51433E] mb-2.5">
              Perguntas frequentes
            </h2>
            <p className="text-sm sm:text-base text-[#6B584F]">
              Transparência total sobre como criamos seu ensaio e protegemos cada imagem enviada.
            </p>
          </div>

          <div className="space-y-3 mb-10">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl bg-white border border-[#8C7165]/15 overflow-hidden"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer min-h-[54px]"
                  >
                    <span className="font-serif text-lg sm:text-xl font-semibold text-[#51433E]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#8C7165] shrink-0 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-[#6B584F] border-t border-[#8C7165]/10 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Compromisso Reforçado de Privacidade Infantil */}
          <div className="rounded-3xl bg-white border border-[#8C7165]/15 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#51433E]">
                <Shield className="w-4 h-4 text-[#8C7165]" aria-hidden="true" />
                <span>Proteção reforçada para fotografias de crianças</span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B584F] leading-relaxed">
                Metadados EXIF e localização são removidos no envio. Não publicamos imagens de
                clientes, não treinamos modelos com suas fotos, não armazenamos dados de cartão e
                removemos os arquivos automaticamente após {retentionHours} horas.
              </p>
            </div>

            {hasSessionMedia && (
              <button
                type="button"
                disabled={deleting}
                onClick={handleImmediateDelete}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-[#7A352E] bg-[#FBECEB] hover:bg-[#F7D7D5] rounded-xl transition-colors cursor-pointer shrink-0 min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
                <span>{deleting ? 'Excluindo...' : 'Excluir minhas fotos agora'}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#51433E] text-[#F5EFE8] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/15">
            <div>
              <p className="font-serif text-2xl font-semibold text-white mb-1">
                Meu Bebê em um Sonho
              </p>
              <p className="text-xs sm:text-sm text-[#EBCFD1]">
                Estúdio fotográfico newborn com inteligência artificial · Recordações criadas com
                carinho e privacidade.
              </p>
            </div>

            <nav
              aria-label="Links institucionais e legais"
              className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs sm:text-sm"
            >
              <button
                type="button"
                onClick={() => setActiveDoc('privacidade')}
                className="hover:text-[#EBCFD1] transition-colors cursor-pointer"
              >
                Política de privacidade
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('termos')}
                className="hover:text-[#EBCFD1] transition-colors cursor-pointer"
              >
                Termos de uso
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('reembolso')}
                className="hover:text-[#EBCFD1] transition-colors cursor-pointer"
              >
                Política de reembolso
              </button>
              <button
                type="button"
                onClick={() => setActiveDoc('contato')}
                className="hover:text-[#EBCFD1] transition-colors cursor-pointer"
              >
                Contato e suporte
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-[#EBCFD1] hover:text-white transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Painel Administrativo</span>
              </button>
            </nav>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#D5C6BE]">
            <p>© {new Date().getFullYear()} Meu Bebê em um Sonho. Todos os direitos reservados.</p>
            <p>Imagens demonstrativas sintéticas · Pagamentos processados por provedor externo seguro</p>
          </div>
        </div>
      </footer>

      {activeDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2E2A]/65 backdrop-blur-xs"
          onClick={() => setActiveDoc(null)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#F5EFE8] text-[#51433E] border border-[#8C7165]/20 p-6 sm:p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="font-serif text-2xl font-semibold">
                {activeDoc === 'privacidade' && 'Política de Privacidade'}
                {activeDoc === 'termos' && 'Termos de Uso'}
                {activeDoc === 'reembolso' && 'Política de Reembolso'}
                {activeDoc === 'contato' && 'Contato e Suporte'}
              </h2>
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                aria-label="Fechar documento"
                className="p-2 rounded-xl hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm leading-relaxed text-[#6B584F]">
              {activeDoc === 'privacidade' && (
                <>
                  <p>
                    O envio de fotografias de bebês requer consentimento expresso do responsável legal
                    ou pessoa formalmente autorizada antes de qualquer processamento.
                  </p>
                  <p>
                    Todas as imagens enviadas têm seus metadados EXIF removidos automaticamente e são
                    armazenadas em diretório privado sem acesso público permanente. As prévias
                    gratuitas utilizam marca-d&apos;água aplicada no servidor.
                  </p>
                  <p>
                    As fotografias não são publicadas, não são compartilhadas além do provedor de
                    geração estritamente necessário para criar o ensaio e não são utilizadas para
                    treinamento de modelos. Os arquivos expiram automaticamente após {retentionHours}{' '}
                    horas ou imediatamente mediante solicitação do usuário pelo botão de exclusão.
                  </p>
                </>
              )}

              {activeDoc === 'termos' && (
                <>
                  <p>
                    A plataforma Meu Bebê em um Sonho disponibiliza criação gratuita de prévias com
                    marca-d&apos;água e venda opcional de pacotes digitais em alta resolução.
                  </p>
                  <p>
                    As imagens são geradas ou editadas por inteligência artificial usando a foto de
                    referência enviada, podendo apresentar variações sutis em relação ao bebê original.
                  </p>
                  <p>
                    O desbloqueio das fotografias originais respeita estritamente a quantidade do
                    pacote confirmado pelo provedor de pagamentos (3, 8 ou 15 fotos).
                  </p>
                </>
              )}

              {activeDoc === 'reembolso' && (
                <>
                  <p>
                    Por disponibilizarmos prévias gratuitas antes da compra, você avalia o resultado
                    antes de decidir pelo desbloqueio.
                  </p>
                  <p>
                    Caso ocorra falha técnica comprovada no download após confirmação do pagamento ou
                    cobrança duplicada, garantimos reenvio das imagens ou reembolso integral dentro de
                    até 7 dias corridos após a compra.
                  </p>
                </>
              )}

              {activeDoc === 'contato' && (
                <>
                  <p>
                    Precisa recuperar seu ensaio, solicitar exclusão de arquivos ou esclarecer dúvidas
                    sobre um pedido? Tenha em mãos o seu código de acesso (ex.:{' '}
                    <code className="font-mono">SONHO-XXXX-XXXX</code>).
                  </p>
                  <p>
                    Atendimento de suporte: utilize o código do seu ensaio na seção de recuperação ou
                    entre em contato pelo canal oficial informado pela operação da plataforma.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
