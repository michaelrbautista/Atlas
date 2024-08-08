const UserInfo = ({ fullName, username }: { fullName: string, username: string }) => {
    return (
        <div className="flex flex-col">
            <p className="text-foreground text-lg font-bold">{fullName}</p>
            <p className="text-muted-foreground text-sm font-bold">@{username}</p>
        </div>
    );
}
 
export default UserInfo;