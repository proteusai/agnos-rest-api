import { SortOrder } from "mongoose";

export interface ServiceOptions {
  limit: number;
  populate: PopulateOptions[];
  sort: { [key: string]: SortOrder };
  skip: number;
}

export interface PopulateOptions {
  /** space delimited path(s) to populate */
  path: string;
  /** fields to select */
  select?: string;
}
