import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardDescription, CardTitle } from "../../../components/ui/card";

interface ExerciseCardProps {
    taskIcon?: string;
    title?: string;
    description?: string;
    route: string
}

export default function ExerciseCard({ taskIcon, title, description, route }: ExerciseCardProps) {
    return (
        <Card className="flex flex-col items-center justify-center w-full max-w-85 p-6">
            <div
              className="h-32 w-32 bg-cover bg-center bg-no-repeat mb-5 rounded-2xl overflow-hidden shadow-sm"
              style={taskIcon ? { backgroundImage: `url('/icons/${taskIcon}')` } : {}}
            />
            <CardTitle className="text-2xl text-center">{title}</CardTitle>
            <CardDescription className="text-xl text-center">{description}</CardDescription>
            <Button variant='taskBtn'>         
                <Link to={`/${route}`}>Continue</Link>
            </Button>
        </Card>
    ); 
}
