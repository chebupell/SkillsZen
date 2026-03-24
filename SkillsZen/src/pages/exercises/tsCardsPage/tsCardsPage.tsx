import React from "react";
import PageLayout from "../../../components/shared/PageLayout/PageLayout";
import BackButton from "../../../components/shared/backButton";
import cards from "../../../data/ts-cards.json";
import type { TsCard } from "../../../types/tsCardsTypes";
import { Card } from "../../../components/ui/card";
import { useState } from "react";
import { Button } from "../../../components/ui/button";

const allCards: TsCard[] = (cards as { cards: TsCard[] }).cards;

const bgVariants = [
  "bg-slate-100/25",
  "bg-sky-100/20",
  "bg-indigo-100/20",
  "bg-stone-100/25",
];

const TsCards: React.FC = () => {

  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);

  const handleCardClick = (cardId: string): void => {
    setFlippedCardIds((previous) =>
      previous.includes(cardId)
      ? previous.filter((id) => id !== cardId)
      : [...previous, cardId],
    );
  };

  const isCardFlipped = (cardId: string): boolean => {
    return flippedCardIds.includes(cardId);
  };

  const resetAllCards = (): void => {
    setFlippedCardIds([]);
  };

  return (
      <PageLayout backgroundImage="ts-cards-background.png">
        <div className="p-4 sm:p-10 min-h-screen">
          <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-2 mb-3">
            <div className="flex justify-start">
              <BackButton />
            </div>
            <div className="text-2xl sm:text-4xl text-right sm:text-center">TS Cards</div>
          <div className="hidden sm:block w-25" aria-hidden="true"></div>
          </div>

          <div className="mt-5 text-center text-base text-slate-700">Learn TypeScript types with flashcards </div>
          <div className="mb-5 text-center text-base text-slate-700/90">Flip cards to see explanations</div>
          <div className="flex justify-self-center">
            <Button onClick={resetAllCards} className=" rounded-xl border border-white/40
            text-white backdrop-blur-md bg-gray-600
              shadow-[0_8px_24px_rgba(31,41,55,0.12)] hover:bg-gray-700 active:bg-gray-800">Reset all cards</Button>
          </div>
          <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allCards.map((card, index) => {
              const flipped = isCardFlipped(card.id);
              const bgClass = bgVariants[index % bgVariants.length];
              return (
                <div
                  key={card.id}
                  className={`m-5 h-44 w-64 cursor-pointer p-1`}
                  style={{ perspective: '1000px'}}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div
                    className="relative h-full w-full transition-transform duration-700"
                    style={{
                      transformStyle: "preserve-3d",
                      transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  >
                    <Card
                      className={`absolute inset-0 rounded-3xl flex items-center justify-center text-center p-3 text-2xl border-white/30
                        backdrop-blur-md font-bold shadow-md text-slate-800 hover:shadow-lg ring-1 ring-black/5 ${bgClass}`}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div>
                          <img src="icons/flower-icon.png" alt="flower" className="w-30" />
                        </div>
                        <div>{card.front}</div>
                      </div>
                    </Card>
                    <Card
                      className={`absolute inset-0 flex flex-wrap  rounded-3xl border-white/35
                        items-center justify-center p-4 ring-1 ring-black/5 bg-white/35 backdrop-blur-lg
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_30px_rgba(31,41,55,0.14)] overflow-hidden`}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      <div className="flex h-full w-full flex-col text-left">
                        <div className="mb-2 text-sm font-semibold leading-5 text-slate-800 text-center">
                          {card.back.description}
                        </div>
                        <div className="mb-2 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-900/90">
                          <pre className="whitespace-pre-wrap wrap-break-words p-2 text-xs leading-5 text-slate-100">
                            <code>{card.back.example}</code>
                          </pre>
                        </div>
                        <div className="mt-auto text-xs leading-4 text-slate-700/80 text-center">{card.back.tip}</div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </PageLayout>
  )
};

export default TsCards;