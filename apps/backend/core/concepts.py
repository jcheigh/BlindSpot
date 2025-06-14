from enum import Enum
from typing import List, TypedDict
class Difficulty(str, Enum):
    EASY   = "Easy"
    MEDIUM = "Medium"
    HARD   = "Hard"
class Concept(TypedDict):
    name: str
    difficulty: Difficulty

CONCEPTS: List[Concept] = [
    {"name": "Sports", "difficulty": Difficulty.EASY},
    {"name": "Artificial Intelligence", "difficulty": Difficulty.MEDIUM},
    {"name": "Social Media", "difficulty": Difficulty.HARD},
]
