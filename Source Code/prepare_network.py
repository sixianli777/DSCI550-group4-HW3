import os
import json
import pandas as pd
<<<<<<< HEAD
from collections import defaultdict
from itertools import product

# Setup paths
base_dir = os.path.dirname(__file__)
tsv_path = os.path.join(base_dir, "..", "Data", "haunted_places_hw2_complete.tsv")
output_path = os.path.join(base_dir, "..", "Data", "network_cleaned_unweighted.json")

# Load TSV
df = pd.read_csv(tsv_path, sep="\t")

# Keep relevant columns
columns = ['apparition_type', 'event_type', 'detected_objects']
df = df[columns].dropna(how='all')

# Get top 10 detected objects
from collections import Counter
all_objects = df['detected_objects'].dropna().astype(str).apply(eval).sum()
top_10_objects = [obj for obj, _ in Counter(all_objects).most_common(10)]

# Clean + gather terms
def extract_terms(row):
    result = defaultdict(list)
    for col in ['apparition_type', 'event_type']:
        if pd.notna(row[col]):
            result[col] = [x.strip() for x in str(row[col]).split(",") if x.strip()]
    if pd.notna(row['detected_objects']):
        try:
            raw = eval(row['detected_objects'])
            result['detected_objects'] = [x for x in raw if x in top_10_objects]
        except:
            pass
    return result

edges = set()
nodes = {}
node_id = 0

# Build nodes and cross-column edges only
for _, row in df.iterrows():
    term_dict = extract_terms(row)

    # Register nodes
    for col, terms in term_dict.items():
        for t in terms:
            if t not in nodes:
                nodes[t] = {"id": node_id, "name": t, "group": col}
                node_id += 1

    # Only add edges between different columns
    keys = list(term_dict.keys())
    for i in range(len(keys)):
        for j in range(i + 1, len(keys)):
            for a, b in product(term_dict[keys[i]], term_dict[keys[j]]):
                edge = tuple(sorted((a, b)))  # unordered pair
                edges.add(edge)

# Format output
nodes_list = list(nodes.values())
links_list = [{"source": nodes[a]["id"], "target": nodes[b]["id"]} for (a, b) in edges]

network = {"nodes": nodes_list, "links": links_list}

=======
from itertools import combinations
from collections import Counter

# --- 1. File Paths ---
base_dir = os.path.dirname(__file__)
tsv_path = os.path.join(base_dir, "..", "Data", "haunted_places_hw2_complete.tsv")
output_path = os.path.join(base_dir, "..", "Data", "network_cleaned.json")

# --- 2. Load TSV ---
df = pd.read_csv(tsv_path, sep="\t")
columns_to_use = ['apparition_type', 'event_type', 'time_of_day', 'spacy_entities']
df = df[columns_to_use].copy()

# --- 3. Clean + Split Terms ---
def extract_terms(row):
    terms = []

    # Handle comma-separated fields
    for col in ['apparition_type', 'event_type', 'time_of_day']:
        if pd.notna(row[col]):
            split_terms = [x.strip().lower() for x in str(row[col]).split(",") if x.strip()]
            terms += split_terms

    # spacy_entities: list
    spacy_raw = row.get('spacy_entities', '')
    if pd.notna(spacy_raw) and isinstance(spacy_raw, str) and spacy_raw.strip().startswith("["):
        try:
            entities = eval(spacy_raw)
            if isinstance(entities, list):
                terms += [str(e).strip().lower() for e in entities if isinstance(e, str)]
        except:
            pass  # skip bad evals

    return list(set(terms))  # remove duplicates

# --- 4. Generate Co-occurrence Pairs ---
pair_counter = Counter()
term_counter = Counter()

for _, row in df.iterrows():
    terms = extract_terms(row)
    term_counter.update(terms)
    pair_counter.update(combinations(terms, 2))

# --- 5. Filter Weak Connections ---
min_pair_count = 3
filtered_pairs = {pair: count for pair, count in pair_counter.items() if count >= min_pair_count}
used_terms = set(t for pair in filtered_pairs for t in pair)

# --- 6. Create D3-Friendly JSON ---
term_to_id = {term: i for i, term in enumerate(sorted(used_terms))}
nodes = [{"id": i, "name": term} for term, i in term_to_id.items()]
links = [
    {"source": term_to_id[a], "target": term_to_id[b], "value": count}
    for (a, b), count in filtered_pairs.items()
]

network = {"nodes": nodes, "links": links}

# --- 7. Save JSON ---
>>>>>>> 9798f02 (scatter)
with open(output_path, "w") as f:
    json.dump(network, f, indent=2)
