import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import type {TuiFileLike} from '@taiga-ui/kit';
import {TuiFiles} from '@taiga-ui/kit';
import type {Observable} from 'rxjs';
import {finalize, map, of, Subject, switchMap, timer} from 'rxjs';
import {FileService} from "../services/file.service";
import {File} from "../photo-upload/photo-upload.component";

@Component({
  selector: 'app-input-files',
  standalone: true,
  exportAs: "app-input-files",
  imports: [AsyncPipe, NgIf, ReactiveFormsModule, TuiFiles],
  templateUrl: './input-files.component.html',
  styleUrl: './input-files.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InputFilesComponent {
  constructor(private fileService: FileService) {}
  selectedFile: File | null = null;
//ниже код из TUI
  protected readonly control = new FormControl<TuiFileLike | null>(
    null,
    Validators.required,
  );

  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadedFiles$ = this.control.valueChanges.pipe(
    switchMap((file) => this.processFile(file)),
  );

  protected removeFile(): void {
    this.control.setValue(null);
  }

  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);

    if (this.control.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    return timer(1000).pipe(
      map(() => {
        if (Math.random() > 0.5) {
          return file;
        }

        this.failedFiles$.next(file);

        return null;
      }),
      finalize(() => this.loadingFiles$.next(null)),
    );
  }
//выбираем файл и отправляем в файл-сервис для хранения
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.fileService.setSelectedFile(this.selectedFile);
  }
}
