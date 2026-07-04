use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SoftwareType {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub category: Option<String>,
    #[serde(default)]
    pub categories: Vec<SoftwareCategory>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unlock: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub random: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ideal_price: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub optimal_dev_time: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub popularity: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retention: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub iterative: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub os_support: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub one_client: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub in_house: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name_generator: Option<String>,
    #[serde(default)]
    pub submarket_names: Vec<String>,
    #[serde(default)]
    pub features: Vec<SpecFeature>,
    #[serde(default)]
    pub add_ons: Vec<AddOn>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hardware: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub manufacturing: Option<Manufacturing>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SoftwareCategory {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unlock: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub popularity: Option<f64>,
    #[serde(default)]
    pub submarkets: Vec<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retention: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub time_scale: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ideal_price: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub iterative: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name_generator: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub hardware: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub manufacturing: Option<Manufacturing>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SpecFeature {
    pub name: String,
    pub spec: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dependencies: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unlock: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dev_time: Option<f64>,
    #[serde(default)]
    pub submarkets: Vec<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code_art: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub server: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub optional: Option<bool>,
    #[serde(default)]
    pub software_categories: Vec<String>,
    #[serde(default)]
    pub features: Vec<SubFeature>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub forced: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub run_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_end_of_day: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_after_sales: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_on_release: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_new_copies: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_work_item_change: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct SubFeature {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub level: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unlock: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dev_time: Option<f64>,
    #[serde(default)]
    pub submarkets: Vec<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code_art: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub server: Option<f64>,
    #[serde(default)]
    pub software_categories: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub run_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_end_of_day: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_after_sales: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_on_release: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_new_copies: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub script_work_item_change: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_factor: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub amount_script: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub depends_on: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AddOn {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unlock: Option<u32>,
    #[serde(default)]
    pub categories: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub optimal_dev_time: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retention: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub forced: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub per_user: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ideal_price: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name_generator: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub base_feature: Option<SpecFeature>,
    #[serde(default)]
    pub features: Vec<SubFeature>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub manufacturing: Option<Manufacturing>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Manufacturing {
    #[serde(default)]
    pub components: Vec<Component>,
    #[serde(default)]
    pub processes: Vec<Process>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub final_time: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub design: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub feature_binding: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Component {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub built_in_thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub depends_on: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dependency_factor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub price: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub time: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Process {
    #[serde(default)]
    pub inputs: Vec<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output: Option<String>,
}
