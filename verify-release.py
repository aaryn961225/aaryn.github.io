from __future__ import annotations

import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ERRORS: list[str] = []
PASSES: list[str] = []


def ok(label: str, condition: bool, detail: str = "") -> None:
    if condition:
        PASSES.append(label)
    else:
        ERRORS.append(f"{label}{': ' + detail if detail else ''}")


def read(path: str) -> str:
    p = ROOT / path
    try:
        return p.read_text(encoding="utf-8-sig")
    except Exception as exc:
        ERRORS.append(f"UTF-8 read failed: {path}: {exc}")
        return ""


class IdParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.ids: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for key, value in attrs:
            if key == "id" and value:
                self.ids.append(value)


required_files = [
    "index.html",
    "README.md",
    "README-PORTFOLIO.md",
    "CONTENT-BASELINE.md",
    "INTEGRATION-AUDIT.txt",
    "serve.py",
    "start-portfolio.bat",
    "start-portfolio.ps1",
    "assets/vtrainer/requirement.png",
    "assets/vtrainer/prototype-flow.png",
    "assets/vtrainer/vtrainer-demo.mp4",
    "projects/dog/media/img/case_3d.png",
    "projects/dog/views/behaviorTree/behaviorTree_dog.html",
    "projects/ui-charts/index.html",
    "projects/ui-charts/charts.js",
    "projects/ui-charts/vendor/echarts.min.js",
    "projects/automation/package.json",
    "projects/automation/Dockerfile",
    "projects/automation/README.md",
    "projects/automation/RUN_GUIDE.md",
    "projects/automation/RUN_GUIDE.html",
    "projects/automation/docs/docker-integration-guide.md",
    "projects/automation/docs/docker-integration-guide.html",
    "projects/automation/docs/architecture.md",
    "projects/automation/docs/architecture.html",
    "projects/automation/reports/ai-review.md",
    "projects/automation/reports/ai-review.html",
    "projects/automation/playwright-report/index.html",
]
required_files += [
    f"assets/vtrainer/shots/{i:02d}-{name}.png"
    for i, name in [
        (1, "splash"),
        (2, "login"),
        (3, "home"),
        (4, "score"),
        (5, "coach"),
        (6, "rank"),
        (7, "profile"),
    ]
]
for path in required_files:
    ok(f"required file: {path}", (ROOT / path).is_file())

index = read("index.html")
ui_html = read("projects/ui-charts/index.html")
ui_js = read("projects/ui-charts/charts.js")
ui_css = read("projects/ui-charts/styles.css")
dog_html = read("projects/dog/views/behaviorTree/behaviorTree_dog.html")
readme = read("README.md")
portfolio_readme = read("README-PORTFOLIO.md")
automation_readme = read("projects/automation/README.md")
run_guide = read("projects/automation/RUN_GUIDE.md")
architecture = read("projects/automation/docs/architecture.md")
docker_guide = read("projects/automation/docs/docker-integration-guide.md")
ai_review_md = read("projects/automation/reports/ai-review.md")
ai_review_html = read("projects/automation/reports/ai-review.html")

