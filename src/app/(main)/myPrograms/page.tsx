import CreateProgramButton from "../../../components/(programs)/createProgramButton";

const MyPrograms = () => {

    return (
        <div className="h-full w-full sm:max-w-5xl px-5 py-20 md:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-3xl font-bold">My Programs</p>
                <CreateProgramButton></CreateProgramButton>
            </div>
        </div>
    );
}
 
export default MyPrograms;