import { FilterQuery } from "mongoose";
import { ServiceOptions } from ".";
import UserDesignShareModel, { UserDesignShareDocument, UserDesignShareInput } from "../models/userDesignShare.model";

const defaultPopulate = ["user", "design", "permission"];

export async function createUserDesignShare(input: UserDesignShareInput) {
  const userDesignShare = await UserDesignShareModel.create(input);

  return userDesignShare.toJSON();
}

export async function findUserDesignShares(query: FilterQuery<UserDesignShareDocument>) {
  return UserDesignShareModel.find(query).lean();
}

export async function findUserDesignSharesForUser(userId: string, options?: ServiceOptions) {
  return UserDesignShareModel.find({ user: userId })
    .populate(options?.populate || defaultPopulate)
    .lean();
}
