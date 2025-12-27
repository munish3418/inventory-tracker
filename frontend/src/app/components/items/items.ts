// src/app/components/items/items.ts
import { Component, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemService, Item } from '../../services/item';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items.html',
  styleUrls: ['./items.css']
})
export class Items implements OnInit {
  items: Item[] = [];
  newItemName = '';
  editingItemId: number | null = null;
  editedName = '';
  currentUserId: number | null = null;

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.userService.getCurrentUserId();
    console.log('ItemsComponent: currentUserId =', this.currentUserId);

    if (!this.currentUserId) {
      console.warn('No current user ID found!');
      return;
    }

    this.loadItems();
  }

  trackById(index: number, item: Item): number {
    return item.id;
  }

  loadItems(): void {
    if (this.currentUserId === null) return;

    this.itemService.getItems().subscribe({
  next: (data: Item[]) => {
    this.ngZone.run(() => {
      this.items = data;
      this.cdr.detectChanges();
    });
  },
  error: (err) => console.error('Load items error:', err)
});
  }

  addItem(): void {
    if (!this.newItemName.trim() || this.currentUserId === null) return;

this.itemService.addItem(this.newItemName).subscribe({
  next: (createdItem: Item) => {
    this.ngZone.run(() => {
      this.items = [...this.items, createdItem];
      this.newItemName = '';
      this.cdr.detectChanges();
    });
  },
  error: (err: unknown) => console.error('Add item error:', err)
});
  }

  deleteItem(id: number): void {
    this.itemService.deleteItem(id).subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.items = this.items.filter(item => item.id !== id);
          this.cdr.detectChanges();
        });
      },
      error: (err: unknown) => console.error('Delete item error:', err)
    });
  }

  startEdit(item: Item): void {
    this.editingItemId = item.id ?? null;
    this.editedName = item.name;
  }

  saveEdit(id: number): void {
    if (!this.editedName.trim() || this.currentUserId === null) return;

    this.itemService.updateItem(id, this.editedName, this.currentUserId).subscribe({
      next: (updatedItem: Item) => {
        this.ngZone.run(() => {
          const index = this.items.findIndex(i => i.id === id);
          if (index > -1) {
            this.items[index] = updatedItem; // update full item in UI
          }
          this.editingItemId = null;
          this.cdr.detectChanges();
        });
      },
      error: (err: unknown) => console.error('Update item error:', err)
    });
  }

  cancelEdit(): void {
    this.editingItemId = null;
  }
}