
import { enModalCommon } from './en/common';
import { enModalFields } from './en/fields';
import { enModalPlaceholders } from './en/placeholders';
import { enModalValidation } from './en/validation';
import { enModalActions } from './en/actions';

import { frModalCommon } from './fr/common';
import { frModalFields } from './fr/fields';
import { frModalPlaceholders } from './fr/placeholders';
import { frModalValidation } from './fr/validation';
import { frModalActions } from './fr/actions';

import type { ModalTranslations } from '../../types/modal';

export const enModal: ModalTranslations = {
  ...enModalCommon,
  ...enModalFields,
  ...enModalPlaceholders,
  ...enModalValidation,
  ...enModalActions,
};

export const frModal: ModalTranslations = {
  ...frModalCommon,
  ...frModalFields,
  ...frModalPlaceholders,
  ...frModalValidation,
  ...frModalActions,
};
