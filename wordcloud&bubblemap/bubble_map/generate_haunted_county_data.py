import pandas as pd
import requests
from collections import Counter
import json
import time

# 步骤 1：读取数据（确保文件名正确）
df = pd.read_csv("haunted_places_hw2_complete.tsv", sep="\t")

# 步骤 2：获取 FIPS 编码（使用 FCC API）
def get_fips(latitude, longitude):
    url = f"https://geo.fcc.gov/api/census/block/find?latitude={latitude}&longitude={longitude}&format=json"
    try:
        response = requests.get(url, timeout=5)
        result = response.json()
        fips = result["County"]["FIPS"]
        return fips[:2], fips[2:]  # 拆分为 (state_fips, county_fips)
    except:
        return None, None

# 步骤 3：提取所有经纬度对应的 county FIPS
fips_list = []
for i, row in df.iterrows():
    lat = row["latitude"]
    lon = row["longitude"]
    state_fips, county_fips = get_fips(lat, lon)
    if state_fips and county_fips:
        fips_list.append((state_fips, county_fips))
    time.sleep(0.2)  # 限速防止 API 封锁

# 步骤 4：统计每个 county 的出现次数
fips_counter = Counter(fips_list)

# 步骤 5：格式化为 bubble map 所需 JSON 格式
output = [["count", "state", "county"]]
for (state, county), count in fips_counter.items():
    output.append([str(count), state, county])

# 步骤 6：保存 JSON 文件
with open("haunted_county_bubble.json", "w") as f:
    json.dump(output, f, indent=2)

print("haunted_county_bubble.json generated")
