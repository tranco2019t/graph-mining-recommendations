"""
Local Neo4j recommendation example.

Usage:
  python code/python/example_local.py
  python code/python/example_local.py --movie "Matrix, The"
"""

import argparse
from neo4j import GraphDatabase


URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "password123"
DATABASE = "neo4j"


QUERY = """
MATCH (m:Movie {title:$movie})<-[:RATED]-(u:User)-[:RATED]->(rec:Movie)
RETURN DISTINCT rec.title AS recommendation
LIMIT 20
"""


def get_recommendations(movie_title: str) -> list[str]:
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    try:
        with driver.session(database=DATABASE) as session:
            result = session.run(QUERY, movie=movie_title)
            return [record["recommendation"] for record in result]
    finally:
        driver.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--movie", default="Crimson Tide")
    args = parser.parse_args()

    recommendations = get_recommendations(args.movie)
    print(f"Recommendations for: {args.movie}")
    if not recommendations:
        print("No recommendation found. Try another title.")
        return
    for idx, title in enumerate(recommendations, start=1):
        print(f"{idx}. {title}")


if __name__ == "__main__":
    main()

