# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenAI Tools Playground - a TypeScript/Node.js chatbot that demonstrates OpenAI's function calling capabilities. The AI assistant can interact with external services (Tesla, Home Assistant, Google Search) and execute code dynamically.

## Commands

```bash
npm run start        # Run the application with ts-node
npm run lint         # Run Biome linter checks
npm run lint:fix     # Auto-fix linting issues
npm run format       # Check code formatting
npm run format:fix   # Auto-fix formatting issues
```

There are no tests configured for this project.

## Architecture

### Core Flow (src/index.ts)

1. Load chat history from `chatHistory.json` for conversation continuity
2. Accept user input via CLI prompt
3. Send messages to OpenAI's GPT model with tool definitions
4. Execute any tool calls returned by the model
5. Loop until model produces a final response
6. Persist chat history to disk

### Tool Structure

All tools are in `src/tools/` and follow this pattern:
- **Implementation function**: Async function that performs the action
- **Description object**: OpenAI function calling schema (name, description, parameters)

Tools are registered in `src/index.ts` via:
- `toolsMapping`: Maps tool names to implementation functions
- `tools`: Array of tool descriptions for the OpenAI API

### Available Tool Categories

| Category | Tools |
|----------|-------|
| **Info** | `get_date`, `get_week_number`, `google_search_api`, `wikipedia_search_api` |
| **Smart Home** | `send_light_commands_to_home_assistant`, `get_domains_from_home_assistant`, `get_domain_info_from_home_assistant` |
| **Tesla** | `get_car_info`, `wake_up_car`, `get_refresh_token_from_tesla` |
| **Code Exec** | `generate_and_run_js_code`, `run_js_code_in_docker`, `generate_and_run_python_code` |
| **System** | `kill_self` (exit code 66 triggers restart), `write_note`, `read_note` |

### Key Files

- `src/index.ts` - Main entry point with OpenAI integration and tool orchestration
- `chatHistory.json` - Persisted conversation history (auto-generated)
- `circleOfLife.sh` - Bash wrapper for auto-restart on exit code 66
- `.env` - Environment variables (API keys, tokens)

## Environment Configuration

Required environment variables (see `.env.example`):
- `OPENAI_API_KEY` - Required for core functionality
- `TESLA_*` - Tesla integration credentials
- `HOME_ASSISTANT_*` - Home Assistant URL/port
- `GOOGLE_*` - Google Search API keys

Token files read at runtime:
- `src/.token` - Tesla auth token
- `src/ha.token` - Home Assistant token

## Code Style

Uses Biome for linting and formatting:
- Tab indentation
- Double quotes for JavaScript/TypeScript

## Session Planning

See `PLANNING.md` for tracking ongoing tasks, notes, and decisions across Claude Code sessions.
