"use client"

import {
  handlingAtom,
  handlingMessageAtom,
  postAtom,
  postErrorAtom,
  stepHandlerAtom,
} from "@/atoms/form-atoms"
import { AnimatePresence, motion } from "framer-motion"
import { useAtom, useAtomValue } from "jotai"

import Post from "../post/post"
import { Button } from "../ui/button"
import Spinner from "../ui/spinner"

const containerVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  exit: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
}

const Step3 = () => {
  const handling = useAtomValue(handlingAtom)
  const [step, stepAction] = useAtom(stepHandlerAtom)
  const postError = useAtomValue(postErrorAtom)
  const [post, setPost] = useAtom(postAtom)
  const handlingMessage = useAtomValue(handlingMessageAtom)
  const goBackHandler = () => {
    stepAction("dec")
    setTimeout(() => {
      setPost({ title: "", content: "" })
    }, 500)
  }
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit={step === 2 ? "initial" : "exit"}
      animate="animate"
      className="flex items-center justify-center w-full h-full"
    >
      <AnimatePresence key="step-1">
        {handling || (!post.content && !postError) ? (
          <motion.div
            variants={containerVariants}
            initial="initial"
            exit="exit"
            animate={handling ? "animate" : "initial"}
            className="flex items-center justify-center w-full h-[80vh]"
          >
            <div className="flex items-center gap-4">
              <Spinner />
              <div className="text-sm text-neutral-700">{handlingMessage}</div>
            </div>
          </motion.div>
        ) : !postError ? (
          <motion.div
            variants={containerVariants}
            initial="initial"
            exit="exit"
            animate={!handling ? "animate" : "initial"}
            className="w-full max-w-3xl"
          >
            <div className="px-3 py-2 mb-4 text-sm font-bold border rounded-md dark:bg-white/5 max-w-fit dark:border-white/10">
              Post
            </div>
            <div>
              <h1 className="mb-10 text-2xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <Post content={post.content} />
            </div>
            {/* Button */}
            <Button
              onClick={goBackHandler}
              variant="outline"
              className="w-full mt-10"
            >
              Go Back to Outline
            </Button>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="initial"
            exit="exit"
            animate={postError ? "animate" : "initial"}
            className="flex items-center gap-2 h-[80vh] justify-center w-full"
          >
            <div className="px-3 py-2 text-sm font-bold border rounded-md dark:bg-red-600/10 max-w-fit dark:border-red-600/20">
              Error
            </div>
            {JSON.stringify(postError)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Step3
