import { UUID } from "crypto";

const brainDataKey = "ragmind-knowledge";

export const getKnowledgeDataKey = (knowledgeId: UUID): string =>
  `${brainDataKey}-${knowledgeId}`;
