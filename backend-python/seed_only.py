from app import app, db
from seed import seed_database

def seed_only():
    with app.app_context():
        try:
            print("Starting database seeding...")
            seed_database()
            print("Database seeded successfully!")
        except Exception as e:
            print(f"Error during seeding: {str(e)}")
            raise

if __name__ == '__main__':
    seed_only() 