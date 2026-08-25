/**
 * =======================================================================
 *  ARQUIVO DE CONFIGURAÇÃO PRINCIPAL - ELZA DAMASCENO VIP
 * =======================================================================
 *  Aqui você pode facilmente alterar:
 *  - Nome da modelo e títulos
 *  - Fotos (locais em /images/elza/ ou URLs online)
 *  - Links de checkout para cada plano
 *  - Preços e descrições dos planos
 *  - Redes sociais e contatos
 * =======================================================================
 */

export interface PlanConfig {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  highlighted?: boolean;
  buttonText: string;
  checkoutUrl: string;
  features: string[];
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  isVipLocked?: boolean;
}

export const SITE_CONFIG = {
  // Informações da Modelo
  model: {
    name: "Elza Damasceno",
    title: "ELZA DAMASCENO VIP",
    tagline: "🔥 BEM-VINDO AO VIP DA ELZA 🔥",
    subtitle: "Conteúdos exclusivos, novidades frequentes e acesso ao conteúdo premium da Elza Damasceno. ❤️",
    bio: "Seja bem-vindo(a) ao meu espaço VIP ❤️ Aqui você encontra conteúdos exclusivos, fotos, vídeos e muitas novidades especiais. Entre agora e tenha acesso ao meu conteúdo premium. 😈🔥",
    isLive: true,
    age: "20",
    stats: {
      photosCount: "1.450+",
      videosCount: "380+",
      subscribersSatisfaction: "99.8%",
      updatesWeekly: "Semanais 🔥"
    }
  },

  // Fotos da Modelo (Substitua pelos seus arquivos em /images/elza/ ou links diretos)
  images: {
    // Foto principal grande em destaque no topo
    featured: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
    // Foto de perfil circular
    profile: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },

  // Redes Sociais e Contatos
  socialLinks: {
    instagram: "https://instagram.com/elzadias",
    tiktok: "https://tiktok.com/@elzadias",
    telegram: "https://t.me/Elzadamasceno_bot",
    support: "https://t.me/Elzadamasceno_bot"
  },

  // Itens da seção "O que tem no VIP?"
  vipBenefits: [
    {
      icon: "Sparkles",
      title: "CONTEÚDOS NOVOS FREQUENTEMENTE",
      desc: "Postagens e novidades postadas diariamente no canal privado."
    },
    {
      icon: "Flame",
      title: "FOTOS EXCLUSIVAS",
      desc: "Ensaios fotográficos em alta resolução sem censura."
    },
    {
      icon: "Heart",
      title: "VÍDEOS ESPECIAIS",
      desc: "Vídeos em alta definição 4K gravados especialmente para você."
    },
    {
      icon: "Smile",
      title: "CONTEÚDOS PREMIUM",
      desc: "Acesso a todo o acervo histórico sem custos adicionais."
    },
    {
      icon: "Camera",
      title: "PACKS EXCLUSIVOS",
      desc: "Coleções temáticas e ensaios sensuais completos."
    },
    {
      icon: "Video",
      title: "VÍDEOS PRIVADOS",
      desc: "Momentos íntimos e gravações exclusivas do dia a dia."
    },
    {
      icon: "Gift",
      title: "NOVIDADES TODA SEMANA",
      desc: "Enquetes interativas e lançamentos semanais garantidos."
    },
    {
      icon: "ShieldAlert",
      title: "ÁREA EXCLUSIVA PARA ASSINANTES",
      desc: "Sigilo absoluto, privacidade garantida e suporte direto."
    }
  ],

  // Galeria de Fotos VIP
  gallery: [
    {
      id: 1,
      title: "Ensaio Especial",
      category: "Ensaio Exclusivo",
      imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
      isVipLocked: false
    },
    {
      id: 2,
      title: "Making of Privado",
      category: "Vídeos & Fotos",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
      isVipLocked: true
    },
    {
      id: 3,
      title: "Coleção Sensual",
      category: "Pack Temático",
      imageUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
      isVipLocked: true
    },
    {
      id: 4,
      title: "Bastidores VIP",
      category: "Momentos Íntimos",
      imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
      isVipLocked: false
    },
    {
      id: 5,
      title: "Ensaio Gold 4K",
      category: "Alta Resolução",
      imageUrl: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
      isVipLocked: true
    },
    {
      id: 6,
      title: "Pack Especial",
      category: "Conteúdo Quente",
      imageUrl: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=800&auto=format&fit=crop",
      isVipLocked: true
    },
    {
      id: 7,
      title: "Close Especial",
      category: "Edição Limitada",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
      isVipLocked: true
    },
    {
      id: 8,
      title: "Noite Privada",
      category: "Vídeo Exclusivo",
      imageUrl: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=800&auto=format&fit=crop",
      isVipLocked: true
    }
  ] as GalleryItem[],

  // Planos de Assinatura
  plans: [
    {
      id: "mensal",
      name: "1 MÊS",
      badge: "🔥 ACESSO INICIAL",
      price: "R$ 19,90",
      period: "por 30 dias",
      description: "Acesso ao conteúdo VIP durante 30 dias com todas as atualizações inclusas.",
      highlighted: false,
      buttonText: "ASSINAR 1 MÊS",
      checkoutUrl: "https://paylume.fans/c/pack-100",
      features: [
        "Acesso completo ao canal VIP por 30 dias",
        "Fotos e vídeos exclusivos sem censura",
        "Atualizações diárias de conteúdo",
        "Suporte e liberação imediata via PIX"
      ]
    },
    {
      id: "trimestral",
      name: "3 MESES",
      badge: "🔥 MAIS POPULAR 🔥",
      price: "R$ 29,90",
      period: "por 90 dias (Apenas R$ 9,96/mês)",
      description: "90 dias de acesso ao VIP com o melhor custo-benefício e prioridade nos novos lançamentos.",
      highlighted: true,
      buttonText: "ASSINAR 3 MESES",
      checkoutUrl: "https://paylume.fans/c/namoradinha-aeed",
      features: [
        "90 dias de acesso ilimitado ao VIP",
        "Economia de mais de 50% no plano",
        "Acesso antecipado a packs inéditos",
        "Acesso a todas as fotos e vídeos anteriores",
        "Liberação automática instantânea"
      ]
    },
    {
      id: "vitalicio",
      name: "VITALÍCIO",
      badge: "👑 ACESSO PERMANENTE",
      price: "R$ 39,90",
      period: "Pagamento único para sempre",
      description: "Pagamento único para acesso permanente ao conteúdo disponível na plataforma, conforme as condições da assinatura.",
      highlighted: false,
      buttonText: "QUERO ACESSO VITALÍCIO",
      checkoutUrl: "https://paylume.fans/c/pack-da-elza",
      features: [
        "Acesso VITALÍCIO sem mensalidades",
        "Nunca mais pague nada para ver",
        "Todas as futuras atualizações gratuitas",
        "Packs completos em qualidade máxima 4K",
        "Acesso VIP prioridade máxima"
      ]
    }
  ] as PlanConfig[]
};
