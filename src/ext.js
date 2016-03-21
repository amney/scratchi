import $ from 'jquery';


// Block entry points
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
    this.mo_cache = {};
    this.class_cache = {};

    this.title = "ACI Extension";

    this.descriptor = require('./data.json')
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
  saveMo(key, value){
    console.log('Saving mo', key, value)
    this.mo_cache[ key ] = value;
    return true
  }

  getClass(key){
    console.log("getting class", key)
    let value = this.class_cache[ key ];
    console.log(value)
    return value
  }

  getClassLength(key){
    console.log("getting class", key)
    let value = this.class_cache[ key ].length;
    console.log("length", value)
    return value
  }

  getMo(index, cls){
    let value = cls[ index ];
    console.log(value)
    return value
  }

  getVariable(key){
    let value = this.mo_cache[ key ];
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
      success: (object) => {
        callback(object.imdata)
      },
      error: () => callback([
          {
            name: "class error"
          }
        ])
    })
  }
}

module.exports = Scratchi
