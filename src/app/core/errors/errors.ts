/* eslint-disable @typescript-eslint/naming-convention */
export const CONSTANTS = {
  ERRORS_PREFIX: 'APP',
};

function formatErrorCode(input: string): string {
  return input.replace(/\s/g, '_').toUpperCase();
}

function createError(code: string, message: string) {
  return {
    code: `${CONSTANTS.ERRORS_PREFIX}_${formatErrorCode(code)}`,
    message,
  };
}

const ERRORS = {
  USER: {
    NOT_FOUND: createError('USER_NOT_FOUND', 'User not found'),
    ALREADY_EXISTS: createError('USER_ALREADY_EXISTS', 'User already exists'),
    INVALID_CREDENTIALS: createError('INVALID_CREDENTIALS', 'Invalid credentials provided'),
  },
  BOOK: {
    NOT_FOUND: createError('BOOK_NOT_FOUND', 'Book not found'),
    ALREADY_EXISTS: createError('BOOK_ALREADY_EXISTS', 'Book already exists'),
  },
  AUTHOR: {
    NOT_FOUND: createError('AUTHOR_NOT_FOUND', 'Author not found'),
    ALREADY_EXISTS: createError('AUTHOR_ALREADY_EXISTS', 'Author already exists'),
  },
  GENERIC: {
    INTERNAL_SERVER_ERROR: createError('INTERNAL_SERVER_ERROR', 'Internal server error'),
  },
  NOT_FOUND: (entity: string, fieldName?: string, fieldValue?: string) => ({
    code: `${CONSTANTS.ERRORS_PREFIX}_${formatErrorCode(entity)}_NOT_FOUND`,
    message: `The ${entity}${fieldName && fieldValue ? ' with ' + fieldName + ' ' + fieldValue : ''} was not found.`,
  }),
  ALREADY_EXISTS: (entity: string, fieldName?: string, fieldValue?: string) => ({
    code: `${CONSTANTS.ERRORS_PREFIX}_${formatErrorCode(entity)}_ALREADY_EXISTS`,
    message: `A ${entity}${fieldName && fieldValue ? ' with ' + fieldName + ' ' + fieldValue : ''} already exists`,
  }),
};

export { ERRORS };
