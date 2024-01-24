import { Request, Response } from "express";

export type TypedRequestWithParams<T> = Request<T>;
export type TypedRequestWithBody<T> = Request<{}, {}, T>;
export type TypedRequestWithQuery<T> = Request<{}, {}, {}, T>;
export type TypedRequestWithParamsAndBody<T, K> = Request<T, {}, K>;

export type TypedResponse<T> = Response<T>;
