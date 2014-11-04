
qx.Class.define("app.page.Form",
{
  extend : qx.ui.mobile.page.NavigationPage,

  construct : function()
  {
    this.base(arguments);
    this.setTitle("Nuevo Cliente");
  },


  members :
  {
    __form: null,


    // overridden
    _initialize: function() {
      this.base(arguments);
      this.set({
        showBackButton : true,
        backButtonText : "Cancelar",
        showButton: true,
        buttonText: "Guardar"
      });

      // Username
      var name = this.name =  new qx.ui.mobile.form.TextField();
      name.setRequired(true);

      // Password
      var username = this.username = new qx.ui.mobile.form.TextField();
      username.setRequired(true);

      var phone = this.phone = new qx.ui.mobile.form.TextField();
      phone.setRequired(true);

      var loginForm = this.__form = new qx.ui.mobile.form.Form();
      loginForm.add(name, "Nombres:");
      loginForm.add(username, "Apellidos:");
      loginForm.add(phone, "Telefono:");

      // Use form renderer
      this.getContent().add(new qx.ui.mobile.form.renderer.Single(loginForm));

      //listeners
      this.addListener("action", this._save, this);
    },

    _new: function(){
      this.status = "new";
      this.name.resetValue();
      this.username.resetValue();
      this.phone.resetValue();
    },

    _open: function(id){
      this.status = "update";
      var self = this;
      this.id = id;
      qx.core.Init.getApplication().clients.forEach(function(item){
        if(item.id == id){
          self.name.setValue(item.name);
          self.username.setValue(item.surname);
        }
      });
    },

    _save: function(){
      var self = this;
      var db = qx.core.Init.getApplication().db;
      
      if(this.__form.validate()){

        var client = {
          id: Math.random(),
          name: this.name.getValue(),
          surname: this.username.getValue(),
          phone: this.phone.getValue()
        };

        var onError = function(tx, e) {
          alert("Error: " + e.message);
        } 

        var onSuccess = function(tx, r){
          console.log("success");
        }

        if(this.status == 'new'){
          qx.core.Init.getApplication().clients.push(client);
        

          db.transaction(function(tx){
            tx.executeSql("INSERT INTO clients(id, name, surname, phone) VALUES (?,?,?,?)",
              [client.id, client.name, client.surname, client.phone],
              onSuccess,
              onError);
          });

        } else {
          qx.core.Init.getApplication().clients.forEach(function(item, index, array){
            if(item.id == self.id){
              array.splice(index, 1, client);
            }
          });

          db.transaction(function(tx) {
            tx.executeSql("DELETE FROM clients WHERE ID=?", [self.id],
              onSuccess,
              onError);
          });

          db.transaction(function(tx){
            tx.executeSql("INSERT INTO clients(id, name, surname, phone) VALUES (?,?,?,?)",
              [client.id, client.name, client.surname, client.phone],
              onSuccess,
              onError);
          });
        }

        qx.core.Init.getApplication().home.show({reverse: true});
      }
    },

    _back: function(){
      qx.core.Init.getApplication().home.show({reverse: true});
    }

    
  }
 
});
