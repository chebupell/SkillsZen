/* eslint-disable prefer-const */
import React from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import ExerciseCard from './components/exerciseCard';
import { Button } from '../../components/ui/button';


let jsProgress = 0;
let tsProgress = 0;
let algoProgress = 0;
let completedBlocks = 0;

const name = "Alex";

const Menu: React.FC = () => {
    return (
      <PageLayout backgroundImage='main-page-background.png'>
        <h2 className='text-center text-4xl text-secondary-foreground'>Welcome, {name}!</h2>
        <p className='text-center text-2xl text-secondary-foreground m-7'>Completed Blocks: {completedBlocks} / 12</p>
        <div className='flex gap-8 justify-center flex-wrap px-4'>
            <ExerciseCard 
              taskIcon='js-icon.png'
              title='JavaScript'
              descriprion={jsProgress+`/4 blocks completed`}>
            </ExerciseCard>

            <ExerciseCard 
              taskIcon='ts-icon.png'
              title='TypeScript'
              descriprion={tsProgress+`/4 blocks completed`}>
            </ExerciseCard>
            
            <ExerciseCard 
              taskIcon='algo-icon.png'
              title='Algotithms'
              descriprion={algoProgress+`/4 blocks completed`}>
            </ExerciseCard>
        </div>
     <div className="flex justify-center w-full">
        <Button className='m-10 mx-auto' variant='progress'>View Progress</Button>
      </div>
      </PageLayout>
    ); 
};

export default Menu;