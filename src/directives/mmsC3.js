'use strict';
 angular.module('mms.directives')
    .directive('mmsC3', ['ElementService', 'UtilsService', 'TableService', '$compile', 'growl','$window', mmsC3]);
function mmsC3(ElementService, UtilsService, TableService, $compile, growl, $window) {
      
  var mmsChartLink = function(scope, element, attrs, mmsViewCtrl) {
   
    var c3 = $window.c3;
    scope.rowHeaders=[]; //not null when render is called 1st time.      
    var d3 = $window.d3;  
    var svg = d3.select(element[0])
      .append('div');
    
    var processed = false;
    var ws = scope.mmsWs;
    var version = scope.mmsVersion;
    if (mmsViewCtrl) {
        var viewVersion = mmsViewCtrl.getWsAndVersion();
        if (!ws)
            ws = viewVersion.workspace;
        if (!version)
            version = viewVersion.version;
    }
    function vf_pplot(_columns, _index, _is_x_value_number, _has_column_header) {

     
      svg.append('div').attr("id", 'c3chart' + _index);
      var c3json = {
         bindto: '#c3chart' + _index,
         data: {
          columns:  _columns, //including column heading
        }
      };
      //Data
      if (scope.c3datanames)
        c3json.data.names = JSON.parse( scope.c3datanames.replace(/'/g, '"')); 
      if (scope.c3dataclasses)
        c3json.data.classes = JSON.parse( scope.c3dataclasses.replace(/'/g, '"')); 
      
      if (scope.c3datalabelsformat){
        if (c3json.data.labels === undefined) c3json.data.labels = {};
        console.log(scope.c3datalabelsformat);
        c3json.data.labels.format = eval("(" + scope.c3datalabelsformat + ")");
        console.log(c3json.data.labels.format);
      }
      else if (scope.c3datalabels)
        c3json.data.labels = Boolean(scope.c3datalabels);
      
      if (scope.c3dataxs)
        c3json.data.xs = JSON.parse( scope.c3dataxs.replace(/'/g, '"'));
      
      if (scope.c3dataaxes){
        c3json.data.axes = JSON.parse( scope.c3dataaxes.replace(/'/g, '"')); 
      }
      //temporary remove to test multiple xyline
      if ( _has_column_header && scope.c3dataxs === undefined){
        c3json.data.x = 'x';  
      }
      //x or xs
      if (_is_x_value_number === false && scope.c3dataxs === undefined){ //row 1 is heading but not numbers (column0 is ignored)
           if (c3json.axis === undefined)  c3json.axis = {};
           if (c3json.axis.x === undefined) c3json.axis.x = {};
           c3json.axis.x.type = 'category';
      }
      if ( scope.c3gridylines !== undefined){
        if (c3json.grid === undefined) c3json.grid = {};
        if (c3json.grid.y === undefined) c3json.grid.y = {};
        c3json.grid.y.lines = JSON.parse( scope.c3gridylines.replace(/'/g, '"'));
      }
      if ( scope.c3axisy2show !== undefined){
        if (c3json.axis === undefined) c3json.axis = {};
        if (c3json.axis.y2 === undefined) c3json.axis.y2 = {};
        c3json.axis.y2.show = Boolean(scope.c3axisy2show);
      }
      if ( scope.c3axisxlabel !== undefined){
          if (c3json.axis === undefined) c3json.axis = {};
          if (c3json.axis.x === undefined) c3json.axis.x = {};
          c3json.axis.x.label = scope.c3axisxlabel;
      }
      if ( scope.c3axisylabel !== undefined){
          if (c3json.axis === undefined) c3json.axis = {};
          if (c3json.axis.y === undefined) c3json.axis.y = {};
          c3json.axis.y.label = scope.c3axisylabel;
      }
      if ( scope.c3datatype !== undefined) 
        c3json.data.type = scope.c3datatype;
      if ( scope.c3datatypes !== undefined ) {//mix, scope.c3datatypes defined
        //{'a1':'step', 'a2':'area-step'}
        //to
        //{"a1":"step", "a2":"area-step"}
        c3json.data.types = JSON.parse( scope.c3datatypes.replace(/'/g, '"'));
      }
      if (scope.c3datagroups !== undefined){
        console.log("scope.c3datagroups");
        c3json.data.groups = JSON.parse( scope.c3datagroups.replace(/'/g, '"'));
      }
      if ( scope.c3dataregions !== undefined){
        //modify
        // {'a1':[{'start':1, 'end':2, 'style':'dashed'},{'start':3}],'a2':[{'end':3}]}
        //to 
        //{"a1":[{"start":1, "end":2, "style":"dashed"},{"start":3}],"a2":[{"end":3}]}
        c3json.data.regions = JSON.parse(scope.c3dataregions.replace(/'/g, '"'));
      }
      //bar - width or ratio
      if ( scope.c3barwidth !== undefined){
        c3json.bar = {};
        c3json.bar.width = {};
        c3json.bar.width = scope.c3barwidth;
      } else if ( scope.c3barwidthratio !== undefined){
        c3json.bar = {};
        c3json.bar.width = {};
        c3json.bar.width.ratio = scope.c3barwidthratio;
      }
    
    var json = JSON.stringify(c3json);
    console.log(json);
    var chart = c3.generate(c3json);
    

    var zz2 = {bindto:'#c3chart' + _index ,
    data: {
        columns: [
            ['data1', 30, 20, 50, 40, 60, 50],
            ['data2', 200, 130, 90, 240, 130, 220],
            ['data3', 300, 200, 160, 400, 250, 250],
            ['data4', 200, 130, 90, 240, 130, 220],
            ['data5', 130, 120, 150, 140, 160, 150],
            ['data6', 90, 70, 20, 50, 60, 120],
        ],
        type: 'line',
        types: {
            data3: 'bar',
            data4: 'bar',
            data6: 'area',
        },
        groups: [
            ['data3','data4']
        ]
    }
  };

    //var json2 = JSON.stringify(zz);
    //console.log(json2);
    //c3.generate(zz);

	}//end of vf_pplot()

  scope.render = function() {

    if (scopetableColumnHeadersLabel.length === 0) return;
      svg.selectAll('*').remove();
      
	/*console.log("columnHeader");  
	console.log(scopetableColumnHeadersLabel);
	console.log("rowHeader");
	console.log(scope.tableRowHeaders);
	console.log("datavalues");
	console.log(scope.datavalues);
	*/  
	var is_x_value_number = true;  //column headings are number (not check 1st column)
  var has_column_header = true;
  var start_index; //0 if column header is included as data, -1 if column header is not included as data
  for ( var k = 0; k < scopeTableIds.length; k++){
		var c3_data=[];

    console.log("scope.c3dataxs" + scope.c3dataxs);
    if ( scope.c3dataxs === undefined) {
      c3_data[0] = ['x'].concat(scopetableColumnHeadersLabel[k]);
      start_index = 0;
    }
    else {//Assume if xs is defined, no column header
      has_column_header = false;
      start_index = -1;
    }
    //console.log("not a number?: ");
    //console.log(isNaN(scopetableColumnHeadersLabel[k][0]));
    if (isNaN(scopetableColumnHeadersLabel[k][0]))
      is_x_value_number = false;

    for ( var i = 0; i < scope.datavalues[k].length; i++){
	     var c3_data_row=[];
       
      for ( var j = 0; j < scope.datavalues[k][i].length; j++){
			  if (scope.datavalues[k][i][j].specialization.value[0].type === "LiteralString"){
          c3_data_row[j] = Number(scope.datavalues[k][i][j].specialization.value[0].string);
        }
        else if (scope.datavalues[k][i][j].specialization.value[0].type === "LiteralReal"){
          c3_data_row[j] = scope.datavalues[k][i][j].specialization.value[0].double;
        }
        else if (scope.datavalues[k][i][j].specialization.value[0].type === "LiteralInteger"){
           c3_data_row[j] = scope.datavalues[k][i][j].specialization.value[0].integer;
        }
      } //end of j
     	c3_data[1+start_index++] = [scope.tableRowHeaders[k][i].name].concat(c3_data_row);
    } //end of i
    ////////////////////temporary remove column header///////////////
    /*var temp = [];
    for (var jj = 1; jj < c3_data.length; jj++){
      temp[jj-1] = c3_data[jj];
    }
    c3_data = temp;
    if ( c3_data.length === 5)
    */
    console.log("c3_data");
    console.log(c3_data);
    //////////////////////////////////
    vf_pplot(c3_data, k, is_x_value_number, has_column_header); //c3_columns
   }//end of k (each table)
  };//end of render

    scope.$watch('datavalues', function(newVals, oldVals) {
        return scope.render();
    }, true);
      
    var scopeTableTitles=[];
    var scopeTableIds = [];
    var scopetableColumnHeadersLabel= [];
    var dataIdFilters = [];

    TableService.readTables (scope.mmsEid,ws, version)
      .then(function(value) {
        scopeTableTitles = value.tableTitles;
        scopeTableIds = value.tableIds;
        scopetableColumnHeadersLabel = value.tableColumnHeadersLabels;
        scope.tableRowHeaders = value.tableRowHeaders;
        scope.datavalues = value.datavalues; //[][] - array
        dataIdFilters = value.dataIdFilters;
      });
    }; //end of link

    return {
      restrict: 'EA',
      require: '?^mmsView',
       scope: {
        mmsEid: '@',
        c3datanames: '@',
        c3dataclasses: '@',
        c3datagroups:  '@',
        c3dataaxes: '@',
        c3datatype: '@',
        c3datatypes: '@',
        c3datalabels: '@',
        c3datalabelsformat: '@',
        c3barwidth: '@',
        c3barwidthratio: '@',
        c3dataregions: '@',
        c3dataxs: '@',
        c3axisy2show: '@',
        c3axisxlabel: '@',
        c3axisylabel: '@',
        c3gridylines: '@'
      },
      link: mmsChartLink
    }; //return
}



