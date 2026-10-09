"""Regenerate src/data/problems.json from data/problem_statements.xlsx  (run: python scripts/build_data.py)"""
import json, re, sys
import pandas as pd

SRC = sys.argv[1] if len(sys.argv) > 1 else "data/problem_statements.xlsx"
CATS = [
    ("Cybersecurity & Blockchain", ["blockchain", "block chain", "cyber"]),
    ("Health & MedTech", ["medtech", "health", "biomedical", "bio-sim", "forensic bio", "life sciences", "well-being", "wellness"]),
    ("Agriculture & Food", ["agri", "food"]),
    ("Education", ["education", "edu", "skill", "learning", "stem"]),
    ("Space & Earth Observation", ["space", "earth", "astro", "planet", "weather", "remote sensing", "exoplanet"]),
    ("Disaster Management", ["disaster"]),
    ("Transport & Mobility", ["transport", "mobility", "vehicle", "automotive", "logistics"]),
    ("Clean Energy & Environment", ["clean", "green", "renewable", "energy", "sustain", "environment", "climate", "waste", "water"]),
    ("Robotics & Automation", ["robot", "drone", "automation", "manufactur", "industr", "steel", "metallurg", "weld", "mechanical", "plant"]),
    ("Governance & FinTech", ["governance", "fintech", "financ", "legal", "law"]),
    ("Heritage, Tourism & Sports", ["heritage", "tourism", "travel", "culture", "sports", "fitness"]),
    ("Social Impact & Accessibility", ["social", "accessib", "assistive", "inclusi"]),
    ("AI & Data", ["artificial", "machine learning", "ai ", "ai/", "ai &", "data", "vision"]),
]
TAGS = {
    "AI/ML": r"\b(ai|ml|artificial intelligence|machine learning|deep learning|neural)\b",
    "IoT": r"\b(iot|internet of things|sensors?)\b",
    "Computer Vision": r"computer vision|image processing|image recognition|\bocr\b|video analytics|cctv",
    "Web/Mobile App": r"mobile app|web app|\bapp\b|portal|website|web-based",
    "Data Analytics": r"analytics|data visuali|dashboard",
    "Blockchain": r"blockchain|smart contract",
    "Drones": r"drone|\buav",
    "Robotics": r"robot",
    "GIS & Satellite": r"\bgis\b|satellite|geospatial|remote sensing|geo-?tag",
    "NLP & Voice": r"\bnlp\b|natural language|chatbot|speech|voice|translat",
    "AR/VR": r"augmented|virtual reality|\bvr\b|metaverse",
    "Embedded": r"embedded|microcontroller|arduino|raspberry|fpga|esp32",
}
COMPLEXITY_TERMS = ("real-time", "satellite", "blockchain", "edge")

def fix(s):
    s = str(s)
    for _ in range(3):  # repair text that was mis-decoded (e.g. "â€™")
        if "Ã" not in s and "â€" not in s:
            break
        try: s = s.encode("cp1252").decode("utf-8")
        except Exception: break
    return re.sub(r"\s+", " ", s).strip()

def match(text):
    t = text.lower() + " "
    return next((c for c, ks in CATS if any(k in t for k in ks)), None)

def estimate_effort(kind, tags, title, desc):
    text = f"{title} {desc}".lower()
    words = re.findall(r"\b[\w'-]+\b", text)
    complexity_terms = sum(term in text for term in COMPLEXITY_TERMS)
    score = (
        (1 if kind == "Hardware" else 0)
        + min(2, len(tags) // 3)
        + (1 if len(words) > 350 else 0)
        + min(2, complexity_terms)
    )
    difficulty = "Beginner" if score <= 1 else "Intermediate" if score <= 3 else "Advanced"

    base_min, base_max = (4, 6) if kind == "Hardware" else (2, 4)
    extra_weeks = max(0, score - 1)
    return difficulty, [base_min + extra_weeks, base_max + extra_weeks]

xl = pd.ExcelFile(SRC)
out = []
for kind in ["Hardware", "Software"]:
    name = next(n for n in xl.sheet_names if n.strip() == kind)
    df = xl.parse(name)
    cols = list(df.columns)
    df["_d"] = df[cols[1]].ffill()
    for _, r in df.iterrows():
        title = fix(r[cols[3]])
        desc = r[cols[4]] if pd.notna(r[cols[4]]) else (r[cols[5]] if len(cols) > 5 and pd.notna(r[cols[5]]) else "")
        desc = fix(desc) if desc != "" else ""
        dom = fix(r["_d"])
        blob = f"{title} {desc[:1500]}"
        tags = [t for t, p in TAGS.items() if re.search(p, blob, re.I)]
        difficulty, weeks_to_build = estimate_effort(kind, tags, title, desc)
        out.append({
            "id": str(r[cols[2]]).strip(), "type": kind, "domain": dom,
            "cat": match(dom) or match(title) or "Miscellaneous",
            "title": title, "desc": desc,
            "tags": tags, "difficulty": difficulty, "weeksToBuild": weeks_to_build,
        })
with open("src/data/problems.json", "w", encoding="utf-8") as output_file:
    json.dump(out, output_file, ensure_ascii=False, separators=(",", ":"))
print(len(out), "problems written")
