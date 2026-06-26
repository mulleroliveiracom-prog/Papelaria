import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Plus,
  Sparkles, 
  Upload, 
  Scissors, 
  Trash2, 
  Download, 
  Share2, 
  RefreshCw, 
  Check,
  Smartphone,
  Square,
  Layout,
  MessageSquare,
  Facebook,
  Instagram,
  Type
} from 'lucide-react';

interface ArtWizardProps {
  onComplete: () => void;
}

const STEPS = [
  'Segmento',
  'Tipo de Anúncio',
  'Dados do Produto',
  'Contato',
  'Identidade Visual',
  'Upload & Edição',
  'Formato'
];

const ArtWizard: React.FC<ArtWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    segment: '',
    adType: '',
    productName: '',
    description: '',
    price: '',
    promoPrice: '',
    discount: '',
    promoText: '',
    expiryDate: '',
    isPromoActive: true,
    whatsapp: '',
    instagram: '',
    address: '',
    hours: '',
    hasCallButton: true,
    style: 'modern',
    font: 'modern',
    format: 'feed',
    variationCount: '3',
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const generationPhrases = [
      "Criando sua arte...",
      "Aplicando design profissional...",
      "Finalizando anúncio...",
      "Pronto!"
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < generationPhrases.length - 1) {
        setGenerationStep(++step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
          setShowResults(true);
        }, 1000);
      }
    }, 1500);
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 px-8 text-center space-y-8">
        <div className="relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 flex items-center justify-center text-indigo-600"
          >
            <Sparkles size={32} />
          </motion.div>
        </div>
        <div className="space-y-2">
          <AnimatePresence mode="wait">
            <motion.h2 
              key={generationStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-2xl font-black text-neutral-900 tracking-tight"
            >
              {[
                "Criando sua arte...",
                "Aplicando design profissional...",
                "Finalizando anúncio...",
                "Pronto!"
              ][generationStep]}
            </motion.h2>
          </AnimatePresence>
          <p className="text-neutral-400 italic text-sm">Nossa IA está cuidando de cada detalhe para você.</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="space-y-10 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Suas artes estão prontas! ✨</h2>
            <p className="text-neutral-500 italic mt-1">Geramos variações exclusivas para você escolher e baixar.</p>
          </div>
          <button 
            onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
            }} 
            className="px-6 py-3 bg-neutral-200 text-neutral-600 rounded-xl font-bold hover:bg-neutral-300 transition-all"
          >
            Criar outra arte
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-neutral-100 group"
            >
              <div className="aspect-[4/5] bg-neutral-100 rounded-[1.5rem] overflow-hidden mb-6 relative">
                 <img 
                   src={`https://picsum.photos/seed/result-${i}/600/800`}
                   alt="Anúncio gerado"
                   referrerPolicy="no-referrer"
                   className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                 />
                 <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase shadow-lg shadow-indigo-100">
                  <Download size={16} />
                  Baixar
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-white text-neutral-400 border border-neutral-200 rounded-xl font-black text-xs uppercase hover:bg-neutral-50 transition-all">
                  <Scissors size={16} />
                  Editar
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-black text-xs uppercase hover:bg-neutral-200 transition-all">
                  <RefreshCw size={16} />
                  Recriar
                </button>
                <button className="flex items-center justify-center gap-2 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-black text-xs uppercase hover:bg-neutral-200 transition-all">
                  <Share2 size={16} />
                  Postar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-10">
      {/* Header & Stepper */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100">
            <PlusIcon step={currentStep} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Nova Arte Publicitária</h1>
            <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider italic">Passo {currentStep + 1} de {STEPS.length}: {STEPS[currentStep]}</p>
          </div>
        </div>

        <div className="flex gap-2">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'bg-indigo-600' : 'bg-neutral-200'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Steps Content */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-neutral-100 min-h-[500px] flex flex-col">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div 
                key="step-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold">Em qual segmento sua empresa atua?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['Alimentação', 'Moda', 'Farmácia', 'Mercado', 'Beleza', 'Academia', 'Ótica', 'Eletrônicos', 'Serviços', 'Outro'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({...formData, segment: s})}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        formData.segment === s 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-50' 
                          : 'border-neutral-100 hover:border-neutral-200 text-neutral-500'
                      }`}
                    >
                      <span className="text-sm font-bold">{s}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div 
                key="step-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold">Que tipo de anúncio quer criar?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {['Promoção', 'Lançamento', 'Combo', 'Desconto', 'Aviso', 'Entrega', 'Estoque', 'Destaque', 'Aniversário', 'Especial'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setFormData({...formData, adType: t})}
                      className={`p-4 rounded-xl border-2 text-center flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.adType === t 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                          : 'border-neutral-100 hover:border-neutral-200 text-neutral-500'
                      }`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Nome do Produto</label>
                  <input 
                    type="text" 
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    placeholder="Ex: Combo Smash Burger"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Descrição Curta</label>
                  <input 
                    type="text" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Ex: Pão brioche, 2x carne 80g..."
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Preço Normal</label>
                  <input 
                    type="text" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="R$ 35,00"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Preço Promocional</label>
                  <input 
                    type="text" 
                    value={formData.promoPrice}
                    onChange={(e) => setFormData({...formData, promoPrice: e.target.value})}
                    placeholder="R$ 29,90"
                    className="w-full px-6 py-4 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-bold"
                  />
                </div>
                <div className="col-span-2 flex items-center gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <input 
                    type="checkbox" 
                    checked={formData.isPromoActive}
                    onChange={(e) => setFormData({...formData, isPromoActive: e.target.checked})}
                    className="w-6 h-6 rounded-lg text-indigo-600" 
                  />
                  <div>
                    <p className="font-bold text-sm">Promoção ativa neste anúncio</p>
                    <p className="text-[10px] text-neutral-400 italic leading-none">Exibir selos de desconto e oferta.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div 
                key="step-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid md:grid-cols-2 gap-6"
              >
                 <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">WhatsApp</label>
                  <input 
                    type="text" 
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="(00) 00000-0000"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Instagram</label>
                  <input 
                    type="text" 
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                    placeholder="@suaempresa"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-neutral-400">Endereço (Opcional)</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Rua das Lojas, 123 - Centro"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:ring-2 focus:ring-indigo-600/20 focus:outline-none font-medium"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div 
                key="step-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4 text-left">
                    <h3 className="font-bold">Cores da Arte</h3>
                    <div className="flex gap-2">
                      {['#4F46E5', '#E11D48', '#10B981', '#F59E0B', '#000000'].map((color) => (
                        <button 
                          key={color}
                          className="w-10 h-10 rounded-full border-4 border-white shadow-md transition-transform hover:scale-110 active:scale-95"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4 text-left">
                    <h3 className="font-bold">Estilo Visual</h3>
                    <select 
                      value={formData.style}
                      onChange={(e) => setFormData({...formData, style: e.target.value})}
                      className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:outline-none border-none font-medium text-sm"
                    >
                      <option value="modern">Moderno & Clean</option>
                      <option value="luxury">Luxo & Elegante</option>
                      <option value="explosive">Explosivo & Promo</option>
                      <option value="fastfood">Fast Food Clássico</option>
                      <option value="minimal">Minimalista</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                   <h3 className="font-bold">Escolha a Fonte</h3>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {['Moderna', 'Clássica', 'Impactante', 'Fina'].map(f => (
                        <button 
                          key={f}
                          onClick={() => setFormData({...formData, font: f})}
                          className={`p-4 rounded-xl border-2 text-sm font-bold transition-all ${
                            formData.font === f ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-neutral-100 text-neutral-400'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div 
                key="step-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="border-4 border-dashed border-neutral-100 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center gap-4 group hover:border-indigo-200 transition-colors bg-neutral-50">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Upload size={28} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black italic text-neutral-900">Clique para enviar as fotos do produto</p>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest italic">JPEG ou PNG • Até 10MB</p>
                  </div>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 mt-4">Selecionar arquivos</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3 border border-indigo-100">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white"><Scissors size={14} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Remover fundo IA</span>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3 border border-indigo-100">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white"><Sparkles size={14} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Aumentar Resolução</span>
                  </div>
                  <div className="p-4 bg-indigo-50 rounded-2xl flex items-center gap-3 border border-indigo-100">
                    <div className="p-2 bg-indigo-600 rounded-lg text-white"><Layout size={14} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">Centralizar Produto</span>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div 
                key="step-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h3 className="text-xl font-bold mb-6">Qual formato deseja exportar?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { id: 'story', icon: Smartphone, label: 'Story (9:16)' },
                      { id: 'feed', icon: Square, label: 'Feed (1:1)' },
                      { id: 'status', icon: MessageSquare, label: 'WhatsApp' },
                      { id: 'banner', icon: Layout, label: 'Horizontal' },
                    ].map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setFormData({...formData, format: f.id})}
                        className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${
                          formData.format === f.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-4 ring-indigo-50' : 'border-neutral-100 text-neutral-400'
                        }`}
                      >
                        <f.icon size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-6">Quantidade de variações</h3>
                  <div className="flex gap-4">
                    {['1', '3', '5', '10'].map(v => (
                      <button 
                        key={v}
                        onClick={() => setFormData({...formData, variationCount: v})}
                        className={`w-14 h-14 rounded-2xl font-black text-xl flex items-center justify-center transition-all ${
                          formData.variationCount === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-10 mt-10 border-t border-neutral-100">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 font-bold transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-neutral-400 hover:text-neutral-900'}`}
          >
            <ChevronLeft size={20} />
            Voltar
          </button>
          
          <button 
            onClick={nextStep}
            className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black italic uppercase text-sm flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
          >
            {currentStep === STEPS.length - 1 ? (
              <>
                <Sparkles size={18} fill="currentColor" />
                Gerar Anúncios
              </>
            ) : (
              <>
                Próximo Passo
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlusIcon = ({ step }: { step: number }) => {
  if (step === 5) return <Upload size={24} />;
  if (step === 6) return <Layout size={24} />;
  return <Plus size={24} />;
};

export default ArtWizard;
