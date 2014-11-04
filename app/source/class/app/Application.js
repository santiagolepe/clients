/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 * This is the main application class of your custom application "app"
 *
 * @asset(app/*)
 */
qx.Class.define("app.Application",
{
  extend : qx.application.Mobile,


  members :
  {

    /**
     * This method contains the initial application code and gets called
     * during startup of the application
     */
    main : function()
    {
      // Call super class
      this.base(arguments);
      var self = this;
      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console.
        // Trigger a "longtap" event on the navigation bar for opening it.
        qx.log.appender.Console;
      }

      // this.clients = [
      //   {id: 1, name : "Cliente 1", surname : "Apellido 1"},
      //   {id: 2, name : "Cliente 2", surname : "Apellido 2"},
      //   {id: 3, name : "Cliente 3", surname : "Apellido 3"}
      // ];

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
        Remove or edit the following code to create your application.
      -------------------------------------------------------------------------
      */

      var form = this.form = new app.page.Form();
      var home = this.home = new app.page.Home();

      // Add the pages to the page manager.
      var manager = new qx.ui.mobile.page.Manager(false);
      manager.addDetail([
        form,
        home
      ]);

      // Initialize the application routing
      this.getRouting().onGet("/", this._show, home);
      // this.getRouting().onGet("/overview", this._show, overview);

      this.getRouting().init();

      //init database
      this._initDB(function(rows){
        self.clients = [];
        console.log(rows.length);
        for (var i = 0; i < rows.length; i++) {
          self.clients.push(rows.item(i));
        }
        self.clients.sort(function(a, b){
          return a.name - b.name;
        });
        home._refresh();
      });
    },

    _initDB: function(cb){
      var onError = function(tx, e) {
        alert("Error: " + e.message);
      } 

      var onSuccess = function(tx, rows){
        if(rows.rows.length == 0) return cb(null);
        return cb(rows.rows||[]);
      }

      var db = this.db = window.openDatabase("clients.db", "1.0", "app.db", 10*1024*1024);
      // var db = window.openDatabase({name: "clients.db"});
      //var db = window.sqlitePlugin.openDatabase("today.db");
      db.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS clients(id TEXT, name TEXT, surname TEXT, phone TEXT)", []);
      });

      db.transaction(function(tx){
        tx.executeSql("SELECT * FROM clients",
          [],
          onSuccess,
          onError);
      });
    },


    /**
     * Default behaviour when a route matches. Displays the corresponding page on screen.
     * @param data {Map} the animation properties
     */
    _show : function() {
      this.show();
    }
  }
});
