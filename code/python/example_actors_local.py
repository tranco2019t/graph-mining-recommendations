"""
Local Neo4j actor lookup example.

Usage:
  python code/python/example_actors_local.py
  python code/python/example_actors_local.py --movie "Toy Story"
"""

import argparse
from neo4j import GraphDatabase


URI = "bolt://localhost:7687"
USER = "neo4j"
PASSWORD = "password123"
DATABASE = "neo4j"


QUERY = """
MATCH (m:Movie {title:$movie})<-[:ACTED_IN]-(a:Actor)
RETURN DISTINCT a.name AS actor
ORDER BY actor
LIMIT 30
"""


def get_actors(movie_title: str) -> list[str]:
    driver = GraphDatabase.driver(URI, auth=(USER, PASSWORD))
    try:
        with driver.session(database=DATABASE) as session:
            result = session.run(QUERY, movie=movie_title)
            return [record["actor"] for record in result]
    finally:
        driver.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--movie", default="Matrix, The")
    args = parser.parse_args()

    actors = get_actors(args.movie)
    print(f"Actors in: {args.movie}")
    if not actors:
        print("No actor found. Try another title.")
        return
    for idx, name in enumerate(actors, start=1):
        print(f"{idx}. {name}")


if __name__ == "__main__":
    main()

