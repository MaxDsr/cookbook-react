from app import app, db
from flask_migrate import init, migrate, upgrade
from seed import seed_database

def init_database():
    with app.app_context():
        # Initialize migrations
        init()
        
        # Create initial migration
        migrate(message='Initial migration')
        
        # Apply migrations
        upgrade()
        
        # Seed the database
        seed_database()
        
        print("Database initialized and seeded successfully!")

if __name__ == '__main__':
    init_database() 