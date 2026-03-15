/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import { ExerciseCard } from './components/exerciseCard';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import type { ExerciseCardProps } from '../../types/menuTypes';
import { apiFetch } from '../../api/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/login';
import { Blocks } from 'lucide-react';


let jsProgress = 0;
let tsProgress = 0;
let algoProgress = 0;
let completedBlocks = 0;

const name = "Alex";

const Menu: React.FC = () => {
  const [cards, setBlocks] = useState<ExerciseCardProps[]>([]);
    const [loading, setLoading] = useState(true);

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            const loadData = async () => {
              try {
                const cards: ExerciseCardProps[] = await apiFetch('/api/courses');
    
                const mappedCards: ExerciseCardProps[] = cards.map((card: ExerciseCardProps) => ({
                  id: card.id,
                  name: card.name,
                  icon: card.icon,
                  description: card.description,
                  total_blocks: card.total_blocks,
                  completed_blocks: card.completed_blocks,
                }));
    
                setBlocks(mappedCards);
                console.log(cards);
              } catch (error) {
                console.log('Failed to fetch exercises:', error);
              } finally {
                setLoading(false);
              }
            };
            loadData();
          } else {
            setLoading(false);
          }
        });
    
        return () => unsubscribe();
      }, []);

      if (loading) {
        return <div className="bg-white text-center p-20 text-2xl">Loading exercises...</div>;
      }

    return (
      <PageLayout backgroundImage='main-page-background.png' className='flex items-center'>
        <h2 className='text-center text-4xl text-secondary-foreground'>Welcome, {name}!</h2>
        <p className='text-center text-2xl text-secondary-foreground m-7'>Completed Blocks: {completedBlocks} / 12</p>
        <div className='flex gap-8 justify-center flex-wrap px-4'>
            <ExerciseCard id={0} name={''} icon={''} description={''} total_blocks={0} completed_blocks={0} />

            {/* <ExerciseCard 
              taskIcon='ts-icon.png'
              title='TypeScript'
              description={tsProgress+`/4 blocks completed`}
              route='exercises/ts'>
            </ExerciseCard>
            
            <ExerciseCard 
              taskIcon='algo-icon.png'
              title='Algorithms'
              description={algoProgress+`/4 blocks completed`}
              route='exercises/algo'>
            </ExerciseCard> */}
        </div>
     <div className="flex justify-center w-full">
        <Button className='m-10 mx-auto' variant='progress'><Link to={'/stats'}>View Progress</Link></Button>
      </div>
      </PageLayout>
    ); 
};

export default Menu;
