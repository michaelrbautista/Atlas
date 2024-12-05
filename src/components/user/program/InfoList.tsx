
export type InfoItem = {
    header: string,
    info: string
}

export const InfoList = ({
    infoItems
}: {
    infoItems: InfoItem[]
}) => {
    return (
        <div className="flex flex-col gap-5 w-full">
            {infoItems.map((item) => {
                return (
                    <div className="flex flex-col lg:flex-row lg:gap-10" key={item.header}>
                        <h1 className="text-secondaryText text-sm lg:w-[100px]">{item.header}</h1>
                        <p className="text-primaryText text-sm">{item.info}</p>
                    </div>
                )
            })}
        </div>
    )
}
