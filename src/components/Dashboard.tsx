import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  LayoutGrid, 
  Palette, 
  History, 
  CreditCard, 
  Settings, 
  Image as ImageIcon,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import Logo from './ui/Logo';
import ArtWizard from './ArtWizard';
import MyBrand from './MyBrand';

interface DashboardProps {
  onGoToLanding: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onGoToLanding }) => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'wizard', label: 'Nova arte', icon: Plus, primary: true },
    { id: 'gallery', label: 'Meus anúncios', icon: LayoutGrid },
    { id: 'templates', label: 'Templates', icon: ImageIcon },
    { id: 'brand', label: 'Minha marca', icon: Palette },
    { id: 'history', label: 'Histórico', icon: History },
    { id: 'subscription', label: 'Assinatura', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-100/50">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed lg:static inset-y-0 left-0 bg-white border-r border-neutral-200 z-50 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <div className={`overflow-hidden ${!isSidebarOpen && 'hidden md:flex'}`}>
              <Logo size={18} showText={isSidebarOpen} />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? item.primary ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-indigo-50 text-indigo-600'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
                }`}
              >
                <item.icon size={20} className={activeTab === item.id ? '' : 'text-neutral-400'} />
                <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'hidden lg:opacity-0'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <button 
              onClick={onGoToLanding}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-neutral-400 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <LogOut size={20} />
              <span className={`${!isSidebarOpen && 'hidden'}`}>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-neutral-200 px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-neutral-100 rounded-lg"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Pesquisar artes ou templates..."
              className="w-full pl-12 pr-4 py-2.5 bg-neutral-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-neutral-100 rounded-xl relative text-neutral-400">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">
              JS
            </div>
          </div>
        </header>

        {/* Dynamic Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'wizard' && (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ArtWizard onComplete={() => setActiveTab('gallery')} />
              </motion.div>
            )}
            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Meus anúncios</h1>
                    <p className="text-neutral-500 mt-1 italic">Aqui estão as últimas artes geradas pela nossa IA para você.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('wizard')}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all shrink-0"
                  >
                    <Plus size={18} />
                    Criar nova arte
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all">
                      <div className="aspect-square bg-neutral-50 relative overflow-hidden">
                        <img 
                          src={`https://picsum.photos/seed/ad-${i}/500/500`}
                          alt={`Arte ${i}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                           <button className="flex-1 py-2 bg-white text-indigo-600 rounded-lg text-xs font-black uppercase">Baixar</button>
                           <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white"><Settings size={16} /></button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm text-neutral-900 mb-1">Promoção Hambúrguer #{i}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Feed Quadrado • 30/04/2026</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setActiveTab('wizard')}
                    className="border-2 border-dashed border-neutral-200 rounded-2xl aspect-square flex flex-col items-center justify-center gap-3 text-neutral-400 hover:border-indigo-300 hover:text-indigo-400 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Plus size={24} />
                    </div>
                    <span className="text-sm font-bold">Nova Arte</span>
                  </button>
                </div>
              </motion.div>
            )}
            {activeTab === 'brand' && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <MyBrand />
              </motion.div>
            )}
            {['templates', 'history', 'subscription', 'settings'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-neutral-400 space-y-4">
                <div className="p-6 bg-neutral-100 rounded-full italic">Funcionalidade em desenvolvimento...</div>
                <button 
                  onClick={() => setActiveTab('gallery')}
                  className="text-indigo-600 font-bold text-sm"
                >
                  Voltar para galeria
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
