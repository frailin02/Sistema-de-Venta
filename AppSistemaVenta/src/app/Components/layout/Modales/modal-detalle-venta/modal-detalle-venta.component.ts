import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from 'src/app/Interfaces/venta';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
import { VentaService } from 'src/app/Services/venta.service';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit {

  fechaRegistro: string = "";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string = "";

  detalleVenta: DetalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total']
  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {

    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.detalleVenta;
    this.total = this.calculateTotalVenta(this.detalleVenta);

  }

  ngOnInit(): void {
    console.log("Total en ngOnInit: ", this.total);
  }
  calculateTotal(precioTexto: string, cantidad: number): string {
    const precio = parseFloat(precioTexto);
    return (precio * cantidad).toFixed(2);
  }

  calculateTotalVenta(detalleVenta: DetalleVenta[]): string { 
    let total = 0;
   detalleVenta.forEach(d => { 
    const precio = parseFloat(d.precioTexto || "0");
     total += precio * (d.cantidad || 0); 
    }); 
    return total.toFixed(2); }




}

