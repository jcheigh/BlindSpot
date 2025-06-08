import goodfire
from core.config import settings

DEFAULT_MSG = "can't answer that"
class GoodfireBot:
    def __init__(self, concept: str, top_k: int = 5,
                 threshold: int = 1, default_msg: str = DEFAULT_MSG):
        self.concept    = concept
        self.variant    = goodfire.Variant(settings.GOODFIRE_MODEL)
        self.client     = goodfire.AsyncClient(api_key=settings.GOODFIRE_API_KEY)
        self.top_k      = top_k
        self.threshold  = threshold
        self.default_msg = default_msg

    async def _get_features(self):
        return await self.client.features.search(
            self.concept, model=self.variant, top_k=self.top_k)

    async def send_classified_chat(self, prompt: str):
        feats = await self._get_features()
        self.variant.abort_when(feats > self.threshold)

        try:
            resp = await self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.variant
            )
            return resp
        except goodfire.exceptions.InferenceAbortedException:
            return self.default_msg
        
def main():
    bot = GoodfireBot("", top_k = 2, threshold=2)
    response = bot.send_classified_chat("What's your favorite drink?")
    print(response)
    response = bot.send_classified_chat("How's your beer")
    print(response)

if __name__ == "__main__":
    main()