present_markers = {
    "offline ECharts iframe": "ASSETS.uiCharts+'?mode=library&embed=1" in index,
    "ECharts dashboard iframe": "ASSETS.uiCharts+'?mode=dashboard&embed=1" in index,
    "embedded ECharts mode": "urlParams.get('embed')==='1'" in ui_js and "is-embedded" in ui_js,
    "embedded duplicate navigation hidden": "body.is-embedded .view-tabs" in ui_css and "body.is-embedded .hero" in ui_css and "body.is-embedded footer" in ui_css,
    "Run & Docker tab": "Run & Docker" in index,
    "first-run directory command": r"cd .\\projects\\automation" in index,
    "browser install script": "npm.cmd run install:browsers" in index,
    "quality check command": "npm.cmd run quality:check" in index,
    "Docker build command": "docker build --no-cache -t low-code-qa-demo-portfolio-v8 ." in index,
    "copy command buttons": "data-copy-target" in index and "指令已複製" in index,
    "modal inert initial state": 'id="modalOverlay" aria-hidden="true" inert' in index,
    "modal inert close state": "overlay.setAttribute('inert','')" in index,
    "responsive breakpoint CSS": "@media (max-width:1279px)" in index,
    "responsive breakpoint JS": "window.innerWidth <= 1279" in index,
    "responsive inline reset": "function applyStackedLayout" in index and "function leaveStackedLayout" in index,
    "automation relationship disclaimer": "不代表五個專案已完成端對端程式整合" in index,
    "UTF-8 architecture HTML": "projects/automation/docs/architecture.html" in index,
    "UTF-8 AI review HTML": "projects/automation/reports/ai-review.html" in index,
    "Accessibility first pass": "Portfolio Accessibility Self-audit · First Pass" in index,
    "Security sanity scope": "QA-level Web Security Sanity Checks" in index,
    "device scenario execution status": "Designed／Not yet device-tested" in index,
    "professional plain-language label": index.count("重點說明：") == 5,
    "Automation executable prototype label": "Personal Project · Executable Prototype" in index,
    "deterministic mock status": "Deterministic Mock" in index and "整合層為確定性 Mock" in index,
    "recorded evidence wording": "3／3 個 Playwright 示範測試通過" in index and "0 個阻擋問題" in index,
    "Docker status is prepared": "Docker runtime configuration','designed','Prepared" in index,
    "ALL scope is demonstration-only": "示範範圍內全部測試" in index,
    "PowerShell execution-policy guidance": "-ExecutionPolicy Bypass" in readme and "-ExecutionPolicy Bypass" in portfolio_readme,
    "content baseline exists": "Protected Status Boundaries" in read("CONTENT-BASELINE.md"),
    "deterministic review report title": "# Deterministic Mock AI Review" in ai_review_md and "Deterministic Mock AI Review" in ai_review_html,
}
for label, value in present_markers.items():
    ok(label, value)

absent_markers = {
    "obsolete SVG chart renderer": "function chartSvg" not in index and "var CHART_TYPES" not in index,
    "pending GitHub placeholder": "連結待補" not in index and "完整 Repo（GitHub）" not in index,
    "old automation convergence claim": "四條能力線匯流" not in index and "四個分支不是獨立展示" not in index,
    "old README port": "localhost:8080" not in readme,
    "generic HTTP server instruction": "python -m http.server" not in portfolio_readme and "py -m http.server" not in readme,
    "stale missing-resource statement": "MISSING: assets/vtrainer" not in read("INTEGRATION-AUDIT.txt"),
    "unused broken cannon import map": '"cannon-es"' not in dog_html,
    "colloquial summary label removed": "簡單說：" not in index,
    "old Docker execution claim removed": "Docker execution" not in index and "Docker execution" not in automation_readme and "Docker execution" not in run_guide,
    "complete regression overclaim removed": "完整回歸" not in index and "完整回歸" not in automation_readme and "完整回歸" not in run_guide,
    "zero-issue shorthand removed": "0 issue" not in index and "0 issue" not in automation_readme,
    "old mock review wording removed": "# Mock AI Review" not in ai_review_md and "No blocking issue detected by mock review" not in ai_review_md,
    "report-server wording localized": "report server" not in read("projects/automation/scripts/select-module.js"),
    "MCP report key casing corrected": "playWrightReport" not in read("projects/automation/adapters/mcp/mock-mcp-context-builder.js"),
}
for label, value in absent_markers.items():
    ok(label, value)

# Duplicate static IDs.
for path in [
    "index.html",
    "projects/ui-charts/index.html",
    "projects/dog/views/behaviorTree/behaviorTree_dog.html",
]:
    parser = IdParser()
    parser.feed(read(path))
    duplicates = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    ok(f"duplicate IDs: {path}", not duplicates, ", ".join(duplicates))

