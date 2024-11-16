import { Injectable } from '@angular/core';//декоратор
import { BehaviorSubject } from 'rxjs';// для хранения и передачи текущего значения
import type { TuiFileLike } from '@taiga-ui/kit';//тип файла используемый в тайге

interface SelectedFile {
  file: TuiFileLike | null;
  textValue: string | null;
}
//декоратор нужен для внедрения в другие компоненты или сервисы
@Injectable({
  providedIn: 'root'//параметр для доступа во всем приложении
})
export class FileService {
  //свойство selectedFileSubject происходит от BehaviorSubject
  private selectedFileSubject = new BehaviorSubject<SelectedFile | null>(null);
  //selectedFiles$ поток данных на которые можно подписаться
  selectedFiles$ = this.selectedFileSubject.asObservable();
//в метод setSelectedFile приходят два параметра
  setSelectedFile(file: TuiFileLike | null, textValue: string | null): void {
    const selectedFile: SelectedFile = { file, textValue };
    //методом next обновляем текущее значение потока
    this.selectedFileSubject.next(selectedFile);
  }
}
