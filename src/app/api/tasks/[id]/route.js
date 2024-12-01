import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
    try {
        const data = await request.json();
        const { name, cost, deadline_date } = data;
        const id = parseInt(params.id);

        if (!id || !name || (!cost && cost != 0) || !deadline_date) {
            return NextResponse.json(
                { error: 'Todos os campos são requeridos' },
                { status: 400 }
            );
        }

        // Verificando se tarefa existe
        const taskExists = await prisma.task.findUnique({
            where: { id },
        });

        if (!taskExists) {
            return NextResponse.json(
                { error: 'Tarefa não encontrada' },
                { status: 404 }
            );
        }

        // Verificando se o novo nome já pertence a outra tarefa
        const taskWithSameName = await prisma.task.findFirst({
            where: {
                name,
                id: { not: id }
            }
        });

        if (taskWithSameName) {
            return NextResponse.json(
                { error: 'Esta tarefa já está cadastrada' },
                { status: 400 }
            );
        }

        // Editando a tarefa
        const editedTask = await prisma.task.update({
            where: { id },
            data: {
                name,
                cost: parseFloat(cost),
                deadline_date: new Date(deadline_date),
            },
        });

        return NextResponse.json(editedTask, { status: 200 })

    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao atualizar a tarefa!' },
            { status: 500 },
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);
        
        if (!id) {
            return NextResponse.json(
                { error: 'ID é requerido' },
                { status: 400 }
            );
        }

        const task = await prisma.task.findUnique({
            where: { id }
        });

        // Verificando se a tarefa existe
        if (!task) {
            return NextResponse.json(
                { error: 'Tarefa não encontrada' },
                { status: 404 }
            );
        }

        // Excluindo a tarefa
        await prisma.task.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: 'Tarefa removida com sucesso' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Erro ao remover tarefa' },
            { status: 500 }
        );
    }
}
