import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../../../service/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  standalone: false 
})
export class TodoItemComponent {

  @Input() task!: Todo;

  @Output() deleteRequested = new EventEmitter<number>();
  @Output() toggleRequested = new EventEmitter<Todo>();

  onDeleteClick() {
    this.deleteRequested.emit(this.task.id);
  }

  onToggleComplete() {
    const updated = {
      ...this.task,
      completed: !this.task.completed
    };

    this.toggleRequested.emit(updated);
  }
}