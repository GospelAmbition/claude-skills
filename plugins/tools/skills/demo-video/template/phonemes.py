# Pronunciation check for narration.json, run before tts.py. Lists every word Kokoro is likely to say
# wrong, with the phonemes it picked:
#   GUESS      not in the lexicon (names, brands, foreign places): pronunciation is a guess
#   HETERONYM  spelled the same, said two ways (record, live, lead…): check the stress/vowel fits the meaning
# Fix a word inline in narration.json with Kokoro's phoneme syntax, e.g. "[Record](/ɹəkˈɔɹd/)",
# then re-run this script; pinned words show as PINNED. Pinning keeps the displayed word in words.json.
# uv run --python 3.12 --with kokoro --with soundfile python phonemes.py [only_id ...]
import json, re, sys
from kokoro import KPipeline

HETERONYMS = {
    "record", "records", "present", "presents", "live", "lives", "lead", "leads", "read", "close", "closes",
    "use", "uses", "object", "objects", "content", "minute", "wind", "winds", "tear", "tears", "bass", "bow",
    "project", "projects", "permit", "permits", "progress", "contract", "contracts", "produce", "refuse",
    "address", "addresses", "desert", "invalid", "conduct", "conflict", "contest", "convert", "decrease",
    "increase", "export", "import", "insert", "insult", "perfect", "rebel", "recall", "reject", "subject",
    "survey", "suspect", "upset", "row", "rows", "sow", "wound", "dove", "does", "polish", "moped", "resume",
    "separate", "estimate", "graduate", "alternate", "attribute", "console", "compact", "complex", "entrance",
    "excuse", "house", "houses", "number", "putting", "sewer", "tarry", "unionized", "wind", "its", "it's",
}

pipe = KPipeline(lang_code="a")
scenes = json.load(open("narration.json"))
only = set(sys.argv[1:])
pinned_re = re.compile(r"\[([^\]]+)\]\(/[^/]+/\)")
found = 0
for s in scenes:
    if only and s["id"] not in only:
        continue
    pinned = {m.lower() for m in pinned_re.findall(s["text"])}
    for r in pipe(s["text"], voice="af_heart"):
        for t in r.tokens or []:
            word = t.text.strip()
            if not word or not word[0].isalpha():
                continue
            low = word.lower()
            if low in pinned:
                print(f"{s['id']:<18} PINNED     {word:<16} /{t.phonemes}/")
                continue
            rating = getattr(t, "rating", None)
            if rating is not None and rating < 3:
                kind = "GUESS"
            elif low in HETERONYMS:
                kind = "HETERONYM"
            else:
                continue
            found += 1
            print(f"{s['id']:<18} {kind:<10} {word:<16} /{t.phonemes}/  ({getattr(t, 'tag', '')})")
print(f"{found} word(s) to check")
