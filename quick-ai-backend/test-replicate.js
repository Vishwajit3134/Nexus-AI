require("dotenv").config();
const Replicate = require("replicate");

async function testReplicate() {
  console.log("1. Checking API Token...");
  const token = process.env.REPLICATE_API_TOKEN;

  if (!token) {
    console.error("❌ ERROR: REPLICATE_API_TOKEN is missing from .env file");
    return;
  }
  console.log("✅ Token found:", token.slice(0, 5) + "...");

  const replicate = new Replicate({
    auth: token,
  });

  console.log("2. Sending test request to Replicate...");
  try {
    const output = await replicate.run("black-forest-labs/flux-schnell", {
      input: {
        prompt: "a tiny astronaut sitting on a cookie",
        go_fast: false,
        megapixels: "1",
        num_outputs: 1,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
      },
    });

    console.log("✅ SUCCESS! Image generated:", output);
  } catch (error) {
    console.error("❌ REPLICATE FAILED:", error.message);
    if (error.response) {
      console.error("Error details:", await error.response.text());
    }
  }
}

testReplicate();
