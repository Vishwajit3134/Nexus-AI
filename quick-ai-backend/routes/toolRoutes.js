require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const PDFParser = require("pdf2json"); // ✅ Switched back to pdf2json for stability
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Replicate = require("replicate");
const pool = require("../db");

// === 💰 CREDIT CONFIGURATION ===
const CREDIT_COSTS = {
  ARTICLE: 20,
  BLOG_TITLES: 5,
  IMAGE: 50,
  IMAGE_EDIT: 40,
  RESUME: 30,
};

// === 1. SETUP ===
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// --- Helper Functions ---

// 🔹 Credit System Helper
const checkAndDeductCredits = async (userId, cost) => {
  try {
    const userResult = await pool.query(
      "SELECT credits FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length === 0) throw new Error("User not found");
    const currentCredits = userResult.rows[0].credits;
    if (currentCredits < cost) return false;
    await pool.query("UPDATE users SET credits = credits - $1 WHERE id = $2", [
      cost,
      userId,
    ]);
    return true;
  } catch (error) {
    console.error("Credit check failed:", error);
    throw error;
  }
};

const callLLM = async (promptRAG) => {
  try {
    const result = await model.generateContent(promptRAG);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("❌ Gemini API Error:", error);
    throw new Error("Failed to generate content from AI");
  }
};

function extractJson(text) {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in AI response.");
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    throw new Error("Failed to parse JSON from AI response.");
  }
}

// 🔹 Helper to read PDF using pdf2json
const getTextFromPdfBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", (errData) =>
      reject(new Error("Failed to parse PDF file."))
    );
    pdfParser.on("pdfParser_dataReady", (pdfData) =>
      resolve(pdfParser.getRawTextContent())
    );
    pdfParser.parseBuffer(buffer);
  });
};

// Mock Retrieval
const retrieveWebContext = async (topic) => {
  return `Snippet: ${topic} is interesting.`;
};
const retrieveExampleTitles = async (category) => {
  return `- "10 Best Tips for ${category}"`;
};
const retrieveResumeBestPractices = async () => {
  return `A good resume should be concise.`;
};

const upload = multer({ storage: multer.memoryStorage() });

// === 2. API ROUTES ===

// --- 🔹 Get User Credits ---
router.get("/user-credits/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query("SELECT credits FROM users WHERE id = $1", [
      userId,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.json({ credits: result.rows[0].credits });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch credits" });
  }
});

