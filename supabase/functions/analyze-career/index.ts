import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const GEMINI_MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `You are CareerPilot AI, an expert career readiness analyst.

STRICT RULES:
- NEVER invent candidate experience, certifications, employment history, or skills.
- If a skill is not mentioned in the candidate profile, mark it as Missing or Basic.
- Base every assessment ONLY on the provided candidate profile and job description.
- Do not make hiring decisions. Your role is advisory guidance only.
- Be conservative when evidence is unclear.

Return ONLY a valid JSON object matching this structure:

{
  "matchScore": number,
  "readiness": "Ready to Apply" | "Apply With Preparation" | "Build Skills First",
  "summary": string,
  "matchingSkills": string[],
  "skillGaps": [
    {
      "skill": string,
      "status": "Missing"|"Basic"|"Familiar"|"Intermediate"|"Strong",
      "priority": "High"|"Medium"|"Low"
    }
  ],
  "technicalMatch": number,
  "requirementMatch": number,
  "interviewReadiness": number,
  "recommendation": string,
  "preparationTime": string,
  "improvedSummary": string,
  "interviewQuestions": [
    {
      "category": "Technical"|"Role-specific"|"Project-based"|"Behavioral",
      "question": string,
      "practiceAnswer": string
    }
  ],
  "learningRoadmap": [
    {
      "days": string,
      "focus": string
    }
  ],
  "nextActions": string[]
}

Guidelines:
- matchScore must reflect genuine overlap.
- Ready to Apply >=75.
- Apply With Preparation = 50-74.
- Build Skills First <50.
- Generate 5-10 interview questions.
- Create a 14-day learning roadmap focused only on relevant skill gaps.
- improvedSummary must use ONLY information from the candidate profile.
- nextActions must contain exactly 3 items.
- Return ONLY JSON.`;

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get Gemini secret
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is not configured in Supabase.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    // Read request body
    const body = await req.json();

    const { profile, targetRole, jobDescription } = body;

    if (!profile || !targetRole || !jobDescription) {
      return new Response(
        JSON.stringify({
          error:
            "Profile, target role, and job description are all required.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const userPrompt = `Analyze the following candidate against the target job.

TARGET ROLE:
${targetRole}

CANDIDATE PROFILE:
${profile}

JOB DESCRIPTION:
${jobDescription}

Return the structured JSON report exactly as specified.`;

    console.log("Calling Gemini model:", GEMINI_MODEL);

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: SYSTEM_PROMPT,
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: userPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          response_mime_type: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();

      console.error(
        "Gemini API error:",
        geminiRes.status,
        errorText,
      );

      return new Response(
        JSON.stringify({
          error: "Gemini API request failed.",
          status: geminiRes.status,
          details: errorText,
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const geminiData = await geminiRes.json();

    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error(
        "Gemini returned no text:",
        JSON.stringify(geminiData),
      );

      return new Response(
        JSON.stringify({
          error: "The AI returned an empty response.",
        }),
        {
          status: 502,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error(
          "Invalid JSON returned by Gemini:",
          parseError,
        );

        return new Response(
          JSON.stringify({
            error: "The AI returned an invalid JSON response.",
          }),
          {
            status: 502,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json",
            },
          },
        );
      }
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Edge function error:", error);

    return new Response(
      JSON.stringify({
        error: "We couldn't complete the analysis right now. Please try again.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});