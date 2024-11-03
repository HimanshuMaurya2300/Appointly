'use server'

import { db } from "@/lib/prisma"
import { auth, clerkClient } from "@clerk/nextjs/server"

export async function updateUsername(username) {

    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthorized")
    }

    const existingUername = await db.user.findUnique({
        where: {
            username
        }
    })

    if (existingUername && existingUername.id !== userId) {
        throw new Error("Username already taken")
    }

    await db.user.update({
        where: {
            clerkUserId: userId
        },
        data: {
            username
        }
    })

    await clerkClient().users.updateUser(userId, {
        username
    })

    return { success: true }
}

export async function getUserByUsername(username) {

    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            events: {
                where: {
                    isPrivate: false
                },
                orderBy: {
                    createdAt: 'desc'
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    isPrivate: true,
                    _count: {
                        select: {
                            bookings: true
                        }
                    }
                }
            }
        }
    })

    return user
}