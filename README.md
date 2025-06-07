# 🎮 BlindSpot

BlindSpot is a Wordle x LLM x Mech Interp inspired game. Users are given a seemingly normal LLM, with a specific concept (color, birds, numbers etc.) "forgetten". Players are given up to N model calls and up to K "Wordle" style guesses to guess the concept. 

## Methodology 
In the long run, we'd wish to do this purely through intervening on the model via the [Goodfire SDK](https://docs.goodfire.ai/quickstart#advanced-look-at-a-features-nearest-neighbors). For example, for each concept, we can find various sets of (feature, value) pairs in the model (e.g. Llama 3.3 8b/70b), such that if we variant.set(features, values), the resulting model seemingly forgets the concept. 

I'm very impressed by the Goodfire SDK-- I don't know that much but do have some understanding of the difficulties of (a) dealing with these large models, (b) training SAEs at scale, (c) serving these models in this fashion. However, in its current stage my initial testing wasn't able to figure out how to steer the models in a fully usable way.

It would be super cool if the model genuinely had a blind spot in its knowledge, without actually knowing it had this deficit (think asking a model about the weather post his knowledge cutoff), but a secondary solution is to treat this purely as a classification task: for each concept simply have some classification model that, if fired, returns some default msg like "I have no idea what you're talking about dude".

To do this, we have many options:
- Few shot learning 
- SFT methods (e.g. LoRA) (but too hard/too lazy...)
- Custom models (e.g. BERT) (depending on the task)
- Feature values from Goodfire (also some other info here)

So, our classifier is essentially an ensemble of all of these. Take log probs, feature values, whatever you can get, as inputs to a custom classifier that will result in the final prediction. 

# Repo Details

This is a monorepo (Turborepo) that uses a next.js frontend (Typescript/Tailwind/React/Next) and a python backend (FastAPI).

## Setup for Contributors 
1. Git Setup
- Fork the repo
- Clone your fork 
- Add this repo as the upstream 
2. pnpm Setup
```bash
corepack enable 
pnpm --version 
pnpm install
```
3. Poetry Setup
cURL poetry install
```bash
curl -sSL https://install.python-poetry.org | python3 -
```
Add to .zshrc the following 
```bash 
PATH="$HOME/.local/bin:$PATH"
```
then save
```bash 
source ~/.zshrc
```
Test with
```bash
poetry --version
```
**Quick Test**
To test, you should be able to run
```bash
pnpm run dev
```
and 
```bash
pnpm run dev:backend
```

steps

0- Set a pre-determined topic for users to try and guess
1- User chats for 1 min / number of chats, set number of characters with a goodfire with abort_when
2- At the end of the chat - user have 3 guess to try and guess the topic
3- Each guess is compared to the original topic to get it's distance (may need to set threshold)
4- They get to try another time for the same topic then they are announced losers

Later:
- replace convo with langchain-goodfire session history 
- prune session history so dict doesnt get unnecessary big 