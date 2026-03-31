/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  MessageCircle, 
  ShoppingBag, 
  Star, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Instagram, 
  MapPin, 
  Menu, 
  X,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";

const WHATSAPP_LINK = "https://wa.me/5534999999999"; // Fictional number for Patrocínio - MG

const products = [
  {
    id: 1,
    name: "Mochila Infantil Colorida",
    price: "R$ 129,90",
    image: "https://i.postimg.cc/DyYq0GNC/Screenshot-20260331-102620.jpg",
    tag: "Novidade"
  },
  {
    id: 2,
    name: "Kit Canetas Coloridas 12 cores",
    price: "R$ 45,00",
    image: "https://i.postimg.cc/SNK6mdgf/Screenshot-20260331-102624.jpg",
    tag: "Mais Vendido"
  },
  {
    id: 3,
    name: "Caderno Universitário Capa Dura",
    price: "R$ 32,90",
    image: "https://i.postimg.cc/yYNm7jLm/Screenshot-20260331-102627.jpg",
    tag: "Exclusivo"
  },
  {
    id: 4,
    name: "Estojo Escolar Moderno",
    price: "R$ 24,50",
    image: "https://i.postimg.cc/RV07vdgd/Screenshot-20260331-102631.jpg",
    tag: "Favorito"
  },
  {
    id: 5,
    name: "Lancheira Térmica",
    price: "R$ 59,90",
    image: "https://i.postimg.cc/65QrBcML/Screenshot-20260331-102634.jpg",
    tag: "Promoção"
  },
  {
    id: 6,
    name: "Agenda 2024 Criativa",
    price: "R$ 39,90",
    image: "https://i.postimg.cc/90LyGwQd/Screenshot-20260331-102637.jpg",
    tag: "Premium"
  }
];

