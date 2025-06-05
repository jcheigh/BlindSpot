# 🎮 BlindSpot

BlindSpot is a Wordle x LLM x Mech Interp inspired game. Users are given a seemingly normal LLM, with a specific concept (color, birds, numbers etc.) ablated (forgotten). Players are given up to N model calls and up to 5 "Wordle" guesses to guess the concept. 

Behind the scenes, we intervene on the model via the [Goodfire SDK](https://docs.goodfire.ai/quickstart#advanced-look-at-a-features-nearest-neighbors). This is a monorepo (Turborepo) that uses a next.js frontend (Typescript/Tailwind/React/Next) and a python backend (FastAPI).

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
cURL poetry install then reload zsh config
```bash
curl -sSL https://install.python-poetry.org | python3 -
export PATH="$HOME/.local/bin:$PATH"
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