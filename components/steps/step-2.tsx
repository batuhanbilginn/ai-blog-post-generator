"use client"

import {
  generatePostHandlerAtom,
  handlingAtom,
  handlingMessageAtom,
  outlineAtom,
  outlineErrorAtom,
  splittedOutlineItemsAtom,
  stepHandlerAtom,
} from "@/atoms/form-atoms"
import { AnimatePresence, Reorder, motion } from "framer-motion"
import { useAtom, useAtomValue, useSetAtom } from "jotai"

import OutlineItem from "../outline/outline-item"
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

const Step2 = () => {
  const handling = useAtomValue(handlingAtom)
  const [step, stepAction] = useAtom(stepHandlerAtom)
  const [outline, setOutline] = useAtom(outlineAtom)
  const [outlineItemsAtoms, dispatch] = useAtom(splittedOutlineItemsAtom)
  const outlineError = useAtomValue(outlineErrorAtom)

  const handlingMessage = useAtomValue(handlingMessageAtom)
  const generetePostHandler = useSetAtom(generatePostHandlerAtom)
  const startFromScratch = () => {
    stepAction("dec")
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit={step === 1 ? "initial" : "exit"}
      animate="animate"
      className="flex items-center justify-center w-full h-full"
    >
      <AnimatePresence key="step-1">
        {handling ? (
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
        ) : !outlineError ? (
          <motion.div
            variants={containerVariants}
            initial="initial"
            exit="exit"
            animate={!handling ? "animate" : "initial"}
            className="w-full max-w-3xl"
          >
            <h1 className="px-3 py-2 mb-4 text-sm font-bold border rounded-md dark:bg-white/5 max-w-fit dark:border-white/10">
              Outline
            </h1>
            <input
              value={outline.title}
              onChange={(e) => {
                setOutline((prev) => ({ ...prev, title: e.target.value }))
              }}
              className="w-full pr-4 text-2xl font-bold bg-transparent outline-none"
            />
            <Reorder.Group
              key={"outline-items"}
              axis="y"
              values={outline.outline}
              onReorder={(newValue) => {
                setOutline((prev) => ({
                  ...prev,
                  outline: newValue,
                }))
              }}
              className="flex flex-col w-full gap-4 pt-4"
            >
              {outlineItemsAtoms.map((outlineItemAtom, index) => (
                <Reorder.Item
                  key={outline.outline[index].id}
                  value={outline.outline[index]}
                >
                  <OutlineItem
                    outlineAtom={outlineItemAtom}
                    removeHandler={() => {
                      dispatch({ type: "remove", atom: outlineItemAtom })
                    }}
                  />
                </Reorder.Item>
              ))}
            </Reorder.Group>
            {/* Button */}
            <motion.div layout className="flex items-center gap-4 mt-10">
              <Button onClick={generetePostHandler} className="w-full">
                Save and Continue
              </Button>
              <Button
                onClick={startFromScratch}
                variant="outline"
                className="w-full"
              >
                Start from Scratch
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="initial"
            exit="exit"
            animate={outlineError ? "animate" : "initial"}
            className="flex items-center gap-2 h-[80vh] justify-center w-full"
          >
            <div className="px-3 py-2 text-sm font-bold border rounded-md dark:bg-red-600/10 max-w-fit dark:border-red-600/20">
              Error
            </div>
            {JSON.stringify(outlineError)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Step2
