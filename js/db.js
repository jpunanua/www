var db;

// Wait for PhoneGap to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// Populate the database 
//
function populateDB() {
    

    db.transaction(function(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS conversation_items');
        tx.executeSql('CREATE TABLE IF NOT EXISTS conversation_items (id unique, parent_id, order_item, img_src, title, content, create_date)');}, errorCB);
}

// Query the database
//
function queryDB(where, successFunc) {
    var sqlTxtqueryDB = "SELECT * FROM conversation_items WHERE " + where;
    db.transaction(function(tx) {tx.executeSql(sqlTxtqueryDB,[], successFunc, errorCB);} );
}


// Insert question
// 
function insertQuestion(data, successFunc) {
    var valuesString =
    "'"+data.id+"',"+
    "'"+data.parent_id+"',"+
    "'"+data.order+"',"+
    "'"+data.img_src+"',"+
    "'"+data.title+"',"+
    "'"+data.content+"',"+
    "'"+data.create_date+"'",
    fieldsString = 'id, parent_id, order_item, img_src, title, content, create_date';

    db.transaction(function(tx) {tx.executeSql("INSERT INTO conversation_items (" + fieldsString + ") VALUES (" + valuesString  + ")");}, errorCB, successFunc);
}


// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: "+err.message);
}