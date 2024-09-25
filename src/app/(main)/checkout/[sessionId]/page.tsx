

const ReturnPage = async () => {
    return (
        <div className="flex flex-col w-full sm:max-w-3xl px-5 py-20 sm:py-10 gap-10 sm:gap-10">
            <div className="flex flex-col items-center gap-5">
                <p className="text-primaryText text-3xl font-bold">Payment has been submitted.</p>
                <p className="text-secondaryText text-base font-semibold text-center">
                    Once approved, you will be able to view the program in the “Programs” tab or in the iOS app (Atlas: Health and Fitness).
                    If you have any issues, please reach out to mrbautistadev@gmail.com.
                </p>
            </div>
        </div>
    )
}
export default ReturnPage