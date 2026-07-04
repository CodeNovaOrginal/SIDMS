# Software Inc. Data Mod Studio

A visual, IDE-style editor for creating and editing **TyD data mods** for [Software Inc.](https://store.steampowered.com/app/362620/Software_Inc/). Build mods without hand-writing raw TyD syntax while still producing valid, game-loadable `.tyd` files.

## Features

### Two Modes

- **Simple Mode** — Guided, form-based wizard UI. Pick a content type, fill in forms, save. Best for beginners.
- **Advanced Mode** — Full IDE with file tree, tabbed editors, raw TyD source editing, inspector panel, and console.

### TyD Format Support

Full parser and writer for the TyD ("Tynan's Tidy Data") format:

- Records, tables, lists
- Quoted and naked strings with escape sequences (`\"`, `\\`, `\#`, `\;`, `\n`)
- Vertical strings (`|` multi-line text)
- Comments (`#`)
- Scientific notation numbers
- Inheritance via `*handle` / `*source` attributes
- Round-trip parsing: parse → edit → write → re-parse

### Content Types

| Type | Description |
|------|-------------|
| **SoftwareTypes** | Products & features with categories, submarkets, dev times, specs |
| **Features** | SpecFeatures and SubFeatures with level requirements and scripts |
| **Personalities** | Employee traits, expressions, and inter-personality relationships |
| **CompanyTypes** | AI company specializations, product types, and addon chances |
| **HardwareDesign** | 3D mesh designs with morph targets and attachments |
| **NameGenerators** | Random name generation rules (node-based text files) |
| **Mod Metadata** | Mod name, description, author |

### Validation

Live validation checks for common issues:

- Required fields (Name on all types)
- Dev time constraints (optimal vs max)
- Submarket consistency
- Feature reference validity

### Inheritance

Supports TyD's `*handle` / `*source` inheritance model:

- Lazy mode: preserves inheritance tree, shows inherited fields greyed out with override toggle
- Eager mode: flattens all inherited fields for validation and export

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | Rust + Tauri v2 |
| Frontend | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| State | Zustand |
| Code Editor | CodeMirror 6 |

## Project Structure

```
sidms/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   ├── lib.rs
│   │   ├── tyd_ast.rs         # TyD AST types
│   │   ├── tyd_parser.rs      # Tokenizer + parser (44 tests)
│   │   ├── tyd_writer.rs      # Serializer
│   │   ├── commands.rs         # Tauri command handlers
│   │   └── models/             # Domain schemas
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── ModeSelector.tsx
│   │   ├── SimpleMode/        # MCreator-style UI
│   │   └── AdvancedMode/      # IDE-style UI
│   ├── editors/               # Visual form editors
│   ├── state/modStore.ts      # Zustand state
│   └── lib/
│       ├── tydClient.ts       # Tauri invoke() wrapper
│       └── validation.ts      # Field-level validation
├── LICENSE
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) (latest stable)
- Tauri v2 system dependencies:
  - **Linux:** `libwebkit2gtk-4.1-dev libjavascriptcoregtk-4.1-dev libsoup-3.0-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`
  - **macOS:** Xcode Command Line Tools
  - **Windows:** Microsoft Visual C++ Build Tools

### Install & Run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sidms.git
cd sidms

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Build

```bash
npm run tauri build
```

The built binary will be in `src-tauri/target/release/`.

## Testing

```bash
# Rust unit tests (TyD parser/writer)
cd src-tauri && cargo test

# TypeScript type check
npx tsc --noEmit

# Full build
npm run build
```

The test suite includes 44 tests covering the TyD parser and writer, including tests against real game data files from Software Inc.

## Mod Folder Structure

A typical Software Inc. mod:

```
MyMod/
├── SoftwareTypes/
│   ├── 01 Operating System.tyd
│   └── 06 Game.tyd
├── CompanyTypes/
│   ├── ComputerOS.tyd
│   └── Games.tyd
├── HardwareDesign/
│   └── CellPhone.tyd
├── NameGenerators/
│   └── OS.txt
├── Personalities.tyd
└── meta.tyd
```

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Software Inc.](https://store.steampowered.com/app/362620/Software_Inc/) by Cornutopia Software
- [Tauri](https://tauri.app/) for the cross-platform desktop framework
- The Software Inc. modding community for documenting the TyD format
