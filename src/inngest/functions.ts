// src/inngest/functions.ts
import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", retries: 3 },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // fetch the video
    await step.sleep("fetching", "5s");

    // fetch the video
    await step.sleep("transcribing", "5s");

    // fetch the video
    await step.sleep("sending-to-ai", "5s");

    await step.run("create-workflow", () => {
      return prisma.workflow.create({
        data: {
          name: "workflow-from-inngest",
        },
      });
    })
  }
);
