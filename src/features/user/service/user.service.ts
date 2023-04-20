import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "@models/user";
import { ServiceOptions } from "@services";

export async function createUser(input: UserInput) {
  const user = await createUserDocument(input);

  return omit(user.toJSON(), "password");
}
export async function createUserDocument(input: UserInput) {
  const user = await UserModel.create(input);

  return user;
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}

export async function findUserDocument(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query);
}

export async function findUsers(query: FilterQuery<UserDocument>, options: ServiceOptions) {
  return UserModel.find(query)
    .skip(options.skip)
    .limit(options.limit)
    .sort(options.sort)
    .populate(options.populate)
    .lean();
}
