import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { ErrorMessage, Field, Form, Formik } from "formik";

import style from './page.module.css';
import Schema from "./Schema";
import { getTaskList } from "@/services/tasksService";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function NewTaskForm({
    isOpen, onClose, tasks, setTasks, setLoading
}) {
    const [btnLoading, setBtnLoading] = useState(false);

    const [idValue, setIdValue] = useState(0);

    // Função para cadastrar tarefa
    const handleSubmit = async (values) => {

        const { taskId, taskName, taskCost, taskDeadline } = values

        const taskData = {
            id: taskId,
            name: taskName,
            cost: taskCost,
            deadline_date: taskDeadline
        };

        setBtnLoading(true);
        setLoading(true);
        fetch(`${BASE_URL}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData),
        })
            .then(async data => {
                if (!data.ok) {
                    if (data.status === 400) {
                        const error = await data.json();
                        toast.error(error.error);
                    } else {
                        toast.error('Erro ao cadastrar tarefa!');
                    }
                    return;
                }

                toast.success('Tarefa Cadastrada Com Sucesso!');
                await getTaskList().then(result => setTasks(result));
            })
            .then(async () => await getTaskList()
                .then(result => setTasks(result))
            )
            .catch(error => {
                toast.error('Erro ao cadastrar! Tente novamente!');
                return;
            })
            .then(() => {
                setBtnLoading(false);
                setLoading(false);
                onClose();
            });
    }

    useEffect(() => {
        const lastTask = tasks[tasks.length - 1];

        if (lastTask != undefined) {
            setIdValue(lastTask.id + 1);
        }
    }, [tasks]);

    return (
        <>
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cadastrar Nova Tarefa</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Formik
                        initialValues={{
                            taskId: idValue,
                            taskName: '',
                            taskCost: 0.0,
                            taskDeadline: new Date().toISOString().split('T')[0],
                        }}
                        validationSchema={Schema}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                    >
                        {() => {
                            return (
                                <Form
                                    className={style.form}
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
                                        <label>Nome da Tarefa:</label>
                                        <Field
                                            type='text'
                                            id='taskName'
                                            name='taskName'
                                            placeholder='Nome da tarefa...'
                                        />
                                        <ErrorMessage name="taskName" component="div"
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
                                        <label>Custo da Tarefa:</label>
                                        <Field
                                            type='number'
                                            id='taskCost'
                                            name='taskCost'
                                        />
                                        <ErrorMessage name="taskCost" component="div"
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
                                        <label>Data Limite da Tarefa:</label>
                                        <Field
                                            type='date'
                                            id='taskDeadline'
                                            name='taskDeadline'
                                        />
                                        <ErrorMessage name="taskDeadline" component="div"
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
                                                : (<span>Cadastrar</span>)
                                        }
                                    </Button>
                                </Form>
                            )
                        }}
                    </Formik>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={btnLoading}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>

    );
}