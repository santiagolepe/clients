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
      var self = this;
      var onError = function(tx, e) {
        alert("Error: " + e.message);
      } 

      var onSuccess = function(tx, r){
        console.log("success");
        qx.core.Init.getApplication().clients.splice(self.index, 1);
        self._refresh();
      }
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
      list.setModel(new qx.data.Array(qx.core.Init.getApplication().clients));

      // Add an changeSelection event
      list.addListener("changeSelection", function(evt) {
        // alert("Index: " + evt.getData())
        var form = qx.core.Init.getApplication().form;
        form.show();
        form._open(qx.core.Init.getApplication().clients[evt.getData()].id);
      }, this);

      list.addListener("removeItem", function(evt) {
        self.index = evt.getData();
        var db = qx.core.Init.getApplication().db;
        console.log(qx.core.Init.getApplication().clients[evt.getData()]);
        var id = qx.core.Init.getApplication().clients[evt.getData()].id;
       db.transaction(function(tx) {
        tx.executeSql("DELETE FROM clients WHERE ID=?", [id],
          onSuccess,
          onError);
      });
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
      this.list.setModel(new qx.data.Array(qx.core.Init.getApplication().clients));
    }

  }
 
});