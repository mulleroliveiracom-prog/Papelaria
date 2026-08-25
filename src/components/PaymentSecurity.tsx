import React from 'react';
import { Lock, ShieldCheck, CreditCard, QrCode, Zap, CheckCircle2 } from 'lucide-react';

export const PaymentSecurity: React.FC = () => {
  return (
    <section className="py-12 px-4 bg-white border-y border-pink-100">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-emerald-600" />
          <h3 className="text-xl sm:text-2xl font-black text-zinc-950 uppercase tracking-tight font-serif">
            PAGAMENTO SEGURO 🔒
          </h3>
        </div>

        <p className="text-sm text-zinc-600 max-w-xl mx-auto font-medium">
          Pagamento processado de forma segura. Após a confirmação, siga as instruções para acessar seu conteúdo VIP.
        </p>

        {/* Payment Methods Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
          
          {/* PIX */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-white border border-emerald-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900">PIX Automático</h4>
            <span className="text-[11px] font-bold text-emerald-700 mt-0.5">⚡ Liberação Imediata</span>
            <p className="text-[11px] text-zinc-500 mt-1">QRCode e Copia e Cola gerados na hora.</p>
          </div>

          {/* Cartão de Crédito */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-pink-50/60 to-white border border-pink-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900">Cartão de Crédito</h4>
            <span className="text-[11px] font-bold text-pink-700 mt-0.5">💳 Em até 12x</span>
            <p className="text-[11px] text-zinc-500 mt-1">Todas as bandeiras aceitas com total discrição.</p>
          </div>

          {/* Cartão de Débito / Outros */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-50/60 to-white border border-purple-200/80 shadow-xs flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-zinc-900">Débito & Seguro</h4>
            <span className="text-[11px] font-bold text-purple-700 mt-0.5">🔒 SSL 256-Bit</span>
            <p className="text-[11px] text-zinc-500 mt-1">Ambiente criptografado e seguro.</p>
          </div>

        </div>

        {/* Discrete billing guarantee */}
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Fatura com nome discreto para garantir a sua total privacidade.</span>
        </div>

      </div>
    </section>
  );
};
