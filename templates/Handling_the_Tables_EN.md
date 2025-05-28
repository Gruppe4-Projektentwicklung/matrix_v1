# Using the Tables

This document explains the structure of Excel tables used for evaluating ideas in the matrix.

## 🧠 Idea Collection (`ideen_template.xlsx`)

| Row | Purpose |
|-----|---------|
| 1   | Column IDs (not bold, e.g. `#t_en#1`, `#-#1`, `#1#1`) |
| 2   | Column headers (bold + bottom line) |
| 3+  | Data rows: starts with example values, should be overwritten or extended

### ID formats:
- `#t_en#1` → Text field in English (e.g., idea name)
- `#t_de#1`, `#t_fr#1` → Corresponding texts in German and French
- `#-#1` → Attribute ID 1 (e.g., CO2 emissions)
- `#+#1` → Unit related to attribute `#-#1` (e.g., `[kg]`)
- `#1#1` → Round 1 evaluation criterion 1 (Yes/No)
- `#1#0` → Average of Round 1
- `#2#1` → Round 2 criterion 1 (1–10 scale)
- `#2#0` → Average of Round 2

---

## 🧮 Combination Table (`kombis_template.xlsx`)

| Row | Purpose |
|-----|---------|
| 1   | ID row (not bold) |
| 2   | Header row (bold + bottom border) |
| 3+  | Example data and formulas

### Columns:
- `#t_en#1`, `#t_de#1`, `#t_fr#1` → Combination title
- `#t_en#2`, `#t_de#2`, `#t_fr#2` → Description
- `#t_en#3`, `#t_de#3`, `#t_fr#3` → Formula explanation
- `Formel_ID` → Mathematical formula using attribute IDs (e.g., `#-#2 + (#-#1 * #-#3)`)
- `Richtung` → Evaluation direction:
  - `high` = higher value is better
  - `low` = lower value is better
- `Kombi_ID` → Internal ID, not shown in frontend
