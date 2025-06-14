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
    # EASY
    {"name": "Sports", "difficulty": Difficulty.EASY},
    {"name": "Food", "difficulty": Difficulty.EASY},
    {"name": "Animals", "difficulty": Difficulty.EASY},
    {"name": "Weather", "difficulty": Difficulty.EASY},
    {"name": "Movies", "difficulty": Difficulty.EASY},
    {"name": "Transportation", "difficulty": Difficulty.EASY},
    {"name": "Jobs", "difficulty": Difficulty.EASY},
    {"name": "Colors", "difficulty": Difficulty.EASY},
    {"name": "Clothing", "difficulty": Difficulty.EASY},
    {"name": "Plants", "difficulty": Difficulty.EASY},

    # MEDIUM
    {"name": "Music", "difficulty": Difficulty.MEDIUM},
    {"name": "Holidays", "difficulty": Difficulty.MEDIUM},
    {"name": "Art", "difficulty": Difficulty.MEDIUM},
    {"name": "Games", "difficulty": Difficulty.MEDIUM},
    {"name": "Economics", "difficulty": Difficulty.MEDIUM},
    {"name": "Programming", "difficulty": Difficulty.MEDIUM},
    {"name": "US Presidents", "difficulty": Difficulty.MEDIUM},
    {"name": "Cooking", "difficulty": Difficulty.MEDIUM},
    {"name": "Mythology", "difficulty": Difficulty.MEDIUM},
    {"name": "Architecture", "difficulty": Difficulty.MEDIUM},

    # HARD
    {"name": "Social Media", "difficulty": Difficulty.HARD},
    {"name": "Sparkling Water", "difficulty": Difficulty.HARD},
    {"name": "Manhattan", "difficulty": Difficulty.HARD},
    {"name": "Apple Products", "difficulty": Difficulty.HARD},
    {"name": "Reality TV", "difficulty": Difficulty.HARD},
    {"name": "Electric Vehicles", "difficulty": Difficulty.HARD},
    {"name": "Red Carpet Fashion", "difficulty": Difficulty.HARD},
    {"name": "Streaming Services", "difficulty": Difficulty.HARD},
    {"name": "Fast Fashion", "difficulty": Difficulty.HARD},
    {"name": "Influencers", "difficulty": Difficulty.HARD},
]
