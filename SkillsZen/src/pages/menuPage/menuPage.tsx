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
        <h2 className='text-center m-10 text-4xl text-secondary-foreground'>Welcome, {name}!</h2>
        <p className='text-center m-20 text-3xl text-secondary-foreground'>Completed Blocks: {completedBlocks} / 12</p>
        <div className='flex gap-40 justify-center'>
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
        <Button className='m-10 ml-117' variant='progress'>View Progress</Button>
      </PageLayout>
    ); 
};

export default Menu;