const reviews = [
  {
    id: 1,
    text: "Ótimo atendimento e produtos incríveis! Encontrei tudo que precisava para o volta às aulas.",
    author: "Mariana Silva",
    stars: 5
  },
  {
    id: 2,
    text: "Minha filha ama essa loja! As mochilas são lindas e de excelente qualidade. Recomendo muito!",
    author: "Ricardo Oliveira",
    stars: 5
  },
  {
    id: 3,
    text: "Melhor papelaria da cidade! Atendimento pelo WhatsApp é super rápido e prático.",
    author: "Ana Paula Santos",
    stars: 5
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-brand-purple/30">
      {/* Floating WhatsApp Button */}
      <motion.a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ rotate: 10 }}
      >
        <MessageCircle size={32} fill="currentColor" />
      </motion.a>

      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 bg-linear-to-br from-brand-blue via-brand-purple to-brand-pink rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white/50 overflow-hidden relative transition-transform duration-500 group-hover:rotate-12">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xs" />
              <span className="text-2xl font-display font-black z-10 drop-shadow-md">P</span>
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-xl font-display font-bold tracking-tight leading-none group-hover:text-brand-purple transition-colors">
                Paper <span className="text-brand-purple">Fácil</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Premium Papelaria</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {["Início", "Produtos", "Promoções", "Sobre", "Contato"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-gray-600 hover:text-brand-purple transition-colors"
              >
                {item}
              </a>
            ))}
            <a 
              href={WHATSAPP_LINK} 
              className="btn-primary btn-whatsapp flex items-center gap-2 text-sm"
            >
              <MessageCircle size={18} />
              Fale no WhatsApp
            </a>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {["Início", "Produtos", "Promoções", "Sobre", "Contato"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-lg font-medium text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a 
              href={WHATSAPP_LINK} 
              className="btn-primary btn-whatsapp flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Fale no WhatsApp
            </a>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section id="início" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-linear-to-bl from-brand-blue/10 via-brand-purple/5 to-transparent rounded-bl-[100px]" />
        <div className="absolute -top-24 -left-24 -z-10 w-96 h-96 bg-brand-pink/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-brand-purple/10 text-brand-purple rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              Papelaria Criativa em Patrocínio - MG
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Abasteça sua <span className="gradient-text">criatividade</span> com as melhores marcas
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg">
              A Paper Fácil traz para Patrocínio o que há de mais moderno e criativo no mundo da papelaria. Venha conhecer nossa loja!
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#produtos" className="btn-primary bg-brand-purple text-white hover:bg-brand-purple/90 flex items-center gap-2">
                <ShoppingBag size={20} />
                Ver Produtos
              </a>
              <a href={WHATSAPP_LINK} className="btn-primary border-2 border-brand-purple text-brand-purple hover:bg-brand-purple/5 flex items-center gap-2">
                <MessageCircle size={20} />
                Chamar no WhatsApp
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 aspect-square rounded-[40px] bg-linear-to-br from-brand-blue via-brand-purple to-brand-pink shadow-2xl flex flex-col items-center justify-center p-4 overflow-hidden border-8 border-white group">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
              
              <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden shadow-inner">
                <img 
                  src="https://i.postimg.cc/DyYq0GNC/Screenshot-20260331-102620.jpg" 
                  alt="Destaque Paper Fácil" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-brand-purple uppercase tracking-widest">Destaque</p>
                        <p className="text-sm font-bold text-gray-900">Mochila Infantil</p>
                      </div>
                    </div>
                    <span className="text-brand-purple font-display font-bold">R$ 129,90</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-8 right-8 text-white/40 animate-pulse">
                <Sparkles size={40} />
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-blue/20 rounded-full blur-2xl -z-10" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-purple/20 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Products Section (Moved up) */}
      <section id="produtos" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Nossos Queridinhos</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Confira os produtos que estão fazendo sucesso por aqui. Estilo e funcionalidade para o seu dia a dia.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-3/4 rounded-3xl overflow-hidden mb-6 shadow-lg group-hover:scale-105 transition-transform duration-500 border-4 border-white">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-purple text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                      {product.tag}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <p className="text-2xl font-display font-bold text-brand-purple mb-4">{product.price}</p>
                <a 
                  href={WHATSAPP_LINK} 
                  className="btn-primary btn-whatsapp w-full flex items-center justify-center gap-2 py-3"
                >
                  <MessageCircle size={18} />
                  Comprar no WhatsApp
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials (Moved down) */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <CheckCircle2 className="text-brand-green" />, title: "Produtos Originais", desc: "Qualidade garantida das melhores marcas." },
              { icon: <MessageCircle className="text-brand-blue" />, title: "Atendimento Rápido", desc: "Suporte via WhatsApp em minutos." },
              { icon: <CreditCard className="text-brand-purple" />, title: "Parcelamento", desc: "Facilitamos suas compras no cartão." },
              { icon: <Truck className="text-brand-pink" />, title: "Variedade", desc: "Tudo para o seu volta às aulas." }
            ].map((item, index) => (
              <motion.div 
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotion Banner */}
      <section id="promoções" className="py-12 px-6">
        <motion.div 
          {...fadeIn}
          className="max-w-7xl mx-auto rounded-[40px] bg-linear-to-r from-brand-blue via-brand-purple to-brand-pink p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Ofertas imperdíveis da semana!</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Preparamos descontos especiais em toda a linha de mochilas e cadernos. Não perca!
            </p>
            <a href={WHATSAPP_LINK} className="btn-primary bg-white text-brand-purple hover:bg-gray-100 inline-flex items-center gap-2">
              Consultar agora
              <ChevronRight size={20} />
            </a>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-32 overflow-hidden relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-purple/5 -z-10 skew-x-12 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              {...fadeIn}
              className="relative"
            >
              {/* Elegant Logo & Address Composition */}
              <div className="relative z-10">
                {/* Main Logo Card */}
                <div className="aspect-square bg-linear-to-br from-brand-blue via-brand-purple to-brand-pink rounded-[80px] shadow-2xl flex flex-col items-center justify-center p-12 relative overflow-hidden border-12 border-white">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="w-40 h-40 bg-white rounded-[40px] flex items-center justify-center shadow-2xl relative rotate-3"
                    >
                      <span className="text-[100px] font-display font-black text-brand-purple leading-none select-none -rotate-3">P</span>
                    </motion.div>
                    
                    <div className="mt-10 text-center">
                      <h3 className="text-5xl font-display font-bold text-white tracking-tight drop-shadow-lg">Paper Fácil</h3>
                      <div className="flex items-center justify-center gap-3 mt-3">
                        <div className="h-px w-8 bg-white/50" />
                        <span className="text-xs font-bold text-white uppercase tracking-[0.4em]">Premium Papelaria</span>
                        <div className="h-px w-8 bg-white/50" />
                      </div>
                    </div>
                  </div>

                  {/* Sparkles */}
                  <div className="absolute top-10 right-10 text-white/40 animate-pulse">
                    <Sparkles size={40} />
                  </div>
                  <div className="absolute bottom-10 left-10 text-white/40 animate-pulse delay-700">
                    <Sparkles size={30} />
                  </div>
                </div>

                {/* Floating Address Card */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -bottom-10 -right-6 md:-right-12 bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 max-w-[280px] group hover:-translate-y-2 transition-transform duration-300"
                >
                  <div className="w-14 h-14 bg-brand-purple/10 rounded-2xl flex items-center justify-center text-brand-purple mb-6 group-hover:scale-110 transition-transform">
                    <MapPin size={32} />
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-3">Onde estamos</h4>
                  <p className="text-gray-500 leading-relaxed mb-6">
                    Av. José Maria Alkimin, 777<br />
                    Centro, Patrocínio - MG
                  </p>
                  <a 
                    href="https://maps.google.com/?q=Av.+José+Maria+Alkimin,+777+-+Centro,+Patrocínio+-+MG" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-purple font-bold hover:gap-4 transition-all"
                  >
                    Ver no Google Maps
                    <ChevronRight size={18} />
                  </a>
                </motion.div>
              </div>

              {/* Decorative background circle */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -z-10" />
            </motion.div>

            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <span className="text-brand-purple font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Desde 2020</span>
              <h2 className="text-5xl font-display font-bold mb-8 leading-tight">Criatividade que transforma o seu <span className="gradient-text">dia a dia</span></h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A Paper Fácil Papelaria nasceu em Patrocínio com a missão de trazer os materiais mais exclusivos e inspiradores para estudantes, artistas e profissionais.
              </p>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
                Nossa curadoria é feita com amor, selecionando cada caneta, caderno e acessório para garantir que sua experiência de escrita e criação seja única e prazerosa.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-4xl font-display font-bold text-brand-blue">100%</p>
                  <p className="text-gray-500 font-medium">Produtos Originais</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-display font-bold text-brand-purple">9k+</p>
                  <p className="text-gray-500 font-medium">Clientes Felizes</p>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-gray-100">
                <a href={WHATSAPP_LINK} className="btn-primary bg-brand-purple text-white hover:shadow-brand-purple/20 inline-flex items-center gap-3">
                  <MessageCircle size={22} />
                  Fale com nossa equipe
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">O que dizem sobre nós</h2>
            <p className="text-gray-600">A satisfação dos nossos clientes é o nosso maior combustível.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} size={18} fill="#FFD700" className="text-[#FFD700]" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-purple/10 rounded-full flex items-center justify-center text-brand-purple font-bold">
                    {review.author[0]}
                  </div>
                  <span className="font-bold text-gray-900">{review.author}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className="bg-gray-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-linear-to-br from-brand-blue to-brand-purple rounded-xl flex items-center justify-center text-white">
                  <Sparkles size={24} />
                </div>
                <span className="text-2xl font-display font-bold tracking-tight">
                  Paper <span className="text-brand-purple">Fácil</span>
                </span>
              </div>
              <p className="text-gray-400 max-w-sm mb-8">
                Sua papelaria criativa em Patrocínio. Transformando ideias em realidade com os melhores materiais.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com/paperfacil" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-brand-purple transition-colors">
                  <Instagram size={20} />
                </a>
                <a href={WHATSAPP_LINK} className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-[#25D366] transition-colors">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Links Rápidos</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="#início" className="hover:text-white transition-colors">Início</a></li>
                <li><a href="#produtos" className="hover:text-white transition-colors">Produtos</a></li>
                <li><a href="#promoções" className="hover:text-white transition-colors">Promoções</a></li>
                <li><a href="#sobre" className="hover:text-white transition-colors">Sobre Nós</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Contato</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-brand-purple shrink-0" />
                  <span>Av. José Maria Alkimin, 777 - Centro, Patrocínio MG</span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle size={20} className="text-brand-purple shrink-0" />
                  <a href={WHATSAPP_LINK} className="hover:text-white transition-colors">(34) 99999-9999</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Paper Fácil Papelaria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
