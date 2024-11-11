import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { Venta } from 'src/app/Interfaces/venta';
import { VentaService } from 'src/app/Services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { finalize } from 'rxjs/operators';
import { DetalleVenta } from 'src/app/Interfaces/detalle-venta';
export const MY_DATA_FORMATS={
  parse:{
    dateInput:'DD/MM/YYYY'
  },
  display:{
    dateInput:'DD/MM/YYYY',
    monthYearLabel:'MMMM YYYY'
  }
}

@Component({
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.css'],
  providers:[
    {provide:MAT_DATE_FORMATS, useValue:MY_DATA_FORMATS}
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {


  formularioBusqueda: FormGroup;
  opcionesBusqueda:any[]=[
    {value:"fecha",descripcion:"Por fechas"},
    {value:"numero",descripcion:"Numero venta"}
  ]
  columnasTabla:string[]=['fechaRegistro','numeroDocumento','tipoPago','total','accion']
  dataInicio:Venta[]=[];
  datosListaVenta=new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator)paginacionTabla! :MatPaginator;
  total: string = "";

  constructor(
    private fb:FormBuilder,
    private dialog:MatDialog,
    private _ventaServicio:VentaService,
    private _utilidadServicio:UtilidadService
  ) {
    this.formularioBusqueda=this.fb.group({
      buscarPor:['fecha'],
      numero:[""],
      fechaInicio:[""],
      fechaFin:[""]
    })
    this.formularioBusqueda.get("buscarPor")?.valueChanges.subscribe(value =>{
      this.formularioBusqueda.patchValue({
        numero:"",
        fechaInicio:"",
        fechaFin:""
      })
    })
   }

  ngOnInit(): void {
  }
  
ngAfterViewInit(): void {
  this.datosListaVenta.paginator=this.paginacionTabla;
}

aplicarFiltroTabla(event:Event){
const filterValue = (event.target as HTMLInputElement).value;
this.datosListaVenta.filter=filterValue.trim().toLowerCase();
}

  buscarVentas() {
    let _fechaInicio: string = "";
    let _fechaFin: string = "";
  
    
    if (this.formularioBusqueda.value.buscarPor === "fecha") {
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');
  
      
      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._utilidadServicio.mostrarAlerta("Debe ingresar ambas fechas", "Oops!");
        return;
      }
    }
  
    // Llamada a la API con el operador finalize para asegurar la ejecución
    this._ventaServicio.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).pipe(
      finalize(() => {
        // Aquí podrías agregar cualquier otra acción que desees ejecutar al finalizar la llamada
        console.log("La solicitud de historial ha finalizado.");
      })
    ).subscribe({
      next: (data) => {
        // Actualizar la lista de ventas siempre que haya un valor de data
        this.datosListaVenta = data.value;
        
        // Comprobar si no hay datos
        if (!data.status) {
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops");
        }
      },
      error: (e) => {
        console.error("Error en la solicitud de historial:", e);
      }
    });
  }

 
  

verDetalleVenta(_venta:Venta){
  this.dialog.open(ModalDetalleVentaComponent,{
    data:_venta,
    disableClose:true,
    width: '700px'
  })
}
calculateTotalVenta(detalleVenta: DetalleVenta[]): string { 
  let total = 0; 
  detalleVenta.forEach(d => {
     const precio = parseFloat(d.precioTexto || "0"); 
     total += precio * (d.cantidad || 0);
     }); 
     return total.toFixed(2); }


}
 