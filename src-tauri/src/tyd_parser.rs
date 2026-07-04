use crate::tyd_ast::{TydRecordEntry, TydValue};
use std::fmt;

#[derive(Debug, Clone, PartialEq)]
pub enum ParseError {
    UnexpectedChar(char, usize),
    UnexpectedEOF,
    UnterminatedString(usize),
    InvalidNumber(String),
    InvalidEscape(char),
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ParseError::UnexpectedChar(c, pos) => write!(f, "Unexpected '{}' at token {}", c, pos),
            ParseError::UnexpectedEOF => write!(f, "Unexpected end of input"),
            ParseError::UnterminatedString(pos) => write!(f, "Unterminated string at token {}", pos),
            ParseError::InvalidNumber(s) => write!(f, "Invalid number: '{}'", s),
            ParseError::InvalidEscape(c) => write!(f, "Invalid escape: \\{}", c),
        }
    }
}

impl std::error::Error for ParseError {}

#[derive(Debug, Clone, PartialEq)]
pub enum Token {
    Name(String),
    Number(f64),
    Boolean(bool),
    String(String),
    VerticalString(String),
    LBrace,
    RBrace,
    LBracket,
    RBracket,
    Semicolon,
    Handle(String),
    Source(String),
    LineBreak,
    EOF,
}

struct Tokenizer<'a> {
    chars: &'a [char],
    pos: usize,
}

impl<'a> Tokenizer<'a> {
    fn new(chars: &'a [char]) -> Self {
        Self { chars, pos: 0 }
    }

    fn peek(&self) -> Option<char> {
        self.chars.get(self.pos).copied()
    }

    fn advance(&mut self) -> Option<char> {
        let ch = self.chars.get(self.pos).copied();
        if ch.is_some() { self.pos += 1; }
        ch
    }

    fn skip_whitespace_except_newlines(&mut self) {
        while let Some(c) = self.peek() {
            if c == ' ' || c == '\t' || c == '\r' {
                self.advance();
            } else {
                break;
            }
        }
    }

    fn skip_comments_and_whitespace(&mut self) -> bool {
        let mut consumed_newline = false;
        loop {
            self.skip_whitespace_except_newlines();
            if self.peek() != Some('#') {
                break;
            }
            while let Some(c) = self.peek() {
                self.advance();
                if c == '\n' {
                    consumed_newline = true;
                    break;
                }
            }
        }
        consumed_newline
    }

    fn read_quoted_string(&mut self) -> Result<String, ParseError> {
        let start = self.pos;
        self.advance();
        let mut s = String::new();
        loop {
            match self.peek() {
                None => return Err(ParseError::UnterminatedString(start)),
                Some('"') => { self.advance(); return Ok(s); }
                Some('\\') => {
                    self.advance();
                    match self.peek() {
                        None => return Err(ParseError::UnterminatedString(start)),
                        Some(c) => {
                            self.advance();
                            match c {
                                '"' => s.push('"'),
                                '\\' => s.push('\\'),
                                'n' => s.push('\n'),
                                '#' => s.push('#'),
                                ';' => s.push(';'),
                                _ => return Err(ParseError::InvalidEscape(c)),
                            }
                        }
                    }
                }
                Some(c) => { self.advance(); s.push(c); }
            }
        }
    }

    fn read_naked_string(&mut self) -> String {
        let mut s = String::new();
        while let Some(c) = self.peek() {
            if c.is_whitespace() || matches!(c, ';' | ']' | '}' | '#' | '{' | '[' | '"') {
                break;
            }
            self.advance();
            s.push(c);
        }
        s
    }

