import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClassListPage } from './class-list';

@NgModule({
  declarations: [
    ClassListPage,
  ],
  imports: [
    IonicPageModule.forChild(ClassListPage),
  ],
})
export class ClassListPageModule {}
