import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Lock, CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Zap, Star } from 'lucide-react';

const BUY_LINK = "https://serverflow.dad/c/taxa-26a9";

interface Question {
  id: number;
  question: string;
  options: { label: string; text: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Nosso primeiro encontro. Para onde você me levaria para garantir que a noite fosse inesquecível?",
    options: [
      { label: "A", text: "Um barzinho agitado para a gente beber, rir e quebrar o gelo." },
      { label: "B", text: "Um restaurante sofisticado, à meia-luz, onde a gente pudesse conversar de perto." },
      { label: "C", text: "Uma viagem surpresa de fim de semana para um lugar onde ninguém nos conhece." }
    ]
  },
  {
    id: 2,
    question: "Eu chego para o nosso encontro. O que você adoraria me ver usando?",
    options: [
      { label: "A", text: "Um vestido preto, elegante, mas com um decote nas costas que te deixaria curioso o jantar inteiro." },
      { label: "B", text: "Algo casual e despojado, mostrando que estou super à vontade com você." },
      { label: "C", text: "Uma roupa provocante, daquelas que faz todo o ambiente olhar pra mim quando eu entro." }
    ]
  },
  {
    id: 3,
    question: "Falando nisso... Durante o jantar, você percebe que os caras da mesa ao lado não param de me olhar. Como você reage?",
    options: [
      { label: "A", text: "Fecho a cara e mostro que não estou gostando." },
      { label: "B", text: "Ignoro, afinal, o que importa é o que estamos conversando." },
      { label: "C", text: "Dou um sorriso de canto, seguro a sua mão por cima da mesa e deixo claro para eles com quem você está saindo." }
    ]
  },
  {
    id: 4,
    question: "A noite está ótima, mas o jantar acabou. Qual é o seu próximo movimento?",
    options: [
      { label: "A", text: "Pergunto se você quer que eu te deixe em casa." },
      { label: "B", text: "Te levo para um lugar mais reservado para tomarmos o último drink da noite." },
      { label: "C", text: "Não pergunto nada. Apenas pego na sua mão, te guio até o carro e deixo o clima acontecer." }
    ]
  },
  {
    id: 5,
    question: "O clima esquentou. Eu chego bem perto e sussurro algo no seu ouvido. O que você gostaria de ouvir?",
    options: [
      { label: "A", text: " \"Eu estava esperando por isso a noite toda.\"" },
      { label: "B", text: " \"Você é bem mais interessante do que eu imaginava.\"" },
      { label: "C", text: " \"Me mostre do que você é capaz...\"" }
    ]
  }
];

