// global-exception-filter.spec.ts
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import {
  GlobalExceptionFilter,
  PostgresErrorCodes,
} from '@infrastructure/modules/common/filters/global-exception.filter';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeQueryFailedError(
  code: string,
  extras: Record<string, unknown> = {},
): QueryFailedError {
  const err = new QueryFailedError('SELECT 1', [], new Error('db error'));
  Object.assign(err, { code, ...extras });
  return err;
}

function run(exception: unknown, url = '/api/resource') {
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ url }),
    }),
  } as unknown as ArgumentsHost;

  const filter = new GlobalExceptionFilter();
  filter.catch(exception, host);

  const httpStatus: number = status.mock.calls[0][0];
  const payload = json.mock.calls[0][0];

  return { httpStatus, payload };
}

// ─── Setup ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  delete process.env.ENVIRONMENT;
});

afterEach(() => jest.restoreAllMocks());

// ══════════════════════════════════════════════════════════════
// 1. EntityNotFoundError
// ══════════════════════════════════════════════════════════════

describe('EntityNotFoundError', () => {
  it('returns 404 with correct shape', () => {
    const { httpStatus, payload } = run(new EntityNotFoundError('User', {}));

    expect(httpStatus).toBe(HttpStatus.NOT_FOUND);
    expect(payload.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(payload.message).toBe('The requested resource does not exist.');
    expect(payload.path).toBe('/api/resource');
    expect(payload.timestamp).toBeDefined();
  });
});

// ══════════════════════════════════════════════════════════════
// 2. QueryFailedError – integrity violations
// ══════════════════════════════════════════════════════════════

describe('QueryFailedError – integrity violations', () => {
  describe('UNIQUE_VIOLATION (23505)', () => {
    it('returns 409 with field name when detail includes it', () => {
      const err = makeQueryFailedError(PostgresErrorCodes.UNIQUE_VIOLATION, {
        detail: 'Key (email)=(test@test.com) already exists.',
      });
      const { httpStatus, payload } = run(err);

      expect(httpStatus).toBe(HttpStatus.CONFLICT);
      expect(payload.error).toBe('Duplicated Entry');
      expect(payload.message).toContain('email');
    });

    it('returns generic message when detail is absent', () => {
      const err = makeQueryFailedError(PostgresErrorCodes.UNIQUE_VIOLATION, {
        detail: '',
      });
      const { httpStatus, payload } = run(err);

      expect(httpStatus).toBe(HttpStatus.CONFLICT);
      expect(payload.message).toBe(
        'The record already exists in the database.',
      );
    });
  });

  describe('FOREIGN_KEY_VIOLATION (23503)', () => {
    it('returns 400 with table name when detail includes it', () => {
      const err = makeQueryFailedError(
        PostgresErrorCodes.FOREIGN_KEY_VIOLATION,
        {
          detail: 'Key (userId)=(99) is not present in table "users".',
        },
      );
      const { httpStatus, payload } = run(err);

      expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
      expect(payload.error).toBe('Foreign Key Violation');
      expect(payload.message).toContain('users');
    });

    it('returns generic message when detail is absent', () => {
      const err = makeQueryFailedError(
        PostgresErrorCodes.FOREIGN_KEY_VIOLATION,
        { detail: '' },
      );
      const { payload } = run(err);
      expect(payload.message).toBe(
        'Invalid reference: the resource does not exist.',
      );
    });
  });

  describe('NOT_NULL_VIOLATION (23502)', () => {
    it('returns 400 and includes the column name', () => {
      const err = makeQueryFailedError(PostgresErrorCodes.NOT_NULL_VIOLATION, {
        column: 'name',
      });
      const { httpStatus, payload } = run(err);

      expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
      expect(payload.error).toBe('Not Null Violation');
      expect(payload.message).toContain('name');
    });

    it('falls back to "unknown" when column is not present', () => {
      const err = makeQueryFailedError(PostgresErrorCodes.NOT_NULL_VIOLATION);
      const { payload } = run(err);
      expect(payload.message).toContain('unknown');
    });
  });

  it('CHECK_VIOLATION returns 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.CHECK_VIOLATION),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('Check violation');
  });

  it('EXCLUSION_VIOLATION returns 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.EXCLUSION_VIOLATION),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('Exclusion violation');
  });
});

