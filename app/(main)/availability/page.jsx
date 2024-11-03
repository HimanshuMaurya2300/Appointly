import React from "react";
import { getUserAvailability } from "@/actions/availability";
import { defaultAvailability } from "./data";
import AvailabilityForm from "@/components/AvailabilityForm";

export default async function AvailabilityPage() {

    const availability = await getUserAvailability();

    return <AvailabilityForm initialData={availability || defaultAvailability} />;
}