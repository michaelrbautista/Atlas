"use client"

import { Button } from "../ui/button"
import Link from "next/link"

const ManagePaymentsButton = () => {
    return (
        <Button
            variant="secondary"
            size="sm"
            asChild
        >
            <Link
                target="_blank"
                href="https://dashboard.stripe.com"
                rel="noopener noreferrer"
            >
                Manage payments
            </Link>
        </Button>
    )
}
export default ManagePaymentsButton