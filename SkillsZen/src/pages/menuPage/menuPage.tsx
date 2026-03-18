/* eslint-disable prefer-const */
import React from 'react';
import PageLayout from '../../components/shared/PageLayout/PageLayout';
import ExerciseCard from './components/exerciseCard';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';


let jsProgress = 0;
let tsProgress = 0;
let algoProgress = 0;
let completedBlocks = 0;

const name = "Alex";

const Menu: React.FC = () => {
    return (
      <PageLayout backgroundImage='main-page-background.png' className='flex items-center'>
        <h2 className='text-center text-4xl text-secondary-foreground'>Welcome, {name}!</h2>
        <p className='text-center text-2xl text-secondary-foreground m-7'>Completed Blocks: {completedBlocks} / 12</p>
        <div className='flex gap-8 justify-center flex-wrap px-4'>
            <ExerciseCard 
              taskIcon='js-icon.png'
              title='JavaScript'
              description={jsProgress+`/4 blocks completed`}
              route='js'>
            </ExerciseCard>

            <ExerciseCard 
              taskIcon='ts-icon.png'
              title='TypeScript'
              description={tsProgress+`/4 blocks completed`}
              route='ts'>
            </ExerciseCard>
            
            <ExerciseCard 
              taskIcon='algo-icon.png'
              title='Algorithms'
              description={algoProgress+`/4 blocks completed`}
              route='algo'>
            </ExerciseCard>
        </div>
     <div className="flex justify-center w-full">
        <Button className='m-10 mx-auto' variant='progress'><Link to={'/stats'}>View Progress</Link></Button>
      </div>
      </PageLayout>
    ); 
};

export default Menu;