// --- 🔹 Image Editor ---
router.post("/image-editor", upload.single("image"), async (req, res) => {
  // 1. Validation & Input Extraction
  // ✅ FIX: Added negative_prompt to the destructuring so it is defined
  const { prompt, userId, negative_prompt } = req.body;

  if (!userId) return res.status(400).json({ error: "User ID is required" });
  if (!req.file)
    return res.status(400).json({ error: "Image file is required" });
  if (!prompt)
    return res.status(400).json({ error: "Edit instruction is required" });

  try {
    // 2. Check Credits
    const hasCredits = await checkAndDeductCredits(
      userId,
      CREDIT_COSTS.IMAGE_EDIT
    );
    if (!hasCredits)
      return res.status(403).json({
        error: `Not enough credits. Required: ${CREDIT_COSTS.IMAGE_EDIT}`,
      });

    console.log("🎨 Editing image with google/nano-banana...");

    // 3. Prepare Image (Convert Buffer to Base64 URI)
    const mime = req.file.mimetype;
    const base64Image = req.file.buffer.toString("base64");
    const imageUri = `data:${mime};base64,${base64Image}`;

    // 4. Run Replicate
    const output = await replicate.run("google/nano-banana", {
      input: {
        prompt: prompt,
        // ✅ FIX: Now negative_prompt is defined (or falls back to default)
        negative_prompt:
          negative_prompt || "low quality, ugly, distorted, watermark",
        image_input: [imageUri], // Expects an array
      },
    });

    // 5. Handle Output (Robustly)
    let imageUrl;

    // Check if output is an object with a .url() method (File output)
    if (output && typeof output.url === "function") {
      imageUrl = output.url();
    }
    // Check if output is an Array (Standard Replicate return for images)
    else if (Array.isArray(output)) {
      imageUrl = output[0];
    }
    // Check if output is just a String (Direct URL)
    else if (typeof output === "string") {
      imageUrl = output;
    } else {
      console.error("Unknown Replicate output format:", output);
      throw new Error("Received invalid output format from AI model");
    }

    console.log("✅ Image edited successfully:", imageUrl);

    // 6. Save to Database
    await pool.query(
      `INSERT INTO image_creations (user_id, tool_type, prompt_input, artistic_style, storage_url, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, "image-editor", prompt, "nano-banana", imageUrl, false]
    );

    // 7. Respond
    res.status(200).json({ imageUrl: imageUrl, cost: CREDIT_COSTS.IMAGE_EDIT });
  } catch (error) {
    console.error("❌ Replicate Error:", error);

    // Return a more descriptive error if available
    const errorMessage = error.message || "Failed to edit image.";
    res.status(500).json({ error: errorMessage });
  }
});
// --- 🔹 Image Generator ---
// router.post("/image-generator", async (req, res) => {
//   const { prompt, style, isPublic, userId } = req.body;
//   if (!prompt) return res.status(400).json({ error: "Prompt is required" });
//   if (!userId) return res.status(400).json({ error: "User ID is required" });

//   try {
//     const hasCredits = await checkAndDeductCredits(userId, CREDIT_COSTS.IMAGE);
//     if (!hasCredits)
//       return res
//         .status(403)
//         .json({ error: `Not enough credits. Required: ${CREDIT_COSTS.IMAGE}` });

//     const model = "black-forest-labs/flux-schnell";
//     const input = {
//       prompt: style ? `${prompt}, ${style} style` : prompt,
//       go_fast: true,
//       megapixels: "1",
//       aspect_ratio: "1:1",
//       output_format: "webp",
//     };
//     const imageUrl = Array.isArray(output) ? output[0].url : output.url;

//     await pool.query(
//       `INSERT INTO image_creations (user_id, tool_type, prompt_input, artistic_style, storage_url, is_public)
//        VALUES ($1, $2, $3, $4, $5, $6)`,
//       [userId, "image-generator", prompt, style, imageUrl, isPublic]
//     );

//     res.status(200).json({ imageUrl: imageUrl, cost: CREDIT_COSTS.IMAGE });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

router.post("/image-generator", async (req, res) => {
  const { prompt, style, isPublic, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // ⚠️ Optional improvement: check credits first, deduct after success
    const hasCredits = await checkAndDeductCredits(userId, CREDIT_COSTS.IMAGE);

    if (!hasCredits) {
      return res.status(403).json({
        error: `Not enough credits. Required: ${CREDIT_COSTS.IMAGE}`,
      });
    }

    const input = {
      prompt: style ? `${prompt}, ${style} style` : prompt,
    };

    // ✅ Use the new model
    const output = await replicate.run("prunaai/flux-fast", { input });

    // ✅ flux-fast returns ONE File object
    if (!output || typeof output.url !== "function") {
      throw new Error("Invalid output from Replicate");
    }

    const imageUrl = await output.url();

    await pool.query(
      `INSERT INTO image_creations
       (user_id, tool_type, prompt_input, artistic_style, storage_url, is_public)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        "image-generator",
        prompt,
        style || null,
        imageUrl,
        isPublic ?? false,
      ]
    );

    return res.status(200).json({
      imageUrl,
      cost: CREDIT_COSTS.IMAGE,
    });
  } catch (error) {
    console.error("❌ REPLICATE FAILED:", error);

    // Proper rate-limit forwarding
    if (error.status === 429) {
      return res.status(429).json({
        error: "Rate limit exceeded",
        message: "Too many requests. Please wait a moment and try again.",
        retryAfter: error.retry_after || 2,
      });
    }

    return res.status(500).json({
      error: "Image generation failed",
      message: error.message,
    });
  }
});

// router.post("/image-generator", async (req, res) => {
//   const { prompt, style, isPublic, userId } = req.body;

//   if (!prompt) {
//     return res.status(400).json({ error: "Prompt is required" });
//   }
//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required" });
//   }

//   try {
//     // ⚠️ Optional improvement: check credits first, deduct after success
//     const hasCredits = await checkAndDeductCredits(userId, CREDIT_COSTS.IMAGE);

//     if (!hasCredits) {
//       return res.status(403).json({
//         error: `Not enough credits. Required: ${CREDIT_COSTS.IMAGE}`,
//       });
//     }

//     // ✅ IMAGEN 4 INPUT CONFIGURATION
//     // Imagen 4 supports: prompt, aspect_ratio (e.g. "1:1", "16:9"), safety_filter_level
//     const input = {
//       prompt: style ? `${prompt}, ${style} style` : prompt,
//       aspect_ratio: "1:1", // Optional: Make this dynamic if your frontend sends it
//       safety_filter_level: "block_medium_and_above",
//     };

//     // ✅ Use Google Imagen 4
//     // Options: "google/imagen-4" (High Quality) or "google/imagen-4-fast" (Faster/Cheaper)
//     const output = await replicate.run("google/imagen-4", { input });

//     // ✅ Imagen 4 on Replicate returns a File object (Stream), just like Flux
//     if (!output || typeof output.url !== "function") {
//       // Fallback check: Some versions might return a standard string[]
//       if (Array.isArray(output) && output[0]) {
//         var imageUrl = output[0]; // Handle legacy array return if API changes
//       } else {
//         throw new Error("Invalid output from Replicate");
//       }
//     } else {
//       // Standard File object handling
//       var imageUrl = await output.url();
//     }

//     await pool.query(
//       `INSERT INTO image_creations
//        (user_id, tool_type, prompt_input, artistic_style, storage_url, is_public)
//        VALUES ($1, $2, $3, $4, $5, $6)`,
//       [
//         userId,
//         "image-generator",
//         prompt,
//         style || null,
//         imageUrl,
//         isPublic ?? false,
//       ]
//     );

//     return res.status(200).json({
//       imageUrl,
//       cost: CREDIT_COSTS.IMAGE,
//     });
//   } catch (error) {
//     console.error("❌ REPLICATE FAILED:", error);

//     // Proper rate-limit forwarding
//     if (error.status === 429) {
//       return res.status(429).json({
//         error: "Rate limit exceeded",
//         message: "Too many requests. Please wait a moment and try again.",
//         retryAfter: error.retry_after || 2,
//       });
//     }

//     return res.status(500).json({
//       error: "Image generation failed",
//       message: error.message,
//     });
//   }
// });

// --- 🔹 Article Generator ---
router.post("/article-generator", async (req, res) => {
  const { topic, length, userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const COSTS = { short: 10, medium: 20, long: 30 };
    const cost = COSTS[length] || 20;

    const hasCredits = await checkAndDeductCredits(userId, cost);
    if (!hasCredits)
      return res
        .status(403)
        .json({ error: `Not enough credits. Required: ${cost}` });

    const context = await retrieveWebContext(topic);
    const promptRAG = `Write an article about ${topic} (${length})... JSON format...`;
    const aiResponseText = await callLLM(
      `Write an article about ${topic} (${length}). Context: ${context}. Output JSON: { "title": "...", "sections": [{ "type": "heading", "content": "..." }, { "type": "paragraph", "content": "..." }] }`
    );
    const generatedJson = extractJson(aiResponseText);

    res.status(200).json({ generated_output: generatedJson, cost: cost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 🔹 Blog Title Generator ---
router.post("/blog-title-generator", async (req, res) => {
  const { keyword, category, userId } = req.body;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const hasCredits = await checkAndDeductCredits(
      userId,
      CREDIT_COSTS.BLOG_TITLES
    );
    if (!hasCredits)
      return res.status(403).json({
        error: `Not enough credits. Required: ${CREDIT_COSTS.BLOG_TITLES}`,
      });

    const examples = await retrieveExampleTitles(category);
    const promptRAG = `Generate 10 blog titles for "${keyword}"... Output JSON: { "titles": [] }`;
    const aiResponseText = await callLLM(promptRAG);
    const generatedJson = extractJson(aiResponseText);
    res.status(200).json({
      generated_output: generatedJson,
      cost: CREDIT_COSTS.BLOG_TITLES,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- 🔹 Résumé Analyzer (Using pdf2json) ---
router.post("/resume-analyzer", upload.single("resume"), async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: "User ID is required" });

  try {
    const hasCredits = await checkAndDeductCredits(userId, CREDIT_COSTS.RESUME);
    if (!hasCredits)
      return res.status(403).json({
        error: `Not enough credits. Required: ${CREDIT_COSTS.RESUME}`,
      });

    if (!req.file)
      return res.status(400).json({ error: "No resume file uploaded." });

    // ✅ Using pdf2json helper function
    const resumeText = await getTextFromPdfBuffer(req.file.buffer);

    const promptRAG = `
      Analyze this resume.
      Resume Text: ${resumeText.substring(0, 4000)}...
      Output JSON format: { "strengths": [{"point": "..."}], "weaknesses": [{"point": "..."}], "suggestions_for_improvement": [{"suggestion": "..."}] }
    `;
    const analysisJsonText = await callLLM(promptRAG);
    const analysis = extractJson(analysisJsonText);

    res
      .status(200)
      .json({ analysis_result: analysis, cost: CREDIT_COSTS.RESUME });
  } catch (error) {
    console.error("Resume Analyzer Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- 🔹 Gallery Route ---
router.get("/gallery", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM image_creations
       WHERE is_public = true
       ORDER BY created_at DESC`
    );

    const images = result.rows.map((img) => ({
      ...img,
      storage_url:
        typeof img.storage_url === "string"
          ? img.storage_url.trim().replace(/^"+|"+$/g, "")
          : img.storage_url,
    }));

    res.status(200).json({ images });
  } catch (error) {
    console.error("Gallery fetch failed:", error);
    res.status(500).json({ error: "Failed to fetch gallery images" });
  }
});

module.exports = router;
