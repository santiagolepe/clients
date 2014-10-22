/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/**
 */
qx.Class.define("app.page.Home", {

  extend : qx.ui.mobile.page.NavigationPage,

  construct : function() {
    this.base(arguments);
    this.setTitle("Clientes");
  },


  members: {
    
    // overridden
    _initialize: function() {
      this.base(arguments);
      this.set({
        showBackButton : true,
        backButtonText : "Salir",
        showButton: true,
        buttonText: "Nuevo"
      });

      var data = qx.core.Init.getApplication().clients;

      // Create the list with a delegate that
      var list = this.list = new qx.ui.mobile.list.List({
        configureItem: function(item, data, row)
        {
          item.setImage("app/user.png");
          item.setTitle(data.name);
          item.setSubtitle(data.surname);
          item.setShowArrow(true);
          item.setRemovable(true);
        }
      });

      // Set the model of the list
      list.setModel(new qx.data.Array(data));

      // Add an changeSelection event
      list.addListener("changeSelection", function(evt) {
        // alert("Index: " + evt.getData())
        var form = qx.core.Init.getApplication().form;
        form.show();
        form._open(data[evt.getData()].id);
      }, this);

      list.addListener("removeItem", function(evt) {
       qx.core.Init.getApplication().clients.splice(evt.getData(), 1);
       this._refresh();
      }, this);


      //add widgets
      this.getContent().add(list);

      //listeners
      this.addListener("action", function(){
        var form = qx.core.Init.getApplication().form;
        form.show();
        form._new();
      });

      this.addListener("appear", this._refresh, this);

    },

    _refresh: function(){
      var data = qx.core.Init.getApplication().clients;
      this.list.setModel(new qx.data.Array(data));
    }

  }
 
});