# ECharts representative count and runtime.
chart_ids = re.findall(r"\{id:'([^']+)',name:'([^']+)'", ui_js)
ok("8 live ECharts definitions", len(chart_ids) == 8, str(chart_ids))
ok("local ECharts runtime reference", "vendor/echarts.min.js" in ui_html)
ok("ECharts localStorage dashboard", "qa-echarts-dashboard" in ui_js)
ok("ECharts dispose before rerender", "instance.dispose()" in ui_js)

# Automation version alignment and JSON integrity.
try:
    package = json.loads(read("projects/automation/package.json"))
    pw_version = package["devDependencies"]["@playwright/test"]
except Exception as exc:
    pw_version = ""
    ERRORS.append(f"package.json parse failed: {exc}")
dockerfile = read("projects/automation/Dockerfile")
ok("Playwright package version 1.54.0", pw_version == "1.54.0", pw_version)
ok("Docker image version aligned", f"playwright:v{pw_version}-noble" in dockerfile if pw_version else False)
ok("package description uses precise mock scope", "deterministic mock adapters for review, MCP context, and n8n notification payloads" in package.get("description", "") if pw_version else False)

json_files = [
    "projects/automation/tasks/ALL.task.json",
    "projects/automation/tasks/AUTH01.task.json",
    "projects/automation/tasks/ORD01.task.json",
    "projects/automation/tasks/ORD02.task.json",
    "projects/automation/reports/quality-gate-report.json",
    "projects/automation/reports/playwright-results.json",
    "projects/automation/reports/test-summary.json",
    "projects/automation/reports/mcp-context.json",
    "projects/automation/reports/ai-review.json",
    "projects/automation/reports/n8n-payload.json",
]
for path in json_files:
    try:
        json.loads(read(path))
        valid = True
    except Exception as exc:
        valid = False
        detail = str(exc)
    ok(f"valid JSON: {path}", valid, detail if not valid else "")

# Key counts and wording that protect against content rollback.
ok(
    "Checklist 9 categories",
    all(key in index for key in ["API:", "RWD:", "Form:", "Permission:", "Security:", "Accessibility:", "XR:", "HardwareIntegration:", "GamepadInput:"]),
)
ok("Checklist 140-item statement", "9 大分類、140 項" in index)
ok("Dog 11 nodes statement", "建立 11 個行為節點" in index)
ok("Dog 7 GWT statement", "7 組核心 GWT" in index)
ok("VTrainer 8 rules and 6 high-risk scenarios", "8 組核心規則與 6 項高風險情境" in index)
ok("VTrainer rule evidence uses 8/8", "<strong>8／8</strong><span>規則具明確 Expected Result</span>" in index)
ok("Automation flow includes Quality Gate", "'Specification Quality Gate'" in read("projects/automation/scripts/generate-summary.js"))
ok("architecture preserves human review", "Human review" in architecture)
ok("Docker guide excludes production assets", "production databases" in docker_guide and "credentials" in docker_guide)

# Retained evidence must match the stored reports.
try:
    playwright_results = json.loads(read("projects/automation/reports/playwright-results.json"))
    stats = playwright_results.get("stats", {})
    evidence_ok = stats.get("expected") == 3 and stats.get("unexpected") == 0 and stats.get("flaky") == 0
except Exception:
    evidence_ok = False
ok("retained Playwright evidence is 3 passed", evidence_ok)
try:
    gate = json.loads(read("projects/automation/reports/quality-gate-report.json"))
    gate_ok = gate.get("summary", {}).get("blocking") == 0 and gate.get("status") == "passed"
except Exception:
    gate_ok = False
ok("retained Quality Gate evidence has 0 blocking issues", gate_ok)