    fn tokenize(&mut self) -> Result<Vec<Token>, ParseError> {
        let mut tokens = Vec::new();
        let mut last_was_newline = false;

        loop {
            let had_newline = self.skip_comments_and_whitespace();
            if had_newline && !last_was_newline {
                tokens.push(Token::LineBreak);
                last_was_newline = true;
            }

            match self.peek() {
                None => {
                    tokens.push(Token::EOF);
                    break;
                }
                Some('\n') => {
                    self.advance();
                    if !last_was_newline {
                        tokens.push(Token::LineBreak);
                        last_was_newline = true;
                    }
                }
                Some('\r') => {
                    self.advance();
                    if self.peek() == Some('\n') { self.advance(); }
                    if !last_was_newline {
                        tokens.push(Token::LineBreak);
                        last_was_newline = true;
                    }
                }
                Some('{') => { self.advance(); tokens.push(Token::LBrace); last_was_newline = false; }
                Some('}') => { self.advance(); tokens.push(Token::RBrace); last_was_newline = false; }
                Some('[') => { self.advance(); tokens.push(Token::LBracket); last_was_newline = false; }
                Some(']') => { self.advance(); tokens.push(Token::RBracket); last_was_newline = false; }
                Some(';') => { self.advance(); tokens.push(Token::Semicolon); last_was_newline = false; }
                Some('|') => {
                    self.advance();
                    let mut line = String::new();
                    while let Some(c) = self.peek() {
                        if c == '\n' || c == '\r' { break; }
                        line.push(c);
                        self.advance();
                    }
                    tokens.push(Token::VerticalString(line.trim().to_string()));
                    last_was_newline = false;
                }
                Some('"') => {
                    let s = self.read_quoted_string()?;
                    tokens.push(Token::String(s));
                    last_was_newline = false;
                }
                Some('*') => {
                    self.advance();
                    let word = self.read_naked_string();
                    if word == "handle" {
                        self.skip_whitespace_except_newlines();
                        tokens.push(Token::Handle(self.read_quoted_string()?));
                    } else if word == "source" {
                        self.skip_whitespace_except_newlines();
                        tokens.push(Token::Source(self.read_quoted_string()?));
                    } else {
                        let mut full = String::from("*");
                        full.push_str(&word);
                        tokens.push(Token::Name(full));
                    }
                    last_was_newline = false;
                }
                Some(c) if c.is_ascii_digit() || c == '-' => {
                    let mut num_str = String::new();
                    if c == '-' {
                        num_str.push(c);
                        self.advance();
                    }
                    while let Some(c) = self.peek() {
                        if c.is_ascii_digit() || c == '.' {
                            num_str.push(c);
                            self.advance();
                        } else if (c == 'e' || c == 'E') && !num_str.contains('e') && !num_str.contains('E') {
                            num_str.push(c);
                            self.advance();
                            if matches!(self.peek(), Some('+' | '-')) {
                                num_str.push(self.peek().unwrap());
                                self.advance();
                            }
                        } else {
                            break;
                        }
                    }
                    // If followed by an alphanumeric char, it's an identifier like "2D", not a number
                    if matches!(self.peek(), Some(c) if c.is_alphanumeric()) {
                        let mut full = num_str;
                        full.push(self.peek().unwrap());
                        self.advance();
                        while let Some(c) = self.peek() {
                            if c.is_whitespace() || matches!(c, ';' | ']' | '}' | '#' | '{' | '[' | '"') {
                                break;
                            }
                            self.advance();
                            full.push(c);
                        }
                        tokens.push(Token::Name(full));
                    } else {
                        match num_str.parse::<f64>() {
                            Ok(n) => tokens.push(Token::Number(n)),
                            Err(_) => tokens.push(Token::Name(num_str)),
                        }
                    }
                    last_was_newline = false;
                }
                Some(c) if c.is_alphabetic() || c == '_' || c == '.' => {
                    let word = self.read_naked_string();
                    match word.as_str() {
                        "True" => tokens.push(Token::Boolean(true)),
                        "False" => tokens.push(Token::Boolean(false)),
                        _ => tokens.push(Token::Name(word)),
                    }
                    last_was_newline = false;
                }
                Some(_) => {
                    let word = self.read_naked_string();
                    if !word.is_empty() {
                        tokens.push(Token::Name(word));
                    } else {
                        self.advance();
                    }
                    last_was_newline = false;
                }
            }
        }

        Ok(tokens)
    }
}

struct Parser {
    tokens: Vec<Token>,
    pos: usize,
}

impl Parser {
    fn new(tokens: Vec<Token>) -> Self {
        Self { tokens, pos: 0 }
    }

    fn peek(&self) -> &Token {
        self.tokens.get(self.pos).unwrap_or(&Token::EOF)
    }

