import { Component } from '@angular/core';
import { TodoService, Todo } from '../../../service/todo.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  standalone: false
})
export class TodoListComponent {

  isAddingMode = false;
  taskForm: FormGroup;
  filteredTasks$: Observable<Todo[]>;

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.filteredTasks$ = this.todoService.filteredTasks$;

    this.route.url.subscribe(() => {
      const current = this.route.snapshot.routeConfig?.path || 'all';
      this.todoService.setFilter(current);
    });

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]]
    });
  }

  toggleMode() {
    this.isAddingMode = !this.isAddingMode;
    if (!this.isAddingMode) this.taskForm.reset();
  }

  submitTask() {
    if (this.taskForm.valid) {
      const { title, description } = this.taskForm.value;
      this.todoService.addTask(title, description);
      this.toggleMode();
    }
  }

  deleteTaskFromList(id: any) {
    this.todoService.deleteTask(id);
  }

  onToggleTask(task: Todo) {
    this.todoService.updateTask(task);
  }

  onSearch(event: any) {
    this.todoService.updateSearchTerm(event.target.value);
  }

  trackById(index: number, item: Todo) {
    return item.id;
  }
}