import type { TydValue } from "../lib/tydClient";

export interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export function validateSoftwareType(ast: TydValue): ValidationError[] {
  const errors: ValidationError[] = [];
  const entries = ast?.as_record?.() || [];

  const find = (name: string) => entries.find((e: { name: string }) => e.name === name);

  const name = find("Name");
  if (!name) errors.push({ path: "Name", message: "SoftwareType must have a Name", severity: "error" });

  const categories = find("Categories");
  if (categories) {
    const catList = categories.value?.as_list?.() || [];
    for (let i = 0; i < catList.length; i++) {
      const cat = catList[i];
      const catEntries = cat?.as_record?.() || [];
      const catName = catEntries.find((e: { name: string }) => e.name === "Name");
      if (!catName) {
        errors.push({ path: `Categories[${i}]`, message: `Category ${i + 1} missing Name`, severity: "error" });
      }
      const retention = catEntries.find((e: { name: string }) => e.name === "Retention");
      if (retention) {
        const val = retention.value?.as_number?.();
        if (val !== undefined && val <= 0) {
          errors.push({ path: `Categories[${i}].Retention`, message: `Retention should be positive`, severity: "warning" });
        }
      }
    }
  }

  const features = find("Features");
  if (features) {
    const featList = features.value?.as_list?.() || [];
    for (let i = 0; i < featList.length; i++) {
      const feat = featList[i];
      const featEntries = feat?.as_record?.() || [];
      const featName = featEntries.find((e: { name: string }) => e.name === "Name");
      if (!featName) {
        errors.push({ path: `Features[${i}]`, message: `Feature ${i + 1} missing Name`, severity: "error" });
      }
      const devTime = featEntries.find((e: { name: string }) => e.name === "DevTime");
      if (devTime) {
        const val = devTime.value?.as_number?.();
        if (val !== undefined && val < 0) {
          errors.push({ path: `Features[${i}].DevTime`, message: `DevTime should be non-negative`, severity: "warning" });
        }
      }
    }
  }

  return errors;
}

export function validatePersonality(ast: TydValue): ValidationError[] {
  const errors: ValidationError[] = [];
  const entries = ast?.as_record?.() || [];
  const root = entries[0];
  if (!root) return errors;

  const innerEntries = root.value?.as_record?.() || [];
  const personalitesList = innerEntries.find((e: { name: string }) => e.name === "Personalities");
  if (personalitesList) {
    const list = personalitesList.value?.as_list?.() || [];
    for (let i = 0; i < list.length; i++) {
      const p = list[i];
      const pEntries = p?.as_record?.() || [];
      const name = pEntries.find((e: { name: string }) => e.name === "Name");
      if (!name) {
        errors.push({ path: `Personalities[${i}]`, message: `Personality ${i + 1} missing Name`, severity: "error" });
      }
    }
  }

  return errors;
}

export function validateFile(ast: TydValue, _fileType: string): ValidationError[] {
  const entries = ast?.as_record?.() || [];
  const rootName = entries[0]?.name;

  if (rootName === "SoftwareType") {
    return validateSoftwareType(entries[0].value);
  }
  if (rootName === "PersonalityGraph") {
    return validatePersonality(ast);
  }
  return [];
}
