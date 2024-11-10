import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import type {TuiFileLike} from '@taiga-ui/kit';
import {TuiFiles} from '@taiga-ui/kit';
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
  protected readonly control = new FormControl<TuiFileLike | null>(null);

  protected removeFile(): void {
    this.control.setValue(null);

  }
//выбираем файл и отправляем в файл-сервис для хранения
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile)
    this.fileService.setSelectedFile(this.selectedFile);
  }
}
