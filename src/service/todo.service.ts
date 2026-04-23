import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';

export interface Todo {
  id: any; 
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = 'http://localhost:3000/todos';

  private tasksSubject = new BehaviorSubject<Todo[]>([]);
  private searchTermSubject = new BehaviorSubject<string>('');
  private filterTypeSubject = new BehaviorSubject<string>('all');

  filteredTasks$ = combineLatest([
    this.tasksSubject.asObservable(),
    this.searchTermSubject.asObservable().pipe(debounceTime(300), distinctUntilChanged()),
    this.filterTypeSubject.asObservable()
  ]).pipe(
    map(([tasks, term, filter]) => {

      let filtered = tasks;

      // search
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(term.toLowerCase()) ||
        (t.description?.toLowerCase().includes(term.toLowerCase()))
      );

      // filter
      if (filter === 'completed') {
        filtered = filtered.filter(t => t.completed);
      }

      return filtered;
    })
  );

  constructor(private http: HttpClient) {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<Todo[]>(this.apiUrl)
      .subscribe(data => this.tasksSubject.next(data));
  }

  addTask(title: string, description: string) {
  const newTask: any = { 
    title, 
    description, 
    completed: false,
    createdAt: new Date() 
  };

  this.http.post<Todo>(this.apiUrl, newTask)
    .subscribe(savedTask => {
      this.tasksSubject.next([savedTask, ...this.tasksSubject.value]);
    });
}

 updateTask(task: Todo) {
  this.http.put<Todo>(`${this.apiUrl}/${task.id}`, task)
    .subscribe(updated => {
      const updatedList = this.tasksSubject.value.map(t =>
        t.id === updated.id ? updated : t
      );

      this.tasksSubject.next(updatedList);
    });
}

  deleteTask(id: any) {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => {
        const updated = this.tasksSubject.value.filter(t => t.id !== id);
        this.tasksSubject.next(updated);
      });
  }

  updateSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setFilter(type: string) {
    this.filterTypeSubject.next(type);
  }
}