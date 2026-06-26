import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, Upload, Palette, Type, Globe, Check } from 'lucide-react';

const MyBrand: React.FC = () => {
  const [isSaved, setIsSaved] = useState(false);
  const [brandData, setBrandData] = useState({
    name: 'Sua Empresa Inc.',
    slogan: 'As melhores ofertas da região',
    primaryColor: '#4F46E5',
    secondaryColor: '#E11D48',
    font: 'Inter',
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Identidade Visual</h1>
          <p className="text-neutral-500 mt-1 italic">Configure sua marca uma vez e nossa IA aplicará em todos os anúncios.</p>
        </div>
        <button 
          onClick={handleSave}
          className={`px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
            isSaved ? 'bg-green-500 text-white shadow-green-100' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'
          }`}
        >
          {isSaved ? <Check size={18} /> : <Save size={18} />}
          {isSaved ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Logo Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-neutral-100 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Globe size={18} /></div>
              <h3 className="font-bold">Informações da Marca</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Nome da Empresa</label>
                  <input 
                    type="text" 
                    value={brandData.name}
                    onChange={(e) => setBrandData({...brandData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Slogan / Chamada Principal</label>
                  <input 
                    type="text" 
                    value={brandData.slogan}
                    onChange={(e) => setBrandData({...brandData, slogan: e.target.value})}
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                <div className="relative group">
                  <div className="w-24 h-24 bg-white rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-neutral-400 group-hover:border-indigo-300 transition-colors cursor-pointer">
                    <Upload size={20} />
                    <span className="text-[8px] font-black uppercase mt-1">Logo</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <Plus size={14} />
                  </div>
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <p className="font-bold text-sm">Logotipo Principal</p>
                  <p className="text-xs text-neutral-500 italic max-w-[200px]">Use arquivos em PNG com fundo transparente para melhores resultados.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Style Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-neutral-100 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Palette size={18} /></div>
              <h3 className="font-bold">Paleta de Cores & Fontes</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Cores Principais</p>
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <div 
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl cursor-pointer" 
                      style={{ backgroundColor: brandData.primaryColor }}
                    />
                    <p className="text-center text-[10px] font-bold text-neutral-400 italic">Primária</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl cursor-pointer" 
                      style={{ backgroundColor: brandData.secondaryColor }}
                    />
                    <p className="text-center text-[10px] font-bold text-neutral-400 italic">Secundária</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Fonte Favorita</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Inter', 'Montserrat', 'Poppins', 'Oswald'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setBrandData({...brandData, font: f})}
                      className={`px-4 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        brandData.font === f ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-neutral-100 text-neutral-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="space-y-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2 italic">Prévia Automática</p>
          <div className="sticky top-24 bg-white p-6 rounded-[2.5rem] shadow-2xl border border-neutral-100">
            <div className="aspect-[4/5] bg-neutral-900 rounded-[1.5rem] overflow-hidden relative p-8 flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-black text-indigo-600 italic">LOGO</div>
                  <div className="px-3 py-1 bg-red-600 text-white rounded-full text-[8px] font-black uppercase tracking-wider">OFFER 50%</div>
               </div>
               <div className="space-y-2">
                  <h4 className="text-white text-2xl font-black leading-none uppercase" style={{ color: brandData.primaryColor === '#000000' ? '#ffffff' : brandData.primaryColor }}>{brandData.name}</h4>
                  <p className="text-neutral-400 text-xs italic">{brandData.slogan}</p>
               </div>
               <div className="absolute right-0 top-1/2 -translate-y-1/2 -rotate-90 origin-right text-[8px] text-white/30 font-bold uppercase tracking-[1em]">ArteExpress IA</div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
               <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 w-[65%]" />
               </div>
               <p className="text-[9px] text-center text-neutral-400 font-bold uppercase italic">Perfil da marca completo 65%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default MyBrand;
