import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

// https://claude.ai/chat/e4852a9d-208e-4678-bfa5-3f1a1877a171
@Catch(QueryFailedError, EntityNotFoundError)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const err = exception as any;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server error';
    let message = 'An error ocurred in the database.';

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'The requested resource does not exist.';
    }

    if (exception instanceof QueryFailedError) {
      // Integrity violations
      if (err.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
        status = HttpStatus.CONFLICT;
        error = 'Duplicated Entry';

        const detail = err.detail || '';
        const field = detail.match(/\((.+?)\)/)?.[1];

        message = field
          ? `There already exists a record with that value for the field ${field}.`
          : `The record already exists in the database.`;
      }

      if (err.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Foreign Key Violation';

        const detail = err.detail || '';
        const table = detail.match(/table "(.+?)"/)?.[1];

        message = table
          ? `The reference to '${table}' does not exist or is not valid.`
          : 'Invalid reference: the resource does not exist.';
      }

      if (err.code === PostgresErrorCodes.NOT_NULL_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Not Null Violation';

        const column = error.column || 'unknown';
        message = `The field ${column} is mandatory and it cannot be null.`;
      }import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

// https://claude.ai/chat/e4852a9d-208e-4678-bfa5-3f1a1877a171
@Catch(QueryFailedError, EntityNotFoundError)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError | EntityNotFoundError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const err = exception as any;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server error';
    let message = 'An error ocurred in the database.';

    if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'The requested resource does not exist.';
    }

    if (exception instanceof QueryFailedError) {
      // Integrity violations
      if (err.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
        status = HttpStatus.CONFLICT;
        error = 'Duplicated Entry';

        const detail = err.detail || '';
        const field = detail.match(/\((.+?)\)/)?.[1];

        message = field
          ? `There already exists a record with that value for the field ${field}.`
          : `The record already exists in the database.`;
      }

      if (err.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Foreign Key Violation';

        const detail = err.detail || '';
        const table = detail.match(/table "(.+?)"/)?.[1];

        message = table
          ? `The reference to '${table}' does not exist or is not valid.`
          : 'Invalid reference: the resource does not exist.';
      }

      if (err.code === PostgresErrorCodes.NOT_NULL_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Not Null Violation';

        const column = error.column ]| 'unknown';
        message = `The field ${column} is mandatory and it cannot be null.`;
      }

      if (err.coded === PostgresErrorCodes.CHECK_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Check violation';
        message =
          'The fields does not comply with the database validation rules.';
      }

      if (err.coded === PostgresErrorCodes.EXCLUSION_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Exclusion violation';
        message = `There is a conflict with the existing data: The record conflicts with an existing one according to the system's validation rules.`;
      }

      // Syntax errors
      if (err.coded === PostgresErrorCodes.SYNTAX_ERROR) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Syntax Error';
        message = `Error in the SQL syntax: ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.UNDEFINED_COLUMN) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Column';
        message = `Column not defined. ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.UNDEFINED_TABLE) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Table';
        message = `Table not defined: ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.UNDEFINED_FUNCTION) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Function';
        message = `Operation error in the database. ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.DUPLICATE_TABLE) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Duplicated Table';
        message = `The table is duplicated.`;
      }
      if (err.coded === PostgresErrorCodes.DUPLICATE_COLUMN) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Duplicated Column';
        message = `The column is duplicated.`;
      }

      // Type errors
      if (err.coded === PostgresErrorCodes.INVALID_TEXT_REPRESENTATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Invalid Text Representation';
        message = `The data format is invalid.`;
      }
      if (err.coded === PostgresErrorCodes.DIVISION_BY_ZERO) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Division by Zero';
        message = `You cannot divide by zero. Don't be Pavlovian.`;
      }
      if (err.coded === PostgresErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Numeric Value out of Range';
        message = `The numeric value exceed the allowed range. ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.STRING_DATA_RIGHT_TRUNCATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'String Data Right Truncation';
        message = `The text exceeds the allowed length: ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.INVALID_DATETIME_FORMAT) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Invalid Datetime Format';
        message = `The date or time format is invalid`;
      }
      if (err.coded === PostgresErrorCodes.DATETIME_FIELD_OVERFLOW) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Datetime Field Overflow';
        message = `Date or time out of range: ${err.message}`;
      }

      // Network errors
      if (
        err.coded === PostgresErrorCodes.CONNECTION_EXCEPTION ||
        PostgresErrorCodes.CONNECTION_DOES_NOT_EXIST ||
        PostgresErrorCodes.CONNECTION_FAILURE
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        error = 'Database Connection Error';
        message = `Connection error in the database: ${err.message}`;
      }

      // Transaction errors
      if (err.coded === PostgresErrorCodes.IN_FAILED_SQL_TRANSACTION) {
        status = HttpStatus.CONFLICT;
        error = 'Transaction Aborted';
        message = `The transaction was aborted due a previous error.`;
      }
      if (err.coded === PostgresErrorCodes.DEADLOCK_DETECTED) {
        status = HttpStatus.CONFLICT;
        error = 'Deadlock Detected';
        message = `Conflict accessing the data. Try again.`;
      }
      if (err.coded === PostgresErrorCodes.SERIALIZATION_FAILURE) {
        status = HttpStatus.CONFLICT;
        error = 'Serialization Failure';
        message = `Concurrence conflict. Try again.`;
      }
    }

    res.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

