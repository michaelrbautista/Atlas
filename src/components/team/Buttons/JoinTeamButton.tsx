"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Loader2 } from "lucide-react";
import { joinTeam, leaveTeam } from "@/server-actions/team";
import { useToast } from "../../ui/use-toast";
import { useUserContext } from "@/context";
import LoggedOutJoinButton from "./LoggedOutJoinButton";

const JoinTeamButton = ({
    isJoined,
    teamId
}: {
    isJoined: boolean,
    teamId: string
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isJoinedState, setIsJoinedState] = useState(isJoined)

    const { user: contextUser } = useUserContext();

    const { toast } = useToast();

    const joinTeamClient = async () => {
        setIsLoading(true);

        let { data, error } = await joinTeam(teamId);

        if (error && !data) {
            toast({
                title: "An error occurred.",
                description: error
            })
            return
        }

        setIsLoading(false);
    }

    const leaveTeamClient = async () => {
        setIsLoading(true);

        let response = await leaveTeam(teamId);

        if (response) {
            console.log(response);
            toast({
                title: "An error occurred.",
                description: "Couldn't leave team."
            })
            return
        }

        setIsJoinedState(false);
    }

    if (contextUser) {
        if (isJoinedState) {
            return (
                <Button onClick={leaveTeamClient} variant="secondary" size="full" className="mt-3" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!isLoading && "Joined"}
                </Button>
            )
        } else {
            return (
                <Button onClick={joinTeamClient} variant={isLoading ? "disabled" : "systemBlue"} size="full" className="mt-3" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!isLoading && "Join Team"}
                </Button>
            )
        }
    } else {
        <LoggedOutJoinButton />
    }
}
export default JoinTeamButton