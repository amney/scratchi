import $ from 'jquery';

class Scratchi {
  _shutdown(){
    console.log("Shutting down")
  }

  _getStatus(){
    console.log("Responding with status: Ready")
    return {
      status: 2,
      msg: 'Ready'
    };
  }

  constructor(){
    this.apic = '';
    this.protocol = '';
    this.baseUrl = '';
    this.class_cache = {};

    this.title = "ACI Extension";

    this.descriptor = require('./data.json')
  }

  scratchiInstalled(){
    return true
  }

  reregister(url){
    console.log('reregistering')
    ScratchExtensions.unregister(this.title)
    ScratchExtensions.loadExternalJS(url)
  }


  connect(apic, username, password, protocol){
    this.apic = apic
    this.protocol = protocol
    this.baseUrl = `${this.protocol}://${this.apic}/api`

    var data = JSON.stringify({
      "aaaUser": {
        "attributes": {
          "name": username,
          "pwd": password
        }
      }
    });


    $.ajax({
      url: `${this.baseUrl}/aaaLogin.json`,
      headers: {},
      type: "POST",
      data: data,
      dataType: "json",
      success: (result) => {

        // Check login
        result = result.imdata[ 0 ]
        if(result.error) {
          console.log('Could not auth')
          return false
        } else {
          var token = result.aaaLogin.attributes.token
          $.ajaxSetup({
            headers: {
              devcookie: token
            }
          })
          console.log("setting token", token)
        }
      }
    })

    return true
  }
  saveClass(key, value){
    console.log('Saving class', key, value)
    this.class_cache[ key ] = value;
    return true
  }

  getClass(key){
    console.log("getting class", key)
    let value = this.class_cache[ key ];
    console.log(value)
    return value
  }

  getClassLength(key){
    console.log("getting class length", key)
    let value = this.getClass(key).length;
    console.log("length", value)
    return value
  }

  getMoFromList(index, cls){
    console.log('Getting MO from list', index, cls)
    let list = this.getClass(cls)
    let value = list[ index ];
    console.log(value)
    return value
  }

  getAttribute(attribute, mo){
    let value = mo[ attribute ];
    console.log(value)
    return value
  }

  getByDn(dn, callback){
    console.log("Getting MO", dn)
    let url = `${this.baseUrl}/mo/${dn}.json?&rsp-prop-include=config-only`
    console.log(url)
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: (object) => {
        object = object.imdata[ 0 ];
        var key = Object.keys(object)[ 0 ];
        var object = object[ key ];
        callback(object.attributes)
      },
      error: () => callback({
          name: "error"
        })
    })
  }
  getByClass(cls, callback){
    console.log("Getting class", cls)
    let url = `${this.baseUrl}/class/${cls}.json?&rsp-prop-include=config-only`
    console.log(url)
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: (objects) => {
        let cleanedObjects = objects.imdata.map((object) => {
          let key = Object.keys(object)[ 0 ];
          let attributes = object[ key ].attributes;
          return attributes
        })
        callback(cleanedObjects)
      },
      error: () => callback([
          {
            name: "class error"
          }
        ])
    })
  }
  getByClassWithFilter(cls, filter, callback){
    return null
  }
}

module.exports = Scratchi