export const PostgresErrorCodes = {
  // Integrity violations (23xxx)
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  EXCLUSION_VIOLATION: '23P01',

  // Syntax errors (42xxx)
  SYNTAX_ERROR: '42601',
  UNDEFINED_COLUMN: '42703',
  UNDEFINED_TABLE: '42P01',
  UNDEFINED_FUNCTION: '42883',
  DUPLICATE_TABLE: '42P07',
  DUPLICATE_COLUMN: '42701',

  // Type errors (22xxx)
  INVALID_TEXT_REPRESENTATION: '22P02',
  DIVISION_BY_ZERO: '22012',
  NUMERIC_VALUE_OUT_OF_RANGE: '22003',
  STRING_DATA_RIGHT_TRUNCATION: '22001',
  INVALID_DATETIME_FORMAT: '22007',
  DATETIME_FIELD_OVERFLOW: '22008',

  // Network errors (08xxx)
  CONNECTION_EXCEPTION: '08000',
  CONNECTION_DOES_NOT_EXIST: '08003',
  CONNECTION_FAILURE: '08006',

  // Transaction errors (25xxx, 40xxx)
  IN_FAILED_SQL_TRANSACTION: '25P02',
  DEADLOCK_DETECTED: '40P01',
  SERIALIZATION_FAILURE: '40001',
} as const;


      if (err.coded === PostgresErrorCodes.CHECK_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Check violation';
        message =
          'The fields does not comply with the database validation rules.';
      }

      if (err.coded === PostgresErrorCodes.EXCLUSION_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Exclusion violation';
        message = `There is a conflict with the existing data: The record conflicts with an existing one according to the system's validation rules.`;
      }

      // Syntax errors
      if (err.coded === PostgresErrorCodes.SYNTAX_ERROR) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Syntax Error';
        message = `Error in the SQL syntax: ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.UNDEFINED_COLUMN) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Column';
        message = `Column not defined. ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.UNDEFINED_TABLE) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Table';
        message = `Table not defined: ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.UNDEFINED_FUNCTION) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Function';
        message = `Operation error in the database. ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.DUPLICATE_TABLE) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Duplicated Table';
        message = `The table is duplicated.`;
      }
      if (err.coded === PostgresErrorCodes.DUPLICATE_COLUMN) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Duplicated Column';
        message = `The column is duplicated.`;
      }

      // Type errors
      if (err.coded === PostgresErrorCodes.INVALID_TEXT_REPRESENTATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Invalid Text Representation';
        message = `The data format is invalid.`;
      }
      if (err.coded === PostgresErrorCodes.DIVISION_BY_ZERO) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Division by Zero';
        message = `You cannot divide by zero. Don't be Pavlovian.`;
      }
      if (err.coded === PostgresErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Numeric Value out of Range';
        message = `The numeric value exceed the allowed range. ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.STRING_DATA_RIGHT_TRUNCATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'String Data Right Truncation';
        message = `The text exceeds the allowed length: ${err.message}`;
      }
      if (err.coded === PostgresErrorCodes.INVALID_DATETIME_FORMAT) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Invalid Datetime Format';
        message = `The date or time format is invalid`;
      }
      if (err.coded === PostgresErrorCodes.DATETIME_FIELD_OVERFLOW) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Datetime Field Overflow';
        message = `Date or time out of range: ${err.message}`;
      }

      // Network errors
      if (
        err.coded === PostgresErrorCodes.CONNECTION_EXCEPTION ||
        err.coded === PostgresErrorCodes.CONNECTION_DOES_NOT_EXIST ||
        err.coded === PostgresErrorCodes.CONNECTION_FAILURE
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        error = 'Database Connection Error';
        message = `Connection error in the database: ${err.message}`;
      }

      // Transaction errors
      if (err.coded === PostgresErrorCodes.IN_FAILED_SQL_TRANSACTION) {
        status = HttpStatus.CONFLICT;
        error = 'Transaction Aborted';
        message = `The transaction was aborted due a previous error.`;
      }
      if (err.coded === PostgresErrorCodes.DEADLOCK_DETECTED) {
        status = HttpStatus.CONFLICT;
        error = 'Deadlock Detected';
        message = `Conflict accessing the data. Try again.`;
      }
      if (err.coded === PostgresErrorCodes.SERIALIZATION_FAILURE) {
        status = HttpStatus.CONFLICT;
        error = 'Serialization Failure';
        message = `Concurrence conflict. Try again.`;
      }
    }

    res.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}

export const PostgresErrorCodes = {
  // Integrity violations (23xxx)
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
  EXCLUSION_VIOLATION: '23P01',

  // Syntax errors (42xxx)
  SYNTAX_ERROR: '42601',
  UNDEFINED_COLUMN: '42703',
  UNDEFINED_TABLE: '42P01',
  UNDEFINED_FUNCTION: '42883',
  DUPLICATE_TABLE: '42P07',
  DUPLICATE_COLUMN: '42701',

  // Type errors (22xxx)
  INVALID_TEXT_REPRESENTATION: '22P02',
  DIVISION_BY_ZERO: '22012',
  NUMERIC_VALUE_OUT_OF_RANGE: '22003',
  STRING_DATA_RIGHT_TRUNCATION: '22001',
  INVALID_DATETIME_FORMAT: '22007',
  DATETIME_FIELD_OVERFLOW: '22008',

  // Network errors (08xxx)
  CONNECTION_EXCEPTION: '08000',
  CONNECTION_DOES_NOT_EXIST: '08003',
  CONNECTION_FAILURE: '08006',

  // Transaction errors (25xxx, 40xxx)
  IN_FAILED_SQL_TRANSACTION: '25P02',
  DEADLOCK_DETECTED: '40P01',
  SERIALIZATION_FAILURE: '40001',
} as const;
