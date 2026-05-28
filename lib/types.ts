export type UseCase =
  | 'visual'
  | 'ads'
  | 'ugc'
  | 'architecture'
  | 'broll'
  | 'experimental';

export type Model = 'gpt-image-2' | 'nano-banana-pro' | 'seedance-2' | 'murilo';

export type Kind = 'image' | 'video';

export type Aspect = '1:1' | '4:5' | '9:16' | '16:9' | '21:9' | string;

export type Item = {
  id: string;
  model: Model;
  kind: Kind;
  mediaUrl: string;
  posterUrl?: string;
  width: number;
  height: number;
  aspect: Aspect;
  durationSec?: number;
  prompt: string;
  title: string;
  useCase: UseCase;
  subCategory: string;
  sourceRepo: string;
  sourceLicense: string;
  sourceUrl: string;
  featured?: boolean;
};

export type RawItem = Omit<Item, 'id' | 'useCase' | 'subCategory'> & {
  hints?: string[];
};

export const USE_CASES: UseCase[] = ['visual', 'ads', 'ugc', 'architecture', 'broll', 'experimental'];

export const USE_CASE_QUOTAS: Record<UseCase, number> = {
  visual: 60,
  ads: 50,
  ugc: 40,
  architecture: 50,
  broll: 60,
  experimental: 30,
};
