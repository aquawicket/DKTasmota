"use strict";

// https://developer.mozilla.org/en-US/docs/Web/API/HTMLTableElement

//The idea is to create a name for every row and every column.
//Currently, we cannot create a column name as eazy as we create row names
//We can name a row, but we have to name each cell in a column.
//This idea: pull a cell, row or column, just from names.
//If by chance a row or column moves, the naming scheme will still work.
// GetIndex(row, column) works until cells are moved and point to different cells.
// GetCellByName(rowName, CellName) should always return the correct cell 
// no matter where it is in the index chart. 

// Example:  DKGetCell("Peter", "Address");
// This should return the cell that is on the Peter Row and the Address Column
// If we add and remove rows or colums, this method should stay functional
// We can do this without altering id's and indexs using rowName and ColumnNama attributes

// (fName) | (age) | (address)   |  (email)
//------------------------------------------------------
//  David  |  28   | 123 Fun St  |  Dave@silly.com
//------------------------------------------------------
//  Mary   |  31   |  P.O. 567   |  Mar02@grape.com
//------------------------------------------------------
//  Peter  |  25   |  464 Go ln. |  PeterDotson@abc.com
//------------------------------------------------------
//  John   |  47   | 09 till pk. |  Johnboy1@mail.com

// The rowName is set to Peter on the <tr> element
// The columnName is set to address on the <td> element

/////////////////////////////////////////////////////////////////////////////
function DKCreateTable(parent, id, top, bottom, left, right, width, height) {
    let table = document.createElement('table');
    table.id = id;
    table.style.position = "absolute";
    table.style.top = top;
    table.style.bottom = bottom;
    table.style.left = left;
    table.style.right = right;
    table.style.width = width;
    table.style.height = height;
    //table.setAttribute('border', '1');
    parent.appendChild(table);
    return table;
}

//////////////////////////////////////
function DKTableInsertRow(table, name) {
    if(!name){
    	//FIXME: why is dkConsole unavailable?
	    if(dkConsole){
	        dkConsole.error("DKTableInsertRow(): name parameter invalid");
	    }
    	else{
	        console.error("DKTableInsertRow(): name parameter invalid");
        }
    }
    let row = table.insertRow(-1);
    row.id = "row" + table.rows.length;
    row.setAttribute("name", name);
    return row;
}

////////////////////////////////////////////
function DKTableInsertCell(table, row, name) {
	if(!name){
    	//FIXME: why is dkConsole unavailable?
	    if(dkconsole){
	        dkconsole.error("DKTableInsertCell(): name parameter invalid");
	    }
    	else{
    		console.trace();
	        console.error("DKTableInsertCell(): name parameter invalid");
        }
    }
    let cell = row.insertCell(-1);
    cell.id = String.fromCharCode(65 + (cell.cellIndex)) + (row.rowIndex + 1);
    cell.setAttribute("name", name);
    return cell;
}

////////////////////////////////////////////////
function DKTableAddRow(table, rowName, cellName) {
    let row = DKTableInsertRow(table, rowName);
    row.id = "row" + table.rows.length;
    //dkconsole.debug("DKTableAddRow() -> row.id = "+row.id);
    let row_count = table.rows.length;

    let cell_count = table.rows[0].cells.length;
    if (!cell_count) {
        cell_count = 1;
    }
    for (let n = 0; n < cell_count; n++) {
    	//Grab the name of the cell from the root column cell if it exists
    	//if(!table.rows[0]){
    	//	console.error("DKTableAddRow(): table.rows[0] is invalid");
    	//	return;
    	//}
    	if(!cellName){
    		cellName = table.rows[0].cells[n].getAttribute("name");
    	}
        let cell = DKTableInsertCell(table, row, cellName);
        //FIXME: The function above is NOT setting the cellName properly.
        //This line is a temporary fix for now. 
        cell.setAttribute("name", table.rows[0].cells[n].getAttribute("name"));
    }
    return row;
}

//////////////////////////////////////
function DKTableAddColumn(table, name) {
    let row_count = table.rows.length;
    if (!row_count) {
        //FIXME: no name attribute for the row
        let row = DKTableInsertRow(table/*, name*/);
        row_count = 1;
    }
    let cell_count = table.rows[0].cells.length;
    for (let n = 0; n < row_count; n++) {
        let cell = DKTableInsertCell(table, table.rows[n], name);
    }
    //return the created column number
    return table.rows[0].cells.length;
}

