export interface TsCard {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  front: string;
  back: {
    description: string;
    example: string;
    tip: string;
  }
}