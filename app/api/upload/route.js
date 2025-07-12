import { NextResponse } from "next/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper: extract text from various file types
async function extractText(buffer, mime) {
  switch (mime) {
    case "application/pdf": {
      const parsed = await pdfParse(buffer);
      return parsed.text;
    }
    case "text/plain": {
      return buffer.toString("utf-8");
    }
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const { value } = await mammoth.extractRawText({ buffer });
      return value;
    }
    case "text/csv": {
      return buffer.toString("utf-8");
    }
    case "application/json": {
      return JSON.stringify(JSON.parse(buffer.toString("utf-8")), null, 2);
    }
    default:
      throw new Error(`Unsupported file type: ${mime}`);
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Invalid file." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    const mime = file.type;

    console.log("📄 File type received:", mime);
    console.log("📦 File size:", buffer.length, "bytes");

    let rawText = "";
    try {
      rawText = await extractText(buffer, mime);
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Empty or unreadable file." },
        { status: 400 }
      );
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.createDocuments([rawText]);

    const embeddings = new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });

    const index = pinecone.index(process.env.PINECONE_INDEX);

    const vectors = await Promise.all(
      docs.map(async (doc, i) => {
        const values = await embeddings.embedQuery(doc.pageContent);
        return {
          id: `doc-${Date.now()}-${i}`,
          values,
          metadata: { text: doc.pageContent },
        };
      })
    );

    await index.upsert(vectors); // 👈 Upsert array of vectors

    return NextResponse.json({ message: "✅ File uploaded and embedded successfully." });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
