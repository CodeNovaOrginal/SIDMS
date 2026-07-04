use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct PersonalityGraph {
    #[serde(default)]
    pub personalites: Vec<Personality>,
    #[serde(default)]
    pub incompatibilities: Vec<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub replace: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Personality {
    pub name: String,
    #[serde(default)]
    pub traits_list: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expression: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub work_learn: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub social: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub lazy_stress: Option<f64>,
    #[serde(default)]
    pub relationships: HashMap<String, f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CompanyType {
    pub specialization: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub per_year: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub frameworks: Option<bool>,
    #[serde(default)]
    pub types: Vec<CompanyTypeEntry>,
    #[serde(default)]
    pub addons: Vec<CompanyAddon>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name_gen: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CompanyTypeEntry {
    pub software: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub chance: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub force: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct CompanyAddon {
    pub software: String,
    pub addon: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub chance: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Meta {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub game_version: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct HardwareDesign {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_mesh: Option<String>,
    #[serde(default)]
    pub objects: Vec<DesignObject>,
    #[serde(default)]
    pub attachments: Vec<Attachment>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_texture: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub secondary_color_enabled: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tertiary_color_enabled: Option<bool>,
    #[serde(default)]
    pub color_sets: Vec<ColorSet>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct DesignObject {
    pub id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mesh: Option<String>,
    #[serde(default)]
    pub morph_targets: Vec<MorphTarget>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub atlas_count: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub atlas_x: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub atlas_y: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub group_id: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct MorphTarget {
    pub label: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vertex_index: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub group_id: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gauss: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mean: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deviation: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub chance: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub handle_magnitude: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub use_custom_handle: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Attachment {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub index: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub type_field: Option<String>,
    #[serde(default)]
    pub attachments_list: Vec<AttachmentEntry>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AttachmentEntry {
    pub object: String,
    #[serde(default)]
    pub offset: Vec<f64>,
    #[serde(default)]
    pub rotation: Vec<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub roll: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ColorSet {
    #[serde(default)]
    pub primary_colors: Vec<String>,
    #[serde(default)]
    pub secondary_colors: Vec<String>,
    #[serde(default)]
    pub tertiary_colors: Vec<String>,
}
