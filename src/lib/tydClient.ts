import { invoke } from "@tauri-apps/api/core";

export interface ModTreeNode {
  name: string;
  path: string;
  is_dir: boolean;
  children: ModTreeNode[];
  file_type: string | null;
}

export interface TydFileResult {
  content: string;
  ast: TydValue;
}

export interface WriteResult {
  success: boolean;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TydValue = any;

export async function openModFolder(): Promise<string> {
  return invoke<string>("open_mod_folder");
}

export async function newModFolder(parentPath: string, name: string): Promise<string> {
  return invoke<string>("new_mod_folder", { parentPath, name });
}

export async function listModTree(path: string): Promise<ModTreeNode[]> {
  return invoke<ModTreeNode[]>("list_mod_tree", { path });
}

export async function readTydFile(path: string): Promise<TydFileResult> {
  return invoke<TydFileResult>("read_tyd_file", { path });
}

export async function readTydContent(path: string): Promise<string> {
  return invoke<string>("read_tyd_content", { path });
}

export async function writeTydFile(path: string, content: string): Promise<WriteResult> {
  return invoke<WriteResult>("write_tyd_file", { path, content });
}

export async function writeTydAst(path: string, ast: TydValue): Promise<WriteResult> {
  return invoke<WriteResult>("write_tyd_ast", { path, ast });
}

export async function previewTyd(content: string): Promise<string> {
  return invoke<string>("preview_tyd", { content });
}

export async function deleteFile(path: string): Promise<WriteResult> {
  return invoke<WriteResult>("delete_file", { path });
}

export async function renameFile(oldPath: string, newPath: string): Promise<WriteResult> {
  return invoke<WriteResult>("rename_file", { oldPath, newPath });
}

export async function exportModFolder(modPath: string, outputPath: string): Promise<WriteResult> {
  return invoke<WriteResult>("export_mod_folder", { modPath, outputPath });
}
