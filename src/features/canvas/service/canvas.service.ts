import { FilterQuery } from "mongoose";
import { ServiceOptions } from "@services";
import CanvasModel, { CanvasDocument, CanvasInput } from "@models/canvas";

export async function createCanvas(input: CanvasInput) {
  const canvas = await createCanvasDocument(input);

  return canvas.toJSON();
}
export async function createCanvasDocument(input: CanvasInput) {
  return CanvasModel.create(input);
}

export async function findCanvas(query: FilterQuery<CanvasDocument>) {
  return CanvasModel.findOne(query).lean();
}

export async function findCanvasDocument(query: FilterQuery<CanvasDocument>) {
  return CanvasModel.findOne(query);
}

export async function findCanvases(query: FilterQuery<CanvasDocument>, options: ServiceOptions) {
  return CanvasModel.find(query)
    .skip(options.skip)
    .limit(options.limit)
    .sort(options.sort)
    .populate(options.populate)
    .lean();
}
