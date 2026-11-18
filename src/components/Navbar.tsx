import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onStartCreation: () => void;
}

const LINKS = [
  { href: '#exemplos', label: 'Exemplos' },
  { href: '#criar-ensaio', label: 'Criar Ensaio' },
  { href: '#pacotes', label: 'Pacotes' },
  { href: '#duvidas', label: 'Dúvidas' },
];

export function Navbar({ onStartCreation }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F5EFE8]/95 backdrop-blur-md border-b border-[#8C7165]/15">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand wordmark */}
        <a
          href="#topo"
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#51433E] whitespace-nowrap shrink-0"
        >
          Meu Bebê em um Sonho
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B584F]"
        >
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#51433E] hover:underline underline-offset-4 decoration-[#C6A477] transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onStartCreation}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 min-h-[40px]"
          >
            Criar ensaio
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl text-[#51433E] hover:bg-[#EBCFD1]/30 transition-colors cursor-pointer"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#8C7165]/15 bg-[#F5EFE8] px-4 py-4">
          <nav aria-label="Menu móvel" className="flex flex-col gap-1.5">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-3 text-sm font-medium text-[#51433E] rounded-xl hover:bg-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onStartCreation();
              }}
              className="mt-2 w-full py-3.5 text-sm font-semibold text-white bg-[#51433E] hover:bg-[#3F332F] rounded-xl transition-colors cursor-pointer min-h-[44px]"
            >
              Criar meu ensaio agora
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
