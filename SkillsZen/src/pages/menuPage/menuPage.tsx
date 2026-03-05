import React from 'react';
import PageLayout from '../../shared/components/PageLayout/PageLayout';
import { Input } from '../../components/ui/input';
import ExerciseCard from '../../shared/exerciseCard';


const Menu: React.FC = () => {
    return (
      <PageLayout backgroundImage='main-page-background.png'>
        <Input type='search' placeholder="Search"></Input>
        <h2 className='text-center m-20 text-4xl text-secondary-foreground'>Choose Your Path</h2>
        <div className='flex'>
            <ExerciseCard></ExerciseCard>
        </div>
      </PageLayout>
    ); 
};

export default Menu;