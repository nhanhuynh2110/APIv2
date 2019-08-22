
var action = require('./action')
var store = require('../store').common
class SchemaAll {
  constructor (schema, table, view) {
    this.schema = schema
    this.data = null
    this.validSchema = true
    this.table = table
    this.condition = null
    this.view = view
    this.strlimit = null
    this.strOrderBy = null
    this.strSelect = '*'
    this.filterColumns = ''
    this.filterCompareColumns = ''
  }

  select (str) {
    if (!str) return this.strSelect
    else {
      this.strSelect = str
      return this.strSelect
    }
  }

  // condition OBJECT { key: value}
  conditionFields (items) {
    try {
      var arr = []
      var condition = ''
      for (var item in items) {
        arr.push(`${item}='${items[item]}'`)
      }
      if (arr.length > 0) {
        condition = arr.join(' AND ')
      }
      this.condition = condition
    } catch (err) {
      console.log(err)
    }
  }

  // condition String
  conditionString (condition) {
    this.condition = condition
  }

  gridCommon (obj, cb) {
    try {
      var searchKey = (obj.searchKey) ? obj.searchKey : ''
      var pageSize = (obj.pageSize && parseInt(obj.pageSize) !== isNaN) ? parseInt(obj.pageSize) : 1
      var pageNumber = (obj.pageNumber && parseInt(obj.pageNumber) !== isNaN) ? parseInt(obj.pageNumber) : 10
      var columnsSearch = (obj.columnsSearch) ? obj.columnsSearch : ''
      var colSort = (obj.colSort) ? obj.colSort : ''
      var typeSort = (obj.typeSort && (obj.typeSort.trim() !== 'ASC' || obj.typeSort.trim() !== 'DESC')) ? obj.typeSort.trim() : 'ASC'
      var filterColumns = this.filterColumns ? this.filterColumns : ''
      var filterCompareColumns = this.filterCompareColumns ? this.filterCompareColumns : ''

      var formData = [
        this.view, searchKey, pageSize, pageNumber, columnsSearch,
        colSort, typeSort, filterColumns, filterCompareColumns
      ]
      this.excuteStore(store.grid, formData, (err, results) => {
        if (err) return cb('excute fail')
        else {
          var data = { total: 0, list: [] }
          if (results.length > 1) {
            data = {
              total: results[0][0]['count'],
              list: results[1]
            }
          }
          return cb(null, data)
        }
      })
    } catch (error) {
      console.log(error)
      return cb('Server error schema parrent')
    }
  }

  save (cb) {
    action.insert(this.table, this.data, cb)
  }

  update (cb) {
    action.update(this.table, this.data, this.condition, cb)
    // console.log(this.data)
  }

  delete (cb) {
    action.delete(this.table, this.condition, cb)
  }

  whereItem (cb) {
    action.whereItem(this.strSelect, this.view, this.condition, this.strOrderBy, cb)
  }

  whereItemTableBase (cb) {
    action.whereItem(this.strSelect, this.table, this.condition, this.strOrderBy, cb)
  }

  offset (start, end) {
    if (parseInt(start) !== 'NaN' &&
      parseInt(end) !== 'NaN' &&
      typeof start === 'number' &&
      typeof end === 'number') {
      this.strlimit = ` LIMIT ${start},${end}`
    }
  }

  orderBy (str) {
    if (!str) return null
    else this.strOrderBy = str
  }

  limit (number = null) {
    if (number) {
      this.strlimit = ` LIMIT ${number}`
    }
  }

  filterGridColumns (filterColumnsObj = {}) {
    let filterColumnsArr = []
    Object.keys(filterColumnsObj).forEach(key => {
      filterColumnsArr.push(`${key}='${filterColumnsObj[key]}'`)
    })
    if (filterColumnsObj && Object.keys(filterColumnsObj).length) {
      this.filterColumns = filterColumnsArr.join(' AND ')
    }
  }

  filterGridCompareColumns (filterColumnsObj = {}) {
    let filterColumnsArr = []
    Object.keys(filterColumnsObj).forEach(key => {
      filterColumnsArr.push(`${key}${filterColumnsObj[key]}`)
    })
    if (filterColumnsObj && Object.keys(filterColumnsObj).length) {
      this.filterCompareColumns = filterColumnsArr.join(' AND ')
    }
  }

  where (cb) {
    action.where(this.strSelect, this.view, this.condition, this.strOrderBy, this.strlimit, cb)
    // action.where(this.view, this.condition, cb)
  }

  whereTableBase (cb) {
    action.where(this.strSelect, this.table, this.condition, this.strOrderBy, this.strlimit, cb)
    // action.where(this.table, this.condition, cb)
  }

  /**
   * @function { name: 'mapDataToSchema' }
   * @param {Type: Object, msg: 'data map to schema'}
   */
  mapDataToSchema (data) {
    try {
      this.data = data
      for (var key in this.data) {
        if (this.schema.hasOwnProperty(key)) {
          console.log(this.data[key])
          let val = this.data[key] ? this.data[key].toString() : ''
          val = val.replace(/'/g, `\\\\'`)
          this.schema[key].value = val
          // this.schema[key].isValid = this.validateField(this.schema[key])
        }
      }
      this.validateSchema()
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * @function { name: validateField, msg: validate all schema}
   * @
   */
  validateSchema () {
    for (var key in this.schema) {
      this.schema[key].isValid = this.validateField(this.schema[key])
      if (this.schema[key].isValid === false) {
        this.validSchema = false
      }
    }
  }

  /**
   * @function { name: validateField, msg: validate field in schema}
   * @param {value: Object in Schema}
   * @
   */
  validateField (field) {
    var value = (field.value !== null) ? field.value : null
    // validate require
    if (field.require === true) {
      if (!value || !value.trim()) return false
    }

    // convert value to boolean ,field type is Boolean
    if (field.type === 'boolean') {
      if (value !== null) {
        value = convertDataToBoolean(value)
      }
    }

    // validate value with type
    if (typeof value !== field.type) return false

    // validate value with regex
    if (field.regex !== null) {
      if (!field.regex.test(field.value)) return false
    }
    return null
  }

  excuteStore (sql, param, cb) {
    action.excuteQueryStore(sql, param, cb)
  }
}

/**
 * @function { name: convertDataToBoolean, msg : convert value to Boolean }
 * @param { value: value field schema}
 */
let convertDataToBoolean = (value) => {
  if (typeof value === 'number') {
    if (value === 1) return true
    else if (value === 0) return false
  } else if (typeof value === 'string') {
    if (value === '1' || value.toLowerCase() === 'true') return true
    else if (value === '0' || value.toLowerCase() === 'false') return false
  } else if (typeof value === 'boolean') return value
  else return null
}

module.exports = SchemaAll
