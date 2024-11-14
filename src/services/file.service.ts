import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import type { TuiFileLike } from '@taiga-ui/kit';

interface SelectedFile {
  file: TuiFileLike | null;
  textValue: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private selectedFileSubject = new BehaviorSubject<SelectedFile | null>(null);
  selectedFiles$ = this.selectedFileSubject.asObservable();

  setSelectedFile(file: TuiFileLike | null, textValue: string | null): void {
    const selectedFile: SelectedFile = { file, textValue };
    this.selectedFileSubject.next(selectedFile);
  }
}
