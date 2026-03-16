import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "../../../components/ui/card";
import type { ExerciseCardProps } from "../../../types/menuTypes";

export const ExerciseCard : React.FC<ExerciseCardProps> = (
    {
        icon,
        name,
        description,
        progress,
        route
    }
) => {
    return (
        <Card className="flex flex-col items-center justify-center w-full max-w-85 p-6"> 
            <div
              className="h-32 w-32 bg-cover bg-center bg-no-repeat mb-5 rounded-2xl overflow-hidden shadow-sm"
              style={icon ? { backgroundImage: `url('/icons/${icon}')` } : {}}
            />
            <CardTitle className="text-2xl text-center">{name}</CardTitle>
            <CardDescription className="text-xl text-center">{description}</CardDescription>
            <CardContent className="text-xl text-center">{progress}</CardContent>
            <Button variant='taskBtn'>   
                <Link to={'/' + route}>Continue</Link> 
            </Button>
        </Card>
    ); 
}
