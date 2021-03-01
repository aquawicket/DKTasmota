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
    var table = document.createElement('table');
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

////////////////////////////////////////
DKTableInsertRow = function(table, name) {
    if(!name){
    	//FIXME: why is dkConsole unavailable?
	    if(dkConsole){
	        dkConsole.error("DKTableInsertRow(): name parameter invalid");
	    }
    	else{
	        console.error("DKTableInsertRow(): name parameter invalid");
        }
    }
    var row = table.insertRow(-1);
    row.id = "row" + table.rows.length;
    row.setAttribute("name", name);
    return row;
}

//////////////////////////////////////////////
DKTableInsertCell = function(table, row, name) {
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
    var cell = row.insertCell(-1);
    cell.id = String.fromCharCode(65 + (cell.cellIndex)) + (row.rowIndex + 1);
    cell.setAttribute("name", name);
    return cell;
}

//////////////////////////////////////////////////
DKTableAddRow = function(table, rowName, cellName) {
    var row = DKTableInsertRow(table, rowName);
    row.id = "row" + table.rows.length;
    //dkconsole.debug("DKTableAddRow() -> row.id = "+row.id);
    row_count = table.rows.length;

    var cell_count = table.rows[0].cells.length;
    if (!cell_count) {
        cell_count = 1;
    }
    for (var n = 0; n < cell_count; n++) {
    	//Grab the name of the cell from the root column cell if it exists
    	//if(!table.rows[0]){
    	//	console.error("DKTableAddRow(): table.rows[0] is invalid");
    	//	return;
    	//}
    	if(!cellName){
    		cellName = table.rows[0].cells[n].getAttribute("name");
    	}
        var cell = DKTableInsertCell(table, row, cellName);
        //FIXME: The function above is NOT setting the cellName properly.
        //This line is a temporary fix for now. 
        cell.setAttribute("name", table.rows[0].cells[n].getAttribute("name"));
    }
    return row;
}

////////////////////////////////////////
DKTableAddColumn = function(table, name) {
    var row_count = table.rows.length;
    if (!row_count) {
        //FIXME: no name attribute for the row
        var row = DKTableInsertRow(table/*, name*/);
        row_count = 1;
    }
    var cell_count = table.rows[0].cells.length;
    for (n = 0; n < row_count; n++) {
        var cell = DKTableInsertCell(table, table.rows[n], name);
    }
    //return the created column number
    return table.rows[0].cells.length;
}

///////////////////////////////////////
DKTableAddRows = function(table, count) {
    //The rows added will have no name
    for (var r = 0; r < count; r++) {
        DKTableAddRow(table);
    }
    return table.rows.length;
}

//////////////////////////////////////////
DKTableAddColumns = function(table, count) {
    //The columns added will have no name
    for (var c = 0; c < count; c++) {
        DKTableAddColumn(table);
    }
    return table.rows[0].cells.length;
}

//////////////////////////////////////////
DKTableDeleteRow = function(table, number) {
    table.deleteRow(number);
    DKTableUpdateIds(table);
}

/////////////////////////////////////////////
DKTableDeleteColumn = function(table, number) {
    for (var r = 0; r < table.rows.length; r++) {
        var row = table.rows[r];
        if (row.cells[number]) {
            row.deleteCell(number - 1);
        }
    }
    DKTableUpdateIds(table);
}

//////////////////////////////////
DKTableUpdateIds = function(table) {
    for (var r = 0; r < table.rows.length; r++) {
        var row = table.rows[r]
        row.id = "row" + (r + 1);
        for (var c = 0; c < row.cells.length; c++) {
            var cell = row.cells[c];
            cell.id = String.fromCharCode(65 + (cell.cellIndex)) + (row.rowIndex + 1);
            //cell.innerHTML = cell.id; //For debug
        }
    }
}

//////////////////////////////////////////////////////////
DKTableGetCellByIndex = function(table, rowNum, columnNum) {
    var row = table.rows[rowNum];
    var cell = row.cells[columnNum];
    return cell;
}

////////////////////////////////////////////////////////
DKTableDeleteCell = function(table, rowNum, columnNum) {
    dkConsole.log("DKTableDeleteCell(table," + rowNum + "," + columnNum + ")")
    //FIXME: This doesn't seem to be working properly.
    //I'm using Brave browser which is a fork of chromium.
    //Bug? or user error? 
    dkConsole.log("DKTableDeleteCell(" + rowNum + "," + columnNum + ")");
    var row = table.rows[rowNum];
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
    for (var r = 0; r < table.rows.length; r++) {
        if (!table.rows[r].getAttribute("name")) {
            dkConsole.log("WARNING: row" + r + " has no name attribute");
            return;
        }
        if (table.rows[r].getAttribute("name") == rowName) {
            var row = table.rows[r];
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

    for (var r = 0; r < table.rows.length; r++) {
        if (!table.rows[r].getAttribute("name")) {
            dkConsole.log("WARNING: row" + r + " has no name attribute");
            return;
        }
        if (table.rows[r].getAttribute("name") == rowName) {
            var row = table.rows[r];
            //if the column name wasn't requested, return the row 
            if(!columnName){ return row; }

            for (var c = 0; c < row.cells.length; c++) {
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

/* Some Debugging tests
DKLoadJSFile("DKTable.js", function(){
	var body = document.getElementsByTagName('body')[0];
	var table = DKCreateTable("20px", "20px", "100px", "100px", body);
	var row_count = DKTableAddRows(table, 10);
	dkConsole.log(+row_count+" rows");
	var column_count = DKTableAddColumns(table, 9);
	dkConsole.log(+column_count+" columns");
	var row = DKTableInsertRow(table, name);
	var cell = DKTableInsertCell(table, row);
	var row12 = DKTableInsertRow(table, name);
	var cellA12 = DKTableInsertCell(table, row12);
	var cellB12 = DKTableInsertCell(table, row12);
	var rows = DKTableAddRows(table, 5);
	var columns = DKTableAddColumns(table, 4);
	var cellC12 = row12.insertCell(3);
	var row6 = table.insertRow(6);
	DKTableUpdateIds(table);
	//DKTableDeleteRow(table, 13);
	//DKTableDeleteColumn(table, 10);
	//DKTableDeleteCell(table, 4, 4);
	var cell = DKTableGetCell(table, 3, 6);
	cell.innerHTML = ":)";
});
*/
