use crate::tyd_ast::{TydRecordEntry, TydValue};

pub struct TydWriter {
    indent: usize,
}

impl TydWriter {
    pub fn new() -> Self {
        Self { indent: 0 }
    }

    fn indent_str(&self) -> String {
        "\t".repeat(self.indent)
    }

    fn write_string_value(&self, s: &str) -> String {
        if s.is_empty() {
            return "\"\"".to_string();
        }
        let needs_quotes = s.contains(';')
            || s.contains(']')
            || s.contains('}')
            || s.contains('#')
            || s.contains('{')
            || s.contains('[')
            || s.contains('"')
            || s.contains('\\')
            || s.contains('\n')
            || s.contains('\r')
            || s.starts_with(' ')
            || s.ends_with(' ')
            || s.contains("  ")
            || s.parse::<f64>().is_ok()
            || matches!(s, "True" | "False");

        if needs_quotes {
            let escaped = s
                .replace('\\', "\\\\")
                .replace('"', "\\\"")
                .replace('\n', "\\n")
                .replace('#', "\\#")
                .replace(';', "\\;");
            format!("\"{}\"", escaped)
        } else {
            s.to_string()
        }
    }

    fn write_number(&self, n: f64) -> String {
        if n.fract() == 0.0 && n.abs() < 1e15 && n.abs() >= -1e15 {
            format!("{}", n as i64)
        } else if n.abs() < 1e-4 || n.abs() > 1e6 {
            format!("{:e}", n)
        } else {
            format!("{}", n)
        }
    }

    fn write_value(&self, value: &TydValue) -> String {
        match value {
            TydValue::String(s) => self.write_string_value(s),
            TydValue::Number(n) => self.write_number(*n),
            TydValue::Boolean(b) => {
                if *b { "True".to_string() } else { "False".to_string() }
            }
            TydValue::VerticalString(s) => format!("| {}", s),
            TydValue::Record(entries) => self.write_record_body(entries),
            TydValue::List(items) => self.write_list(items),
        }
    }

    fn write_record_body(&self, entries: &[TydRecordEntry]) -> String {
        if entries.is_empty() {
            return "{ }".to_string();
        }
        let mut result = "{\n".to_string();
        for entry in entries {
            if let Some(h) = &entry.handle {
                result.push_str(&format!("{}\t*handle \"{}\"\n", self.indent_str(), h));
            }
            if let Some(s) = &entry.source {
                result.push_str(&format!("{}\t*source \"{}\"\n", self.indent_str(), s));
            }
            let val = self.write_value(&entry.value);
            result.push_str(&format!("{}\t{}\t{}\n", self.indent_str(), entry.name, val));
        }
        result.push_str(&format!("{}}}", self.indent_str()));
        result
    }

    fn write_list(&self, items: &[TydValue]) -> String {
        if items.is_empty() {
            return "[ ]".to_string();
        }
        let all_simple = items.iter().all(|i| {
            matches!(i, TydValue::String(_) | TydValue::Number(_) | TydValue::Boolean(_))
        });
        if all_simple && items.len() <= 5 {
            let parts: Vec<String> = items.iter().map(|i| self.write_value(i)).collect();
            format!("[ {} ]", parts.join("; "))
        } else {
            let mut result = "[\n".to_string();
            for item in items {
                let val = self.write_value(item);
                match item {
                    TydValue::Record(_) => {
                        result.push_str(&format!("{}\t{}\n", self.indent_str(), val));
                    }
                    _ => {
                        result.push_str(&format!("{}{}\n", self.indent_str(), val));
                    }
                }
            }
            result.push_str(&format!("{}]", self.indent_str()));
            result
        }
    }

    pub fn write(&self, value: &TydValue) -> String {
        match value {
            TydValue::Record(entries) => {
                let mut parts = Vec::new();
                for entry in entries {
                    let val = self.write_value(&entry.value);
                    parts.push(format!("{}\t{}\n", entry.name, val));
                }
                parts.join("\n")
            }
            _ => self.write_value(value),
        }
    }
}

impl Default for TydWriter {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::tyd_ast::{TydRecordEntry, TydValue};
    use crate::tyd_parser::parse;

    #[test]
    fn test_write_string() {
        let w = TydWriter::new();
        assert_eq!(w.write_string_value("hello"), "hello");
        assert_eq!(w.write_string_value(""), "\"\"");
        assert_eq!(w.write_string_value("a;b"), "\"a\\;b\"");
        assert_eq!(w.write_string_value("a#b"), "\"a\\#b\"");
    }

    #[test]
    fn test_write_number() {
        let w = TydWriter::new();
        assert_eq!(w.write_number(42.0), "42");
        assert_eq!(w.write_number(3.14), "3.14");
    }

    #[test]
    fn test_write_boolean() {
        let w = TydWriter::new();
        assert_eq!(w.write_value(&TydValue::Boolean(true)), "True");
        assert_eq!(w.write_value(&TydValue::Boolean(false)), "False");
    }

    #[test]
    fn test_write_record() {
        let w = TydWriter::new();
        let val = TydValue::Record(vec![
            TydRecordEntry::new("Name", TydValue::String("Test".to_string())),
            TydRecordEntry::new("Value", TydValue::Number(42.0)),
        ]);
        let result = w.write(&val);
        assert!(result.contains("Name"));
        assert!(result.contains("Test"));
        assert!(result.contains("Value"));
        assert!(result.contains("42"));
    }

    #[test]
    fn test_write_list() {
        let w = TydWriter::new();
        let list = TydValue::List(vec![
            TydValue::String("A".to_string()),
            TydValue::String("B".to_string()),
            TydValue::String("C".to_string()),
        ]);
        assert_eq!(w.write_value(&list), "[ A; B; C ]");
    }

    #[test]
    fn test_write_empty_record() {
        let w = TydWriter::new();
        let val = TydValue::Record(vec![]);
        assert_eq!(w.write_value(&val), "{ }");
    }

    #[test]
    fn test_write_empty_list() {
        let w = TydWriter::new();
        assert_eq!(w.write_value(&TydValue::List(vec![])), "[ ]");
    }

    #[test]
    fn test_round_trip_simple() {
        let input = "Name \"Test\"\nValue 42\nFlag True";
        let ast = parse(input).unwrap();
        let output = TydWriter::new().write(&ast);
        let ast2 = parse(&output).unwrap();
        let e1 = ast.as_record().unwrap();
        let e2 = ast2.as_record().unwrap();
        assert_eq!(e1.len(), e2.len());
        assert_eq!(e1[0].value.as_string(), e2[0].value.as_string());
        assert_eq!(e1[1].value.as_number(), e2[1].value.as_number());
        assert_eq!(e1[2].value.as_bool(), e2[2].value.as_bool());
    }

    #[test]
    fn test_round_trip_nested() {
        let input = "Parent {\n    Child \"value\"\n    Num 3.14\n}";
        let ast = parse(input).unwrap();
        let output = TydWriter::new().write(&ast);
        let ast2 = parse(&output).unwrap();
        let e1 = ast.as_record().unwrap();
        let e2 = ast2.as_record().unwrap();
        assert_eq!(e1[0].name, e2[0].name);
    }
}
