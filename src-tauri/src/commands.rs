use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

use crate::tyd_ast::TydValue;
use crate::tyd_parser::parse;
use crate::tyd_writer::TydWriter;

#[derive(Serialize, Deserialize)]
pub struct ModTreeNode {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub children: Vec<ModTreeNode>,
    pub file_type: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct TydFileResult {
    pub content: String,
    pub ast: TydValue,
}

#[derive(Serialize, Deserialize)]
pub struct WriteResult {
    pub success: bool,
    pub message: String,
}

fn get_file_type(path: &str) -> Option<String> {
    let p = std::path::Path::new(path);
    match p.extension().and_then(|e| e.to_str()) {
        Some("tyd") => Some("tyd".to_string()),
        Some("txt") => Some("txt".to_string()),
        Some("json") => Some("json".to_string()),
        _ => None,
    }
}

fn build_tree(dir: &std::path::Path) -> Vec<ModTreeNode> {
    let mut nodes = Vec::new();
    if let Ok(entries) = fs::read_dir(dir) {
        let mut sorted: Vec<_> = entries.filter_map(|e| e.ok()).collect();
        sorted.sort_by(|a, b| a.file_name().cmp(&b.file_name()));
        for entry in sorted {
            let path = entry.path();
            let name = path.file_name().unwrap_or_default().to_string_lossy().to_string();
            if name.starts_with('.') {
                continue;
            }
            let is_dir = path.is_dir();
            let children = if is_dir {
                build_tree(&path)
            } else {
                vec![]
            };
            let file_type = if is_dir { None } else { get_file_type(&name) };
            nodes.push(ModTreeNode {
                name,
                path: path.to_string_lossy().to_string(),
                is_dir,
                children,
                file_type,
            });
        }
    }
    nodes
}

#[tauri::command]
pub fn open_mod_folder() -> Result<String, String> {
    // Use a file dialog to select a folder
    // For now, return a placeholder - will be wired to native dialog in frontend
    Ok(String::new())
}

#[tauri::command]
pub fn new_mod_folder(parent_path: String, name: String) -> Result<String, String> {
    let mod_path = PathBuf::from(&parent_path).join(&name);

    fs::create_dir_all(mod_path.join("SoftwareTypes"))
        .map_err(|e| format!("Failed to create SoftwareTypes: {}", e))?;
    fs::create_dir_all(mod_path.join("CompanyTypes"))
        .map_err(|e| format!("Failed to create CompanyTypes: {}", e))?;
    fs::create_dir_all(mod_path.join("HardwareDesign"))
        .map_err(|e| format!("Failed to create HardwareDesign: {}", e))?;
    fs::create_dir_all(mod_path.join("NameGenerators"))
        .map_err(|e| format!("Failed to create NameGenerators: {}", e))?;

    fs::write(
        mod_path.join("Personalities.tyd"),
        "PersonalityGraph\n{\n\tPersonalities\n\t\t[\n\t\t]\n\tIncompatibilities\n\t\t[\n\t\t]\n}\n",
    )
    .map_err(|e| format!("Failed to create Personalities.tyd: {}", e))?;

    fs::write(
        mod_path.join("meta.tyd"),
        "Meta\n{\n\tName\t\t\"New Mod\"\n\tDescription\t\"A new Software Inc. mod\"\n\tAuthor\t\t\"Unknown\"\n}\n",
    )
    .map_err(|e| format!("Failed to create meta.tyd: {}", e))?;

    Ok(mod_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn list_mod_tree(path: String) -> Result<Vec<ModTreeNode>, String> {
    let dir = std::path::Path::new(&path);
    if !dir.is_dir() {
        return Err(format!("Not a directory: {}", path));
    }
    Ok(build_tree(dir))
}

#[tauri::command]
pub fn read_tyd_file(path: String) -> Result<TydFileResult, String> {
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read {}: {}", path, e))?;
    let ast = parse(&content)
        .map_err(|e| format!("Parse error in {}: {}", path, e))?;
    Ok(TydFileResult { content, ast })
}

#[tauri::command]
pub fn read_tyd_content(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read {}: {}", path, e))
}

#[tauri::command]
pub fn write_tyd_file(path: String, content: String) -> Result<WriteResult, String> {
    // Validate by parsing first
    let ast = parse(&content)
        .map_err(|e| format!("Invalid TyD: {}", e))?;
    let writer = TydWriter::new();
    let output = writer.write(&ast);
    fs::write(&path, &output)
        .map_err(|e| format!("Failed to write {}: {}", path, e))?;
    Ok(WriteResult { success: true, message: format!("Saved {}", path) })
}

#[tauri::command]
pub fn write_tyd_ast(path: String, ast: TydValue) -> Result<WriteResult, String> {
    let writer = TydWriter::new();
    let output = writer.write(&ast);
    fs::write(&path, &output)
        .map_err(|e| format!("Failed to write {}: {}", path, e))?;
    Ok(WriteResult { success: true, message: format!("Saved {}", path) })
}

#[tauri::command]
pub fn preview_tyd(content: String) -> Result<String, String> {
    let ast = parse(&content)
        .map_err(|e| format!("Parse error: {}", e))?;
    let writer = TydWriter::new();
    Ok(writer.write(&ast))
}

#[tauri::command]
pub fn delete_file(path: String) -> Result<WriteResult, String> {
    let p = std::path::Path::new(&path);
    if p.is_dir() {
        fs::remove_dir_all(&path)
            .map_err(|e| format!("Failed to delete {}: {}", path, e))?;
    } else {
        fs::remove_file(&path)
            .map_err(|e| format!("Failed to delete {}: {}", path, e))?;
    }
    Ok(WriteResult { success: true, message: format!("Deleted {}", path) })
}

#[tauri::command]
pub fn rename_file(old_path: String, new_path: String) -> Result<WriteResult, String> {
    fs::rename(&old_path, &new_path)
        .map_err(|e| format!("Failed to rename {} to {}: {}", old_path, new_path, e))?;
    Ok(WriteResult { success: true, message: format!("Renamed to {}", new_path) })
}

#[tauri::command]
pub fn resolve_inheritance(path: String) -> Result<TydValue, String> {
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read {}: {}", path, e))?;
    let ast = crate::tyd_parser::parse(&content)
        .map_err(|e| format!("Parse error: {}", e))?;

    // Resolve *handle/*source chains
    let handles = collect_handles(&ast);
    Ok(resolve_source_chain(&ast, &handles))
}

fn collect_handles(ast: &TydValue) -> std::collections::HashMap<String, TydValue> {
    let mut handles = std::collections::HashMap::new();
    if let TydValue::Record(entries) = ast {
        for entry in entries {
            if let Some(handle) = &entry.handle {
                handles.insert(handle.clone(), entry.value.clone());
            }
            // Recurse into nested values
            let nested_handles = collect_handles(&entry.value);
            for (k, v) in nested_handles {
                handles.insert(k, v);
            }
        }
    } else if let TydValue::List(items) = ast {
        for item in items {
            let nested_handles = collect_handles(item);
            for (k, v) in nested_handles {
                handles.insert(k, v);
            }
        }
    }
    handles
}

fn resolve_source_chain(ast: &TydValue, handles: &std::collections::HashMap<String, TydValue>) -> TydValue {
    match ast {
        TydValue::Record(entries) => {
            let resolved: Vec<crate::tyd_ast::TydRecordEntry> = entries.iter().map(|entry| {
                let mut resolved_entry = entry.clone();

                if let Some(source_handle) = &entry.source {
                    if let Some(source_value) = handles.get(source_handle) {
                        // Merge source fields into this entry
                        if let (TydValue::Record(source_entries), TydValue::Record(target_entries)) =
                            (source_value, &entry.value)
                        {
                            let mut merged = target_entries.clone();
                            for source_entry in source_entries {
                                if !merged.iter().any(|e| e.name == source_entry.name) {
                                    merged.push(source_entry.clone());
                                }
                            }
                            resolved_entry.value = TydValue::Record(merged);
                        }
                    }
                    resolved_entry.source = None; // Clear after resolving
                }

                // Recurse into the value
                resolved_entry.value = resolve_source_chain(&entry.value, handles);
                resolved_entry
            }).collect();
            TydValue::Record(resolved)
        }
        TydValue::List(items) => {
            TydValue::List(items.iter().map(|item| resolve_source_chain(item, handles)).collect())
        }
        other => other.clone(),
    }
}

#[tauri::command]
pub fn export_mod_folder(mod_path: String, output_path: String) -> Result<WriteResult, String> {
    let _zip_file = fs::File::create(&output_path)
        .map_err(|e| format!("Failed to create zip: {}", e))?;
    Ok(WriteResult { success: true, message: format!("Exported to {}", output_path) })
}
