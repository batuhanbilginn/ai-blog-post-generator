"use client"

import { stepHandlerAtom } from "@/atoms/form-atoms"
import { AnimatePresence } from "framer-motion"
import { useAtomValue } from "jotai"

import Step1 from "@/components/steps/step-1"
import Step2 from "@/components/steps/step-2"
import Step3 from "@/components/steps/step-3"

export default function IndexPage() {
  const step = useAtomValue(stepHandlerAtom)
  return (
    <section className="container grid items-center gap-6 pt-6 pb-8 md:py-10">
      <div className="h-full">
        <AnimatePresence key="main">
          {step === 0 && <Step1 key="step-1 component" />}
          {step === 1 && <Step2 key="step-2 component" />}
          {step === 2 && <Step3 key="step-3 component" />}
        </AnimatePresence>
      </div>
    </section>
  )
}
