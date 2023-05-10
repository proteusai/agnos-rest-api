import { omit } from "lodash";
import { FilterQuery } from "mongoose";
import { ServiceOptions } from "@services";
import ProjectModel, { ProjectDocument, ProjectInput } from "@models/project";
import { DEFAULT_QUERY_LIMIT, DEFAULT_QUERY_SKIP } from "@constants/defaults";

export async function createProject(input: ProjectInput) {
  const project = await createProjectDocument(input);

  return omit(project.toJSON(), "secrets");
}
export async function createProjectDocument(input: ProjectInput) {
  return ProjectModel.create(input);
}

export async function findProject(query: FilterQuery<ProjectDocument>, options?: ServiceOptions) {
  return ProjectModel.findOne(query)
    .populate(options?.populate || [])
    .lean();
}

export async function findProjectDocument(query: FilterQuery<ProjectDocument>, options?: ServiceOptions) {
  return ProjectModel.findOne(query).populate(options?.populate || []);
}

export async function findProjects(query: FilterQuery<ProjectDocument>, options?: ServiceOptions) {
  return ProjectModel.find(query)
    .skip(options?.skip || DEFAULT_QUERY_SKIP)
    .limit(options?.limit || DEFAULT_QUERY_LIMIT)
    .sort(options?.sort || {})
    .populate(options?.populate || [])
    .lean();
}
