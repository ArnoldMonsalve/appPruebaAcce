import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from 'src/app/services/category';
import { NavController } from '@ionic/angular';

import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonItem, IonLabel, IonInput, IonModal, IonButtons,
  IonIcon, ToastController, Platform, IonSelect, IonSelectOption,
  IonCheckbox,IonNote
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, add, checkboxOutline, squareOutline, pencil, arrowForward,alertCircleOutline } from 'ionicons/icons';import { TaskDto } from 'src/app/models/task.model';
import { CategoryDto } from 'src/app/models/category.model';
import { TaskService } from 'src/app/services/task';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonButton, IonItem, IonLabel, IonInput,
    IonIcon, IonSelect, IonSelectOption,
    IonCheckbox,IonModal, IonButtons,IonNote
  ]
})
export class TasksPage implements OnInit {
  tasks: TaskDto[] = [];
  categories: CategoryDto[] = [];
  newTaskTitle: string = '';
  selectedCategoryId?: number;

  isEditModalOpen = false;
  editingTask: TaskDto | null = null;
  editTaskTitle: string = '';
  editTaskCategoryId?: number;

  isConfirmModalOpen = false;
  taskToDelete: TaskDto | null = null;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private toastController: ToastController,
    private platform: Platform,
    private navCtrl: NavController
  ) {
    addIcons({
    trash,
    add,
    pencil,
    'arrow-forward': arrowForward,
    'checkbox-outline': checkboxOutline,
    'square-outline': squareOutline,
    'alert-circle': alertCircleOutline
  });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadData();
    });
  }

  // Se ejecuta cada vez que entro a la ventana
  ionViewWillEnter() {
    this.loadData();

    if(this.categories.length== 0 ){
      this.showToast('Por favor, debe crear una categoria antes de registrar tareas.', 'warning');
    }
  }

  loadData() {
    this.categories = this.categoryService.getCategories();
    this.tasks = this.taskService.getTasks();
  }

  addTask() {
    if (!this.newTaskTitle.trim() || !this.selectedCategoryId) {
      this.showToast('Escribe la tarea y selecciona una categoría', 'warning');
      return;
    }

    this.taskService.addTask(this.newTaskTitle, this.selectedCategoryId);
    this.newTaskTitle = '';
    this.tasks = this.taskService.getTasks();
    this.showToast('Tarea agregada!', 'success');
  }

  toggleTask(taskId: number) {
    this.taskService.toggleTask(taskId);
    this.tasks = this.taskService.getTasks();
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
    this.tasks = this.taskService.getTasks();
    this.showToast('Tarea eliminada', 'danger');
  }

  getCategoryName(id?: number): string {
    if (id === undefined || id === null) return 'Sin categoría';
    const category = this.categories.find(c => c.id === id);
    return category ? category.name : 'Sin categoría';
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  goToCategorys() {
    this.navCtrl.navigateForward('/categorys');
  }

  openEditModal(task: TaskDto) {
    this.editingTask = { ...task }; // Copia para no alterar la original antes de tiempo
    this.editTaskTitle = task.title;
    this.editTaskCategoryId = task.categoryId;
    this.isEditModalOpen = true;
  }

  saveEdit() {
    if (this.editingTask && this.editTaskTitle.trim() && this.editTaskCategoryId) {
      this.taskService.editTask(
        this.editingTask.id,
        this.editTaskTitle,
        this.editTaskCategoryId
      );
      this.loadData();
      this.isEditModalOpen = false;
      this.showToast('Tarea actualizada correctamente', 'success');
    }
  }

  openConfirmModal(task: TaskDto) {
    this.taskToDelete = task;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.taskToDelete = null;
  }

  confirmDeleteTask() {
    if (this.taskToDelete) {
      this.taskService.deleteTask(this.taskToDelete.id);
      this.loadData(); // Refresca la lista de tareas
      this.closeConfirmModal();
      this.showToast('Tarea eliminada', 'danger');
    }
  }

}
