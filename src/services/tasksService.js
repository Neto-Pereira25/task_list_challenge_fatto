require('dotenv').config();

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTaskList() {

    const result = await fetch(`${BASE_URL}/api/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!result.ok) {
        throw new Error('Erro ao obter a lista');
    }

    return result.json();
}
