import { Button } from "../../../components/ui/button";
import { Card, CardDescription, CardTitle } from "../../../components/ui/card";

interface ExerciseCardProps {
    taskIcon?: string;
    title?: string;
    descriprion?: string;
    buttonText?: string;
}

export default function ExerciseCard({ taskIcon, title, descriprion, buttonText }: ExerciseCardProps) {
    return (
        <Card className="flex justify-center w-64 align-center flex-col">
            <div
              className="h-30 bg-contain bg-center bg-no-repeat mg-50"
              style={taskIcon ? { backgroundImage: `url('/icons/${taskIcon}')` } : {}}
            />
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            <CardDescription className="text-xl text-center">{descriprion}</CardDescription>
            <Button variant='taskBtn' className="ml-15">{buttonText}</Button>
        </Card>
    ); 
}