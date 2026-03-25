import React from "react";
import { Button } from "../../../components/ui/button";

interface GardenProps {
  onBack: () => void;
}

const Garden: React.FC<GardenProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-8
      bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-700">

      <div className="relative max-w-5xl w-full overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
        <img
          src="ts-cards-images/final-garden.gif"
          alt="Garden"
          className="w-full h-auto max-h-[80vh] object-cover"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <Button
            onClick={onBack}
            className="px-8 py-6 bg-blue-500 backdrop-blur-sm text-white rounded-full shadow-lg
                      transition-all duration-200 border-none hover:bg-blue-600 hover:scale-[1.02]
                      active:bg-blue-700 active:scale-100 active:shadow-inner"
          >
            Back to Cards
          </Button>
        </div>
    </div>
  )
}

export default Garden;