// https://github.com/request/request/issues/3143

import { FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
// import vm from "vm";
import { VM } from "vm2";
import axios from "axios";
import request from "request";
import requireFromUrl from "require-from-url";
import { ServiceOptions } from ".";
import FunctionVersionModel, {
  FunctionVersionDocument,
  FunctionVersionInput,
} from "../models/functionVersion.model";
import { findUser } from "./user.service";

const defaultPopulate = ["function", "team", "user"];

export async function createFunctionVersion(input: FunctionVersionInput) {
  const functionVersion = await createFunctionVersionDocument(input);

  return functionVersion.toJSON();
}
export async function createFunctionVersionDocument(
  input: FunctionVersionInput
) {
  const functionVersion = await FunctionVersionModel.create(input);

  return functionVersion;
}

export async function findFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>
) {
  return FunctionVersionModel.findOne(query).lean();
}

export async function findFunctionVersions(
  query: FilterQuery<FunctionVersionDocument>,
  options?: ServiceOptions
) {
  return FunctionVersionModel.find(query)
    .populate(options?.populate || defaultPopulate)
    .sort({ createdAt: -1 })
    .lean();
}

export async function findAndUpdateFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>,
  update: UpdateQuery<FunctionVersionDocument>,
  options: QueryOptions
) {
  return FunctionVersionModel.findOneAndUpdate(query, update, options);
}

export interface RunOptions {
  test?: boolean;
  args: {
    form?: object;
    user: {
      _id: string;
    };
  };
}

export async function runFunctionVersion(
  query: FilterQuery<FunctionVersionDocument>,
  options: RunOptions
) {
  const functionVersion = await FunctionVersionModel.findOne({
    ...query,
    populate: ["function", "team"],
  }).lean();

  if (!functionVersion) {
    throw new Error("Cannot find function version");
  }

  let testForm = undefined;
  const testData = functionVersion.testData;
  if (testData) {
    const testDataJson = JSON.parse(testData);
    testForm = testDataJson["form"];
  }

  const user = await findUser({ _id: options.args.user._id });

  const sandbox = {
    axios,
    request,
    requireFromUrl,
    agnos: {
      form: options.args.form || options.test ? testForm : undefined,
      function: {
        version: {
          secrets: functionVersion.secrets,
        },
      },
      ...(functionVersion.scopes &&
        functionVersion.scopes.includes("READ:USER") && {
          user: {
            email: user?.email,
            name: user?.name,
            picture: user?.picture,
          },
        }),
      // design
      // environment
    },
    console: {
      log: (data: any) => {
        console.log(">>>>>>>> custom logger:");
        console.log(data);
        // TODO: build log and invocation stats
      },
    },
  };
  console.log(">>>>>>>>>>>>>>>>>>>>>>>>function scopes");
  console.log(functionVersion.scopes);
  console.log(">>>>>>>>>>>>>>>>>>>>>>>is user passed in sandbox?");
  console.log(sandbox);
  const vm = new VM({
    sandbox,
    timeout: 10000,
  });
  const result = vm.run(functionVersion.code);

  // const script = new vm.Script(`(function(){${functionVersion.code}})()`);
  //   const script = new vm.Script(functionVersion.code);
  //   const context = vm.createContext(sandbox);
  //   const result = script.runInContext(context);

  return result;
}
