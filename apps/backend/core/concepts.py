from enum import Enum
from typing import List, TypedDict

class Difficulty(str, Enum):
    EASY   = "Easy"
    MEDIUM = "Medium"
    HARD   = "Hard"

class ConceptEntry(TypedDict):
    name: str
    difficulty: Difficulty

CONCEPTS: List[ConceptEntry] = [
    {"name": "Sports", "difficulty": Difficulty.EASY},
    {"name": "Artificial Intelligence", "difficulty": Difficulty.MEDIUM},
    {"name": "Social Media", "difficulty": Difficulty.HARD},
]
