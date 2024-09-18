import { Button } from "@/components/ui/button"
import { Tables } from "../../../../database.types"
import { ChevronRight, Plus } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { useState } from "react"
import WorkoutForm from "@/components/workout/WorkoutForm"
import { cn } from "@/lib/utils"
import Link from "next/link"
import WorkoutPage from "@/components/workout/WorkoutPage";

const Day = ({
    programId,
    workouts,
    week,
    day,
    disabled,
    isCreator
}: {
    programId: string,
    workouts: Tables<"workouts">[],
    week: number,
    day: string,
    disabled: boolean,
    isCreator: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);

    if (disabled) {
        return (
            <div className="bg-systemBackground border-r-[1px] flex flex-col gap-2 min-w-32 h-full p-2">
                <div className="flex flex-row justify-between items-center">
                    <p className={cn("text-sm font-semibold", disabled ? "text-systemGray4" : "text-secondaryText")}>{day.charAt(0).toUpperCase()}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div className="bg-systemGray6 border-r-[1px] flex flex-col gap-2 min-w-32 max-w-32 h-full p-2">
                <div className="flex flex-row justify-between items-center">
                    <p className="text-secondaryText text-sm font-semibold p-2">{day.charAt(0).toUpperCase()}</p>
                    {isCreator && (
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger className="hidden sm:flex" asChild>
                            <Button variant="ghost" size="smallIcon">
                                <Plus className="text-secondaryText"></Plus>
                            </Button>
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
                    )}
                </div>
                {/* Workouts */}
                <div className="flex flex-col gap-2">
                    {workouts.map((workout) => {
                        return (
                            <Link href={isCreator ? `/creator/workout/${workout.id}` : `/workout/${workout.id}`} className="bg-systemGray4 rounded-md p-2" key={workout.id}>
                                <p className="text-primaryText text-sm font-semibold truncate">{workout.title}</p>
                            </Link>
                            // <Dialog key={workout.id}>
                            //     <DialogTrigger asChild>
                            //         <Button variant="secondary" size="sm">
                            //             <p className="text-primaryText text-sm font-semibold truncate">{workout.title}</p>
                            //         </Button>
                            //     </DialogTrigger>
                            //     <DialogContent className="max-w-sm sm:max-w-3xl h-5/6 overflow-scroll">
                            //         <DialogHeader>
                            //             <DialogTitle>{workout.title}</DialogTitle>
                            //             <DialogDescription>{workout.description}</DialogDescription>
                            //         </DialogHeader>
                            //         <WorkoutPage workout={workout} />
                            //     </DialogContent>
                            // </Dialog>
                        )
                    })}
                </div>
            </div>
        )
    }
}
export default Day