
import { enModalActions } from './actions';
import { enModalCommon } from './common';
import { enModalFields } from './fields';
import { enModalPlaceholders } from './placeholders';
import { enModalValidation } from './validation';

export const enModal = {
  ...enModalActions,
  ...enModalCommon,
  ...enModalFields,
  ...enModalPlaceholders,
  ...enModalValidation
};
