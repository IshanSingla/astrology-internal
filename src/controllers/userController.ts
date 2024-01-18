import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "../types";
import admin from "../services/firebaseAdmin";
import { createContact } from "../services/googleContacts";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    const userData: User = req.body;
    try {
        const user = await prisma.user.create({
            data: {
                name: userData.name,
                mobile_number: userData.mobile_number,
                whatsapp_number: userData.whatsapp_number,
                dob: new Date(userData.dob),
                place_of_birth: {
                    create: userData.place_of_birth,
                },
                series_number: userData.series_number,
            },
        });
        const message = {
            notification: {
                title: 'New User Added',
                body: user.id ?? '',
            },
            topic: 'users' // or you can use a specific device token
        };

        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });

        res.json(user);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('An error occurred:', errorMessage);
        res.status(500).send({
            error: errorMessage,
        });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                place_of_birth: true,
            },
        });
        res.json(users);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('An error occurred:', errorMessage);
        res.status(500).send({
            error: errorMessage,
        });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            include: {
                place_of_birth: true,
            },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('An error occurred:', errorMessage);
        res.status(500).send({
            error: errorMessage,
        });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userData: User = req.body;
    try {
        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                name: userData.name,
                mobile_number: userData.mobile_number,
                whatsapp_number: userData.whatsapp_number,
                dob: new Date(userData.dob),
                place_of_birth: {
                    update: userData.place_of_birth,
                },
                series_number: userData.series_number,
            },
        });

        // Create Google Contacts
        await createContact(userData);
        res.json(user);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('An error occurred:', errorMessage);
        res.status(500).send({
            error: errorMessage,
        });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.json(user);
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error('An error occurred:', errorMessage);
        res.status(500).send({
            error: errorMessage,
        });
    }
};
