
// A map of table ids to their instance columns (or _id if we couldn't pull it)
var display_cols = {"household_member": "name", "femaleClients": "_id", "maleClients": "_id", "exampleForm": "name", "Ethiopia_members": "name", "Tea_types": "Name", "plot": "plot_name", "Tea_inventory": "_id", "geopoints": "_id", "datesTest": "test", "selects": "_id", "visit": "_id", "Ethiopia_household": "household_id", "Tea_houses": "Name"}
// List of tables to edit with formgen. If a table isn't found in this list, we edit it with survey instead
var allowed_tables = ["household_member", "femaleClients", "maleClients", "exampleForm", "Ethiopia_members", "Tea_types", "plot", "Tea_inventory", "geopoints", "datesTest", "selects", "Ethiopia_household", "Tea_houses"];
var customJsOl = function customJsOl() {
	
	var br = function(col, extra) {
		return function(e, c, d) { return "<b>" + col + "</b>: " + c + (extra ? extra : "<br />"); };
	}
	var check = function(col, accepting, type) {
		if (accepting === undefined) {
			accepting = function(e, c, d) {
				return c.toUpperCase() == "YES";
			}
		}
		if (type === undefined) type = "checkbox"
		return function(e, c, d) {
			return "<input disabled type='"+type+"' " + (accepting(e, c, d) ? "checked=checked" : "") + " /><b>" + col + "</b>";
		};
	}
	var selected = function(a, b) {
		if (a == null) return false;
		if (a[0] == "[") {
			return jsonParse(a).indexOf(b) >= 0;
		}
		return a.toUpperCase() == b.toUpperCase();
	}

	main_col = "thName";
	table_id = "Tea_houses";
	global_join = "Tea_types ON Tea_types._id = Tea_houses.Specialty_Type_id"
	global_which_cols_to_select = "*, Tea_types.Name AS ttName, Tea_houses.Name AS thName, (SELECT COUNT(*) FROM Tea_inventory WHERE Tea_inventory.House_id = Tea_houses._id) AS num_teas"
	var opened = function(e, c, d) { return "<b>Opened</b>: " + (c == null ? "" : c).split("T")[0]; };
	colmap = [
		["thName", function(e, c, d) { return c }],
		["State", true],
		["Region", true],
		["District", true],
		["Neighborhood", br("Neighborhood")],
		["ttName", br("Specialty")],
		["Date_Opened", opened],
		["Customers", "Number of Customers: "],
		["Visits", br("Total Number of Visits")],
		["Location_latitude", "Latitude (GPS): "],
		["Location_longitude", br("Longitude (GPS)", "<br /><br /><b>Services</b>:")],
		["Iced", check("Iced")],
		["Hot", check("Hot")],
		["WiFi", function(e, c, d) { return check("WiFi")(e, c, d) + "<br /><h3>Contact Information</h3>"; }],
		["Store_Owner", true],
		["Phone_Number", "Mobile number: "],
		["num_teas", function (e, c, d) {
			odkTables.setSubListView("Tea_inventory", "House_id = ?", [row_id], "config/assets/Tea_inventory_list.html#Tea_inventory/thName = ?/" + d.getData(0, "thName"));
			return "<span onClick='openTeas();' style='color: blue; text-decoration: underline;'>" + c + " tea" + (c.toString() == 1 ? "" : "s") + "</span>";
		}],
	]
	colmap = [
		{"column": "thName", "callback": function(e, c, d) { return c; }},
		{"column": "State"},
		{"column": "Region"},
		{"column": "District"},
		{"column": "Neighborhood", "callback": br("Neighborhood")},
		{"column": "ttName", "callback": br("Specialty")},
		{"column": "Date_Opened", "callback": opened},
		{"column": "Customers", "display_name": "Number of Customers: "},
		{"column": "Visits", "callback": br("Total Number of Visits")},
		{"column": "Location_latitude", "display_name": "Latitude (GPS): "},
		{"column": "Location_longitude", "callback": br("Longitude (GPS)", "<br /><br /><b>Services</b>:")},
		{"column": "Iced", "callback": check("Iced")},
		{"column": "Hot", "callback": check("Hot")},
		{"column": "WiFi", "callback": function(e, c, d) { return check("WiFi")(e, c, d) + "<br /><h3>Contact Information</h3>"; }},
		{"column": "Store_Owner"},
		{"column": "Phone_Number", "display_name": "Mobile number: "},
		{"column": "num_teas", "callback": function(e, c, d) {
			odkTables.setSubListView("Tea_inventory", "House_id = ?", [row_id], "config/assets/Tea_inventory_list.html#Tea_inventory/thName = ?/" + d.getData(0, "thName"));
			return "<span onClick='openTeas();' style='color: blue; text-decoration: underline;'>" + c + " tea" + (c.toString() == 1 ? "" : "s") + "</span>";
		}}
	]
	window.openTeas = function openTeas() {
		odkTables.openTableToListView({}, "Tea_inventory", "House_id = ?", [row_id], "config/assets/Tea_inventory_list.html#Tea_inventory/thName = ?/" + cached_d.getData(0, "thName"));
	}

}
