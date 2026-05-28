export type UseCase =
  | 'visual'
  | 'ads'
  | 'ugc'
  | 'architecture'
  | 'broll'
  | 'experimental';

export type Model = 'gpt-image-2' | 'nano-banana-2' | 'nano-banana-pro' | 'seedance-2' | 'murilo';

export type ModelId = 'gpt-image-2' | 'nano-banana-2' | 'nano-banana-pro' | 'seedance-2';

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

export type Repo = {
  name: string;
  url: string;
  stars: number;
  description: string;
  language?: string;
  topic?: string;
};

export type Video = {
  title: string;
  url: string;
  channel: string;
  durationMin?: number;
  publishedAt?: string;
  topic?: string;
};

export type Course = {
  title: string;
  url: string;
  provider: string;
  lengthHours?: number;
  price: string;
  level: string;
  topic: string;
};

export type Tool = {
  name: string;
  url: string;
  kind: string;
  description: string;
  free: boolean;
};

export type ModelResource = {
  id: ModelId;
  name: string;
  tagline: string;
  release: string;
  vendor: string;
  strengths: string[];
  color: string;
  repos: Repo[];
  videos: Video[];
  courses: Course[];
  tools: Tool[];
};

export type ResourcesIndex = { models: ModelResource[]; generated?: string };

// ===== Playbooks (Frame Zero v2 Phase α) =====

export type PromptEntry = {
  title: string;
  body: string;
  model: Model | 'kling-3' | 'veo-3' | 'ffmpeg' | 'higgsfield';
  kind: Kind;
  aspect: Aspect;
  expectedOutputItemId?: string;
  tags?: string[];
};

export type CaseEntry = {
  brand: string;
  url: string;
  thumbnail?: string;
  credit: string;
  whatsBrilliant: string;
  metric?: string;
};

export type Paper = { title: string; arxivId: string; year: number; relevance: string };
export type Agency = { name: string; url: string; specialty: string; notable: string };

export type StackEntry = { moment: string; model: string; rationale: string };
export type WorkflowSpec = { mermaid: string };
export type BehindLensStep = { step: number; title: string; body: string; screenshot?: string };

export type ROIInput = {
  id: string;
  label: string;
  type: 'number' | 'select';
  default: number | string;
  options?: string[];
};
export type ROIOutput = { id: string; label: string; format: 'BRL' | '%' | 'hours' };
export type ROISpec = { inputs: ROIInput[]; formula: string; outputs: ROIOutput[] };

export type PlaybookResources = {
  repos: Repo[];
  videos: Video[];
  courses: Course[];
  tools: Tool[];
  papers?: Paper[];
  agencies?: Agency[];
};

export type Playbook = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  icp?: string;
  status?: 'stub' | 'ready';
  comingPhase?: string;
  math?: {
    ticketMedio: number;
    timeToDeliver: string;
    costPerAsset: number;
    suggestedMargin: number;
  };
  stack?: StackEntry[];
  workflow?: WorkflowSpec;
  prompts?: PromptEntry[];
  cases?: CaseEntry[];
  resources?: PlaybookResources;
  behindTheLens?: BehindLensStep[];
  roi?: ROISpec;
};

export type PlaybooksIndex = {
  version: string;
  generatedAt: string;
  playbooks: Playbook[];
};
