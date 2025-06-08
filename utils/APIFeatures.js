// this class give filter, sort,limitfields & pagination method to tourController files

class APIFeatures {
  constructor(query, queryStrn) {
    this.query = query;
    this.queryStrn = queryStrn;

    // console.log(this.query);
    // console.log(this.queryStrn);
  }
  filter() {
    const queryObj = { ...this.queryStrn };
    const excludeField = ["limit", "page", "sort", "fields"];
    excludeField.forEach((el) => delete queryObj[el]);

    // Advance Search for checking Greater and less then in query
    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }
  sort() {
    if (this.queryStrn.sort) {
      const sortBy = this.queryStrn.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt _id");
    }
    return this;
  }

  limitFields() {
    if (this.queryStrn.fields) {
      const selectedFields = this.queryStrn.fields.split(",").join(" ");
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }
  pagination() {
    const page = this.queryStrn.page * 1 || 1;
    const limit = this.queryStrn.limit * 1 || 10;
    const skip = (page - 1) * limit;

    // EXECUTE QUERY
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
