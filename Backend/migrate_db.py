"""
Database migration script to add columns to documents table
"""

import sqlite3
import os

def migrate_database():
    """Add ai_result_json, markdown_content, person_data, and vehicle_data columns to documents table if not exists"""
    
    db_path = "ade.db"
    
    if not os.path.exists(db_path):
        print("Database doesn't exist yet. Run the app first to create it.")
        return
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Check if columns exist
        cursor.execute("PRAGMA table_info(documents)")
        columns = [column[1] for column in cursor.fetchall()]
        
        migrations_done = False
        
        if 'ai_result_json' not in columns:
            print("Adding ai_result_json column to documents table...")
            cursor.execute("ALTER TABLE documents ADD COLUMN ai_result_json TEXT")
            migrations_done = True
        
        if 'markdown_content' not in columns:
            print("Adding markdown_content column to documents table...")
            cursor.execute("ALTER TABLE documents ADD COLUMN markdown_content TEXT")
            migrations_done = True
        
        if 'person_data' not in columns:
            print("Adding person_data column to documents table...")
            cursor.execute("ALTER TABLE documents ADD COLUMN person_data TEXT")
            migrations_done = True
        
        if 'vehicle_data' not in columns:
            print("Adding vehicle_data column to documents table...")
            cursor.execute("ALTER TABLE documents ADD COLUMN vehicle_data TEXT")
            migrations_done = True
        
        if migrations_done:
            conn.commit()
            print("✅ Migration completed successfully!")
        else:
            print("✅ All columns already exist. No migration needed.")
        
        # Show current schema
        cursor.execute("PRAGMA table_info(documents)")
        columns = cursor.fetchall()
        print("\nCurrent documents table schema:")
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
