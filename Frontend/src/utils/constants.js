export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const UNIDADES_MEDIDA = [
  { value: 'kg', label: 'Kilogramos (Kg)' }, { value: 'g', label: 'Gramos (g)' }, { value: 'mg', label: 'Miligramos (mg)' },
  { value: 'l', label: 'Litros (L)' }, { value: 'ml', label: 'Mililitros (ml)' }, { value: 'unidades', label: 'Unidades' },
  { value: 'tazas', label: 'Tazas' }, { value: 'cucharadas', label: 'Cucharadas' }, { value: 'cucharaditas', label: 'Cucharaditas' },
  { value: 'pizca', label: 'Pizca' }, { value: 'al_gusto', label: 'Al gusto' }, { value: 'oz', label: 'Onzas (oz)' },
  { value: 'lb', label: 'Libras (lb)' }, { value: 'paquete', label: 'Paquete' }, { value: 'lata', label: 'Lata' }, { value: 'diente', label: 'Diente' },
];
export const DIFICULTADES = [
  { value: 'facil', label: 'Fácil' }, { value: 'media', label: 'Media' }, { value: 'dificil', label: 'Difícil' },
];
export const MAX_IMAGENES = 5;
