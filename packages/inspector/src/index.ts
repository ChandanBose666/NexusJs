// Main API
export { initInspector } from './inspector.js';
export type { InspectorOptions, InspectorHandle } from './inspector.js';

// Types
export {
  ALL_KINDS,
  KIND_COLORS,
  KIND_LABELS,
  emptyStats,
} from './types.js';
export type { ComponentKind, ComponentInfo, InspectorStats } from './types.js';

// Scanner utilities (useful for testing / custom integrations)
export { scanComponents, countByKind, DATA_KIND, DATA_NAME } from './scanner.js';
export type { Scannable } from './scanner.js';

// Style utilities
export { buildStylesheet, injectStylesheet, removeStylesheet, STYLE_ELEMENT_ID } from './styles.js';

// Panel utilities
export {
  buildStatsRows,
  buildPanelContent,
  createPanel,
  updatePanel,
  removePanel,
  PANEL_ELEMENT_ID,
} from './panel.js';
