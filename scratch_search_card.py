with open('sustainability.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'corner-stitch' in line:
        print(f"Line {idx+1}: {line.strip()}")
        start = max(0, idx-1)
        end = min(len(lines), idx+6)
        for i in range(start, end):
            print(f"  [{i+1}] {lines[i].strip()}")
        break