    fn advance(&mut self) -> Token {
        let t = self.tokens.get(self.pos).cloned().unwrap_or(Token::EOF);
        self.pos += 1;
        t
    }

    fn skip_seps(&mut self) {
        while matches!(self.peek(), Token::Semicolon | Token::LineBreak) {
            self.advance();
        }
    }

    fn parse_value(&mut self) -> Result<TydValue, ParseError> {
        match self.peek().clone() {
            Token::LBrace => { self.advance(); self.parse_record_entries() }
            Token::LBracket => { self.advance(); self.parse_list_items() }
            Token::String(s) => { self.advance(); Ok(TydValue::String(s)) }
            Token::VerticalString(first) => {
                self.advance();
                let mut lines = vec![first];
                loop {
                    self.skip_seps();
                    match self.peek() {
                        Token::VerticalString(_) => {
                            if let Token::VerticalString(line) = self.advance() {
                                lines.push(line);
                            }
                        }
                        _ => break,
                    }
                }
                Ok(TydValue::VerticalString(lines.join("\n")))
            }
            Token::Number(n) => { self.advance(); Ok(TydValue::Number(n)) }
            Token::Boolean(b) => { self.advance(); Ok(TydValue::Boolean(b)) }
            Token::Name(s) => {
                self.advance();
                // Collect consecutive Name tokens as a single multi-word value
                let mut words = vec![s];
                while matches!(self.peek(), Token::Name(_)) {
                    if let Token::Name(w) = self.advance() {
                        words.push(w);
                    }
                }
                Ok(TydValue::String(words.join(" ")))
            }
            Token::EOF => Err(ParseError::UnexpectedEOF),
            _ => Err(ParseError::UnexpectedChar('?', self.pos)),
        }
    }

    fn parse_record_entries(&mut self) -> Result<TydValue, ParseError> {
        let mut entries = Vec::new();
        loop {
            self.skip_seps();
            if matches!(self.peek(), Token::RBrace | Token::EOF) {
                self.advance();
                break;
            }
            entries.push(self.parse_entry()?);
        }
        Ok(TydValue::Record(entries))
    }

    fn parse_entry(&mut self) -> Result<TydRecordEntry, ParseError> {
        let mut handle = None;
        let mut source = None;
        loop {
            self.skip_seps();
            match self.peek() {
                Token::Handle(h) => { handle = Some(h.clone()); self.advance(); }
                Token::Source(s) => { source = Some(s.clone()); self.advance(); }
                _ => break,
            }
        }

        self.skip_seps();
        let name = match self.advance() {
            Token::Name(n) => n,
            _ => return Err(ParseError::UnexpectedChar('?', self.pos - 1)),
        };

        self.skip_seps();
        let value = self.parse_value()?;
        let mut entry = TydRecordEntry::new(&name, value);
        entry.handle = handle;
        entry.source = source;
        Ok(entry)
    }

    fn parse_list_items(&mut self) -> Result<TydValue, ParseError> {
        let mut items = Vec::new();
        loop {
            self.skip_seps();
            match self.peek() {
                Token::RBracket => { self.advance(); break; }
                Token::EOF => break,
                _ => { items.push(self.parse_value()?); }
            }
        }
        Ok(TydValue::List(items))
    }

    fn parse_top_level(&mut self) -> Result<TydValue, ParseError> {
        // Skip leading line breaks
        while matches!(self.peek(), Token::LineBreak) { self.advance(); }

        match self.peek().clone() {
            Token::LBracket => { self.advance(); self.parse_list_items() }
            Token::LBrace => { self.advance(); self.parse_record_entries() }
            Token::EOF => Ok(TydValue::Record(vec![])),
            _ => {
                let mut entries = Vec::new();
                loop {
                    self.skip_seps();
                    if matches!(self.peek(), Token::EOF) { break; }
                    entries.push(self.parse_entry()?);
                }
                Ok(TydValue::Record(entries))
            }
        }
    }
}

