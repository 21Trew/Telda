import { Component, OnInit } from '@angular/core';
import moment from 'moment'; // Use default import
import { Router } from '@angular/router';
import { NgForOf } from '@angular/common';

interface Day {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasTasks: boolean;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  standalone: true,
  imports: [
    NgForOf
  ],
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  currentMonth = moment();
  days: Day[] = [];
  selectedDate: string = localStorage.getItem('selectedDate') || moment().format('YYYY-MM-DD');

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.generateCalendar();
  }

  generateCalendar(): void {
    const startOfMonth = this.currentMonth.clone().startOf('month').startOf('week');
    const endOfMonth = this.currentMonth.clone().endOf('month').endOf('week');
    this.days = [];

    let date = startOfMonth.clone();
    while (date.isBefore(endOfMonth)) {
      this.days.push({
        date: date.format('YYYY-MM-DD'),
        day: date.date(),
        isCurrentMonth: date.month() === this.currentMonth.month(),
        isToday: date.isSame(moment(), 'day'),
        hasTasks: this.hasTasks(date.format('YYYY-MM-DD')) // Проверяем наличие задач
      });
      date.add(1, 'day'); // Переходим к следующему дню
    }
  }

  prevMonth(): void {
    this.currentMonth.subtract(1, 'month');
    this.generateCalendar();
  }

  nextMonth(): void {
    this.currentMonth.add(1, 'month');
    this.generateCalendar();
  }

  // Метод для перехода на страницу дня
  selectDay(date: string): void {
    this.router.navigate(['/day', date]); // Навигация на страницу дня
  }

  hasTasks(date: string): boolean {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '{}');
    return !!tasks[date]?.length; // Проверяем, есть ли задачи на эту дату
  }
}
