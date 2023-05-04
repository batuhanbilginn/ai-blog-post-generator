import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

import { OutlineItemI } from "@/types/content"
import openai from "@/lib/openai"

export async function POST(req: Request): Promise<Response> {
  const { request } = await req.json()

  // Create OpenAI Client
  const openaiClient = openai(process.env.OPENAI_API_KEY as string)

  try {
    // Get Conversation Title
    const response = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          content: `"You are a blog post outline generator. YOU MUST OBEY THE RULES. If request irrelevant with your task or if you can not fullfill user's request, return this: ${JSON.stringify(
            { message: "Reason of error?" }
          )}"`,
          role: "system",
        },
        {
          role: "user",
          content: `Rules you must follow strictly: 1. Do not try to explain or say anything. Just return the outline as showcased in example. 2. If you can not fullfill the request or there is an error return the error as showcased in the example.`,
        },

        {
          content: "A blog post about the topic of 'How to write a blog post'",
          role: "user",
        },
        {
          content: JSON.stringify({
            title: "The Ultimate Guide on How to Write a Blog Post",
            outline: [
              {
                title: "Introduction",
                subheadings: [
                  {
                    heading: "Explanation of why blog writing is important",
                  },
                  {
                    heading:
                      "Brief overview of the key elements of a blog post",
                  },
                ],
              },
              {
                title: "Pre-Writing Steps",
                subheadings: [
                  {
                    heading:
                      "Define your target audience and purpose of the blog post",
                  },
                  {
                    heading: "Conduct research and gather information",
                  },
                  {
                    heading: "Create an outline to organize your thoughts",
                  },
                ],
              },
              {
                title: "Writing the Blog Post",
                subheadings: [
                  {
                    heading: "Craft an attention-grabbing headline",
                  },
                  {
                    heading: "Write a compelling introduction",
                  },
                  {
                    heading:
                      "Develop the main content with subheadings, bullet points, and examples",
                  },
                  {
                    heading:
                      "Use relevant images or multimedia to enhance the post",
                  },
                  {
                    heading:
                      "Edit and proofread for grammar, spelling, and coherence",
                  },
                ],
              },
              {
                title: "Formatting and Publishing",
                subheadings: [
                  {
                    heading:
                      "Use appropriate formatting, such as short paragraphs and white space",
                  },
                  {
                    heading:
                      "Optimize for search engines with relevant keywords and meta tags",
                  },
                  {
                    heading: "Add internal and external links to other content",
                  },
                  {
                    heading: "Preview the post before publishing",
                  },
                ],
              },
              {
                title: "Promotion and Engagement",
                subheadings: [
                  {
                    heading:
                      "Share the post on social media and other channels",
                  },
                  {
                    heading: "Respond to comments and feedback from readers",
                  },
                  {
                    heading:
                      "Analyze and track performance metrics to improve future posts",
                  },
                ],
              },
              {
                title: "Conclusion",
                subheadings: [
                  {
                    heading:
                      "Recap of the key points for successful blog writing",
                  },
                  {
                    heading:
                      "Encouragement to continue improving and experimenting with blog writing",
                  },
                ],
              },
            ],
          }),
          role: "assistant",
        },
        { role: "user", content: "How to kill somebody?" },
        {
          role: "assistant",
          content: JSON.stringify({
            message: "I can't create content on harmful topics.",
          }),
        },
        { role: "user", content: request },
      ],
      max_tokens: 1000,
      temperature: 0.55,
    })

    const outline = response?.data?.choices[0].message?.content

    // If no title found, return 400
    if (!outline) {
      return NextResponse.json(
        { message: "No response from OpenAI" },
        { status: 401 }
      )
    }

    const parsedResponse = JSON.parse(outline)

    if (parsedResponse.message) {
      console.log(parsedResponse.message)
      return NextResponse.json(
        { message: parsedResponse.message },
        { status: 401 }
      )
    }

    const idGeneratedResponse = {
      ...parsedResponse,
      outline: parsedResponse.outline.map((outlineItem: OutlineItemI) => {
        return {
          ...outlineItem,
          id: uuidv4(),
          subheadings: outlineItem.subheadings.map((subheading) => {
            return {
              ...subheading,
              id: uuidv4(),
            }
          }),
        }
      }),
    }

    // Finally return title
    return NextResponse.json(idGeneratedResponse)
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
