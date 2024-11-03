"use client";

import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/app/lib/validators";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    // console.log(user);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(usernameSchema),
    });

    // Only set the username value when user is loaded and username exists
    useEffect(() => {
        if (isLoaded && user?.username) {
            setValue("username", user.username);
        }
    }, [isLoaded, user?.username, setValue]);

    const {
        loading: loadingUpdates,
        data: upcomingMeetings,
        fn: fnUpdates,
    } = useFetch(getLatestUpdates);

    useEffect(() => {
        if (isLoaded) {  // Only fetch updates when user is loaded
            (async () => await fnUpdates())();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]); // Add isLoaded to dependency array

    const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

    const onSubmit = async (data) => {
        await fnUpdateUsername(data.username);
    };

    // Add loading state handling
    if (!isLoaded) {
        return (
            <div className="flex justify-center space-y-8">
                <BarLoader color="#36d7b7" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.firstName}!</CardTitle>
                </CardHeader>
                <CardContent>
                    {!loadingUpdates ? (
                        <div className="space-y-6 font-light">
                            <div>
                                {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {upcomingMeetings?.map((meeting) => (
                                            <li key={meeting.id}>
                                                {meeting.event.title} on{" "}
                                                {format(
                                                    new Date(meeting.startTime),
                                                    "MMM d, yyyy h:mm a"
                                                )}{" "}
                                                with {meeting.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No upcoming meetings</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Loading updates...</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Unique Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span>{window.location.origin}/</span>
                                <Input {...register("username")} placeholder="username" />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
                            )}
                        </div>
                        {loading && (
                            <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                        )}
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            Update Username
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}