pub fn parse(input: &str) -> Result<TydValue, ParseError> {
    let cleaned = input.replace('\r', "");
    let chars: Vec<char> = cleaned.chars().collect();
    let mut tokenizer = Tokenizer::new(&chars);
    let tokens = tokenizer.tokenize()?;
    let mut parser = Parser::new(tokens);
    parser.parse_top_level()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_simple_record() {
        let r = parse("Name \"Test\"").unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e.len(), 1);
        assert_eq!(e[0].name, "Name");
        assert_eq!(e[0].value.as_string(), Some("Test"));
    }

    #[test]
    fn test_multiple_entries() {
        let r = parse("Name \"Test\"\nValue 42\nFlag True").unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e.len(), 3);
        assert_eq!(e[0].value.as_string(), Some("Test"));
        assert_eq!(e[1].value.as_number(), Some(42.0));
        assert_eq!(e[2].value.as_bool(), Some(true));
    }

    #[test]
    fn test_nested_record() {
        let r = parse("Parent {\n    Child \"value\"\n}").unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].name, "Parent");
        let inner = e[0].value.as_record().unwrap();
        assert_eq!(inner[0].name, "Child");
        assert_eq!(inner[0].value.as_string(), Some("value"));
    }

    #[test]
    fn test_empty_record() {
        let r = parse("Empty { }").unwrap();
        let e = r.as_record().unwrap();
        let inner = e[0].value.as_record().unwrap();
        assert_eq!(inner.len(), 0);
    }

    #[test]
    fn test_list() {
        let r = parse("[ \"A\"; \"B\"; \"C\" ]").unwrap();
        let items = r.as_list().unwrap();
        assert_eq!(items.len(), 3);
    }

    #[test]
    fn test_empty_list() {
        let r = parse("[ ]").unwrap();
        assert_eq!(r.as_list().unwrap().len(), 0);
    }

    #[test]
    fn test_mixed_list() {
        let r = parse("[ \"Console\"; [ \"SmartPhone\"; 2000 ] ]").unwrap();
        assert_eq!(r.as_list().unwrap().len(), 2);
    }

    #[test]
    fn test_number() {
        let r = parse("Value 42").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_number(), Some(42.0));
    }

    #[test]
    fn test_float() {
        let r = parse("Value 3.14").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_number(), Some(3.14));
    }

    #[test]
    fn test_negative_number() {
        let r = parse("Value -1.5").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_number(), Some(-1.5));
    }

    #[test]
    fn test_scientific_notation() {
        let r = parse("Value 2.108179E-06").unwrap();
        let n = r.as_record().unwrap()[0].value.as_number().unwrap();
        assert!((n - 2.108179e-06).abs() < 1e-12);
    }

    #[test]
    fn test_boolean() {
        let r = parse("A True\nB False").unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].value.as_bool(), Some(true));
        assert_eq!(e[1].value.as_bool(), Some(false));
    }

    #[test]
    fn test_naked_string() {
        let r = parse("Name Computer").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_string(), Some("Computer"));
    }

    #[test]
    fn test_multi_word_naked() {
        let r = parse("Name Game design").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_string(), Some("Game design"));
    }

    #[test]
    fn test_escape_sequences() {
        let r = parse("T \"Line1\\nLine2\"").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_string(), Some("Line1\nLine2"));
    }

    #[test]
    fn test_escape_hash() {
        let r = parse("T \"\\#Bloom\"").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_string(), Some("#Bloom"));
    }

    #[test]
    fn test_escape_semicolon() {
        let r = parse("T \"\\;\"").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_string(), Some(";"));
    }

    #[test]
    fn test_escape_quote() {
        let r = parse("T \"Say \\\"hello\\\"\"").unwrap();
        assert_eq!(r.as_record().unwrap()[0].value.as_string(), Some("Say \"hello\""));
    }

    #[test]
    fn test_handle_source() {
        let input = "*handle \"base\"\nName \"Base\"\n*source \"base\"\nName \"Override\"";
        let r = parse(input).unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e.len(), 2);
        assert_eq!(e[0].handle, Some("base".to_string()));
        assert_eq!(e[1].source, Some("base".to_string()));
    }

    #[test]
    fn test_vertical_string() {
        let r = parse("Text\n    | line1\n    | line2").unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e.len(), 1);
        assert_eq!(e[0].name, "Text");
        match &e[0].value {
            TydValue::VerticalString(s) => assert_eq!(s, "line1\nline2"),
            _ => panic!("Expected vertical string"),
        }
    }

    #[test]
    fn test_software_type_snippet() {
        let input = "SoftwareType\n{\n    Name    \"Operating System\"\n    Random  0\n    OptimalDevTime  75\n    SubmarketNames  [ Simplicity; Security; Customization ]\n}";
        let r = parse(input).unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].name, "SoftwareType");
        let inner = e[0].value.as_record().unwrap();
        assert_eq!(inner[0].name, "Name");
        assert_eq!(inner[0].value.as_string(), Some("Operating System"));
        assert_eq!(inner[1].name, "Random");
        assert_eq!(inner[1].value.as_number(), Some(0.0));
    }

    #[test]
    fn test_personality_snippet() {
        let input = "PersonalityGraph\n{\n    Personalities\n        [\n            {\n            Name    Generous\n            Traits  [ Humble; Stressed ]\n            Relationships\n                {\n                Optimistic  1.75\n                Flirt       1.5\n                }\n            }\n        ]\n}";
        let r = parse(input).unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].name, "PersonalityGraph");
        let inner = e[0].value.as_record().unwrap();
        let list = inner[0].value.as_list().unwrap();
        let p = list[0].as_record().unwrap();
        assert_eq!(p[0].name, "Name");
        assert_eq!(p[0].value.as_string(), Some("Generous"));
    }

    #[test]
    fn test_comments() {
        let r = parse("Name \"Test\" # comment\nValue 42").unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e.len(), 2);
    }

    #[test]
    fn test_inline_comment_in_list() {
        let r = parse("Submarkets [ 1; 3; 1 ] # comment").unwrap();
        let e = r.as_record().unwrap();
        let list = e[0].value.as_list().unwrap();
        assert_eq!(list.len(), 3);
    }

    #[test]
    fn test_real_personalities_file() {
        let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../Example Mod/Personalities.tyd");
        let input = std::fs::read_to_string(&path).unwrap();
        let r = parse(&input).unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].name, "PersonalityGraph");
        let inner = e[0].value.as_record().unwrap();
        assert!(inner.iter().any(|e| e.name == "Personalities"));
        assert!(inner.iter().any(|e| e.name == "Incompatibilities"));
    }

    #[test]
    fn test_real_software_type_file() {
        let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../Example Mod/SoftwareTypes/06 Game.tyd");
        let input = std::fs::read_to_string(&path).unwrap();
        let r = parse(&input).unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].name, "SoftwareType");
        let inner = e[0].value.as_record().unwrap();
        assert!(inner.iter().any(|e| e.name == "Name"));
        assert!(inner.iter().any(|e| e.name == "Features"));
    }

    #[test]
    fn test_debug_game_tokens() {
        let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../Example Mod/SoftwareTypes/01 Operating System.tyd");
        let input = std::fs::read_to_string(&path).unwrap();
        let cleaned = input.replace('\r', "");
        let chars: Vec<char> = cleaned.chars().collect();
        let mut tokenizer = Tokenizer::new(&chars);
        let tokens = tokenizer.tokenize().unwrap();
        for i in 1430..1460.min(tokens.len()) {
            eprintln!("token[{}]: {:?}", i, tokens[i]);
        }
    }

    #[test]
    fn test_real_software_type_with_scripts() {
        let path = std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../../Example Mod/SoftwareTypes/01 Operating System.tyd");
        let input = std::fs::read_to_string(&path).unwrap();
        let r = parse(&input).unwrap();
        let e = r.as_record().unwrap();
        assert_eq!(e[0].name, "SoftwareType");
        let inner = e[0].value.as_record().unwrap();
        assert!(inner.iter().any(|e| e.name == "Categories"));
        assert!(inner.iter().any(|e| e.name == "Features"));
        assert!(inner.iter().any(|e| e.name == "AddOns"));
    }

    #[test]
    fn test_round_trip_simple() {
        let input = "Name \"Test\"\nValue 42\nFlag True";
        let ast = parse(input).unwrap();
        let output = crate::tyd_writer::TydWriter::new().write(&ast);
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
        let output = crate::tyd_writer::TydWriter::new().write(&ast);
        let ast2 = parse(&output).unwrap();
        let e1 = ast.as_record().unwrap();
        let e2 = ast2.as_record().unwrap();
        assert_eq!(e1[0].name, e2[0].name);
    }
}