function App() {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'calculating' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [calcProgress, setCalcProgress] = useState(0);

  // Background star particles
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${(Math.random() * 100).toFixed(2)}%`,
      left: `${(Math.random() * 100).toFixed(2)}%`,
      size: Math.random() > 0.7 ? '3px' : '1.5px',
      opacity: (Math.random() * 0.6 + 0.2).toFixed(2),
      animationDelay: `${(Math.random() * 4).toFixed(1)}s`,
    }));
  }, []);

  // Handle option selection during quiz
  const handleSelectOption = (optionLabel: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion]: optionLabel }));

    if (currentQuestion < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
      }, 250);
    } else {
      // Finished all 5 questions -> go to calculating screen
      setTimeout(() => {
        setStage('calculating');
      }, 250);
    }
  };

  // Calculating screen simulation timer (3 seconds)
  useEffect(() => {
    if (stage === 'calculating') {
      setCalcProgress(0);
      const interval = setInterval(() => {
        setCalcProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 4;
        });
      }, 100);

      const timeout = setTimeout(() => {
        setStage('result');
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [stage]);

  const progressPercentage = Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100);

  return (
    <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-zinc-950 via-black to-zinc-950 text-zinc-100 font-sans flex flex-col items-center justify-between p-3.5 sm:p-6 overflow-x-hidden selection:bg-red-500/20 selection:text-red-200">
      
      {/* Background Star Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: Number(star.opacity),
              animationDelay: star.animationDelay,
            }}
          />
        ))}
      </div>

      {/* Red & Purple Background Glow Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-80 bg-red-900/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md h-80 bg-purple-900/10 blur-[120px] pointer-events-none z-0" />

      {/* Top Scarcity Bar / Sticky Yellow Header if in Quiz or Result */}
      <div className="w-full max-w-sm sm:max-w-md z-20 pt-1.5 pb-3">
        {stage === 'quiz' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                Pergunta {currentQuestion + 1} de {QUESTIONS.length}
              </span>
              <span>{progressPercentage}% Concluído</span>
            </div>
            {/* Top Yellow Progress Bar */}
            <div className="w-full h-2.5 bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden p-0.5 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow-lg shadow-amber-500/50"
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl py-2 px-2.5 text-center">
            <span className="text-amber-400 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest flex items-center justify-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-amber-400 shrink-0" /> ATENÇÃO: OFERTA TEMPORÁRIA LIBERADA
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-sm sm:max-w-md flex-1 flex flex-col justify-center items-center z-10 py-2 sm:py-4">
        <AnimatePresence mode="wait">

          {/* ==================== TELA 1: INTRODUÇÃO ==================== */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/90 text-center space-y-4 sm:space-y-6 relative overflow-hidden"
            >
              {/* Top Pill Seal */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-md">
                <Lock className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>VERIFICAÇÃO</span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Você seria capaz de me <span className="text-red-500 underline decoration-red-500/50 decoration-2">impressionar</span>? <br />
                <span className="text-zinc-400 font-medium text-base sm:text-lg md:text-xl">(O Teste da Elza)</span>
              </h1>

              {/* Red Passion / Mystery Accent Line */}
              <div className="w-14 sm:w-16 h-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full mx-auto" />

              {/* Text Copy */}
              <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed text-left bg-zinc-950/60 p-3.5 sm:p-4 rounded-2xl border border-zinc-800/60 font-normal">
                "Muitos caras chegam na minha DM achando que sabem exatamente como me agradar, mas a verdade é que poucos têm a atitude que me prende. Vamos fazer um joguinho rápido? Se você provar que sabe me tratar em um encontro, eu tenho um presente bem particular te esperando no final..."
              </p>

              {/* Start Button */}
              <button
                onClick={() => setStage('quiz')}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm sm:text-base md:text-lg tracking-wider uppercase shadow-xl shadow-red-950/50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group border border-red-400/30"
              >
                <span>🔥 INICIAR O TESTE AGORA</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-[11px] sm:text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Teste 100% Privado e Anônimo</span>
              </div>
            </motion.div>
          )}

          {/* ==================== TELA 2: PERGUNTAS DO QUIZ ==================== */}
          {stage === 'quiz' && (
            <motion.div
              key={`question-${currentQuestion}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/90 space-y-4 sm:space-y-6"
            >
              {/* Question Header */}
              <div className="space-y-1.5">
                <span className="text-red-500 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  Pergunta {QUESTIONS[currentQuestion].id}
                </span>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-snug">
                  {QUESTIONS[currentQuestion].question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-2.5 sm:space-y-3">
                {QUESTIONS[currentQuestion].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt.label)}
                    className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-red-500/50 text-zinc-200 hover:text-white font-medium text-xs sm:text-sm md:text-base transition-all duration-200 flex items-start gap-3 active:scale-[0.99] group shadow-md"
                  >
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 group-hover:bg-red-500 group-hover:text-white font-black text-xs flex items-center justify-center shrink-0 transition-colors">
                      {opt.label}
                    </span>
                    <span className="leading-relaxed pt-0.5">{opt.text}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ==================== TELA 3: CALCULANDO COMPATIBILIDADE (3s) ==================== */}
          {stage === 'calculating' && (
            <motion.div
              key="calculating"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 my-auto"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center">
                {/* Circular pulse glowing ring */}
                <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-red-500 border-r-amber-400 animate-spin" />
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 fill-red-500 animate-bounce" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  Calculando sua compatibilidade...
                </h3>
                <p className="text-[11px] sm:text-xs text-zinc-400 font-mono">
                  Analisando suas atitudes e respostas ({calcProgress}%)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-zinc-950 border border-zinc-800 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-150"
                  style={{ width: `${calcProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Gerando seu resultado exclusivo...</span>
              </div>
            </motion.div>
          )}

          {/* ==================== TELA 4: RESULTADO E OFERTA FINAL ==================== */}
          {stage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/95 space-y-4 sm:space-y-6 text-left"
            >
              {/* Match Highlight Header */}
              <div className="bg-gradient-to-r from-red-950/80 via-zinc-900 to-amber-950/80 border border-red-500/40 rounded-2xl p-3.5 sm:p-4 text-center space-y-1 shadow-lg">
                <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                  <span>Pontuação:</span>
                  <span className="text-red-500 bg-red-500/10 px-2 py-0.5 rounded-lg border border-red-500/30">
                    98% de Compatibilidade! 🔥
                  </span>
                </h2>
              </div>

              {/* Exact Copy Paragraphs */}
              <div className="space-y-3 sm:space-y-4 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed bg-zinc-950/60 p-4 sm:p-5 rounded-2xl border border-zinc-800/60">
                <p>
                  "Uau... Eu confesso que estou surpresa. A maioria dos caras erra feio na atitude, mas você acertou em cheio no que me deixa louca. Você tem exatamente a mistura de confiança e mistério que eu adoro em um homem.
                </p>
                <p>
                  Como você provou que não é igual aos outros, promessa é dívida. Eu preparei um presente exclusivo para você: <strong className="text-white underline decoration-red-500">O meu contato direto VIP</strong>.
                </p>
                <p>
                  Eu quero continuar essa conversa com você em um lugar mais privado. E para melhorar, vou te mandar lá a foto exata do vestido que eu usaria nesse nosso encontro... 🤫
                </p>
                <p>
                  Mas olha, eu recebo centenas de mensagens de curiosos todos os dias, e eu só quero no meu chat VIP homens de verdade. Por isso, para liberar o seu presente e o meu contato direto, o sistema pede apenas uma taxa de verificação anti-spam de <strong className="text-amber-400 font-extrabold">R$ 3,99</strong>.
                </p>
                <p>
                  É menos que um café. É só para me provar que você é real, que valoriza o meu tempo e que não é apenas mais um moleque da internet.
                </p>
                <p className="font-bold text-white pt-1">
                  O seu presente e a minha foto já estão destravados te esperando. Você vem ou vai me deixar esperando?
                </p>
              </div>

              {/* Primary Green CTA Button (High-Contrast Emerald, Pulsing) */}
              <div className="pt-1 sm:pt-2">
                <a
                  href={BUY_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block w-full text-center"
                >
                  {/* Neon Glow behind green CTA */}
                  <div className="absolute inset-0 bg-emerald-500/40 rounded-2xl blur-xl animate-pulse" />

                  <div className="relative py-4 sm:py-5 px-3.5 sm:px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 hover:to-green-400 active:scale-[0.98] text-zinc-950 font-black text-xs sm:text-base md:text-lg tracking-wide shadow-2xl shadow-emerald-500/30 transition-all border border-emerald-300 flex items-center justify-center gap-1.5 sm:gap-2 leading-tight">
                    <span className="animate-bounce shrink-0">👉</span>
                    <span className="uppercase">QUERO MEU PRESENTE E ACESSO VIP (R$ 3,99)</span>
                  </div>
                </a>
              </div>

              {/* Security and Guarantee info */}
              <div className="flex flex-col items-center justify-center gap-1 text-center text-[11px] sm:text-xs text-zinc-500 pt-0.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Acesso Imediato e Discreto</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-zinc-600">
                  Taxa simbólica anti-spam de R$ 3,99. Liberação instantânea no seu celular.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-sm sm:max-w-md text-center py-3.5 z-10 border-t border-zinc-900/60">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
          © 2026 O Teste da Elza • Todos os direitos reservados
        </p>
      </footer>

    </div>
  );
}

export default App;


