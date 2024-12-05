

export const BadgeList = ({
    badges
}: {
    badges: string[]
}) => {
    return (
        <div className="flex flex-row gap-2">
            {badges.map((badge) => {
                return (
                    <div className="px-3 py-[5px] bg-systemGray6 border-systemGray4 border-[1px] rounded-full" key={badge}>
                        <h1 className="text-primaryText text-sm">{badge}</h1>
                    </div>
                )
            })}
        </div>
    )
}
