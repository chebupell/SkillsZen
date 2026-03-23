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
  "bg-blue-200",
  "bg-blue-300",
  "bg-blue-100",
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

          <div className="text-center mt-5">Learn TypeScript types with flashcards </div>
          <div className="text-center mb-5">Flip cards to see explanations</div>
          <div className="flex justify-self-center">
            <Button onClick={resetAllCards} className="justify-self-center">Reset all cards</Button>
          </div>
          <div className="flex flex-wrap justify-center content-center">
            {allCards.map((card, index) => {
              const flipped = isCardFlipped(card.id);
              return (
                <Card
                key={card.id}
                className={`flex justify-center text-center gap-10 cursor-pointer w-60 h-40 m-5
                  text-xl font-bold transition-colors duration-200 shadow-md hover:shadow-lg ring-1
                  ring-black/5 from-white to-blue-50 p-3 ${bgVariants[index % bgVariants.length]}`}
                onClick={() => handleCardClick(card.id)}
                >
                  {flipped ? (
                    <div className="text-sm font-medium leading-5">
                      <div className="font-bold mb-2">{card.back.description}</div>
                      <div className="mb-2">{card.back.example}</div>
                      <div className="text-xs opacity-80">{card.back.tip}</div>
                    </div>
                  ) : (
                    <div className="text-xl font-bold">{card.front}</div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </PageLayout>
  )
};

export default TsCards;