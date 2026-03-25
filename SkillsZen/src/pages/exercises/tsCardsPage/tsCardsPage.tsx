import React, { useEffect } from "react";
import PageLayout from "../../../components/shared/PageLayout/PageLayout";
import BackButton from "../../../components/shared/backButton";
import cards from "../../../data/ts-cards.json";
import type { TsCard } from "../../../types/tsCardsTypes";
import { Card } from "../../../components/ui/card";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import GardenProgress from "./gardenProgress";
import { useAuth } from "../../../services/AuthContext";
import { getTsCardsProgress, resetTsCardsProgress,  setTsCardCheckedState } from "../../../services/tsCardsProgressService";

const allCards: TsCard[] = (cards as { cards: TsCard[] }).cards;

const bgVariants = [
  "bg-slate-100/25",
  "bg-sky-100/20",
  "bg-indigo-100/20",
  "bg-stone-100/25",
];

const gardenImgDisabled = 'icons/zen-garden-disabled.png';
const gardenImg = 'icons/zen-garden.png';

const TsCards: React.FC = () => {
  const { user } = useAuth();
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([]);
  const [checkedCardIds, setCheckedCardIds] = useState<string[]>([]);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    const loadProgress = async (): Promise<void> => {
      if (!user?.uid) {
        setCheckedCardIds([]);
        setIsLoadingProgress(false);
        return;
      }

      setIsLoadingProgress(true);

      try {
        const progress = await getTsCardsProgress(user.uid);
        setCheckedCardIds(progress.checkedCardIds);
      } finally {
        setIsLoadingProgress(false);
      }
    };

    void loadProgress();
  }, [user?.uid]);

  const handleCardClick = (cardId: string): void => {
    setFlippedCardIds((previous) =>
      previous.includes(cardId)
      ? previous.filter((id) => id !== cardId)
      : [...previous, cardId],
    );
  };

  const handleCheckboxChange = async (cardId: string): Promise<void> => {
    if (!user?.uid) return;

    const wasChecked = checkedCardIds.includes(cardId);
    const nextIsChecked = !wasChecked;

    const previousCheckedCardIds = checkedCardIds;
    const nextCheckedCardIds = nextIsChecked
      ? [...checkedCardIds, cardId]
      : checkedCardIds.filter((id) => id !== cardId);

    setCheckedCardIds(nextCheckedCardIds);

    try {
      await setTsCardCheckedState(user.uid, cardId, nextIsChecked);
    } catch (error) {
      console.error("Failed to save progress", error);
      setCheckedCardIds(previousCheckedCardIds);
    }
  };

  const isCardFlipped = (cardId: string): boolean => {
    return flippedCardIds.includes(cardId);
  };

  const isCardChecked = (cardId: string): boolean => {
    return checkedCardIds.includes(cardId);
  };

  const resetAllCards = async (): Promise<void> => {
    const previousCheckedCardIds = checkedCardIds;

    setFlippedCardIds([]);
    setCheckedCardIds([]);

    if (!user?.uid) return;

    try {
      await resetTsCardsProgress(user.uid);
    } catch (error) {
      console.error("Failed to reset progress", error);
      setCheckedCardIds(previousCheckedCardIds);
    }
  };

  if (isLoadingProgress) {
    return (
      <div className="bg-white text-center p-20 text-2xl">Loading...</div>
    );
  }

  const isGardenFinished = checkedCardIds.length === allCards.length && allCards.length > 0;

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
          <div className="mb-5 text-center text-base text-slate-700/90">
            Flip cards to see explanations • Mark what you've learned to grow your garden
          </div>
          <div className="flex justify-self-center gap-2">
            <Button onClick={() => void resetAllCards()} variant="resetCards">
                Reset all cards
            </Button>
            <GardenProgress current={checkedCardIds.length} total={allCards.length} />
          </div>
          <div className="flex justify-center mt-5">
            <img
              src={isGardenFinished ? gardenImg : gardenImgDisabled}
              alt="Zen Garden Entrance"
              className={`h-15 transition-all duration-500 ${isGardenFinished ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed opacity-70'}`}
            />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                        <input type="checkbox"
                          className="absolute top-2 right-2 h-6 w-6 appearance-none bg-amber-50 rounded-full
                          checked:bg-lime-500 checked:border-transparent
                            bg-no-repeat bg-center
                            cursor-pointer border border-white-200 transition-all"
                          style={
                            isCardChecked(card.id)
                              ? { backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.3 4.3a1 1 0 0 0-1.4 0L6.5 9.6 4.1 7.3a1 1 0 1 0-1.4 1.4l3.1 3a1 1 0 0 0 1.4 0l6.1-6a1 1 0 0 0 0-1.4z'/%3E%3C/svg%3E")`, backgroundSize: '14px 14px' }
                              : {}
                          }
                          checked={isCardChecked(card.id)}
                          onChange={() => void handleCheckboxChange(card.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
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