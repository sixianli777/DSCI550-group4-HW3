import pandas as pd

# 读取 TSV 数据
df = pd.read_csv("haunted_places_hw2_complete.tsv", sep="\t")

# 提取 description 字段并拼接成纯文本
all_text = " ".join(df["description"].dropna().astype(str)).lower()

# 保存为 words.txt
with open("words.txt", "w") as f:
    f.write(all_text)

print("words.txt Generated")
