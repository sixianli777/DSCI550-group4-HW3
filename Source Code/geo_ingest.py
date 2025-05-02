# %%
import pandas as pd
import pysolr
import json
from tqdm import tqdm

# %%
df = pd.read_csv('../Data/haunted_places_hw2_complete.tsv', sep='\t')

# %%
json_docs = []
doc_id = 0
for index, row in df.iterrows():
    json_doc = {}
    json_doc["text"] = str(row['description']) + ' ' + str(row['location']) + ' ' + str(row['city']) + ' ' + str(row['state']) + ' ' + str(row['country'])
    json_doc["id"] = str(doc_id)
    doc_id  = doc_id +1
    json_docs.append(json_doc)

# %%
with open("../Data/geotopic.json", "w") as f:
    json.dump(json_docs, f, indent=2)

# %%
core_name = 'geotopic_index'

solr = pysolr.Solr('http://localhost:8983/solr/' + core_name, always_commit=True, timeout=10)

# %%

for doc in tqdm(json_docs):
    solr.add([
        doc
    ])

# %%



