import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface TermsModalProps {
  isOpen: boolean;
  type: 'terms' | 'privacy' | null;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const isTerms = type === 'terms';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-100 max-h-[85vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2.5 pb-4 border-b border-pink-100">
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600">
              {isTerms ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-black text-zinc-950 font-serif">
                {isTerms ? 'Termos de Uso' : 'Política de Privacidade'}
              </h3>
              <p className="text-xs text-pink-600 font-semibold">{SITE_CONFIG.model.title}</p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="mt-4 overflow-y-auto pr-2 text-xs sm:text-sm text-zinc-600 space-y-3 leading-relaxed">
            {isTerms ? (
              <>
                <p>
                  <strong>1. Aceitação dos Termos:</strong> Ao adquirir qualquer plano de assinatura da plataforma {SITE_CONFIG.model.title}, você concorda com todas as cláusulas e condições aqui descritas.
                </p>
                <p>
                  <strong>2. Conteúdo e Propriedade Intelectual:</strong> Todo o material disponibilizado (fotos, vídeos, textos e áudios) é de propriedade exclusiva da criadora {SITE_CONFIG.model.name}. É expressamente proibida a reprodução, cópia, vazamento ou distribuição não autorizada, sob pena de responsabilização civil e criminal.
                </p>
                <p>
                  <strong>3. Idade Mínima:</strong> O acesso ao conteúdo é estritamente restrito a maiores de 18 anos. Ao prosseguir com a assinatura, você declara ser maior de idade.
                </p>
                <p>
                  <strong>4. Acesso e Entrega:</strong> O acesso ao canal e materiais é liberado de forma digital e automática logo após a confirmação do pagamento pelo gateway oficial.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>1. Privacidade e Discrição:</strong> Respeitamos sua privacidade integralmente. Nenhum dado pessoal sensível é compartilhado publicamente e as transações ocorrem em ambiente protegido com criptografia SSL 256-bit.
                </p>
                <p>
                  <strong>2. Identificação Discreta na Fatura:</strong> Para garantir o seu sigilo, o nome na fatura do cartão ou comprovante bancário aparecerá com identificação genérica da processadora de pagamentos.
                </p>
                <p>
                  <strong>3. Armazenamento Seguro:</strong> Todas as informações fornecidas no momento do checkout são processadas diretamente pelas instituições financeiras homologadas, não ficando armazenadas em servidores desprotegidos.
                </p>
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-pink-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors"
            >
              Entendido e Fechar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
