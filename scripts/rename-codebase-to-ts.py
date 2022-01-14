import os
import os.path as path
import subprocess
from typing import TypedDict
import glob


class LintedFile(TypedDict):
    file: str
    lines: list[str]


def get_file_lint_map_from_eslint_output(eslint_output: str, source_dir: str) -> list[LintedFile]:
    lines = eslint_output.split("\n")
    landmark = "/source/"
    landmark_len = len(landmark)

    by_file: list[LintedFile] = []
    current_file: LintedFile = None
    for line in lines:
        if landmark in line:
            if current_file is not None:
                by_file.append(current_file)
            current_file = {"file": os.path.join(source_dir, line[line.index(
                landmark)+landmark_len:]), "lines": []}
        elif current_file is not None and len(line) > 0:
            rule = line[line.rindex(" ")+1:] if " " in line else line

            if rule not in current_file["lines"]:
                current_file["lines"].append(rule)

    return by_file


def get_new_ts_ext(js_file: str) -> str:
    return ".tsx" if ".jsx" in js_file else ".ts"


def rename_js_with_jsx_content(source_dir: str):
    print("running eslint to determine which .js files needs to be .tsx...")
    eslint_output = subprocess.run(
        ["yarn", "eslint", source_dir, "--quiet"], cwd=source_dir, stdout=subprocess.PIPE, encoding="utf-8").stdout

    print("parsing eslint output...")
    file_lint_map = get_file_lint_map_from_eslint_output(
        eslint_output, source_dir)

    to_convert_to_jsx = [
        file["file"] for file in file_lint_map if "react/jsx-filename-extension" in file["lines"]]

    renames = [(file, os.path.splitext(file)[0] + ".tsx")
               for file in to_convert_to_jsx]

    print(f"{len(to_convert_to_jsx)} files to rename from .js to .tsx")

    for rename in renames:
        print("renaming {} -> {}".format(rename[0], path.basename(rename[1])))
        os.rename(*rename)


def rename_jsjsx_to_tstsx(source_dir: str):
    print("determining .js/.jsx files to convert to .ts/.tsx...")
    from_exts = [".js", ".jsx"]
    to_convert = [(file, os.path.splitext(file)[0] + get_new_ts_ext(file)) for file in glob.glob(
        f"{source_dir}/**/*", recursive=True) if os.path.splitext(file)[1] in from_exts]

    print(f"{len(to_convert)} files to rename from .js/.jsx to .ts/.tsx")
    for convert in to_convert:
        print(
            "renaming {} -> {}".format(convert[0], path.basename(convert[1])))
        os.rename(*convert)


if __name__ == "__main__":
    source_dir = path.abspath(path.join(path.dirname(__file__), "../source"))

    rename_js_with_jsx_content(source_dir)
    rename_jsjsx_to_tstsx(source_dir)
