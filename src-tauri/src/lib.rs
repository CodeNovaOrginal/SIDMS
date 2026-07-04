pub mod tyd_ast;
pub mod tyd_parser;
pub mod tyd_writer;
pub mod models;
pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            commands::open_mod_folder,
            commands::new_mod_folder,
            commands::list_mod_tree,
            commands::read_tyd_file,
            commands::read_tyd_content,
            commands::write_tyd_file,
            commands::write_tyd_ast,
            commands::preview_tyd,
            commands::delete_file,
            commands::rename_file,
            commands::create_file,
            commands::export_mod_folder,
            commands::resolve_inheritance,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
