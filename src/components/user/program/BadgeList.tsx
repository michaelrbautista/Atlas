import { Badge } from "@/components/ui/badge"


export const BadgeList = ({
    badges
}: {
    badges: string[]
}) => {
    return (
        <div className="flex flex-row gap-5">
            {badges.map((badge) => {
                return (
                    <Badge variant="secondary" key={badge}>{badge}</Badge>
                )
            })}
        </div>
    )
}
