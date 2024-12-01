import React, { Suspense, useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { ErrorMessage, Field, Formik } from "formik";

import style from './page.module.css';
import Schema from './Schema';
import { getTaskList } from "@/services/tasksService";

export default function EditTaskForm({
    isOpen, onClose, tasks, idTask, setTasks, setLoading
}) {

    const [btnLoading, setBtnLoading] = useState(false);

    const [taskData, setTaskData] = useState({
        taskId: '',
        taskName: '',
        taskCost: '',
        taskDeadline: new Date().toISOString().split('T')[0],
    });

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    useEffect(() => {
        if (idTask != undefined) {
            const currentTask = tasks.find(task => task.id === idTask);
            if (currentTask) {
                setTaskData({
                    taskId: currentTask.id,
                    taskName: currentTask.name,
                    taskCost: currentTask.cost,
                    taskDeadline: currentTask.deadline_date.split('T')[0],
                });
            }
        }
    }, [idTask, tasks]);

    function handleSubmit(values) {
        setBtnLoading(true);
        setLoading(true);
        fetch(`${BASE_URL}/api/tasks/${idTask}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: values.taskId,
                name: values.taskName,
                cost: values.taskCost,
                deadline_date: values.taskDeadline,
            }),
        })
            .then(async data => {
                if (!data.ok) {
                    const error = await data.json();

                    toast.error(error.error);
                    return;
                }

                toast.success('Tarefa editada com sucesso!');
                await getTaskList().then(result => setTasks(result));
            })
            .catch(() => {
                toast.error('Erro ao editar tarefa!');
            })
            .then(() => {
                setBtnLoading(false);
                setLoading(false);
                onClose();
            })
            ;
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Editar Tarefa {idTask}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Suspense fallback={<div>Carregando...</div>}>
                    {!taskData.taskName ? null :
                        <Formik
                            initialValues={taskData}
                            validationSchema={Schema}
                            enableReinitialize={true}
                            onSubmit={handleSubmit}
                        >
                            {({ handleSubmit }) => {
                                return (
                                    <Form
                                        className={style.form}
                                        onSubmit={handleSubmit}
                                    >
                                        <div>
                                            <Field
                                                type='hidden'
                                                id='taskId'
                                                name='taskId'
                                            />
                                        </div>
                                        <div
                                            className={style.field}
                                        >
                                            <label htmlFor="taskName">Nome da Tarefa:</label>
                                            <Field
                                                type='text'
                                                id='taskName'
                                                name='taskName'
                                                placeholder='Nome da tarefa...'
                                                required
                                            />
                                            <ErrorMessage
                                                name="taskName"
                                                component="div"
                                                className={`
                                                bg-danger fw-bold 
                                                my-1 mx-auto 
                                                p-2
                                                rounded
                                            `}
                                            />
                                        </div>
                                        <div
                                            className={style.field}
                                        >
                                            <label htmlFor="taskCost">Custo da Tarefa:</label>
                                            <Field
                                                type='number'
                                                id='taskCost'
                                                name='taskCost'
                                                required
                                            />
                                            <ErrorMessage
                                                name="taskCost"
                                                component="div"
                                                className={`
                                                bg-danger fw-bold 
                                                my-1 mx-auto 
                                                p-2
                                                rounded
                                            `}
                                            />
                                        </div>
                                        <div className={style.field}>
                                            <label htmlFor="taskDeadline">Data Limite da Tarefa:</label>
                                            <Field
                                                type='date'
                                                id='taskDeadline'
                                                name='taskDeadline'
                                                required
                                            />
                                            <ErrorMessage
                                                name="taskDeadline"
                                                component="div"
                                                className={`
                                                bg-danger fw-bold 
                                                my-1 mx-auto 
                                                p-2
                                                rounded
                                            `}
                                            />
                                        </div>
                                        <Button type="submit" variant="primary" disabled={btnLoading}>

                                            {
                                                btnLoading
                                                    ? (<Spinner animation="border" variant="light" size="sm" />)
                                                    : (<span>Editar Tarefa</span>)
                                            }
                                        </Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    }
                </Suspense>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} disabled={btnLoading}>
                    Fechar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}