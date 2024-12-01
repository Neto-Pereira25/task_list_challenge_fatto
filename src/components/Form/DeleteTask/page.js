import { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getTaskList } from "@/services/tasksService";

export default function DeleteTask({
    isOpen, onClose, tasks, idTask, setTasks, setLoading
}) {

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const [btnLoading, setBtnLoading] = useState(false);

    const handleConfirmDelete = () => {

        const task = tasks.find(task => task.id === idTask);

        if (task != undefined) {
            setBtnLoading(true);
            setLoading(true);
            fetch(`${BASE_URL}/api/tasks/${task.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(async data => {
                    if (!data.ok) {
                        toast.error(`Tarefa ${idTask} não pode ser removida, tente novamente!`);
                        return;
                    }
                    
                    toast.success(`Tarefa ${idTask} removida com sucesso`);
                    await getTaskList().then(result => setTasks(result));
                })
                .catch(() => {
                    toast.error('Erro ao tentar remover tarefa!');
                })
                .then(() => {
                    setBtnLoading(false);
                    setLoading(false);
                    onClose();
                });

        } else {
            toast.error('Essa tarefa não existe');
            setBtnLoading(false);
            onClose();
        }
    }

    return (
        <>
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Deletar Tarefa {idTask}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div>Tem certeza que deseja deltar a tarefa {idTask} ?</div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={btnLoading}>
                        Fechar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}
                        disabled={btnLoading}
                    >
                        {
                            btnLoading
                                ? (<Spinner animation="border" variant="light" size="sm" />)
                                : (<span>Deletar</span>)
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}