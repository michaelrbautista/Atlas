import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import WorkoutForm from "./WorkoutForm"
import { useState } from "react";
import { Label } from "@/components/ui/label";


const AddWorkoutButton = ({
    programId,
    week,
    day
}: {
    programId: string,
    week: number,
    day: string
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="hidden sm:flex" asChild>
                <Button variant="ghost">+ Add workout</Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
                <SheetHeader>
                    <SheetTitle>New Workout</SheetTitle>
                    <SheetDescription>
                        Week: {week}<br/>
                        Day: {day.charAt(0).toUpperCase() + day.slice(1)}
                    </SheetDescription>
                </SheetHeader>
                <WorkoutForm programId={programId} week={week} day={day} setIsOpen={setIsOpen} />
            </SheetContent>
        </Sheet>
    )
}

export default AddWorkoutButton