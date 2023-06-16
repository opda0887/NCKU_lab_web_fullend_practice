import psycopg2
from datetime import datetime

# 連接資料庫
conn = psycopg2.connect(
    host="localhost",
    database="productDb",
    user="admin",
    password="admin1234")

# 建立 cursor 物件
cur = conn.cursor()

# 定義 SQL 查詢
sql = """
INSERT INTO usertable (username, password, birthday, create_time, last_login)
VALUES (%s, %s, %s, %s, %s)
"""

# 插入資料
cur.execute(sql, ("Eddie", "72F1935F451506EA984DF8B6026F1F91136DB9D3854BCB98E289E52EE392E0CD", datetime(1970, 6, 30), datetime.now(), None))
cur.execute(sql, ("Peter", "EA72C79594296E45B8C2A296644D988581F58CFAC6601D122ED0A8BD7C02E8BF", datetime(1990, 1, 1), datetime.now(), None))
cur.execute(sql, ("May", "8C78FE5B9936488C111733D36F3DA4B246A4D206159EFE5CD64CDB229C38F069", datetime(2003, 5, 13), datetime.now(), datetime.now()))

# 提交變更
conn.commit()

# 關閉 cursor 和連線
cur.close()
conn.close()
