use serde::{Deserialize, Serialize};
use std::fmt;

/// Represents a value in the TyD format
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum TydValue {
    /// A string value (quoted or naked)
    String(String),
    /// A numeric value (integer or float)
    Number(f64),
    /// A boolean value (True/False)
    Boolean(bool),
    /// A record/table (key-value pairs inside { })
    Record(Vec<TydRecordEntry>),
    /// A list of values inside [ ]
    List(Vec<TydValue>),
    /// A vertical string (lines starting with |)
    VerticalString(String),
}

/// A single entry in a TyD record (name-value pair)
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct TydRecordEntry {
    pub name: String,
    pub value: TydValue,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub handle: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub comments: Vec<String>,
}

impl TydValue {
    pub fn as_string(&self) -> Option<&str> {
        match self {
            TydValue::String(s) => Some(s),
            _ => None,
        }
    }

    pub fn as_number(&self) -> Option<f64> {
        match self {
            TydValue::Number(n) => Some(*n),
            _ => None,
        }
    }

    pub fn as_bool(&self) -> Option<bool> {
        match self {
            TydValue::Boolean(b) => Some(*b),
            _ => None,
        }
    }

    pub fn as_record(&self) -> Option<&Vec<TydRecordEntry>> {
        match self {
            TydValue::Record(entries) => Some(entries),
            _ => None,
        }
    }

    pub fn as_list(&self) -> Option<&Vec<TydValue>> {
        match self {
            TydValue::List(items) => Some(items),
            _ => None,
        }
    }

    pub fn get_field(&self, name: &str) -> Option<&TydValue> {
        match self {
            TydValue::Record(entries) => {
                entries.iter().find(|e| e.name == name).map(|e| &e.value)
            }
            _ => None,
        }
    }

    pub fn get_field_string(&self, name: &str) -> Option<&str> {
        self.get_field(name).and_then(|v| v.as_string())
    }

    pub fn get_field_number(&self, name: &str) -> Option<f64> {
        self.get_field(name).and_then(|v| v.as_number())
    }

    pub fn get_field_bool(&self, name: &str) -> Option<bool> {
        self.get_field(name).and_then(|v| v.as_bool())
    }

    pub fn get_field_list(&self, name: &str) -> Option<&Vec<TydValue>> {
        self.get_field(name).and_then(|v| v.as_list())
    }

    pub fn get_field_record(&self, name: &str) -> Option<&Vec<TydRecordEntry>> {
        self.get_field(name).and_then(|v| v.as_record())
    }
}

impl TydRecordEntry {
    pub fn new(name: &str, value: TydValue) -> Self {
        Self {
            name: name.to_string(),
            value,
            handle: None,
            source: None,
            comments: Vec::new(),
        }
    }

    pub fn with_handle(mut self, handle: &str) -> Self {
        self.handle = Some(handle.to_string());
        self
    }

    pub fn with_source(mut self, source: &str) -> Self {
        self.source = Some(source.to_string());
        self
    }

    pub fn with_comment(mut self, comment: &str) -> Self {
        self.comments.push(comment.to_string());
        self
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tyd_value_string() {
        let val = TydValue::String("hello".to_string());
        assert_eq!(val.as_string(), Some("hello"));
        assert_eq!(val.as_number(), None);
    }

    #[test]
    fn test_tyd_value_number() {
        let val = TydValue::Number(42.0);
        assert_eq!(val.as_number(), Some(42.0));
        assert_eq!(val.as_string(), None);
    }

    #[test]
    fn test_tyd_value_bool() {
        let val = TydValue::Boolean(true);
        assert_eq!(val.as_bool(), Some(true));
    }

    #[test]
    fn test_tyd_record_entry() {
        let entry = TydRecordEntry::new("Name", TydValue::String("Test".to_string()))
            .with_handle("base")
            .with_comment("test comment");

        assert_eq!(entry.name, "Name");
        assert_eq!(entry.handle, Some("base".to_string()));
        assert_eq!(entry.comments, vec!["test comment".to_string()]);
    }

    #[test]
    fn test_get_field() {
        let record = TydValue::Record(vec![
            TydRecordEntry::new("Name", TydValue::String("Test".to_string())),
            TydRecordEntry::new("Value", TydValue::Number(42.0)),
        ]);

        assert_eq!(record.get_field_string("Name"), Some("Test"));
        assert_eq!(record.get_field_number("Value"), Some(42.0));
        assert_eq!(record.get_field_string("Missing"), None);
    }
}
