const fs=require("fs")
const OpenAI =require("openai")
const pdf = require("pdf-parse");
const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});

 const processResume = async (req, res) => {
  try {
      const filePath = req.file.path; // Path to the uploaded PDF file
      // Extract text from the PDF
      const dataBuffer = fs.readFileSync(filePath); // Read the file using fs
      const data = await pdf(dataBuffer); // Parse the PDF
      const resumeText = data.text; // Extract text from the request body
    const completion = openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {
          role: "user",
          content: `Analyze this resume and provide an ATS score (out of 100) and Give 5 suggestions for improvement. Format the response as follows:
          //             ATS Score: <score>/100
          //             Suggestions:
          //             1. <suggestion 1>
          //             2. <suggestion 2>
          //             3. <suggestion 3>
          //             Resume: ${resumeText}`,
        },
      ],
    });
    
    completion.then((result) => {
      const aiResponse=result.choices[0].message
      // console.log(aiResponse)
      const scoreMatch = aiResponse.content.match(/ATS Score: (\d+)\/100/);
    const suggestionsMatch = aiResponse.content.match(/Suggestions:\n([\s\S]*)/);
      // console.log(suggestionsMatch[1])
    const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
    const suggestions = suggestionsMatch
    ? suggestionsMatch[1]
    .split("\n") // Split by new lines
    .map(item => item.trim()) // Remove extra spaces
    .filter(item => item.length > 0) // Remove empty elements
    .map(item => item.replace(/^\/\/\s*\d+\.\s*/, "")) // Remove numbering and "//"
    : [];
    // Send the response back to the client
    fs.unlinkSync(filePath)
    res.json({ score, suggestions });
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to analyze resume" });
  }
}
module.exports=processResume