/////////////////////////////////////
function DKTableAddRows(table, count) {
    //The rows added will have no name
    for (let r = 0; r < count; r++) {
        DKTableAddRow(table);
    }
    return table.rows.length;
}

////////////////////////////////////////
function DKTableAddColumns(table, count) {
    //The columns added will have no name
    for (let c = 0; c < count; c++) {
        DKTableAddColumn(table);
    }
    return table.rows[0].cells.length;
}

////////////////////////////////////////
function DKTableDeleteRow(table, number) {
    table.deleteRow(number);
    DKTableUpdateIds(table);
}

///////////////////////////////////////////
function DKTableDeleteColumn(table, number) {
    for (let r = 0; r < table.rows.length; r++) {
        let row = table.rows[r];
        if (row.cells[number]) {
            row.deleteCell(number - 1);
        }
    }
    DKTableUpdateIds(table);
}

////////////////////////////////
function DKTableUpdateIds(table) {
    for (let r = 0; r < table.rows.length; r++) {
        let row = table.rows[r]
        row.id = "row" + (r + 1);
        for (let c = 0; c < row.cells.length; c++) {
            let cell = row.cells[c];
            cell.id = String.fromCharCode(65 + (cell.cellIndex)) + (row.rowIndex + 1);
            //cell.innerHTML = cell.id; //For debug
        }
    }
}

function DKTableGetCellByIndex(table, rowNum, columnNum) {
    let row = table.rows[rowNum];
    let cell = row.cells[columnNum];
    return cell;
}

////////////////////////////////////////////////////
function DKTableDeleteCell(table, rowNum, columnNum) {
    dkConsole.log("DKTableDeleteCell(table," + rowNum + "," + columnNum + ")")
    //FIXME: This doesn't seem to be working properly.
    //I'm using Brave browser which is a fork of chromium.
    //Bug? or user error? 
    dkConsole.log("DKTableDeleteCell(" + rowNum + "," + columnNum + ")");
    let row = table.rows[rowNum];
    //row.deleteCell(columnNum);
    document.removeElement(row.cells[columnNum]);
}

//////////////////////////////
function DKTableGetIndex(cell) {
    return cell.cellIndex;
}

////////////////////////////////////////////
function DKTableGetRowByName(table, rowName){
	return DKTableGetCellByNames(table, rowName);
	/*
    for (let r = 0; r < table.rows.length; r++) {
        if (!table.rows[r].getAttribute("name")) {
            dkConsole.log("WARNING: row" + r + " has no name attribute");
            return;
        }
        if (table.rows[r].getAttribute("name") == rowName) {
            let row = table.rows[r];
            return row;
        }
    }
    */
}
//////////////////////////////////////////////////////////
function DKTableGetCellByNames(table, rowName, columnName) {
    //TODO: We would like to retrieve a cell by names
    // Example:  DKGetCell("Peter", "Address");
    // This should return the cell that is on the Peter Row and the Address Column
    // If we add and remove rows or colums, this method should stay functional
    // We can do this without altering id's and indexs using rowName and ColumnNama attributes

    // (fName) | (age) | (address)   |  (email)
    //------------------------------------------------------
    //  David  |  28   | 123 Fun St  |  Dave@silly.com
    //------------------------------------------------------
    //  Mary   |  31   |  P.O. 567   |  Mar02@grape.com
    //------------------------------------------------------
    //  Peter  |  25   |  464 Go ln. |  PeterDotson@abc.com
    //------------------------------------------------------
    //  John   |  47   | 09 till pk. |  Johnboy1@mail.com

    // The rowName is set to Peter on the <tr> element
    // The columnName is set to address on the <td> element

    for (let r = 0; r < table.rows.length; r++) {
        if (!table.rows[r].getAttribute("name")) {
            dkConsole.log("WARNING: row" + r + " has no name attribute");
            return;
        }
        if (table.rows[r].getAttribute("name") == rowName) {
            let row = table.rows[r];
            //if the column name wasn't requested, return the row 
            if(!columnName){ return row; }

            for (let c = 0; c < row.cells.length; c++) {
                if (!row.cells[c].getAttribute("name")) {
                    dkConsole.log("WARNING: row" + r + ", cell" + c + " has no name attribute");
                    return;
                }
                if (row.cells[c].getAttribute("name") == columnName) {
                    return row.cells[c];
                    //we found the cell, return it's element
                }
            }
        }
    }
}
