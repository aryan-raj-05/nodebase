// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI} from "@ai-sdk/openai";
import { generateText } from "ai";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText, 
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful asssisstant.",
        prompt: "What is the meaning of life?",
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText, 
      {
        model: openai("gpt-4"),
        system: "You are a helpful asssisstant.",
        prompt: "What is the meaning of life?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText, 
      {
        model: anthropic("claude-sonnet-4-0"),
        system: "You are a helpful asssisstant.",
        prompt: "What is the meaning of life?",
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  },
);
