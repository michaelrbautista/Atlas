"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const getAllSubscriptions = async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("Couldn't get current user.");
        return
    }

    const { data, error } = await supabase
        .from("subscriptions")
        .select(`
            subscribed_to:users!subscriptions_subscribed_to_fkey(
                full_name,
                username,
                bio,
                profile_picture_url
            )
        `)
        .eq("subscriber", user.id)
        .eq("is_active", true)

    if (error && !data) {
        console.log(error)
        throw new Error(error.message)
    }

    return data
}

export const unsubscribeFree = async (subscriber: string, subscribed_to: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("subscriptions")
        .update({
            is_active: false
        })
        .eq("subscriber", subscriber)
        .eq("subscribed_to", subscribed_to)

    if (error && !data) {
        console.log(error)
        return {
            error: error
        }
    }

    return {
        data: data
    }
}

export const redirectToSubscribe = async (username: string) => {
    redirect(`${username}/subscribe`);
}

export const checkPreviousSubscription = async (creatorId: string) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("Couldn't get current user.");
        return
    }

    const { data, error } = await supabase
        .from("subscriptions")
        .select()
        .eq("subscriber", user.id)
        .eq("subscribed_to", creatorId)

    if (error && !data) {
        console.log(error)
        throw new Error(error.message)
    }

    if (data.length > 0) {
        return data[0]
    } else {
        return
    }
}

export const getSubscription = async (creatorId: string) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: Error("Couldn't get current user.")
        }
    }

    const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("subscriptions")
        .select()
        .eq("subscriber", user.id)
        .eq("subscribed_to", creatorId)

    if (subscriptionError && !subscriptionData) {
        return {
            error: subscriptionError.message
        }
    }

    return {
        data: subscriptionData[0]
    }
}

export const subscribeForFree = async (subscriber: string, subscribed_to: string, subscribe_to_username: string) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        console.log("Couldn't get current user.");
        return
    }

    // Check for old subscription
    const { data: checkData, error: checkError } = await supabase
        .from("subscriptions")
        .select()
        .eq("subscriber", subscriber)
        .eq("subscribed_to", subscribed_to)

    if (checkError && !checkData) {
        throw new Error(checkError.message)
    }

    if (checkData.length > 0) {
        // Update subscription
        const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
                tier: "free",
                is_active: true
            })
            .eq("id", checkData[0].id)

        if (updateError) {
            throw new Error(updateError.message)
        }
    } else {
        // Add subscription
        const { error: subscriptionError } = await supabase
            .from("subscriptions")
            .insert({
                subscriber: subscriber,
                subscribed_to: subscribed_to,
                tier: "free",
                is_active: true
            })

        if (subscriptionError) {
            throw new Error(subscriptionError.message)
        }
    }

    // Redirect to subscription profile
    return redirect(`/${subscribe_to_username}`);
}