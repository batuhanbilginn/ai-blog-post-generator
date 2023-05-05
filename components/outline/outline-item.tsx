"use client"

import { useState } from "react"
import {
  createNewHeadingAtom,
  createNewSubheadingAtom,
} from "@/atoms/form-atoms"
import { AnimatePresence, Reorder, motion } from "framer-motion"
import { PrimitiveAtom, useAtom, useSetAtom } from "jotai"
import { Trash2 } from "lucide-react"

import { OutlineItemI } from "@/types/content"

import { Button } from "../ui/button"
import Subheading from "./subheading"

const menuVariants = {
  initial: {
    opacity: 0,
    y: -5,
    height: 0,
  },
  animate: {
    opacity: 1,
    y: 0,
    height: "auto",
  },
}

const OutlineItem = ({
  outlineAtom,
  removeHandler,
}: {
  outlineAtom: PrimitiveAtom<OutlineItemI>
  removeHandler: () => void
}) => {
  const [outlineItem, setOutlineItem] = useAtom(outlineAtom)
  const [isMenuHovered, setIsMenuHovered] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const addNewHeading = useSetAtom(createNewHeadingAtom)
  const addNewSubHeading = useSetAtom(createNewSubheadingAtom)
  return (
    <motion.div key={outlineItem.id + "container"} layout className="w-full">
      <motion.div
        key={outlineItem.id + "title"}
        layout
        className="flex items-center w-full gap-2"
        onMouseEnter={() => {
          setIsDeleteOpen(true)
        }}
        onMouseLeave={() => {
          setIsDeleteOpen(false)
        }}
      >
        <AnimatePresence key={outlineItem.id + "delete"}>
          {isDeleteOpen && (
            <motion.button
              onClick={removeHandler}
              layout
              variants={{
                initial: {
                  opacity: 0,
                  x: -5,
                  width: 0,
                  display: "none",
                },
                animate: {
                  opacity: 1,
                  x: 0,
                  display: "block",
                  width: "auto",
                },
              }}
              initial="initial"
              animate="animate"
              exit="initial"
            >
              <Trash2 size={12} />
            </motion.button>
          )}
        </AnimatePresence>

        <h2 className="px-2 py-1 text-xs font-bold border cursor-move rounded-md max-w-fit dark:border-white/10 dark:bg-white/5">
          H2
        </h2>
        <input
          value={outlineItem.title}
          onChange={(e) => {
            setOutlineItem((prev) => ({ ...prev, title: e.target.value }))
          }}
          className="w-full pr-4 font-medium bg-transparent outline-none"
        />
      </motion.div>
      {outlineItem.subheadings.length > 0 && (
        <Reorder.Group
          key={outlineItem.id + "subheadings"}
          axis="y"
          values={outlineItem.subheadings}
          onReorder={(newValue) => {
            setOutlineItem((prev) => ({
              ...prev,
              subheadings: newValue,
            }))
          }}
          className="flex flex-col w-full pl-4 mt-4 gap-3"
        >
          {outlineItem.subheadings.map((subheading) => (
            <Reorder.Item
              key={subheading.id}
              value={subheading}
              className="w-full cursor-move"
            >
              <Subheading id={subheading.id} outlineAtom={outlineAtom} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
      {/* Menu */}
      <motion.div
        layout
        key={outlineItem.id + "menu"}
        onMouseEnter={() => {
          setIsMenuHovered(true)
        }}
        onMouseLeave={() => {
          setIsMenuHovered(false)
        }}
        className="py-2"
      >
        <motion.div
          initial="initial"
          animate={isMenuHovered ? "animate" : "initial"}
          variants={menuVariants}
          key={outlineItem.id + "submenu"}
          layout
        >
          <div className="flex items-center w-full mt-2 gap-3">
            <Button
              onClick={() => {
                addNewHeading(outlineItem.id)
              }}
              className="text-xs"
              variant="outline"
              size="sm"
            >
              + Heading
            </Button>
            <Button
              onClick={() => {
                addNewSubHeading(outlineItem.id)
              }}
              className="text-xs"
              variant="outline"
              size="sm"
            >
              + Subheading
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default OutlineItem
