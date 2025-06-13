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
