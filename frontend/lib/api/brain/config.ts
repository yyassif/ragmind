const BRAIN_DATA_KEY = "ragmind-brains";

export const getBrainDataKey = (brainId: string): string =>
  `${BRAIN_DATA_KEY}-${brainId}`;

export const getBrainKnowledgeDataKey = (brainId: string): string =>
  `${BRAIN_DATA_KEY}-${brainId}-knowledge`;

export const PUBLIC_BRAINS_KEY = "ragmind-public-brains";