// ══════════════════════════════════════════════════════════════
// 3. QueryFailedError – syntax errors (parametrizado)
// ══════════════════════════════════════════════════════════════

describe('QueryFailedError – syntax errors', () => {
  const syntaxCases: [string, string, string][] = [
    [
      PostgresErrorCodes.SYNTAX_ERROR,
      'Syntax Error',
      'Error in the SQL syntax',
    ],
    [
      PostgresErrorCodes.UNDEFINED_COLUMN,
      'Undefined Column',
      'Column not defined',
    ],
    [
      PostgresErrorCodes.UNDEFINED_TABLE,
      'Undefined Table',
      'Table not defined',
    ],
    [
      PostgresErrorCodes.UNDEFINED_FUNCTION,
      'Undefined Function',
      'Operation error in the database',
    ],
    [
      PostgresErrorCodes.DUPLICATE_TABLE,
      'Duplicated Table',
      'table is duplicated',
    ],
    [
      PostgresErrorCodes.DUPLICATE_COLUMN,
      'Duplicated Column',
      'column is duplicated',
    ],
  ];

  test.each(syntaxCases)(
    'code %s → 500 con error "%s"',
    (code, expectedError, msgFragment) => {
      const { httpStatus, payload } = run(makeQueryFailedError(code));
      expect(httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(payload.error).toBe(expectedError);
      expect(payload.message.toLowerCase()).toContain(
        msgFragment.toLowerCase(),
      );
    },
  );
});

// ══════════════════════════════════════════════════════════════
// 4. QueryFailedError – type errors
// ══════════════════════════════════════════════════════════════

describe('QueryFailedError – type errors', () => {
  it('INVALID_TEXT_REPRESENTATION → 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.INVALID_TEXT_REPRESENTATION),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('Invalid Text Representation');
  });

  it('DIVISION_BY_ZERO → 400 con mensaje Pavlovian', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.DIVISION_BY_ZERO),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.message).toContain('Pavlovian');
  });

  it('NUMERIC_VALUE_OUT_OF_RANGE → 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('Numeric Value out of Range');
  });

  it('STRING_DATA_RIGHT_TRUNCATION → 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.STRING_DATA_RIGHT_TRUNCATION),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('String Data Right Truncation');
  });

  it('INVALID_DATETIME_FORMAT → 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.INVALID_DATETIME_FORMAT),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('Invalid Datetime Format');
  });

  it('DATETIME_FIELD_OVERFLOW → 400', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.DATETIME_FIELD_OVERFLOW),
    );
    expect(httpStatus).toBe(HttpStatus.BAD_REQUEST);
    expect(payload.error).toBe('Datetime Field Overflow');
  });
});

// ══════════════════════════════════════════════════════════════
// 5. QueryFailedError – network errors
// ══════════════════════════════════════════════════════════════

describe('QueryFailedError – network errors', () => {
  const networkCodes = [
    PostgresErrorCodes.CONNECTION_EXCEPTION,
    PostgresErrorCodes.CONNECTION_DOES_NOT_EXIST,
    PostgresErrorCodes.CONNECTION_FAILURE,
  ];

  test.each(networkCodes)('code %s → 503 Database Connection Error', (code) => {
    const { httpStatus, payload } = run(makeQueryFailedError(code));
    expect(httpStatus).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(payload.error).toBe('Database Connection Error');
  });
});

// ══════════════════════════════════════════════════════════════
// 6. QueryFailedError – transaction errors
// ══════════════════════════════════════════════════════════════

describe('QueryFailedError – transaction errors', () => {
  it('IN_FAILED_SQL_TRANSACTION → 409', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.IN_FAILED_SQL_TRANSACTION),
    );
    expect(httpStatus).toBe(HttpStatus.CONFLICT);
    expect(payload.error).toBe('Transaction Aborted');
  });

  it('DEADLOCK_DETECTED → 409', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.DEADLOCK_DETECTED),
    );
    expect(httpStatus).toBe(HttpStatus.CONFLICT);
    expect(payload.error).toBe('Deadlock Detected');
  });

  it('SERIALIZATION_FAILURE → 409', () => {
    const { httpStatus, payload } = run(
      makeQueryFailedError(PostgresErrorCodes.SERIALIZATION_FAILURE),
    );
    expect(httpStatus).toBe(HttpStatus.CONFLICT);
    expect(payload.error).toBe('Serialization Failure');
  });
});

