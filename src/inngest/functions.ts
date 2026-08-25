// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";
import * as Sentry from "@sentry/nextjs";
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
    await step.sleep("pretend", "5s");

    Sentry.logger.info("User triggered test log", { log_source: "sentry_test" });

    console.warn("Something is missing");
    console.error("This is an error I want to track");

    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText, 
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful asssisstant.",
        prompt: "What is 2 + 2?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "openai-generate-text",
      generateText, 
      {
        model: openai("gpt-4"),
        system: "You are a helpful asssisstant.",
        prompt: "What is the meaning of life?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText, 
      {
        model: anthropic("claude-sonnet-4-0"),
        system: "You are a helpful asssisstant.",
        prompt: "What is the meaning of life?",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  },
);
