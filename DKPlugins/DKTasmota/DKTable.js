/////////////////////////////////////////////////////////////////////////
DKCreateTable = function(parent, top, bottom, left, right, width, height) {
    var table = document.createElement('table');
    table.style.position = "absolute";
    table.style.top = top;
    table.style.left = left;
    //table.style.bottom = bottom;
    //table.style.right = right;
    table.style.width = width;
    table.style.height = height;
    //table.setAttribute('border', '1');
    parent.appendChild(table);
    return table;
}

//////////////////////////////////
DKTableInsertRow = function(table) {
    return table.insertRow(-1);
}

////////////////////////////////////////
DKTableInsertCell = function(table, row) {
    var cell = row.insertCell(-1);
    cell.id = String.fromCharCode(65 + (cell.cellIndex)) + (row.rowIndex + 1);
    //cell.innerHTML = cell.id; //For debugging
    return cell;
}

///////////////////////////////
DKTableAddRow = function(table) {
    var row = DKTableInsertRow(table);
    row_count = table.rows.length;
    row.id = "row" + row_count;
    var cell_count = table.rows[0].cells.length;
    if (!cell_count) {
        cell_count = 1;
    }
    for (var n = 0; n < cell_count; n++) {
        var cell = DKTableInsertCell(table, row);
    }
    return table.rows.length;
    //return the created row number
}

//////////////////////////////////
DKTableAddColumn = function(table) {
    var row_count = table.rows.length;
    if (!row_count) {
        var row = DKTableInsertRow(table);
        row_count = 1;
    }
    var cell_count = table.rows[0].cells.length;
    for (n = 0; n < row_count; n++) {
        var cell = DKTableInsertCell(table, table.rows[n]);
    }
    return table.rows[0].cells.length;
    //return the created column number
}

///////////////////////////////////////
DKTableAddRows = function(table, count) {
    for (var r = 0; r < count; r++) {
        DKTableAddRow(table);
    }
    return table.rows.length;
}

//////////////////////////////////////////
DKTableAddColumns = function(table, count) {
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

///////////////////////////////////////////////////
DKTableGetCell = function(table, rowNum, columnNum) {
    var row = table.rows[rowNum];
    var cell = row.cells[columnNum];
    return cell;
}

//////////////////////////////////////////////////////
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

/* Some Debugging tests
DKLoadJSFile("DKTable.js", function(){
	var body = document.getElementsByTagName('body')[0];
	var table = DKCreateTable("20px", "20px", "100px", "100px", body);
	var row_count = DKTableAddRows(table, 10);
	dkConsole.log(+row_count+" rows");
	var column_count = DKTableAddColumns(table, 9);
	dkConsole.log(+column_count+" columns");
	var row = DKTableInsertRow(table);
	var cell = DKTableInsertCell(table, row);
	var row12 = DKTableInsertRow(table);
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
