import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { TuiFileLike } from '@taiga-ui/kit';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private selectedFileSubject = new BehaviorSubject<TuiFileLike | null>(null);
  selectedFile$ = this.selectedFileSubject.asObservable();

  setSelectedFile(file: TuiFileLike | null): void {
    this.selectedFileSubject.next(file);
  }
}
