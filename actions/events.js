'use server'

import { eventSchema } from "@/app/lib/validators";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { addDays, addMinutes, format, formatDate, isBefore, parseISO, startOfDay } from 'date-fns'

export async function createEvent(data) {

    const { userId } = await auth()
    // console.log(userId)

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const validateData = eventSchema.parse(data)

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const event = await db.event.create({
        data: {
            ...validateData,
            userId: user.id,
        }
    })

    return event
}

export async function getUserEvents() {

    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const events = await db.event.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            _count: {
                select: {
                    bookings: true
                }
            }
        }
    })

    return { events, username: user.username }
}


export async function deleteEvent(eventId) {

    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const event = await db.event.findUnique({
        where: {
            id: eventId
        }
    })

    if (!event || event.userId !== user.id) {
        throw new Error("Event not found or Unauthorized")
    }

    await db.event.delete({
        where: {
            id: eventId
        }
    })

    return { success: true }
}


export async function getEventDetails(username, eventId) {

    const event = await db.event.findFirst({
        where: {
            id: eventId,
            user: {
                username
            }
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    })

    return event
}


function generateAvailableTimeSlots(startTime, endTime, duration, bookings, dateStr, timeGap = 0) {

    const slots = []

    let currentTime = parseISO(
        `${dateStr}T${startTime.toISOString().slice(11, 16)}`
    )

    const slotEndTime = parseISO(
        `${dateStr}T${endTime.toISOString().slice(11, 16)}`
    )

    const now = new Date()

    if (format(now, 'yyyy-MM-dd') !== dateStr) {
        currentTime = isBefore(currentTime, now) ? addMinutes(now, timeGap) : currentTime
    }

    while (currentTime < slotEndTime) {

        const slotEnd = new Date(currentTime.getTime() + duration * 60000)

        const isSlotAvailable = !bookings.some((booking) => {

            const bookingStart = booking.startTime
            const bookingEnd = booking.endTime

            return (
                (currentTime >= bookingStart && currentTime < bookingEnd) ||
                (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
                (currentTime <= bookingStart && slotEnd >= bookingEnd)
            )
        })

        if (isSlotAvailable) {
            slots.push(format(currentTime, 'HH:mm'))
        }

        currentTime = slotEnd
    }

    return slots
}



export async function getEventAvailability(eventId) {

    const event = await db.event.findUnique({
        where: {
            id: eventId,
        },
        include: {
            user: {
                include: {
                    availability: {
                        select: {
                            days: true,
                            timeGap: true
                        }
                    },
                    bookings: {
                        select: {
                            startTime: true,
                            endTime: true
                        }
                    }
                }
            }
        }
    })

    if (!event || !event.user.availability) {
        return []
    }

    const { availability, bookings } = event.user

    const startDate = startOfDay(new Date())
    const endDate = addDays(startDate, 30)

    const availableDates = []

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {

        const dayofWeek = format(date, 'EEEE').toUpperCase()

        const dayAvailability = availability.days.find((day) => {
            if (day.day === dayofWeek) {
                return day
            }
        })

        if (dayAvailability) {

            const dateStr = formatDate(date, 'yyyy-MM-dd')

            const slots = generateAvailableTimeSlots(
                dayAvailability.startTime,
                dayAvailability.endTime,
                event.duration,
                bookings,
                dateStr,
                availability.timeGap
            )

            availableDates.push({
                date: dateStr,
                slots
            })
        }
    }

    return availableDates
}