/* eslint-disable prefer-const */
import React, { useEffect, useState } from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import type { ExerciseCardProps } from '../../types/menuTypes';
import { apiFetch } from '../../api/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/login';
import { ExerciseCard } from './components/exerciseCard';
import { useAuth } from '../../services/AuthContext';

const Menu: React.FC = () => {
  const { user } = useAuth();
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
        <h2 className='text-center text-4xl text-secondary-foreground mb-10'>Welcome, {user?.name}!</h2>
        <div className='flex gap-8 justify-center flex-wrap px-4'>
            <ExerciseCard 
            id={cards[0].id}
            name={cards[0].name}
            icon={cards[0].icon.toLowerCase() + '-icon.png'}
            description={cards[0].description}
            progress={cards[0].completed_blocks + '/' +
              cards[0].total_blocks + ' blocks completed'}
            route='js'/>

            <ExerciseCard 
            id={cards[1].id}
            name={cards[1].name}
            icon={cards[1].icon.toLowerCase() + '-icon.png'}
            description={cards[1].description}
            progress={cards[1].completed_blocks + '/' +
              cards[1].total_blocks + ' blocks completed'}
            route='ts'/>
            
            <ExerciseCard 
            id={cards[2].id}
            name={cards[2].name}
            icon={cards[2].icon.toLowerCase() + '-icon.png'}
            description={cards[2].description}
            progress={cards[2].completed_blocks + '/' +
              cards[2].total_blocks + ' blocks completed'}
            route='algo'/>
        </div>
     <div className="flex justify-center w-full">
        <Button className='m-10 mx-auto' variant='progress'><Link to={'/stats'}>View Progress</Link></Button>
      </div>
      </PageLayout>
    ); 
};

export default Menu;
