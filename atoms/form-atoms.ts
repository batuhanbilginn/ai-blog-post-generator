import { atom } from "jotai"
import { focusAtom } from "jotai-optics"
import { splitAtom } from "jotai/utils"
import { v4 as uuidv4 } from "uuid"

import { OutlineI, OutlineItemI, PostI, SubheadingI } from "@/types/content"

const formStepAtom = atom<number>(0)
export const stepHandlerAtom = atom(
  (get) => get(formStepAtom),
  (_get, set, action: "inc" | "dec") =>
    set(formStepAtom, (prev) => (action === "inc" ? prev + 1 : prev - 1))
)
export const outlineErrorAtom = atom<string>("")
export const postErrorAtom = atom<string>("")
export const handlingAtom = atom<boolean>(false)
export const handlingMessageAtom = atom((get) => {
  const step = get(formStepAtom)
  return step === 1 ? "Generating Outline..." : "Generating Post..."
})
export const inputAtom = atom<string>("")
export const outlineAtom = atom<OutlineI>({
  title: "The Ultimate Guide on How to Write a Blog Post",
  outline: [
    {
      title: "Introduction",
      subheadings: [
        {
          heading: "Explanation of why blog writing is important",
          id: uuidv4(),
        },
        {
          heading: "Brief overview of the key elements of a blog post",
          id: uuidv4(),
        },
      ],
      id: uuidv4(),
    },
    {
      title: "Pre-Writing Steps",
      subheadings: [
        {
          heading: "Define your target audience and purpose of the blog post",
          id: uuidv4(),
        },
        {
          heading: "Conduct research and gather information",
          id: uuidv4(),
        },
        {
          heading: "Create an outline to organize your thoughts",
          id: uuidv4(),
        },
      ],
      id: uuidv4(),
    },
    {
      title: "Writing the Blog Post",
      subheadings: [
        {
          heading: "Craft an attention-grabbing headline",
          id: uuidv4(),
        },
        {
          heading: "Write a compelling introduction",
          id: uuidv4(),
        },
        {
          heading:
            "Develop the main content with subheadings, bullet points, and examples",
          id: uuidv4(),
        },
        {
          heading: "Use relevant images or multimedia to enhance the post",
          id: uuidv4(),
        },
        {
          heading: "Edit and proofread for grammar, spelling, and coherence",
          id: uuidv4(),
        },
      ],
      id: uuidv4(),
    },
    {
      title: "Formatting and Publishing",
      subheadings: [
        {
          heading:
            "Use appropriate formatting, such as short paragraphs and white space",
          id: uuidv4(),
        },
        {
          heading:
            "Optimize for search engines with relevant keywords and meta tags",
          id: uuidv4(),
        },
        {
          heading: "Add internal and external links to other content",
          id: uuidv4(),
        },
        {
          heading: "Preview the post before publishing",
          id: uuidv4(),
        },
      ],
      id: uuidv4(),
    },
    {
      title: "Promotion and Engagement",
      subheadings: [
        {
          heading: "Share the post on social media and other channels",
          id: uuidv4(),
        },
        {
          heading: "Respond to comments and feedback from readers",
          id: uuidv4(),
        },
        {
          heading:
            "Analyze and track performance metrics to improve future posts",
          id: uuidv4(),
        },
      ],
      id: uuidv4(),
    },
    {
      title: "Conclusion",
      subheadings: [
        {
          heading: "Recap of the key points for successful blog writing",
          id: uuidv4(),
        },
        {
          heading:
            "Encouragement to continue improving and experimenting with blog writing",
          id: uuidv4(),
        },
      ],
      id: uuidv4(),
    },
  ],
})
const focusedOutlineItemsAtom = focusAtom(outlineAtom, (optic) =>
  optic.prop("outline")
)
export const splittedOutlineItemsAtom = splitAtom(focusedOutlineItemsAtom)
export const postAtom = atom<PostI>({ title: "", content: "" })