// ══════════════════════════════════════════════════════════════
// 7. HttpException
// ══════════════════════════════════════════════════════════════

describe('HttpException', () => {
  it('handles a plain string response', () => {
    const exception = new HttpException(
      'Custom error message',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    jest
      .spyOn(exception, 'getResponse')
      .mockReturnValue('Custom error message');

    const { httpStatus, payload } = run(exception);

    expect(httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(payload.message).toBe('Custom error message');
    expect(payload.error).toBe('HttpException');
  });

  it('handles an object response with a custom error field', () => {
    const exception = new HttpException(
      { statusCode: 422, message: 'Field invalid', error: 'Validation Error' },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
    const { httpStatus, payload } = run(exception);

    expect(httpStatus).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(payload.error).toBe('Validation Error');
  });

  it('joins an array message into a comma-separated string', () => {
    const exception = new HttpException(
      {
        statusCode: 400,
        message: ['f1 required', 'f2 invalid'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
    Object.defineProperty(exception, 'message', {
      value: ['f1 required', 'f2 invalid'],
    });

    const { payload } = run(exception);
    expect(typeof payload.message).toBe('string');
    expect(payload.message).toContain(',');
  });

  it('logs the error through Logger.error', () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error');
    run(new HttpException('Oops', HttpStatus.BAD_REQUEST));

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('HttpException'),
      expect.any(String),
    );
  });
});

// ══════════════════════════════════════════════════════════════
// 8. Generic Error
// ══════════════════════════════════════════════════════════════

describe('Generic Error', () => {
  it('returns 500 for an unexpected error', () => {
    const { httpStatus, payload } = run(new Error('Something exploded'));

    expect(httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(payload.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(payload.error).toBe('Internal Server error');
  });

  it('logs the uncontrolled error', () => {
    const loggerSpy = jest.spyOn(Logger.prototype, 'error');
    run(new Error('boom'));

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('Uncontrolled error'),
      expect.any(String),
    );
  });
});

// ══════════════════════════════════════════════════════════════
// 9. Development mode – stack y details en la respuesta
// ══════════════════════════════════════════════════════════════

describe('Development mode extras', () => {
  it('includes stack and details when ENVIRONMENT=development', () => {
    process.env.ENVIRONMENT = 'development';
    const { payload } = run(new Error('dev error'));

    expect(payload.stack).toBeDefined();
    expect(payload.details).toBeDefined();
  });

  it('does NOT include stack or details in production', () => {
    const { payload } = run(new Error('prod error'));

    expect(payload.stack).toBeUndefined();
    expect(payload.details).toBeUndefined();
  });
});

// ══════════════════════════════════════════════════════════════
// 10. Response payload shape invariants
// ══════════════════════════════════════════════════════════════

describe('Response payload shape', () => {
  it('always includes statusCode, error, message, timestamp and path', () => {
    const { payload } = run(
      new EntityNotFoundError('Post', {}),
      '/api/posts/1',
    );

    expect(payload).toMatchObject({
      statusCode: expect.any(Number),
      error: expect.any(String),
      message: expect.any(String),
      timestamp: expect.any(String),
      path: '/api/posts/1',
    });
  });

  it('timestamp is a valid ISO 8601 string', () => {
    const { payload } = run(new Error('ts check'));
    expect(() => new Date(payload.timestamp)).not.toThrow();
    expect(new Date(payload.timestamp).toISOString()).toBe(payload.timestamp);
  });

  it('path reflects the actual request URL', () => {
    const { payload } = run(new Error('path check'), '/custom/url?foo=bar');
    expect(payload.path).toBe('/custom/url?foo=bar');
  });
});

// ══════════════════════════════════════════════════════════════
// 11. Unknown pg code
// ══════════════════════════════════════════════════════════════

describe('Unknown QueryFailedError code', () => {
  it('returns 500 with default internal error for an unmapped pg code', () => {
    const err = makeQueryFailedError('99999');
    const { httpStatus, payload } = run(err);

    expect(httpStatus).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(payload.error).toBe('Internal Server error');
    expect(payload.message).toBe('An error ocurred in the database.');
  });
});
