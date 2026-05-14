from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import psycopg2
import os
import json

load_dotenv()
app = FastAPI()

frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_conn():
    return psycopg2.connect(os.environ["POSTGRES_URL"])

def init_db():
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS trees (
            id SERIAL PRIMARY KEY,
            tree_data JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

class TreePayload(BaseModel):
    tree_data: dict


@app.get("/api/trees")
def get_trees():
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id, tree_data FROM trees ORDER BY created_at ASC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [{"id": row[0], "tree_data": row[1]} for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/trees")
def create_tree(payload: TreePayload):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO trees (tree_data) VALUES (%s) RETURNING id",
            (json.dumps(payload.tree_data),)
        )
        new_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        conn.close()
        return {"id": new_id, "tree_data": payload.tree_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/api/trees/{tree_id}")
def update_tree(tree_id: int, payload: TreePayload):
    try:
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "UPDATE trees SET tree_data = %s WHERE id = %s RETURNING id",
            (json.dumps(payload.tree_data), tree_id)
        )
        updated = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        if not updated:
            raise HTTPException(status_code=404, detail="Tree not found")
        return {"id": tree_id, "tree_data": payload.tree_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))