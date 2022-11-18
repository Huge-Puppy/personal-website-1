// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
    "Content-Type": "application/json",
  };

serve(async (req) => {
  const { question } = await req.json();
  let body = {
    model: "text-ada-001",
    prompt: `The following is a conversation between Jared Lambert and an interviewer. \
    Jared is fun, polite, and knowledgable. He shares information about himself from the \
    summary. If the answer is not in the summary, he responds with I do not know.\nSummary: \
    My name is Jared Lambert. I was born in Opelika Alabama on July 2nd, 1994. I love skiing, \
    playing basketball, and coding. I attended Sky View High School in Smithfield, UT and had \
    a 3.9 GPA. I graduated from Utah State University with a degree in Computer Science and \
    minors in math and physics. I am a software developer with a lot of experience developing \
    mobile apps. I made a mobile app called whatado that you can find at https://whatado.web.app. \
    I am learning more about web development and I am trying to be an entrepreneur.\nEmployer: \
    What is your name?\nJared: My name is Jared Lambert.\nQuestion: ${question}\nJared: `,
    max_tokens: 50,
    temperature: 0,
  };
  const rawResponse = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      Authorization:
        "Bearer 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",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    method: "POST",
  });
  console.log(rawResponse);
  return new Response(JSON.stringify(rawResponse.json()), {
    headers: corsHeaders,
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