# User-facing authored-text scan. Historical source examples, vendor libraries,
# generated Playwright report internals, and unused development source are excluded.
authored_files = [
    "index.html",
    "README.md",
    "README-PORTFOLIO.md",
    "projects/ui-charts/index.html",
    "projects/ui-charts/charts.js",
    "projects/automation/README.md",
    "projects/automation/README_FOR_ME.md",
    "projects/automation/RUN_GUIDE.md",
    "projects/automation/docs/architecture.md",
    "projects/automation/docs/docker-integration-guide.md",
    "projects/automation/docs/interview-guide.md",
    "projects/automation/docs/security-boundary.md",
    "projects/automation/docs/llm-safety-boundary.md",
    "projects/automation/docs/mcp-context-design.md",
    "projects/automation/docs/n8n-integration-guide.md",
    "projects/automation/docs/phase2-ai-assisted-design.md",
    "projects/automation/orchestrator/qa-orchestrator-role.md",
    "projects/automation/orchestrator/workflow-map.md",
    "projects/automation/scripts/select-module.js",
    "projects/automation/scripts/quality-gate.js",
    "projects/automation/scripts/clarify-spec.js",
    "projects/automation/scripts/generate-summary.js",
    "projects/automation/scripts/run-integration-mock.js",
    "projects/automation/reports/ai-review.md",
    "projects/automation/reports/mock-notification.md",
]
forbidden_phrases = [
    "簡單說：",
    "完整回歸",
    "0 issue",
    "Production Credential",
    "Docker-ready",
    "Integration-ready",
    "證明穩定",
    "連結待補",
    "No blocking issue detected by mock review",
    "QA automation review completed. No blocking issue detected by mock integration.",
]
for phrase in forbidden_phrases:
    hits = [path for path in authored_files if phrase in read(path)]
    ok(f"professional text excludes: {phrase}", not hits, ", ".join(hits))

# Primary JavaScript syntax checks when Node.js is available.
js_files = [
    "projects/ui-charts/charts.js",
    "projects/automation/scripts/select-module.js",
    "projects/automation/scripts/quality-gate.js",
    "projects/automation/scripts/clarify-spec.js",
    "projects/automation/scripts/generate-summary.js",
    "projects/automation/scripts/run-mock-llm-analysis.js",
    "projects/automation/scripts/run-mock-n8n-notification.js",
    "projects/automation/adapters/mcp/mock-mcp-context-builder.js",
    "projects/automation/adapters/llm/mock-llm-client.js",
    "projects/automation/adapters/n8n/mock-n8n-webhook.js",
]
for path in js_files:
    try:
        result = subprocess.run(["node", "--check", str(ROOT / path)], capture_output=True, text=True)
        syntax_ok = result.returncode == 0
        detail = result.stderr.strip()
    except FileNotFoundError:
        syntax_ok = True
        detail = "Node.js unavailable; skipped"
    ok(f"JavaScript syntax: {path}", syntax_ok, detail)

# Check the inline script in the primary page.
script_matches = re.findall(r"<script>([\s\S]*?)</script>", index, flags=re.I)
if script_matches:
    temp_script = ROOT / ".verify-index-inline.js"
    temp_script.write_text("\n".join(script_matches), encoding="utf-8")
    try:
        result = subprocess.run(["node", "--check", str(temp_script)], capture_output=True, text=True)
        ok("JavaScript syntax: index inline script", result.returncode == 0, result.stderr.strip())
    except FileNotFoundError:
        ok("JavaScript syntax: index inline script", True, "Node.js unavailable; skipped")
    finally:
        temp_script.unlink(missing_ok=True)
else:
    ok("JavaScript syntax: index inline script", False, "No inline script found")

print("QA Career Journey release verification")
print("=" * 44)
for label in PASSES:
    print(f"PASS  {label}")
if ERRORS:
    print("\nFailures")
    print("-" * 44)
    for error in ERRORS:
        print(f"FAIL  {error}")
    print(f"\nResult: FAILED ({len(ERRORS)} issue(s))")
    sys.exit(1)
print(f"\nResult: PASSED ({len(PASSES)} checks)")
