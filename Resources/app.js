// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

//--------------------------------------------------
// Setup UI
//--------------------------------------------------

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create tab1
//
var allWin = Titanium.UI.createWindow({  
    title:'All',
    backgroundColor:'#fff'
});
var allTab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'All',
    window:allWin
});

//
// create tab2
//
var groceryWin = Titanium.UI.createWindow({  
    title:'Grocery',
    backgroundColor:'#fff'
});
var groceryTab = Titanium.UI.createTab({  
    icon:'KS_nav_ui.png',
    title:'Grocery',
    window:groceryWin
});

//
// create tab3
//
var cafeWin = Titanium.UI.createWindow({  
    title:'Cafe',
    backgroundColor:'#fff'
});
var cafeTab = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Cafe',
    window:cafeWin
});

//
//  add tabs
//
tabGroup.addTab(allTab);  
tabGroup.addTab(groceryTab);  
tabGroup.addTab(cafeTab);  

//--------------------------------------------------
// setup database 
//--------------------------------------------------

// connect to db
var placeDB = require('lib/joli').connect('places_in_sanfrancisco'); 

// init database scheme using model
var placeModel = new placeDB.model({  // cafe model definition
  table:    'place',
  columns:  {
    id:                 'INTEGER',
    name:               'TEXT',
    type:        'TEXT'
  }
});

// erase existing tables
placeModel.truncate(); 

// create table on local database
placeDB.models.initialize(); 

//--------------------------------------------------
// insert data
//--------------------------------------------------

var data = new Array(
    { name: 'Cafe Centro', type: 'Cafe' },
    { name: 'Darwin Cafe', type: 'Cafe' },
    { name: 'Coco 500', type: 'Restaurant' },
    { name: 'Koh Samui', type: 'Restaurant' },
    { name: 'Sanraku', type: 'Restaurant' },
    { name: 'Alexsander', type: 'Restaurant' },
    { name: 'Whole Foods', type: 'Grocery' },
    { name: 'Safe Way', type: 'Grocery' }
);

for (i=0; i < data.length; i++) {
    var place = placeModel.newRecord({
					  name: data[i].name,
					  type: data[i].type
				      });
    place.save();
}

//--------------------------------------------------
// read data
//--------------------------------------------------

// all
var allQuery = new placeDB.query()
    .select('place.*')
    .from('place')
    .order(['type asc']);
var allResults = allQuery.execute();

// only grocery
var groceryQuery = new placeDB.query()
    .select('place.*')
    .from('place')
    .where('place.type = ?', 'Grocery')
    .order(['name asc'])
var groceryResults = groceryQuery.execute();

// only cafe
var cafeQuery = new placeDB.query()
    .select('place.*')
    .from('place')
    .where('place.type = ?', 'Cafe')
    .order(['name asc']);
var cafeResults = cafeQuery.execute();

//--------------------------------------------------
// setup table UI using the results
//--------------------------------------------------

allWin.add(results2table(allResults)); 
cafeWin.add(results2table(cafeResults)); 
groceryWin.add(results2table(groceryResults)); 

//--------------------------------------------------
// Show UI
//--------------------------------------------------

// open tab group
tabGroup.open();

//--------------------------------------------------
// Utility functions
//--------------------------------------------------

function results2table(results) {
    var data = new Array();
    for (i = 0; i < results.length; i++) {
	data.push({ title: results[i].get('name') }); 
    }

    return Titanium.UI.createTableView({ data:data });
}