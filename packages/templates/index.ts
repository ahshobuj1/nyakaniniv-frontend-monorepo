import {azuraTemplate} from './azura/config';
import {kenzoTemplate} from './kenzo/config';

export const templates = {
  azura: azuraTemplate,
  kenzo: kenzoTemplate,
};

export type TemplateId = keyof typeof templates;
