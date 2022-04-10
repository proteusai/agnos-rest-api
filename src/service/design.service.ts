import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import DesignModel, {
  DesignDocument,
  DesignInput,
} from "../models/design.model";

export async function createDesign(input: DesignInput) {
  const design = await createDesignDocument(input);

  return omit(design.toJSON(), "secrets");
}
export async function createDesignDocument(input: DesignInput) {
  try {
    const design = await DesignModel.create(input);

    return design;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function findDesign(query: FilterQuery<DesignDocument>) {
  return DesignModel.findOne(query).lean();
}
