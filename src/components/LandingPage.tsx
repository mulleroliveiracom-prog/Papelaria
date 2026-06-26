import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, Layout, ShoppingBag, Utensils, Scissors, Heart, Camera, Smartphone, CheckCircle2 } from 'lucide-react';
import Logo from './ui/Logo';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Logo />
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
            <a href="#examples" className="hover:text-indigo-600 transition-colors">Exemplos</a>
            <a href="#benefits" className="hover:text-indigo-600 transition-colors">Benefícios</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Planos</a>
            <button onClick={onStart} className="px-6 py-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all font-semibold shadow-md shadow-indigo-100">
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold tracking-wide uppercase"
          >
            <Zap size={14} fill="currentColor" />
            Poderosa IA de Design
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-neutral-900 leading-[1.1] tracking-tight max-w-4xl mx-auto"
          >
            Crie artes profissionais para sua empresa <span className="text-indigo-600">em segundos</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-500 max-w-2xl mx-auto"
          >
            Envie a foto do produto, preencha as informações e receba anúncios prontos para postar no Instagram e WhatsApp.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={onStart}
              className="group w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-200"
            >
              Criar arte agora
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#examples"
              className="w-full sm:w-auto px-10 py-5 bg-white text-neutral-600 rounded-2xl font-bold text-lg border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center justify-center"
            >
              Ver exemplos
            </a>
          </motion.div>
        </div>
      </header>

      {/* Examples Grid */}
      <section id="examples" className="py-20 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="space-y-4 text-left">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Feito para todo tipo de comércio</h2>
              <p className="text-neutral-500 max-w-md italic">Adaptamos o design da IA para o seu segmento de mercado de forma automática.</p>
            </div>
            <div className="flex gap-2">
              {[Utensils, ShoppingBag, Scissors, Heart].map((Icon, i) => (
                <div key={i} className="p-3 bg-white rounded-xl text-neutral-400">
                  <Icon size={24} />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Hambúrguer', img: 'https://picsum.photos/seed/burger/600/800', tag: 'Fast Food' },
              { title: 'Pizza', img: 'https://picsum.photos/seed/pizza/600/800', tag: 'Pizzaria' },
              { title: 'Moda', img: 'https://picsum.photos/seed/fashion/600/800', tag: 'Roupas' },
              { title: 'Perfume', img: 'https://picsum.photos/seed/perfume/600/800', tag: 'Beleza' },
              { title: 'Mercado', img: 'https://picsum.photos/seed/market/600/800', tag: 'Ofertas' },
              { title: 'Academia', img: 'https://picsum.photos/seed/gym/600/800', tag: 'Fitness' },
            ].map((example, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative bg-white p-4 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all border border-neutral-200"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-neutral-100">
                  <img
                    src={example.img}
                    alt={example.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="mt-4 px-2 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900">{example.title}</h3>
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">{example.tag}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: Layout, title: 'Sem precisar saber design', desc: 'Nossa inteligência artificial cria o layout perfeito por cima das suas fotos.' },
            { icon: Zap, title: 'Artes prontas em segundos', desc: 'Preencha o que precisa vender e assista a arte aparecer na tela instantaneamente.' },
            { icon: Smartphone, title: 'Feito para comércio local', desc: 'Focado nos negócios do dia a dia, desde lanchonetes até academias.' },
            { icon: Camera, title: 'Pronto para Instagram e WhatsApp', desc: 'Formas quadradas e verticais exportadas em alta qualidade para postagem.' },
          ].map((benefit, i) => (
            <div key={i} className="space-y-4">
              <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <benefit.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900">{benefit.title}</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-neutral-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-600 opacity-10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl font-black mb-16 tracking-tight">Escolha o plano ideal para sua empresa</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/10 text-left space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Grátis</h3>
                <p className="text-neutral-400 text-sm">Para quem está começando agora</p>
              </div>
              <div className="text-5xl font-black italic">R$ 0<span className="text-lg font-normal not-italic opacity-50 ml-2">/mês</span></div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-indigo-400" />
                  3 artes por mês
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-indigo-400" />
                  Formatos básicos
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-indigo-400" />
                  Marca d'água discreta
                </li>
              </ul>
              <button className="w-full py-4 rounded-2xl border border-white/20 hover:bg-white/10 transition-all font-bold">
                Começar Grátis
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-600 p-10 rounded-[2.5rem] ring-4 ring-indigo-500/50 text-left space-y-8 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-[50px] group-hover:scale-150 transition-transform duration-700" />
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">Mais Popular</div>
                <h3 className="text-2xl font-bold">Profissional</h3>
                <p className="text-indigo-100 text-sm">Domine suas redes sociais</p>
              </div>
              <div className="text-5xl font-black italic">R$ 49<span className="text-lg font-normal not-italic opacity-70 ml-2">,90/mês</span></div>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-white" />
                  Geração ilimitada
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-white" />
                  Sem marca d'água
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-white" />
                  Remoção de fundo com 1 clique
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={18} className="text-white" />
                  Suporte prioritário
                </li>
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/40">
                Torne-se Pró
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Logo size={18} />
          </div>
          <p className="text-sm text-neutral-400 italic">Uma solução para o pequeno comércio brasileiro.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
