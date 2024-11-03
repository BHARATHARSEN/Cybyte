import { Component } from '@angular/core';
import { RouterService } from '../router.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private routerService: RouterService) {}

  navigateTo(route: string): void {
    this.routerService.navigateTo(route);
  }

}
