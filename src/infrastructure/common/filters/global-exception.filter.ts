import {
  type ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { Response, Request } from 'express';

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

type THttpExceptionResponse = {
  statusCode: number;
  message: string | string[];
  error: string;
};

@Catch(QueryFailedError, EntityNotFoundError, HttpException, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
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
    } else if (exception instanceof QueryFailedError) {
      // Integrity violations
      if (err.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
        status = HttpStatus.CONFLICT;
        error = 'Duplicated Entry';

        const detail = err.detail || '';
        const field = detail.match(/\((.+?)\)/)?.[1];

        message = field
          ? `There already exists a record with that value for the field ${field}.`
          : `The record already exists in the database.`;
      } else if (err.code === PostgresErrorCodes.FOREIGN_KEY_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Foreign Key Violation';

        const detail = err.detail || '';
        const table = detail.match(/table "(.+?)"/)?.[1];

        message = table
          ? `The reference to '${table}' does not exist or is not valid.`
          : 'Invalid reference: the resource does not exist.';
      } else if (err.code === PostgresErrorCodes.NOT_NULL_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Not Null Violation';

        const column = err.column || 'unknown';
        message = `The field ${column} is mandatory and it cannot be null.`;
      } else if (err.code === PostgresErrorCodes.CHECK_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Check violation';
        message =
          'The fields does not comply with the database validation rules.';
      } else if (err.code === PostgresErrorCodes.EXCLUSION_VIOLATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Exclusion violation';
        message = `There is a conflict with the existing data: The record conflicts with an existing one according to the system's validation rules.`;
      }

      // Syntax errors
      else if (err.code === PostgresErrorCodes.SYNTAX_ERROR) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Syntax Error';
        message = `Error in the SQL syntax: ${err.message}`;
      } else if (err.code === PostgresErrorCodes.UNDEFINED_COLUMN) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Column';
        message = `Column not defined. ${err.message}`;
      } else if (err.code === PostgresErrorCodes.UNDEFINED_TABLE) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Table';
        message = `Table not defined: ${err.message}`;
      } else if (err.code === PostgresErrorCodes.UNDEFINED_FUNCTION) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Undefined Function';
        message = `Operation error in the database. ${err.message}`;
      } else if (err.code === PostgresErrorCodes.DUPLICATE_TABLE) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Duplicated Table';
        message = `The table is duplicated.`;
      } else if (err.code === PostgresErrorCodes.DUPLICATE_COLUMN) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        error = 'Duplicated Column';
        message = `The column is duplicated.`;
      }

      // Type errors
      else if (err.code === PostgresErrorCodes.INVALID_TEXT_REPRESENTATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Invalid Text Representation';
        message = `The data format is invalid.`;
      } else if (err.code === PostgresErrorCodes.DIVISION_BY_ZERO) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Division by Zero';
        message = `You cannot divide by zero. Don't be Pavlovian.`;
      } else if (err.code === PostgresErrorCodes.NUMERIC_VALUE_OUT_OF_RANGE) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Numeric Value out of Range';
        message = `The numeric value exceed the allowed range. ${err.message}`;
      } else if (err.code === PostgresErrorCodes.STRING_DATA_RIGHT_TRUNCATION) {
        status = HttpStatus.BAD_REQUEST;
        error = 'String Data Right Truncation';
        message = `The text exceeds the allowed length: ${err.message}`;
      } else if (err.code === PostgresErrorCodes.INVALID_DATETIME_FORMAT) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Invalid Datetime Format';
        message = `The date or time format is invalid`;
      } else if (err.code === PostgresErrorCodes.DATETIME_FIELD_OVERFLOW) {
        status = HttpStatus.BAD_REQUEST;
        error = 'Datetime Field Overflow';
        message = `Date or time out of range: ${err.message}`;
      }

      // Network errors
      else if (
        err.code === PostgresErrorCodes.CONNECTION_EXCEPTION ||
        err.code === PostgresErrorCodes.CONNECTION_DOES_NOT_EXIST ||
        err.code === PostgresErrorCodes.CONNECTION_FAILURE
      ) {
        status = HttpStatus.SERVICE_UNAVAILABLE;
        error = 'Database Connection Error';
        message = `Connection error in the database: ${err.message}`;
      }

      // Transaction errors
      else if (err.code === PostgresErrorCodes.IN_FAILED_SQL_TRANSACTION) {
        status = HttpStatus.CONFLICT;
        error = 'Transaction Aborted';
        message = `The transaction was aborted due a previous error.`;
      } else if (err.code === PostgresErrorCodes.DEADLOCK_DETECTED) {
        status = HttpStatus.CONFLICT;
        error = 'Deadlock Detected';
        message = `Conflict accessing the data. Try again.`;
      } else if (err.code === PostgresErrorCodes.SERIALIZATION_FAILURE) {
        status = HttpStatus.CONFLICT;
        error = 'Serialization Failure';
        message = `Concurrence conflict. Try again.`;
      }
    } else if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else {
        const response = exceptionResponse as THttpExceptionResponse;
        status = response.statusCode || status;
        message = Array.isArray(exception.message)
          ? exception.message.join(',')
          : exception.message;
        error = response.error || error;
      }

      this.logger.error(`HttpException: ${exception.message}`, exception.stack);
    } else if (exception instanceof Error) {
      this.logger.error(
        `Uncontrolled error: ${exception.message}`,
        exception.stack,
      );
    }

    const isDevelopment = process.env.ENVIRONMENT === 'development';

    res.status(status).json({
      statusCode: status,
      error,
      message,
      timestamp: new Date().toISOString(),
      path: req.url,
      ...(isDevelopment &&
        exception instanceof Error && {
          stack: exception.stack,
          details: exception,
        }),
    });
  }
}
