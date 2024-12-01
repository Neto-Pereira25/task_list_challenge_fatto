"use client"
import React from 'react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./page.module.css";
import TaskList from '@/components/TaskList/page';
import { FaHeart } from 'react-icons/fa';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TaskList />
        <footer className={styles.footer}>
          <div>Feito com <FaHeart
            className='text-danger'
          /> por José Neto</div>
        </footer>
      </main>
      <ToastContainer autoClose={2000} />
    </div>
  );
}
