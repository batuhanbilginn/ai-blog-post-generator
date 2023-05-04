import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import remarkGfm from "remark-gfm"

const Post = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      className="break-words markdown"
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
    >
      {content ?? ""}
    </ReactMarkdown>
  )
}

export default Post
