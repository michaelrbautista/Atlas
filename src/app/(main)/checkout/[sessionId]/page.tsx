import Image from "next/image"

const ReturnPage = async () => {
    return (
        <div className="flex flex-col w-full max-w-2xl px-5 py-20 sm:py-10 gap-10 sm:gap-10">
            <div className="flex flex-col items-center gap-5">
                <p className="text-primaryText text-3xl font-bold text-center">Payment has been submitted.</p>
                <p className="text-secondaryText text-base font-semibold text-center">
                    Once approved, you will be able to view the program in the “Programs” tab or in the iOS app.
                    If you have any issues, please reach out to mrbautistadev@gmail.com.
                </p>
                <a target="_blank" href="https://apps.apple.com/us/app/atlas-health-and-fitness/id6484401731" rel="noopener noreferrer">
                    <Image layout="intrinsic" src="/appstoreicon.svg" width={150} height={150} alt="web"></Image>
                </a>
            </div>
        </div>
    )
}
export default ReturnPage