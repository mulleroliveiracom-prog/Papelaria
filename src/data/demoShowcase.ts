import heroImg from '../assets/images/hero_newborn_studio_1795008518204.jpg';
import cloudImg from '../assets/images/demo_cloud_dream_1795008520387.jpg';
import teddyImg from '../assets/images/demo_teddy_bears_1795008519102.jpg';
import flowerBasketImg from '../assets/images/demo_flower_basket_1795008519174.jpg';
import angelImg from '../assets/images/demo_little_angel_1795008522004.jpg';
import luxuryBeigeImg from '../assets/images/demo_luxury_beige_1795008521515.jpg';
import moonStarsImg from '../assets/images/demo_moon_stars_1795008520763.jpg';
import enchantedGardenImg from '../assets/images/scenario_enchanted_garden_1795009828280.jpg';
import littlePrinceImg from '../assets/images/scenario_little_prince_1795009828665.jpg';
import royalVelvetImg from '../assets/images/scenario_royal_velvet_1795028021168.jpg';
import enchantedWoodsImg from '../assets/images/scenario_enchanted_woods_1795028021528.jpg';
import cloudBalloonImg from '../assets/images/scenario_cloud_balloon_1795028022130.jpg';
import moonAstronautImg from '../assets/images/scenario_moon_astronaut_1795028023271.jpg';
import bohoLavenderImg from '../assets/images/scenario_boho_lavender_1795028022758.jpg';
import nordicBearImg from '../assets/images/scenario_nordic_bear_1795028024163.jpg';
import monochromeFineArtImg from '../assets/images/scenario_monochrome_fineart_1795028024985.jpg';
import butterflyGardenImg from '../assets/images/scenario_butterfly_garden_1795028026175.jpg';
import littleSailorImg from '../assets/images/scenario_little_sailor_1795028025226.jpg';
import rusticFarmImg from '../assets/images/scenario_rustic_farm_1795028025853.jpg';

export const HERO_STUDIO_IMAGE = heroImg;

export interface DemoGalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const DEMO_GALLERY_ITEMS: DemoGalleryItem[] = [
  {
    id: 'nuvem',
    title: 'Bebê dormindo em uma nuvem',
    description:
      'Cenário aéreo e sereno com nuvens de algodão macio e iluminação suave em tons claros.',
    image: cloudImg,
  },
  {
    id: 'ursinhos',
    title: 'Bebê em um cenário de ursinhos',
    description:
      'Cesto artesanal aconchegante cercado por ursinhos de pelúcia em bege e creme.',
    image: teddyImg,
  },
  {
    id: 'cesta-flores',
    title: 'Bebê em uma cesta com flores',
    description:
      'Composição botânica delicada com rosas chá, gipsofila e folhas suaves de eucalipto.',
    image: flowerBasketImg,
  },
  {
    id: 'anjinho',
    title: 'Bebê em um cenário de anjinho',
    description:
      'Asas delicadas de plumas brancas sobre mantinha de tricô em luz dourada de janela.',
    image: angelImg,
  },
  {
    id: 'estudio-bege',
    title: 'Bebê em um estúdio bege luxuoso',
    description:
      'Retrato minimalista atemporal em tecidos de linho e cashmere com estética de galeria.',
    image: luxuryBeigeImg,
  },
  {
    id: 'lua-estrelas',
    title: 'Bebê em um cenário de lua e estrelas',
    description:
      'Lua crescente em veludo claro bordada com pequenas estrelas douradas em clima noturno suave.',
    image: moonStarsImg,
  },
];

export const SCENARIO_THUMBNAILS: Record<string, string> = {
  'ursinho-dos-sonhos': teddyImg,
  'jardim-encantado': enchantedGardenImg,
  'pequeno-principe': littlePrinceImg,
  'pequena-princesa': angelImg,
  'nuvem-de-algodao': cloudImg,
  'ceu-estrelado': moonStarsImg,
  'estudio-profissional-bege': luxuryBeigeImg,
  'flores-delicadas': flowerBasketImg,
  'realeza-classica': royalVelvetImg,
  'bosque-encantado': enchantedWoodsImg,
  'balao-nas-nuvens': cloudBalloonImg,
  'pequeno-astronauta-na-lua': moonAstronautImg,
  'boho-chic-lavanda': bohoLavenderImg,
  'ursinho-nordico-trico': nordicBearImg,
  'fine-art-preto-e-branco': monochromeFineArtImg,
  'jardim-das-borboletas': butterflyGardenImg,
  'pequeno-marinheiro': littleSailorImg,
  'fazendinha-rustica-chic': rusticFarmImg,
};
