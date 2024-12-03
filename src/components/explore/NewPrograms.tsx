import { getNewPrograms } from "@/server-actions/program"
import ProgramList from "../user/program/ProgramList";

const NewPrograms = async () => {
    const newPrograms = await getNewPrograms();

    return (
        <ProgramList programs={newPrograms} />
    )
}
export default NewPrograms