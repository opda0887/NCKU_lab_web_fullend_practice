from fastapi import FastAPI, Depends, Form, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
import hashlib
import psycopg2
import jwt

app = FastAPI()
security = HTTPBearer()

secrect_key = "THEKEY"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ! 允許的前端應用程式的URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 連接到PostgreSQL數據庫
try:
    conn = psycopg2.connect(
    host="localhost",
    database="productDb",
    user="admin",
    password="admin1234")
except psycopg2.Error:
    raise HTTPException(status_code=500, detail="Connect database error")

# todo: 驗證user並生成JWT token
@app.post("/login")
async def login(username: str = Form(...), password: str = Form(...)):
    # 先做密碼的 sha256 轉換
    hash_object = hashlib.sha256(password.encode())
    hex_dig = hash_object.hexdigest()
    # 查詢用戶信息
    cur = conn.cursor()
    cur.execute("SELECT * FROM usertable WHERE username=%s AND password=%s", (username, hex_dig))
    user = cur.fetchone()
    # 如果未查詢到用戶，則拒絕登錄
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    # 更新用戶的last_login欄位
    cur.execute("UPDATE usertable SET last_login = %s WHERE username = %s", (datetime.now(), username))
    conn.commit()
    # 生成JWT token
    access_token = jwt.encode({"sub": username}, secrect_key, algorithm="HS256")
    # 返回token
    return {"access_token": access_token, "token_type": "bearer"}

# 通過JWT token驗證用戶身份
async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # 驗證JWT token
        payload = jwt.decode(token.credentials, secrect_key, algorithms=["HS256"])
        # 如果解碼成功，返回用戶名
        return payload["sub"]
    except (jwt.exceptions.InvalidTokenError, KeyError):
        # 如果解碼失敗或缺少有效的用戶名，拋出HTTP錯誤
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# todo: 獲取用户信息（需要身份驗證）
@app.get("/user")
async def get_user(current_user: str = Depends(get_current_user)):
    try:
        # 查詢用户信息
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM usertable WHERE username=%s", (current_user,))
            user = cur.fetchone()

        # 如果未查詢到用户，則拒絕訪問
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 返回用户信息
        return {"data": dict(zip(('username', 'password', 'birthday', 'create_time', 'last_login'), user))}

    except psycopg2.Error:
        # 如果查詢失败，抛出HTTP錯誤
        raise HTTPException(status_code=500, detail="Internal server error")
    
# todo: 註冊新使用者
@app.post("/user")
async def register(username: str = Form(...), password: str = Form(...), birthday: Optional[datetime] = Form(None)):
    try:
        # 先做密碼的 sha256 轉換
        hash_object = hashlib.sha256(password.encode())
        hex_dig = hash_object.hexdigest()
        # 建立 cursor 物件
        cur = conn.cursor()
        # 定義 SQL 查詢
        sql = """
        INSERT INTO usertable (username, password, birthday, create_time, last_login)
        VALUES (%s, %s, %s, %s, %s)
        """
        # 插入資料
        cur.execute(sql, (username, hex_dig, birthday, datetime.now(), datetime.now()))
        # 提交變更
        conn.commit()
        # 回傳成功訊息
        return {"message": "User registered successfully."}
    except psycopg2.Error:
        # 回滾變更
        conn.rollback()
        # 拋出 HTTP 錯誤 400 Bad Request
        raise HTTPException(status_code=400, detail="This user already exist.")

# todo: 更新使用者資料
@app.patch("/user")
async def update_user(password: Optional[str] = Form(None), birthday: Optional[datetime] = Form(None), current_user: str = Depends(get_current_user)):
    # 獲取使用者資料
    cur = conn.cursor()
    cur.execute("SELECT * FROM usertable WHERE username=%s", (current_user,))
    user = cur.fetchone()
    
    # 如果未查詢到用户，則拒絕訪問
    if not user:
        raise HTTPException(status_code=404, detail="User not found or Auth expired, you need to login again")
    
    # 修改該使用者的密碼與生日，如果都是無值，則不用做更新
    if password:
        # 先做密碼的 sha256 轉換
        hash_object = hashlib.sha256(password.encode())
        hex_dig = hash_object.hexdigest()
        cur.execute("UPDATE usertable SET password=%s WHERE username=%s", (hex_dig, current_user,))
    if birthday:
        cur.execute("UPDATE usertable SET birthday=%s WHERE username=%s", (birthday, current_user,))
    conn.commit()

    return {"message": "User updated successfully."}

# todo: 刪除使用者（需要身份驗證）
@app.delete("/user")
async def delete_user(current_user: str = Depends(get_current_user)):
    try:
        # 查詢用户信息
        cur = conn.cursor()
        cur.execute("SELECT * FROM usertable WHERE username=%s", (current_user,))
        user = cur.fetchone()

        # 如果未查詢到用户，則拒絕訪問
        if not user:
            raise HTTPException(status_code=404, detail="User not found or Auth expired, you need to login again")
        
        # 找到使用者，進行刪除並儲存更改
        cur.execute("DELETE FROM usertable WHERE username=%s", (current_user,))
        conn.commit()
        
        # 回傳成功訊息
        return {"message": "User deleted successfully."}

    except psycopg2.Error:
        # 回滾變更
        conn.rollback()
        # 如果查詢失败，抛出HTTP錯誤
        raise HTTPException(status_code=500, detail="Internal server error")
