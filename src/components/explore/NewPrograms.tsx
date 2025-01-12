import { getNewPrograms } from "@/server-actions/program"
import ProgramList from "../program/user/ProgramList";

const NewPrograms = async () => {
    const newPrograms = await getNewPrograms();

    return (
        <ProgramList programs={newPrograms} />
    )
}

export default NewPrograms