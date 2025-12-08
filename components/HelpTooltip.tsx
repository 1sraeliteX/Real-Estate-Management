'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'

interface HelpTooltipProps {
  text: string
}

export default function HelpTooltip({ text }: HelpTooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-blue-500 hover:text-blue-700 ml-1"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
      
      {show && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-sm rounded-lg p-3 shadow-xl z-10">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}
