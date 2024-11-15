"use client";

import { redirectToPost } from '@/server-actions/post';
import { ChevronRight, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tables } from '../../../database.types';
import ProgramItem from '../program/ProgramItem';

export type CreatorFetchedPost = {
    created_at: string;
    created_by: string;
    id: string;
    program_id: string | null;
    text: string | null;
    workout_id: string | null;
    workouts: {
        id: string;
        title: string;
        description: string | null;
    } | null;
    programs: {
        id: string;
        title: string;
        price: number;
        description: string | null;
        image_url: string | null;
    } | null
}

const CreatorPostItem = ({
    post,
    user
}: {
    post: CreatorFetchedPost,
    user: Tables<"users">
}) => {
    return (
        <div onClick={() => {redirectToPost(post.id)}} className="flex flex-row gap-5 p-5 border-b-[1px] cursor-pointer">
            {(!user.profile_picture_url) ? (
                // Replace with placeholder image
                <div className="bg-systemGray5 shrink-0 h-[40px] w-[40px] rounded-full flex items-center justify-center">
                    <Users className="text-secondaryText h-4" />
                </div>
            ) : (
                <Image
                    className="h-[40px] w-[40px] rounded-full"
                    height={40}
                    width={40}
                    src={user.profile_picture_url}
                    alt="programImage"
                    style={{objectFit: "cover"}}
                    priority
                />
            )}
            <div className="flex flex-col gap-2">
                <p className="text-primaryText font-bold text-lg">{user.full_name}</p>
                <p className="text-primaryText font-normal text-base">{post?.text}</p>
                {/* Workout or program reference */}
                {post.workouts && (
                    <Link href={`/creator/workout/${post.workouts?.id}`} key={post.workouts?.id} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                        <div className="">
                            <p className="text-primaryText font-bold">{post.workouts?.title}</p>
                            <p className="text-secondaryText line-clamp-2">{post.workouts?.description}</p>
                        </div>
                        <ChevronRight />
                    </Link>
                )}
                {post.programs && (
                    <ProgramItem
                        id={post.programs.id}
                        title={post.programs.title}
                        imageUrl={post.programs.image_url ?? undefined}
                        price={post.programs.price}
                        description={post.programs.description ?? undefined}
                        userFullName={user.full_name}
                    />
                )}
            </div>
        </div>
    )
}
export default CreatorPostItem