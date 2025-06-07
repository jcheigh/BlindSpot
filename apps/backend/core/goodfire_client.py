import goodfire
from core.config import settings
"""
To Do: add logging (WITH COLORAMA), env variables, etc. 
"""
# env var
DEFAULT_MSG = "can't answer that"
class GoodfireBot:
    def __init__(self, concept, top_k = 5, threshold = 1, default_msg = DEFAULT_MSG):
        self.concept = concept
        self.variant = self.new_variant()
        self.top_k = top_k
        self.client = goodfire.Client(api_key=settings.GOODFIRE_API_KEY)
        self.threshold = threshold
        self.default_msg = default_msg
    
    def new_variant(self) -> goodfire.Variant:
        return goodfire.Variant(settings.GOODFIRE_MODEL)

    def get_features(self):
        """
        To add: caching mechanism for same features
        """
        features = self.client.features.search(
            self.concept,
            model=self.variant,
            top_k=self.top_k
        )
        return features
    
    def send_classified_chat(self, prompt):
        features = self.get_features()
        print(f'Features:')
        print(features)
        self.variant.abort_when(features > self.threshold)
        try:
            response = self.client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model=self.variant
            )
            print(f'Original Response: {response}')
            return response 
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