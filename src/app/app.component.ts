import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ApiService } from './shared/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridAngular;
  title = 'angularGridDemoApp';
  searchString = '';
  heroes: any[];
  selectedRows: any[] = [];
  private gridApi;
  private gridColumnApi;


  constructor(private apiService: ApiService){

  }

  searchCtrl = new FormControl();
 
  myForm = new FormGroup({
    search: this.searchCtrl
  });

  gridOptions = {
    defaultColDef: {
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100
    }
    
  };
  

  columnDefs = [
    { field: 'id', checkboxSelection: true },
    { field: 'actualCompany', filter: 'agTextColumnFilter' },
    { field: 'actualJobTitle', filter: 'agTextColumnFilter' },
    { field: 'combinedCandidateName', filter: 'agTextColumnFilter' },
    { field: 'dateCreated',  filter: 'agDateColumnFilter'},
    { field: 'email', filter: 'agTextColumnFilter' },
    { field: 'firstName',  filter: 'agTextColumnFilter'},
    { field: 'lastName', filter: 'agTextColumnFilter' },
    { field: 'level', filter: 'agNumberColumnFilter' }
  ];
  

  ngOnInit(){
    this.getData();

    this.myForm.get("search").valueChanges.subscribe(x => {
      this.onSearchChange(x)
    });

    // var cellDefs = this.agGrid.api.getEditingCells();
    // console.log(cellDefs);
    // if (cellDefs.length > 0) {
    //   var cellDef = cellDefs[0];
    //   console.log(
    //     'editing cell is: row = ' +
    //       cellDef.rowIndex +
    //       ', col = ' +
    //       cellDef.column.getId() +
    //       ', floating = ' +
    //       cellDef.rowPinned
    //   );
    // } else {
    //   console.log('no cells are editing');
    // }
  }

  getData():void{
    this.apiService.getData().subscribe({
      next: result => this.heroes = result.data,
      complete: () => console.log('done')
    });
  }

  onSearchChange(newValue){
    this.apiService.searchBy(newValue).subscribe({
      next: result => this.heroes = result.data,
      complete: () => console.log('done')
    });
  }

  onCellValueChanged($event) {
    console.log($event);
    this.apiService.update($event.data).subscribe({
      next: result => console.log(result),
      complete: () => console.log('done')
    });
  }  

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  

  onSelectionChanged(event) {
    this.selectedRows = this.gridApi.getSelectedRows();
    console.log(this.selectedRows);
    
  }

  delete(){
    return this.selectedRows.map((selectedObj, index) => {
      this.apiService.delete(selectedObj.id).subscribe({
        next: result => {
          if(index + 1 === this.selectedRows.length){
            console.log(index);
            this.getData()
          }
        },
        complete: () => console.log(`${selectedObj.id} deleted.`)
      });
    })
  }
}
