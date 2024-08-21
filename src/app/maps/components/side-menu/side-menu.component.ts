import { Component } from '@angular/core';


interface MenuItem {
  name : string;
  route: string;
}
@Component({
  selector: 'maps-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  public menuItems: MenuItem[] = [
    { route: 'fullscreen', name: 'Pantalla Completa' },
    { route: 'markers',    name: 'Marcadores' },
    { route: 'properties', name: 'Favoritos' },
  ];

}
