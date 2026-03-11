import { Button } from "../../../components/ui/button";
import { Card, CardDescription, CardTitle } from "../../../components/ui/card";

interface ExerciseCardProps {
    taskIcon?: string;
    title?: string;
    descriprion?: string;
}

export default function ExerciseCard({ taskIcon, title, descriprion }: ExerciseCardProps) {
    return (
        <Card className="flex justify-center w-64 align-center flex-col">
            <div
              className="h-32 w-32 bg-cover bg-center bg-no-repeat mb-5 rounded-2xl overflow-hidden shadow-sm"
              style={taskIcon ? { backgroundImage: `url('/icons/${taskIcon}')` } : {}}
            />
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            <CardDescription className="text-xl text-center">{descriprion}</CardDescription>
            <Button variant='taskBtn'>Continue</Button>
        </Card>
    ); 
}