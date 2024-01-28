import { Request, Response } from 'express';

export type TypedRequestWithParams<T> = Request<T>;
export type TypedRequestWithBody<T> = Request<object, object, T>;
export type TypedRequestWithQuery<T> = Request<object, object, object, T>;
export type TypedRequestWithParamsAndBody<T, K> = Request<T, object, K>;

export type TypedResponse<T> = Response<T | { errors: string[] }>;
