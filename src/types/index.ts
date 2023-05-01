import { Response as ExpressResponse } from "express";
import { UserDocument } from "@models/user";
import { ObjectId, UpdateWriteOpResult } from "mongoose";

export type Obj = Record<string, unknown>;

export type Pagination = { size: number; page: number; next?: number; prev?: number };

export type ResponseLocals = { user?: UserDocument & { session?: ObjectId } };

export type ResponseMeta = { pagination?: Pagination; result?: UpdateWriteOpResult };

export type Response<T> = ExpressResponse<
  { data?: T | null; error?: Pick<Error, "name" | "message">; meta?: ResponseMeta },
  ResponseLocals
>;

export type Node<T = any, U extends string | undefined = string | undefined> = {
  id: string;
  position: XYPosition;
  data: T;
  type?: U;
  // style?: CSSProperties;
  className?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  hidden?: boolean;
  selected?: boolean;
  dragging?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  deletable?: boolean;
  dragHandle?: string;
  width?: number | null;
  height?: number | null;
  parentNode?: string;
  zIndex?: number;
  extent?: "parent" | CoordinateExtent;
  expandParent?: boolean;
  positionAbsolute?: XYPosition;
  ariaLabel?: string;
  focusable?: boolean;
  resizing?: boolean;
};

export interface XYPosition {
  x: number;
  y: number;
}

export declare enum Position {
  Left = "left",
  Top = "top",
  Right = "right",
  Bottom = "bottom",
}

export type CoordinateExtent = [[number, number], [number, number]];
