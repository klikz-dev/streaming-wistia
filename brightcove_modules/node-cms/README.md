# node-cms

This is a wrapper for the Brightcove CMS API. An API reference can be found [here](http://docs.brightcove.com/en/video-cloud/cms-api/getting-started/overview-cms.html).

### Usage

```js
var cms = require('node-cms');

cms.init({
	accountId: accountId,
	clientId: clientId,
	clientSecret: clientSecret
}, defaultName, opts);

// Get a list of videos
var queryParams = {
	q: 'name:gossip',
	sort: '-updated_at'
};

cms.videos.list(queryParams).then(function(response) {
	var videos = response.data;
	// Perform whatever action you need the videos for
});
```


### Parameters
The parameters can all be found in the *Admin > API Authentication* section of your Video Cloud account.

Name|Description
----|------------
accountId|Your Video Cloud account ID.
clientId|The client ID of Application youre using to access the API.
clientSecret|The client secret of the Application youre using to access the API.
defaultName|An optional default name for this account. If not specified, it's **DEFAULT**.
opts|An optional object that allows enabling of certain other features (caching, auto-retry, etc)


### Additional Options
In addition to the query parameters specified in the API documentation, there are additional parameters and options that can be passed in as well.

#### Switching Accounts
It's possible to hold authentication credentials for multiple accounts in the same CMS instance. This is helpful if you have multiple Video Cloud accounts you want to query from. To switch to a specific account pass in an `account` key into options otherwise it will use the default from initialization.

```js
// This assumes you have already initialized the cms as shown in the example above

// Add a new account. This only adds the credentials
cms.addAccount({
	accountId: otherAccountId,
	clientId: otherClientId,
	clientSecret: otherClientSecret
}, otherAccountName);

// Switch account
cms.videos.list(queryParams, { account: otherAccountName })
```

#### Caching
You can enable caching by passing in node-cache store when initializing the module. **This will enable caching for all accounts that have been added.** For example:

```js
var NodeCache = require('node-cache');

var store = new NodeCache();
cms.init({
	accountId: accountId,
	clientId: clientId,
	clientSecret: clientSecret
}, defaultName, { store: store });
```

Once initialized requests will be cached however, you can also disable caching on a per-request basis by including a `cache` key in the passed in options

```js
// Calls have been made to retrieve videos...

// Will use the cache
cms.videos.list(queryParams)

// Will not use the cache
cms.videos.list(queryParams, { cache: false })
```

#### Requesting all resources
For requests that take query parameters, the CMS API will limit the number of results to 20 by default and 100 at a maximum. You can get all the resources in a single request by including a `fetch_all` key in the passed in options.

```js
// This will fetch all videos, even if the number exceeds 100
cms.videos.list(undefined, { fetch_all: true })
```

### Getting sources with video metadata
Usually to get a videos sources (renditions) you need to make a separate call to `cms.videos.sources()`. For convenience, you can include the sources with a video metadata by including a `get_sources` key in options

```js
cms.videos.get('123456789', { get_sources: true })
```

#### Automatically retry after rate limiting
As specified in the API docs, there is an upper limit on the number of concurrent requests and queries that can be made a second. If exceeded an error will be thrown. You can enable [auto retry](https://en.wikipedia.org/wiki/Exponential_backoff) which will attempt to make the request until it succeeds or 5 attempts have been made. **By default it is disabled.**

```js
cms.init({
	accountId: accountId,
	clientId: clientId,
	clientSecret: clientSecret
}, defaultName, { retry: true });
```

### Query Builder

While queries can be entered as a string, as defined in the Brightcove API [documentation for search](http://docs.brightcove.com/en/video-cloud/cms-api/guides/search-videos.html), they can also be built using the `cms.query.parse()` function which will convert them to the appropriate string.

#### Usage

The builder takes an array of query terms (javascript objects) combined in various ways and returns a query string.

```js
// This is equivalent to the query in the example above
var queryParams = {
	q: cms.query.parse([{ name: 'gossip'}]),
	sort: '-updated_at'
};

cms.videos.list(queryParams).then(function(response) {
	var videos = response.data;
	// Perform whatever action you need the videos for
});
```

#### Basic Search

For searching on fields (id, tags, etc) you simply include all the fields you want to search in an object of field:value pairs or as a string.

```js
//
var fields = [{
	name: foo,
	tags: bar,nature
}, "description:Stuff"];

cms.query.parse(fields);
// name:foo tags:bar,nature description:Stuff
```

#### Date Ranges

Date ranges are entered in as an array `[startDate endDate]`. Whenever a field matches any of the valid date fields (specified below) it will be parsed appropriately. Dates can be entered as javascript Date objects or Strings. Both `startDate` or `endDate` can be ommited for an open ended date range.

**Valid Date Fields**
* updated_at
* created_at
* schedule.starts_at
* schedule.ends_at
* published_at

```js
// Search videos updated between August 1, 2010 and October 8, 2010
var range = [{
	updated_at: [new Date(2010, 7, 1), new Date(2010, 9, 8)]
}];

cms.query.parse(range);
// updated_at:2010-08-01T04:00:00.000Z..2010-10-08T04:00:00.000Z
```

#### Combining Search Criteria

Query terms can be combined by breaking them into different objects and using boolean logic such as `AND` and `NO` in between them. By default, query terms use **OR**.

Whenever a term is preceeded by `NOT` it has the appropriate symbol `-` prepended to all of its fields. Whenever terms have an `AND` before or after them, all of their fields are prepended with `+`. This is explained in greater depth in the search documentation.

**Example**: Let's say we want to find all videos with the *name* "gossip", which do **not** have the *tag* "bar" **and** which were *updated_at* between August 1, 2010 and October 8, 2010.

```js
var search = [
	'NOT',
	{ tags: 'bar' },
	{ name: 'gossip' },
	'AND',
	updated_at: [new Date(2010, 7, 1), new Date(2010, 9, 8)]
];

cms.query.parse(search);
// -tags:bar +name:gossip +updated_at:2010-08-01T04:00:00.000Z..2010-10-08T04:00:00.000Z
```

### Tests

There are some basic tests in the `test/` directory, broken down by modules. You can use the command `npm test` to run them all.
Alternatively, you can add any tests you don't want to run to the `test/other/` directory and it will be ignored.
