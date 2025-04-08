import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Section{
  title: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private currentSectionSubject = new BehaviorSubject<Section>({ title: '', id: '' }); // Default empty
  public currentSection$: Observable<Section> = this.currentSectionSubject.asObservable();

  setCurrentSection(section: Section) {
    this.currentSectionSubject.next(section);
  }
}
