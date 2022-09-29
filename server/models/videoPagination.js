'use strict';

/**
 * Split an array into array chunks
 * @chunksize - size of array chunks to split the larger array into
 * example: [1,2,3,4,5,6,7,8,9].chunk(3) -> [[1,2,3],[4,5,6],[7,8,9]]
 */
Array.prototype.chunk = function(chunkSize) {
  var array = this;
  return [].concat.apply([], array.map(function(elem, i) {
    return (i % chunkSize) ? [] : [array.slice(i, i + chunkSize)];
  }));
};

/**
 * Video pagination
 * @constructor
 * @param {VideoCollection} collection - Collection object
 * @param {Number} pageSize - number of videos per page
 * @param {Number} pageNum - current page number
 */
function VideoPagination(collection, pageSize, pageNum) {
  this.pageSize = pageSize;
  this.pageItems = collection.videos.chunk(pageSize);
  this.totalPages = this.pageItems.length;
  this.totalItems = collection.videos.length;
  this.showPagination = this.totalItems > pageSize;
  this.setPage(pageNum);
}

VideoPagination.prototype = {
  constructor: VideoPagination,

  /**
   * Paginate by a specific page number
   * @param {Number} pageNum - new page number
   */
  setPage: function(pageNum) {
    this.currentPage = pageNum;
    this.startIndex = (pageNum - 1) * this.pageSize + 1;
    this.endIndex = Math.min(this.totalItems, this.pageSize * pageNum);
    this.isPrevEnabled = pageNum !== 1;
    this.isNextEnabled = pageNum <= this.totalPages - 1;
    this.nextPage = pageNum + 1;
    this.prevPage = pageNum - 1;
    this._createPageNumbers();
  },

  /**
   * Get all the videos for this page
   * @return {Array} array of videos
   */
  getVideos: function() {
    return this.totalItems ? this.pageItems[this.currentPage - 1] : [];
  },

  /**
   * Create page numbers given the current dataset
   * @private
   */
  _createPageNumbers: function() {
    var currentPage = this.currentPage;
    var numPages = this.totalPages;
    var visibleIndexes;

    if (currentPage <= 2) {
      visibleIndexes = [1, 2, 3, 4, 5];
    } else if (currentPage === numPages || currentPage === numPages - 1) {
      visibleIndexes = [numPages - 4, numPages - 3, numPages - 2, numPages - 1, numPages];
    } else {
      visibleIndexes = [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
    }

    this.pageNumbers = this.pageItems.map(function(page, index) {
      index = index + 1;

      return {
        number: index,
        isActive: index === currentPage,
        isHidden: visibleIndexes.indexOf(index) === -1,
        isFirstVisible: visibleIndexes[0] === index,
        isLastVisible: visibleIndexes[visibleIndexes.length - 1] === index
      };
    });
  }
};

module.exports = VideoPagination;