import { NextFunction, Request, Response } from 'express';
import { JoiError } from '../schema-validator/schema.validator';

export type TypedRequestWithParams<T> = Request<T>;
export type TypedRequestWithBody<T> = Request<object, object, T>;
export type TypedRequestWithQuery<T> = Request<object, object, object, T>;
export type TypedRequestWithParamsAndBody<T, K> = Request<T, object, K>;

export type TypedResponse<T> = Response<T | JoiError>;

export type MiddlewareRouteType = (req: Request, res: Response, next: NextFunction) => void;
