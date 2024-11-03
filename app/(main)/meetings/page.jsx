import React, { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserMeetings } from '@/actions/meetings'
import MeetingList from '@/components/MeetingList'


export const metadata = {
    title: 'Your Meetings | Appointly',
    description: 'View and managed your upcoming and past meetings with ease.',
}

async function UpcomingMeetings() {

    const meetings = await getUserMeetings('upcoming')

    return (
        <MeetingList
            meetings={meetings}
            type={"upcoming"}
        />
    )
}

async function PastMeetings() {

    const meetings = await getUserMeetings('past')

    return (
        <MeetingList
            meetings={meetings}
            type={"past"}
        />
    )
}

const MeetingPage = () => {
    return (
        <Tabs defaultValue="upcoming">
            <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="w-full">
                <Suspense fallback={<div>Loading upcoming meetings...</div>}>
                    <UpcomingMeetings />
                </Suspense>
            </TabsContent>
            <TabsContent value="past">
                <Suspense fallback={<div>Loading past meetings...</div>}>
                    <PastMeetings />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}

export default MeetingPage