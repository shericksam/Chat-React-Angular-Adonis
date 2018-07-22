class CustomSerializer {
    constructor (rows, pages = null, isOne = false) {
      this.rows = rows
      this.pages = pages
      this.isOne = isOne
    }
  
    first () {
      return this.rows[0]
    }
  
    last () {
      return this.rows[this.rows.length - 1]
    }
  
    size () {
      return this.isOne ? 1 : this.rows.length
    }
  
    toJSON () {
      // return formatted data
    }
  }
  
  module.exports = CustomSerializer