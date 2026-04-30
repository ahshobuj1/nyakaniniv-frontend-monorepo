import {azuraTemplate} from './azura/config';

export const templates = {
  azura: azuraTemplate,
};

export type TemplateId = keyof typeof templates;
