import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
  label: string;
  editing: boolean;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
  label: string;
}


@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-0.30300942518783813, 39.202142770771644);
  public newMarkerLabel: string = '';

  ngAfterViewInit(): void {

    if ( !this.divMap ) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      accessToken: 'pk.eyJ1IjoiY2VzY2FsYmVyb2xhIiwiYSI6ImNtMDJoNWN0dTAxYXUycXNhbXR1cXY2MHAifQ.LvR3aq2hnwRKR-r8qUbYmw',
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.currentLngLat,
      zoom: 13
    });

    this.readFromLocalStorage();

  }


  openMarkerModal() {
    this.newMarkerLabel = '';
    const modalElement = document.getElementById('markerNameModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  saveNewMarker() {
    if (!this.map || !this.newMarkerLabel) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color, this.newMarkerLabel);

    const modalElement = document.getElementById('markerNameModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  addMarker(lngLat: LngLat, color: string, label: string) {
    if ( !this.map ) return;

    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat( lngLat )
      .addTo( this.map );

    this.markers.push({ color, marker, label, editing: false });
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage() );
  }

  deleteMarker( index: number ) {
    this.markers[index].marker.remove();
    this.markers.splice( index, 1 );
    this.saveToLocalStorage();
  }
  addFavorites( index: number ) {
    this.markers[index].marker.remove();
    this.markers.splice( index, 1 );
    this.saveToLocalStorage();
  }

  flyTo( marker: Marker ) {

    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat()
    });
  }

  enableEditing(index: number) {
    this.markers[index].editing = true;
  }

  disableEditing(index: number) {
    this.markers[index].editing = false;
    this.saveToLocalStorage();
  }


  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markers.map( ({ color, marker, label }) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray(),
        label
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ));

  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse( plainMarkersString ); //!Ojo!

    plainMarkers.forEach( ({ color, lngLat, label }) => {
      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker( coords, color, label );
    })

  }


}
