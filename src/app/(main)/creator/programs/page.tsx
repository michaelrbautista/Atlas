import CreateProgramButton from "../../../../components/(program)/CreateProgramButton";

const MyPrograms = () => {

    // Get user, if they have a team id then show create program button

    return (
        <div className="h-full w-full sm:max-w-4xl px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">My Programs</p>
                <CreateProgramButton></CreateProgramButton>
            </div>
        </div>
    );
}
 
export default MyPrograms;