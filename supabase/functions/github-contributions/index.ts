// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST",
  "Access-Control-Expose-Headers": "Content-Length, X-JSON",
  "Access-Control-Allow-Headers":
    "apikey, X-Client-Info, Content-Type, Authorization, Accept, Accept-Language, X-Authorization",
};

serve(async (req) => {
  const { method } = req;
  if (method === "OPTIONS") {
    return new Response("ok", { headers: { ...corsHeaders } });
  }

  var dateOffset = 24 * 60 * 60 * 1000 * 370; //1 year
  var startDate = new Date();
  startDate.setTime(startDate.getTime() - dateOffset);

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${Deno.env.get("GITHUB_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
        user(login: "huge-puppy"){
        contributionsCollection(from: "${startDate.toISOString()}", to: "${new Date().toISOString()}") {
					contributionCalendar{
          	totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
        }
      }
    }
    }`,
    }),
  });

  return new Response(JSON.stringify(await response.json()), {
    headers: { ...corsHeaders },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
