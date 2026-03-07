import React from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import { Input } from '../../components/ui/input';
import ExerciseCard from './components/exerciseCard';


const Menu: React.FC = () => {
    return (
      <PageLayout backgroundImage='main-page-background.png'>
        <Input type='search' placeholder="Search"></Input>
        <h2 className='text-center m-20 text-4xl text-secondary-foreground'>Choose Your Path</h2>
        <div className='flex gap-40 justify-center'>
            <ExerciseCard 
              taskIcon='js-icon.png'
              title='JavaScript'
              descriprion='Core JS concepts'
              buttonText='Tasks'>
            </ExerciseCard>

            <ExerciseCard 
              taskIcon='ts-icon.png'
              title='TypeScript'
              descriprion='Advenced TS topics'
              buttonText='Tasks'>
            </ExerciseCard>
            
            <ExerciseCard 
              taskIcon='algo-icon.png'
              title='Algotithms'
              descriprion='Popular coding patterns'
              buttonText='Tasks'>
            </ExerciseCard>
        </div>
      </PageLayout>
    ); 
};

export default Menu;