import re
import json

with open(r'c:\Users\Master\.gemini\antigravity\brain\e2d8d6cd-c288-46e0-9dd4-5e908758f732\.system_generated\steps\418\content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# find FB_PUBLIC_LOAD_DATA_
match = re.search(r'var FB_PUBLIC_LOAD_DATA_ = (\[.*?\]);\s*</script>', content, re.DOTALL)
if match:
    data = json.loads(match.group(1))
    questions = data[1][1]
    for q in questions:
        title = q[1]
        print(title)
else:
    print("Not found")
