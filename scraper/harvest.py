import csv, os
from scrapegraphai.graphs import SmartScraperGraph

# Run from anywhere (cron included): all files live next to this script.
os.chdir(os.path.dirname(os.path.abspath(__file__)))

CONFIG = {
    "llm": {
        "model": "anthropic/claude-haiku-5-5",
        "api_key": os.environ["ANTHROPIC_API_KEY"],
        "model_tokens": 200000,
    },
    # Free local option instead:
    # "llm": {"model": "ollama/llama3.2", "model_tokens": 8192, "format": "json"},
    "headless": True,
    "verbose": False,
}

PROMPT = (
    "From this company website extract: company_name, what_they_sell "
    "(max 10 words), public_contact_email, contact_page_url, "
    "instagram_url, country. Only use information visible on the site. "
    "Use null for anything missing. Return JSON."
)

FIELDS = ["website", "company_name", "what_they_sell",
          "public_contact_email", "contact_page_url", "instagram_url", "country"]
OUT = "leads.csv"
MAX_PER_RUN = 50

def seen_sites():
    if not os.path.exists(OUT):
        return set()
    with open(OUT, newline="") as f:
        return {row["website"] for row in csv.DictReader(f)}

def main():
    seen = seen_sites()
    with open("sites.txt") as f:
        sites = [l.strip() for l in f if l.strip() and not l.startswith("#")]
    sites = [s for s in sites if s not in seen][:MAX_PER_RUN]
    new_file = not os.path.exists(OUT)
    with open(OUT, "a", newline="") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        if new_file:
            w.writeheader()
        for url in sites:
            try:
                r = SmartScraperGraph(prompt=PROMPT, source=url, config=CONFIG).run()
                if isinstance(r, dict) and isinstance(r.get("content"), dict):
                    r = r["content"]
                row = {k: (r.get(k) if isinstance(r, dict) else None) for k in FIELDS[1:]}
                row["website"] = url
                w.writerow(row)
                f.flush()
                print("ok  ", url)
            except Exception as e:
                print("skip", url, e)

if __name__ == "__main__":
    main()