const outlineChunksAtom = atom<string>("")

// Handlers
export const generateOutlineHandlerAtom = atom(null, async (get, set) => {
  const handling = get(handlingAtom)
  const inputValue = get(inputAtom)
  // Early Returns
  if (handling || inputValue.length < 10) return
  // Set Handling
  set(handlingAtom, true)
  set(outlineErrorAtom, "")
  set(stepHandlerAtom, "inc")
  set(outlineAtom, { title: "", outline: [] })
  set(inputAtom, "")

  // Generate Outline
  try {
    const response = await fetch("/api/outline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: inputValue,
      }),
    })

    if (!response.ok) {
      console.log("Response not ok", response)
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      console.log("No data from response.", data)
      throw new Error("No data from response.")
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      set(outlineChunksAtom, (prev) => prev + chunkValue)
    }

    // Parse Outline
    const parsedOutline = JSON.parse(get(outlineChunksAtom))

    // Check if there is an error
    if (parsedOutline.message) {
      set(outlineErrorAtom, parsedOutline.message)
      return
    }

    // Generate IDs
    const idGeneratedResponse = {
      ...parsedOutline,
      outline: parsedOutline.outline.map((outlineItem: OutlineItemI) => {
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

    // Set Outline
    set(outlineAtom, idGeneratedResponse)
  } catch (error: any) {
    console.log(error)
    set(outlineErrorAtom, error.message)
  } finally {
    // Stop Handling
    set(handlingAtom, false)
  }
})

export const generatePostHandlerAtom = atom(null, async (get, set) => {
  const handling = get(handlingAtom)
  const outline = get(outlineAtom)
  // Early Returns
  if (handling || !outline) return

  set(stepHandlerAtom, "inc")
  set(postAtom, { title: outline.title, content: "" })
  setTimeout(() => {
    // Set Handling
    set(handlingAtom, true)
  }, 100)

  // Generate Post
  try {
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: {
          ...outline,
          outline: outline.outline.map((outlineItem) => {
            return {
              ...outlineItem,
              subheadings: outlineItem.subheadings.map(
                (subheading) => subheading.heading
              ),
            }
          }),
        },
      }),
    })

    if (!response.ok) {
      console.log("Response not ok", response)
      throw new Error(response.statusText)
    }

    // This data is a ReadableStream
    const data = response.body
    if (!data) {
      console.log("No data from response.", data)
      throw new Error("No data from response.")
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false

    // Stop Handling
    set(handlingAtom, false)
    while (!done) {
      console.log("Reading...")
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)
      // Set Post
      set(postAtom, (prev) => {
        return {
          ...prev,
          content: prev.content + chunkValue,
        }
      })
    }
  } catch (error: any) {
    console.log(error)
    set(postErrorAtom, error.message)
  }
})

export const createNewHeadingAtom = atom(null, (get, set, id: string) => {
  const outline = get(outlineAtom)
  const splittedOutlineItems = get(splittedOutlineItemsAtom)
  const index = splittedOutlineItems.findIndex((item) => get(item).id === id)
  const newHeading: OutlineItemI = {
    title: "Write a heading",
    id: uuidv4(),
    subheadings: [
      {
        heading: "Write a subheading",
        id: uuidv4(),
      },
    ],
  }

  set(outlineAtom, {
    ...outline,
    outline: [
      ...outline.outline.slice(0, index + 1),
      newHeading,
      ...outline.outline.slice(index + 1),
    ],
  })
})

export const createNewSubheadingAtom = atom(null, (get, set, id: string) => {
  const outline = get(outlineAtom)

  const newSubheading: SubheadingI = {
    heading: "Write a subheading",
    id: uuidv4(),
  }

  set(outlineAtom, {
    ...outline,
    outline: outline.outline.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          subheadings: [...item.subheadings, newSubheading],
        }
      } else {
        return item
      }
    }),
  })
})
