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

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console.
        // Trigger a "longtap" event on the navigation bar for opening it.
        qx.log.appender.Console;
      }

      this.clients = [
        {id: 1, name : "Cliente 1", surname : "Apellido 1"},
        {id: 2, name : "Cliente 2", surname : "Apellido 2"},
        {id: 3, name : "Cliente 3", surname : "Apellido 3"}
      ];

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