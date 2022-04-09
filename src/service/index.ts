export interface ServiceOptions {
  populate?: PopulateOptions | (PopulateOptions | string)[];
}

export interface PopulateOptions {
  /** space delimited path(s) to populate */
  path: string;
  /** fields to select */
  select?: any;
}
