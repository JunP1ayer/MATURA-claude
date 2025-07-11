import { NextRequest, NextResponse } from 'next/server'

interface BlogPostRequest {
  userInput: string;
}

interface BlogPostResponseSuccess {
  success: true;
  blogIdeas: {
    title: string;
    description: string;
    keywords: string[];
  }[];
}

interface BlogPostResponseError {
  success: false;
  error: string;
}

type BlogPostResponse = BlogPostResponseSuccess | BlogPostResponseError;


export async function GET() {
  console.log("GET request received");
  return NextResponse.json({ message: "API is healthy" });
}

export async function POST(request: NextRequest) {
  console.log("POST request received");
  try {
    const { userInput } = (await request.json()) as BlogPostRequest;

    console.log("User input:", userInput);

    if (!userInput || userInput.trim() === "") {
      console.error("Validation error: User input is empty");
      return NextResponse.json({ success: false, error: "User input is required" }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    const blogIdeas = generateBlogIdeas(userInput);

    console.log("Generated blog ideas:", blogIdeas);

    return NextResponse.json({ success: true, blogIdeas });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}


function generateBlogIdeas(userInput: string): { title: string; description: string; keywords: string[]; }[] {
  const keywords = userInput.split(" ").filter(word => word.length > 2);
  const numIdeas = Math.min(keywords.length, 3) + 1;

  return Array.from({ length: numIdeas }, (_, i) => ({
    title: `Blog Idea ${i + 1}: ${keywords[i] || 'My Blog' }`,
    description: `A blog post about ${keywords[i] || 'my amazing journey'}.  This will be a great post!`,
    keywords: [...keywords, `blog`, `website`, `tutorial`],
  }));
}