from openai import OpenAI
from pydantic import BaseModel

from core.config import settings
class _DistanceSchema(BaseModel):
    distance: float
class Distance:
    """LLM-based semantic distance with lazy OpenAI client init."""
    
    _client: OpenAI | None = None
    _model: str = settings.OPENAI_MODEL
    _system_prompt: str = """
        # Instructions
        You are given two short phrases. Output strictly a JSON object with:
          - "distance": a float ≥0.0 and ≤1.0
            • values < .2 = similar enough you wouldn't discount someone from saying one vs. other in a quiz
            • .2 < values < .4 = pretty close but not really the same, for example if one is a subgroup of the other
            • values > .7 = not really close at all 
        Return it **as JSON and nothing else**

        # Examples:
        <distance_inputs id="example-1">
            Phrase 1: Sports, Phrase 2: Athletics 
        </distance_inputs>

        <assistant_response id="example-1">
            {distance : 0.1}
        </assistant_response>

        <assistance_explanation id="example-1">
            Sports and Athletics are basically identical answers (so < .2) but not the exact same (so > 0)
        </assistant_explanation>

        <distance_inputs id="example-2">
            Phrase 1: Sports, Phrase 2: Baseball 
        </distance_inputs>

        <assistant_response id="example-2">
            {distance : 0.3}
        </assistant_response>

        <assistance_explanation id="example-2">
            Sports and Baseball are definitely related (so < .4) but one is a subgroup of the other (so > .2)
        </assistant_explanation>

        <distance_inputs id="example-3">
            Phrase 1: Sports, Phrase 2: Eating 
        </distance_inputs>

        <assistant_response id="example-3">
            {distance : 1}
        </assistant_response>

        <assistance_explanation id="example-3">
            Sports and Eating are completely unrelated
        </assistant_explanation>
    """
    @classmethod
    def _get_client(cls) -> OpenAI:
        if cls._client is None:
            cls._client = OpenAI(api_key=settings.OPENAI_API_KEY)
        return cls._client

    @classmethod
    def distance(cls, a: str, b: str) -> float:
        """
        Compute semantic distance ∈ [0,1] between phrases `a` and `b`
        (0 = identical, 1 = unrelated).
        """
        prompt = f"Phrase 1: {a}, Phrase 2: {b}"
        response = cls._get_client().responses.parse(
            model=cls._model,
            input=[
                {"role": "system", "content": cls._system_prompt},
                {"role": "user", "content": prompt},
            ],
            text_format=_DistanceSchema,
            temperature=0
        )
        return response.output_parsed.distance


"""OLD- too much memory

from sentence_transformers import SentenceTransformer, util

class Distance:
    _model: SentenceTransformer | None = None

    @classmethod
    def _get_model(cls) -> SentenceTransformer:
        if cls._model is None:                 
            cls._model = SentenceTransformer("all-MiniLM-L6-v2")
        return cls._model

    @classmethod
    def distance(cls, a: str, b: str) -> float:
        v1, v2 = cls._get_model().encode([a.strip().lower(), b.strip().lower()])
        sim = util.cos_sim(v1, v2).item()
        ### map from [-1,1] to [0,1]
        return 1 - ((sim + 1) / 2)
"""