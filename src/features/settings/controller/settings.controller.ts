import { Request } from "express";
import { createSettings, findAndUpdateSettings, findSettings } from "@services/settings";
import { findUserDocument } from "@services/user";
import { Obj, Response } from "@types";
import { SettingsDocument } from "@models/settings";
import { UpdateSettingsRequest } from "@schemas/settings";
import { LeanDocument, ObjectId } from "mongoose";
import { ColorMode } from "@constants/settings";

export async function getSettingsHandler(
  req: Request,
  res: Response<LeanDocument<SettingsDocument & { _id: ObjectId }>>
) {
  const _id = res.locals.user?._id;
  const user = await findUserDocument({ _id });

  let settings = await findSettings({ user: _id });

  if (!settings) {
    settings = await createSettings({ user: _id });
    if (settings && user) {
      user.settings = settings._id;
      await user?.save();
    }
  }

  return res.send({ data: settings });
}

export async function updateSettingsHandler(
  req: Request<Obj, Obj, UpdateSettingsRequest["body"]>,
  res: Response<LeanDocument<SettingsDocument & { _id: ObjectId }>>
) {
  const _id = res.locals.user?._id;
  const user = await findUserDocument({ _id });

  let settings = await findSettings({ user: _id });

  if (!settings) {
    settings = await createSettings({
      ...req.body,
      ...(req.body.colorMode && { colorMode: ColorMode[req.body.colorMode] }),
      user: _id,
    });
    if (settings && user) {
      user.settings = settings._id;
      await user?.save();
    }
  } else {
    settings = await findAndUpdateSettings({ user: _id }, req.body, {
      new: true,
    });
  }

  return res.send({ data: settings });
}
