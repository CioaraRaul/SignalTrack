import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarShellComponent } from './layout/sidebar-shell/sidebar-shell.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('signaltrack-frontend');
}
