import goodfire
from core.config import settings
from core.utils import Logger
class GoodfireBot:
    def __init__(
                self, 
                concept    : str,
                feat_top_k : int = settings.TOP_K_FEATURES,
                threshold  : int = settings.ABORT_WHEN_THRESH,
                default_msg: str = settings.DEFAULT_MSG,
                temp       : int = settings.GOODFIRE_TEMP,
                top_p      : int = settings.GOODFIRE_TOP_P,
                max_tokens : int = settings.MAX_TOKENS
                ):
        self.concept     = concept
        self.variant     = goodfire.Variant(settings.GOODFIRE_MODEL)
        self.client      = goodfire.AsyncClient(api_key=settings.GOODFIRE_API_KEY)
        self.top_k       = feat_top_k
        self.threshold   = threshold
        self.default_msg = default_msg
        self.temp        = temp 
        self.top_p       = top_p 
        self.max_tokens  = max_tokens
        
        Logger.info(f'Using model {settings.GOODFIRE_MODEL}')

    async def _get_features(self):
        Logger.info(f"Finding features for {self.concept}")
        return await self.client.features.search(
                                                self.concept, 
                                                model = self.variant, 
                                                top_k = self.top_k
                                                )

    async def send_classified_chat(self, prompt: str):
        feats = await self._get_features()
        self.variant.abort_when(feats > self.threshold)

        try:
            ### https://platform.openai.com/docs/api-reference/responses-streaming/response/reasoning/done
            response = await self.client.chat.completions.create(
                        model                  = self.variant,
                        messages               = [{"role": "user", "content": prompt}],
                        temperature            = self.temp,
                        top_p                  = self.top_p,
                        max_completion_tokens  = self.max_tokens
                        )
            return response.choices[0].message['content']
            
        except goodfire.exceptions.InferenceAbortedException:
            return self.default_msg
        
def main():
    bot = GoodfireBot("coffee", top_k = 2, threshold=2)
    bot.send_classified_chat("What's your favorite drink?")
    bot.send_classified_chat("How's your beer")

if __name__ == "__main__":
    main()


