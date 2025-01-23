"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function getCreatorPrograms() {
    const supabase = createClient();

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
        return {
            error: "Couldn't get creator."
        }
    }

    const { data: programsData, error: programsError } = await supabase
        .from("programs")
        .select()
        .eq("created_by", currentUser.id)

    if (programsError && !programsData) {
        return {
            error: programsError.message
        }
    }

    return {
        data: programsData
    }
}

export async function addPriceId(priceId: string) {
    const supabase = createClient();

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
        console.log("Couldn't get current user.");
        return
    }

    const { error } = await supabase
        .from("users")
        .update({ stripe_price_id: priceId })
        .eq("id", currentUser.id)

    if (error) {
        return {
            error: error.message
        }
    }
}

export async function updateStripeAccountId(stripeAccountId: string) {
    const supabase = createClient();

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
        console.log("Couldn't get current user.");
        return
    }

    const { error } = await supabase
        .from("users")
        .update({ stripe_account_id: stripeAccountId })
        .eq("id", currentUser.id)

    if (error) {
        console.log("Error updating user's stripe account id.");
    }
}

export async function updateStripePaymentsEnabled(stripeAccountId: string, payments_enabled: boolean) {
    const supabase = createClient();

    const { data: { user: currentUser } } = await supabase.auth.getUser()

    if (!currentUser) {
        console.log("Couldn't get current user.");
        return
    }

    const { error } = await supabase
        .from('users')
        .update({ payments_enabled: payments_enabled })
        .eq('id', currentUser.id)

    if (error) {
        console.log("Error updating user's stripe payments status.");
    }
}

export async function redirectWhenChangingView(viewChangingTo: "user" | "creator") {
    if (viewChangingTo == "user") {
        return redirect("/creator/team");
    } else {
        return redirect("/home");
    }
}

export async function redirectToLibrary() {
    return redirect("/creator/library");
}

export async function redirectToHome() {
    return redirect("/explore");
}

export async function redirectToTeam() {
    return redirect("/creator/team");
}
