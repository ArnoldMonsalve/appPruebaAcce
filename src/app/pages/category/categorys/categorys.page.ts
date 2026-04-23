import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  IonList, IonItem, IonLabel, IonInput, IonModal, IonButtons,
  IonIcon, ToastController, Platform, IonListHeader
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { trash, pencil, add } from 'ionicons/icons';
import { CategoryDto } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category';
import { ConfigService } from 'src/app/services/config';

@Component({
  selector: 'app-categorys',
  templateUrl: './categorys.page.html',
  styleUrls: ['./categorys.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonButton, IonList, IonItem, IonLabel, IonInput,
    IonModal, IonButtons, IonIcon, IonListHeader
  ]
})
export class CategorysPage implements OnInit {
  categories: CategoryDto[] = [];
  newCategory: string = '';

  // Modales
  isEditModalOpen = false;
  editId?: number;
  editName: string = '';

  showDelete: boolean = true;//para validar el remote config de firebase
  isConfirmModalOpen = false;
  categoryToDelete: CategoryDto | null = null;

  constructor(
    private categoryService: CategoryService,
    private toastController: ToastController,
    private platform: Platform,
    private navCtrl: NavController,
    private ConfigService : ConfigService
  ) {
    addIcons({ trash, pencil, add });
  }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.loadCategories();
    });
  }

  async ionViewWillEnter() {
    this.loadCategories();
    this.showDelete = await this.ConfigService.canDelete();
    console.log('¿Botón eliminar activo?:', this.showDelete);
  }

  loadCategories() {
    this.categories = this.categoryService.getCategories();
  }

  addCategory() {
    const name = this.newCategory.trim();
    if (!name) {
      this.showToast('Por favor, digite la categoría.', 'warning');
      return;
    }
    this.categoryService.addCategory(name);
    this.newCategory = '';
    this.loadCategories();
    this.showToast('Categoría agregada.', 'success');
  }

  openEditModal(cat: CategoryDto) {
    this.editId = cat.id;
    this.editName = cat.name;
    this.isEditModalOpen = true;
  }

  saveEdit() {
    if (!this.editName.trim()) return;
    this.categoryService.editCategory(this.editId!, this.editName);
    this.loadCategories();
    this.isEditModalOpen = false;
    this.showToast('Categoría actualizada.', 'success');
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id);
    this.loadCategories();
    this.showToast('Categoría eliminada.', 'danger');
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

  goToTasks() {
    this.navCtrl.navigateForward('/tasks');
  }

   openConfirmModal(cat: CategoryDto) {
    this.categoryToDelete = cat;
    this.isConfirmModalOpen = true;
  }

  confirmDelete() {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id);
      this.loadCategories();
      this.isConfirmModalOpen = false;
      this.categoryToDelete = null;
      this.showToast('Categoría eliminada correctamente', 'danger');
    }
  }

  closeConfirmModal() {
    this.isConfirmModalOpen = false;
    this.categoryToDelete = null;
  }
}
