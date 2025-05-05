
import { frModalActions } from './actions';
import { frModalCommon } from './common';
import { frModalFields } from './fields';
import { frModalPlaceholders } from './placeholders';
import { frModalValidation } from './validation';

export const frModal = {
  ...frModalActions,
  ...frModalCommon,
  ...frModalFields,
  ...frModalPlaceholders,
  ...frModalValidation
};
