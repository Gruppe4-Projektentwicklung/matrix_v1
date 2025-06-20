import pandas as pd
from openpyxl import Workbook
from pathlib import Path
import sys


def generate(idea_file: Path, output_file: Path) -> None:
    df = pd.read_excel(idea_file, header=None, dtype=str, keep_default_na=False)
    if df.shape[0] < 2:
        raise ValueError("idea list is missing required rows")

    attr_ids = [str(val).strip() for val in df.iloc[0] if str(val).startswith("#-#")]
    attr_names_de = [str(val).strip() for val in df.iloc[1] if str(val).startswith("#-#")]
    if len(attr_ids) != len(attr_names_de):
        raise ValueError("attribute id/name row mismatch")

    wb = Workbook()
    ws = wb.active

    # first row with attribute IDs (kept for reference)
    ws.append(["#ID#"] + attr_ids)
    # description rows
    ws.append(["Beschreibung DE"] + ["Beschreibung des Attributs." for _ in attr_ids])
    ws.append(["Description EN"] + ["Description of the attribute." for _ in attr_ids])
    ws.append(["Description FR"] + ["Description de l'attribut." for _ in attr_ids])
    # attribute names
    ws.append(["Name DE"] + attr_names_de)
    ws.append(["Name EN"] + [f"{name} (EN)" for name in attr_names_de])
    ws.append(["Name FR"] + [f"{name} (FR)" for name in attr_names_de])

    wb.save(output_file)


def main(argv: list[str]) -> None:
    if len(argv) != 3:
        print("Usage: python generate_attribute_descriptions.py <idea_file> <output_file>")
        return
    idea_file = Path(argv[1])
    output_file = Path(argv[2])
    generate(idea_file, output_file)


if __name__ == "__main__":
    main(sys.argv)
