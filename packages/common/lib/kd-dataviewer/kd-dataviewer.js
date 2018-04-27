/**TODO

**/
/**
Data Viewer CE
2017-5-8: Included use of before and complete callbacks in renderFieldValues().
**/
(function($) {
  // create the dataViewer global object
  DataViewer = typeof DataViewer == 'undefined' ? {} : DataViewer;

  /**
     * Code in kd_client.js is preventing the backspace from working on $('.dataTables_filter input'). stopPropigation allows backspace to work.
     */
  $('body').on('keydown', '.dataTables_filter input', function(event) {
    event.stopPropagation();
  });

  /**
     * Define default properties for the Search configurations
     * Reduces need to include all properties in a search configuration.
     * Each Search config my overide these values by including a value of its own.
     * execute: {Function} Function which will execute the search
     * Other properties are used by Datatables.net or its Responsive Plugin.
     */
  /* Define default properties for defaultsBridgeDataTable object. */
  var defaultsBridgeDataTable = {
    resultsContainer: '<table cellspacing="0", border="0", class="display">',
    // Properties specific to DataTables
    paging: true,
    info: true,
    searching: true,
    responsive: {
      details: {
        type: 'column'
      }
    }
  };

  /* Define default properties for defaultsBridgeList object. */
  var defaultsBridgeList = {
    resultsContainer: '<div>'
  };

  /**
     * Executes the search for the configured search object.
     * @param {Obj} destination
     * @param {Obj} Search configuration object
     */
  DataViewer.executeSearch = function(destination, configObj) {
    //Determine current and Parent form
    setParentChildForms(destination, configObj);
    if (configObj.before) {
      configObj.before(configObj);
    }
    //Retrieve and set the Bridge parameter values using JQuery
    var parameters = {};
    if (configObj.resource.parameters) {
      $.each(configObj.resource.parameters, function(i, v) {
        if (typeof v == 'function') {
          parameters[i] = v();
        } else if (typeof v == 'string') {
          parameters[i] = $(configObj.resource.parameters[i]).val();
        }
      });
    }
    try {
      configObj.forms
        .self('bridgedResource[' + configObj.resource.name + ']')
        .load({
          attributes: configObj.resource.attributes,
          values: parameters,
          success: function(response) {
            // If Bridge is a "Single" convert it to array to match format of "multiple"
            if (
              configObj.forms.self(
                'bridgedResource[' + configObj.resource.name + ']'
              ).type == 'Single'
            ) {
              configObj.response = [response];
            } else {
              configObj.response = response;
            }
            // If any results or successEmpty is not defined
            if ($(configObj.response).length > 0 || !configObj.successEmpty) {
              // Execute success callback if defined
              if (configObj.success) {
                configObj.success(configObj);
              }
              // If configured Render Results
              if (configObj.renderer && configObj.renderer.type) {
                configObj = configObj.renderer.type(destination, configObj);
              }
            } else {
              // No records returned
              // Execute successEmpty callback if defined
              if (configObj.successEmpty) {
                configObj.successEmpty(configObj);
                configObj = configObj.renderer.type(destination, configObj);
              }
            }
            // Execute complete callback if defined
            if (configObj.complete) {
              configObj.complete(configObj);
            }
          },
          error: function(response) {
            // Execute error callback if defined
            if (configObj.error) {
              configObj.error(configObj);
            }
            // Execute complete callback if defined
            if (configObj.complete) {
              configObj.complete(configObj);
            }
          }
        });
    } catch (e) {
      alert(
        'There was an error loading the Bridge Resource "' +
          configObj.resource.name +
          '"'
      );
    }
  };

  /**
     * Builds a response obj from Field values on the form and render the results.
     * In the "data" array of the configObj the "setField" property is used to map the source field on the Form
     *  to the table or list.
     * @param {Obj} destination
     * @param {Obj} Search configuration object
     */
  DataViewer.renderFieldValues = function(destination, configObj) {
    // Initialize the forms obj
    setParentChildForms(destination, configObj);
    // Initialize the response if not defined
    configObj.response =
      typeof configObj.response == 'undefined' ? [] : configObj.response;
    // The processSingleResult property should not be set to true when using renderFieldValues.
    configObj.renderer.options.processSingleResult = false;
    // The removeOnClick property should not be set to true when using renderFieldValues.
    configObj.removeOnClick = false;
    if (configObj.before) {
      configObj.before(configObj);
    }
    var fieldValueObj = {};
    // Get Field Values and place into an object
    $.each(configObj.data, function(i, v) {
      if (v['setField'] != '' && typeof v['setField'] != 'undefined') {
        // Set field string (e.g.: "field[First Name]")
        var field = 'field[' + v['setField'] + ']';
        // Check if field exist on self then parent. If neither set to empty.
        if (configObj.forms.self(field) != null) {
          var value = configObj.forms.self(field).value();
        } else if (configObj.forms.parent(field) != null) {
          var value = configObj.forms.parent(field).value();
        } else {
          var value = '';
        }
        // Set value into the feidlValueObj
        fieldValueObj[v['name']] = value;
      }
    });
    // Add object to the response Array
    configObj.response.push(fieldValueObj);
    // Render Results
    configObj = configObj.renderer.type(destination, configObj);
    if (configObj.complete) {
      configObj.complete(configObj);
    }
  };

  /**
     * Renders the results fo a Search configuration object.
     * @param {Obj} destination
     * @param {Obj} Search configuration object
     */
  DataViewer.renderResults = function(destination, configObj) {
    // Initialize the forms obj
    setParentChildForms(destination, configObj);
    // The processSingleResult property should not be set to true when using renderFieldValues.
    configObj.renderer.options.processSingleResult = false;
    // Initialize the response if not defined
    configObj.response =
      typeof configObj.response == 'undefined' ? [] : configObj.response;
    // If any results or successEmpty is not defined
    if ($(configObj.response).length > 0 || !configObj.successEmpty) {
      // Execute success callback if defined
      if (configObj.success) {
        configObj.success(configObj);
      }
      // If configured Render Results
      if (configObj.renderer && configObj.renderer.type) {
        configObj = configObj.renderer.type(destination, configObj);
      }
    } else {
      // No records returned
      // Execute successEmpty callback if defined
      if (configObj.successEmpty) {
        configObj.successEmpty(configObj);
      }
    }
    // Execute complete callback if defined
    if (configObj.complete) {
      configObj.complete(configObj);
    }
  };

  /**
    * Set Values from selected row
    * @params {Object} data config object
    * @params {Object} data returned from selection.
    */
  DataViewer.setFieldsfromResults = function(configData, results, configObj) {
    //rowCallback
    var self = this;
    self.configObj = configObj;
    //Iterate through the data object defined in the configuration
    $.each(configData, function(k_data, v_data) {
      // If setField property is set
      if (
        v_data['setField'] != '' &&
        typeof v_data['setField'] != 'undefined'
      ) {
        // If setField is not an array create one
        fldArr = !Array.isArray(v_data['setField'])
          ? new Array(v_data['setField'])
          : v_data['setField'];
        // Iterate through array of setField values
        $.each(fldArr, function(k_fld, v_fld) {
          // Set field string (e.g.: "field[First Name]")
          var field = 'field[' + v_fld + ']';
          var v_fld = v_fld;
          //Iterate through each of the defined forms (ie: self and parent)
          $.each(self.configObj.forms, function(k_form, v_form) {
            // Set field value if it exists for self and parent
            if (v_form('field[' + v_fld + ']') !== null) {
              v_form('field[' + v_fld + ']').value(results[v_data['name']]);
            } else {
              // v_fld is not a field try setting value using jQuery
              evaluteObjType(v_fld).html(results[v_data['name']]);
            }
          });
        });
      }
      // If callback property exists
      if (v_data.callback) {
        v_data.callback(results[v_data['name']], results); //cellvalue, row values
      }
    });
  };

  /****************************************************************************
      PRIVATE HELPERS / SHARED FUNCTIONS
  ****************************************************************************/

  /**
     * Returns object
     * @param {Object} table
     */
  evaluteObjType = function(obj) {
    // Append to DOM
    if (obj instanceof $) {
      // if jQuery Obj
      obj = obj;
    } else if (typeof obj == 'string') {
      // if string
      obj = $(obj);
    } else if (typeof obj == 'function') {
      // if function
      obj = obj();
    }
    return obj;
  };

  /**
     * Returns Search Object
     * Creates resultsContainer and adds it to DOM based on Search Config
     * @param {Object} Search Object
     */
  function initializeResultsContainer(configObj) {
    if (
      $(configObj.forms.self('form').element()).find(
        '#' + configObj.resultsContainerId
      ).length == 0
    ) {
      // Create resultsContainer
      if (typeof configObj.resultsContainer == 'string') {
        // if string
        configObj.resultsContainer = $(configObj.resultsContainer).attr(
          'id',
          configObj.resultsContainerId
        );
      } else if (typeof configObj.resultsContainer == 'function') {
        // if function
        configObj.resultsContainer = configObj
          .resultsContainer()
          .attr('id', configObj.resultsContainerId);
      }
      // Append to DOM
      if (configObj.destination instanceof $) {
        // if jQuery configObj
        configObj.destination.append(configObj.resultsContainer);
      } else if (typeof configObj.destination == 'string') {
        // if string
        configObj.destination = $(configObj.destination).append(
          configObj.resultsContainer
        );
      } else if (typeof configObj.destination == 'function') {
        // if function
        configObj.destination = configObj
          .destination()
          .append(configObj.resultsContainer);
      }
      return configObj;
    }
    return configObj;
  }

  /**
    * Convert the "data" property into "columns", necessary for DataTables.
    * @param {Object} Search Object to convert
    */
  function convertDataToColumns(obj) {
    obj.columns = [];
    $.each(obj.data, function(attribute, attributeObject) {
      attributeObject['data'] = attributeObject.name;
      obj.columns.push(attributeObject);
    });
  }

  /**
    * Set the Parent form and Current form for when DataViewer is used as a SubForm
    * @param {Object} Config Obj
    */
  function setParentChildForms(destination, configObj) {
    configObj.destination = evaluteObjType(destination);
    configObj.forms = {};
    var currentFormId = $(configObj.destination)
      .closest('form[data-form]')
      .attr('id');
    var currentForm = K.as(Kinetic.forms[currentFormId]);
    configObj.forms.self = currentForm;
    configObj.forms.parent = K;
    // Create an alias for self which is easier syntax to reference in the callbacks
    Subform = configObj.forms.self;
  }

  /****************************************************************************
                                PUBlIC FUNCTIONS
    ****************************************************************************/

  /**
    * Returns string with uppercase first letter
    * @param {String} Value to be give uppercase letter
    */
  DataViewer.ucFirst = function(str) {
    var firstLetter = str.substr(0, 1);
    return firstLetter.toUpperCase() + str.substr(1);
  };

  /****************************************************************************
                                RENDERERS
    ****************************************************************************/
  DataViewer.Renderers = {
    /**
        * Create a TableTable using a Search Object
        * @param {Object} Search Object used to create the DataTable
        */
    DataTables: function(destination, configObj) {
      // Entend defaults into the configuration
      configObj = $.extend({}, defaultsBridgeDataTable, configObj);
      // Merge Render options into Config Obj
      configObj = $.extend(true, {}, configObj, configObj.renderer.options);
      // Create a table element for Datatables and add to DOM
      configObj = initializeResultsContainer(configObj);
      // Set columns, need by DataTables
      convertDataToColumns(configObj);
      // Ensure the response is an Array
      /*if (typeof configObj.response === 'undefined') {
        alert('The response Obj is undefined.  The table cannot be populated.');
      } else */ if (
        typeof configObj.response !== 'undefined' &&
        !Array.isArray(configObj.response)
      ) {
        alert(
          'The response Obj must be an Array.  The table cannot be populated.'
        );
      }

      // Set data, needed by DataTables
      configObj.data = configObj.response;
      // Append Column to beginning of table contain row expansion for responsive Plugin
      if (configObj.responsive) {
        configObj.columns.unshift({
          title: '&nbsp',
          defaultContent: '',
          class: 'control',
          orderable: false
        });
      }
      // For when DataViewer is used in a Subform. "$(configObj.forms.self('form').element()).find("#"+configObj.resultsContainerId)" finds only children of the current form.
      var tableContainer = $(configObj.forms.self('form').element()).find(
        '#' + configObj.resultsContainerId
      );
      if (
        typeof configObj.processSingleResult != 'undefined' &&
        configObj.processSingleResult &&
        $(configObj.data).length == 1
      ) {
        // If it exists destroy DataTable and remove from view.
        if ($.fn.DataTable.isDataTable(tableContainer)) {
          tableContainer.DataTable().destroy([true]);
        }
        //Set Results to Fields
        DataViewer.setFieldsfromResults(
          configObj.columns,
          configObj.data[0],
          configObj
        );
        //Execute ClickCallback
        try {
          if (configObj.clickCallback) {
            configObj.clickCallback(null, configObj.data[0]);
          }
        } catch (e) {
          alert('Error in clickCallback:\n' + e);
        }
        // No result set has been created due to a single result and "processSingleResult" == true.  Create object to prevent errors and display message in the configObj
        configObj.tableObj = $(
          'A single result was processed, no result set was created'
        );
      } else {
        // If it exists destroy DataTable and empty it.
        if ($.fn.DataTable.isDataTable(tableContainer)) {
          tableContainer.DataTable().destroy();
          tableContainer.empty();
        }
        var dtConfig = {};
        dtConfig.data=configObj.data;
        dtConfig.columns=configObj.columns;
        dtConfig = $.extend(true, {}, dtConfig, configObj.renderer.options);
        configObj.tableObj = tableContainer.DataTable(dtConfig);
        // Bind Click Event based on where the select attribute extists ie:<tr> or <td>
        tableContainer.off().on('click', 'td', function(event) {
          // Ensure user has not clicked on an element with control class (Used by the responsive plugin to expand info and allow checkbox and button elements to be clicked)
          if (!$(this).hasClass('control') && configObj.tableObj.data().any()) {
            DataViewer.setFieldsfromResults(
              configObj.columns,
              configObj.tableObj.row($(this).closest('tr')).data(),
              configObj
            );
            try {
              if (configObj.clickCallback) {
                configObj.clickCallback(
                  $(this).closest('tr'),
                  configObj.tableObj.row($(this).closest('tr')).data(),
                  configObj
                );
              }
            } catch (e) {
              alert('Error in clickCallback:\n' + e);
            }
            if (
              configObj.removeOnClick ||
              typeof configObj.removeOnClick == 'undefined'
            ) {
              // Destroy DataTable and empty container in case columns change.
              configObj.tableObj.destroy();
              tableContainer.empty();
            }
          }
        });
      }
      return configObj;
    },
    UnorderedList: function(destination, configObj) {
      // Entend defaults into the configuration
      configObj = $.extend({}, defaultsBridgeList, configObj);
      // Merge Render options into Config Obj
      configObj = $.extend(true, {}, configObj, configObj.renderer.options);
      // Ensure the response is an Array
      if (!Array.isArray(configObj.response)) {
        alert(
          'The response Obj must be an Array.  The table cannot be populated.'
        );
      }
      // Create a results element for Datatables and add to DOM
      configObj = initializeResultsContainer(configObj);
      if (
        typeof configObj.processSingleResult != 'undefined' &&
        configObj.processSingleResult &&
        $(configObj.response).length == 1
      ) {
        //Destroy List
        $(configObj.forms.self('form').element())
          .find('#' + configObj.resultsContainerId)
          .remove();
        //Set Results to Fields
        DataViewer.setFieldsfromResults(
          configObj.data,
          configObj.response[0],
          configObj
        );
        //Execute ClickCallback
        try {
          if (configObj.clickCallback) {
            configObj.clickCallback(null, configObj.response[0]);
          }
        } catch (e) {
          alert('Error in clickCallback:\n' + e);
        }
      } else {
        this.$resultsList = $('<ul/>').attr('id', 'resultList');
        var self = this; // reference to this in current scope
        //Iterate through row results to retrieve data
        $.each(configObj.response, function(i, record) {
          var odd_or_even = i % 2 == 0 ? 'even' : 'odd';
          self.$singleResult = $('<li/>').attr(
            'class',
            'result ' + odd_or_even
          );
          //Iterate through the configured columns to match with data returned from bridge
          $.each(configObj.data, function(attribute, attributeObject) {
            if (
              typeof record[attributeObject.name] != 'undefined' ||
              typeof attributeObject['defaultContent'] != 'undefined'
            ) {
              var title = '';
              if (attributeObject['title']) {
                var $title = $('<div/>')
                  .addClass('title ' + attributeObject['class'])
                  .html(attributeObject['title']);
                self.$singleResult.append($title);
              }
              var contentValue = '';
              if (typeof attributeObject['defaultContent'] != 'undefined') {
                contentValue = attributeObject['defaultContent'];
                self.$singleResult.data(
                  attributeObject.name,
                  attributeObject['defaultContent']
                );
              } else {
                contentValue = record[attributeObject.name];
                self.$singleResult.data(
                  attributeObject.name,
                  record[attributeObject.name]
                );
              }
              if (typeof attributeObject['render'] != 'undefined') {
                contentValue = attributeObject['render'](
                  contentValue,
                  'display',
                  record
                );
              }
              var $value = $('<div/>')
                .addClass(attributeObject['class'])
                .html(contentValue)
                .data('name', attributeObject['name']);
              self.$singleResult.append($value);
            }
          });
          self.$resultsList.append(self.$singleResult);
        });
        // For when DataViewer is used in a Subform. "$(configObj.forms.self('form').element()).find("#"+configObj.resultsContainerId)" finds only children of the current form.
        $(configObj.forms.self('form').element())
          .find('#' + configObj.resultsContainerId)
          .empty()
          .append(this.$resultsList);
        $(configObj.forms.self('form').element())
          .find('#' + configObj.resultsContainerId)
          .off()
          .on('click', 'li div', function(event) {
            // Ensure user has not clicked on an element with control class (Used to allow checkbox and button elements to be clicked)
            if (!$(this).hasClass('control')) {
              DataViewer.setFieldsfromResults(
                configObj.data,
                $(this)
                  .parent('li')
                  .data(),
                configObj
              );
              try {
                if (configObj.clickCallback) {
                  configObj.clickCallback(
                    $(this).parent('li'),
                    $(this)
                      .parent('li')
                      .data()
                  );
                }
              } catch (e) {
                alert('Error in clickCallback:\n' + e);
              }
              if (
                configObj.removeOnClick ||
                typeof configObj.removeOnClick == 'undefined'
              ) {
                $(configObj.forms.self('form').element())
                  .find('#' + configObj.resultsContainerId)
                  .empty();
              }
            }
          });
      }
      return configObj;
    }
  };

  /****************************************************************************
                                Render Utilities
                            Used to render Data results
    ****************************************************************************/

  DataViewer.render = {
    // Render using moment.js
    moment: function(options) {
      //Default Options
      var options = options || {};
      var from = options.from || '';
      var to = options.to || 'MMMM Do YYYY, h:mm:ss a';
      var locale = options.locale || 'en';

      return function(d, type, row) {
        var m = window.moment(d, from, locale, true);

        // Order and type get a number value from Moment, everything else
        // sees the rendered value
        return m.format(type === 'sort' || type === 'type' ? 'x' : to);
      };
    }
  };

  /****************************************************************************
                                 Utilities
    ****************************************************************************/
  /**
    * Jquery plugin for Unordered Lists
    * Creates functionality similar to DataTables plugin.
    */
  $.fn.UnorderedList = function() {
    var self = this;
    /**
            * Returns List as JSON obj
            */
    var data = function() {
      var array = [];
      $(self)
        .find('li')
        .each(function(i, v) {
          var obj = {};
          $(v)
            .find("div:not('.title')")
            .each(function(i, v) {
              obj[$(v).data('name')] = $(v).text();
            });
          array.push(obj);
        });
      return array;
    };
    return {
      data: data
    };
  };
})(jQuery);
