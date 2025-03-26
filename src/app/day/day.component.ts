import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {
  date: string = '';
  tasks: Task[] = [];
  newTaskText: string = '';
  searchQuery: string = '';
  isCompletedTasksVisible: boolean = false; // Флаг для сворачивания/разворачивания выполненных задач
  editingTaskId: number | null = null; // ID задачи, которую редактируем
  editedTaskText: string = ''; // Новый текст задачи

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.date = this.route.snapshot.paramMap.get('date') || '';
    this.loadTasks();
  }

  loadTasks(): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    this.tasks = tasks[this.date] || [];
  }

  saveTasks(): void {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    tasks[this.date] = this.tasks;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  addTask(): void {
    if (!this.newTaskText.trim()) return;
    this.tasks.push({ id: Date.now(), text: this.newTaskText, completed: false });
    this.newTaskText = '';
    this.saveTasks();
  }

  toggleTask(task: Task): void {
    task.completed = !task.completed;
    this.saveTasks();
  }

  deleteTask(task: Task): void {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.saveTasks();
  }

  filteredTasks(completed: boolean): Task[] {
    return this.tasks
      .filter(task => task.completed === completed && task.text.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  // Метод для переключения видимости выполненных задач
  toggleCompletedTasks(): void {
    this.isCompletedTasksVisible = !this.isCompletedTasksVisible;
  }

  goToCalendar(): void {
    this.router.navigate(['/calendar']);
  }

  editTask(task: Task): void {
    this.editingTaskId = task.id;
  }

  onBlur(task: Task, event: FocusEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && target.innerText.trim()) {
      this.saveEditedTask(task, target.innerText);
    } else {
      // Если текст пустой, отменяем редактирование
      this.cancelEdit();
    }
  }

  saveEditedTask(task: Task, newText: string): void {
    if (this.editingTaskId === task.id && newText.trim()) {
      task.text = newText;
      this.saveTasks();
    }
    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingTaskId = null;
  }

  isEditing(task: Task): boolean {
    return this.editingTaskId === task.id;
  }
}
