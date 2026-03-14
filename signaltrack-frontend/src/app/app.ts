import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarShellComponent } from './layout/sidebar-shell/sidebar-shell.component';
import { AlertPanelComponent } from './features/alerts/alert-panel/alert-panel.component';
import { AlertToastComponent } from './shared/components/alert-toast/alert-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarShellComponent, AlertPanelComponent, AlertToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('signaltrack-frontend');
}
