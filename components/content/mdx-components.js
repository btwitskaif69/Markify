import {
  AlternativesSection,
  KeyStatsWithSources,
  ProsConsTable,
  QuestionFirstAnswer,
  TldrSummary,
} from "@/components/content/AiAnswerBlocks";
import {
  CiteThisPage,
  CopyAnswerButton,
  ShareSnippetButtons,
} from "@/components/content/ContentActions";
import TrustSignals from "@/components/content/TrustSignals";

export const GEO_MDX_COMPONENTS = {
  QuestionFirstAnswer,
  TldrSummary,
  KeyStatsWithSources,
  ProsConsTable,
  AlternativesSection,
  CopyAnswerButton,
  ShareSnippetButtons,
  CiteThisPage,
  TrustSignals,
};

export const getMdxComponents = (overrides = {}) => ({
  ...GEO_MDX_COMPONENTS,
  ...overrides,
});
